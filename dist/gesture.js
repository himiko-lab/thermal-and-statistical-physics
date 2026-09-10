/**
 * Hand-gesture slide controller.
 *
 * Watches the front camera, looks for an *open palm*, and fires next/prev when
 * that palm travels sideways far enough, fast enough.
 *
 * Requiring the palm to stay open is what keeps normal talking-with-your-hands
 * from flipping slides: a relaxed or half-closed hand never arms the detector.
 *
 * Disalin dari deck Sensatype dan sejak itu diubah di tiga tempat: penjaga
 * kemacetan pada _loop, start() yang dibuat aman dipanggil berkali-kali, dan
 * beberapa properti baca-saja untuk mode uji (lastHand, fps, extended).
 * Logika deteksinya sendiri tidak disentuh.
 */

import { FilesetResolver, HandLandmarker } from './vendor/vision_bundle.mjs';

export const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

// Fingertip / PIP-joint pairs, thumb excluded — thumb extension is unreliable
// at the angles a seated camera sees, and the other four are signal enough.
const FINGERS = [
  { tip: 8, pip: 6 },
  { tip: 12, pip: 10 },
  { tip: 16, pip: 14 },
  { tip: 20, pip: 18 },
];

/**
 * Sensitivity presets, cycled live with the S key so the feel can be dialled in
 * during rehearsal — in the actual room, under the actual lighting.
 *
 *   fingersForOpenPalm — how many fingers must read extended to arm
 *   extendRatio        — how straight a finger must be to count as extended
 *   framesToArm        — consecutive open-palm frames before arming
 *   graceFrames        — dropped frames tolerated mid-swipe before giving up
 *   swipeWindowMs      — look-back window the travel must accumulate within
 *   minTravelNorm      — floor on travel, as a fraction of frame width
 *   minTravelHands     — travel must also beat this many hand-widths
 *   cooldownMs         — hard floor after a fire, so one motion can't count twice
 */
export const PRESETS = {
  tenang: {
    label: 'Tenang',
    fingersForOpenPalm: 4, extendRatio: 1.15,
    framesToArm: 3, graceFrames: 3,
    swipeWindowMs: 700, minTravelNorm: 0.12, minTravelHands: 1.4,
    cooldownMs: 450,
  },
  normal: {
    label: 'Normal',
    fingersForOpenPalm: 3, extendRatio: 1.08,
    framesToArm: 2, graceFrames: 5,
    swipeWindowMs: 950, minTravelNorm: 0.085, minTravelHands: 0.95,
    cooldownMs: 260,
  },
  sensitif: {
    label: 'Sensitif',
    fingersForOpenPalm: 3, extendRatio: 1.03,
    framesToArm: 2, graceFrames: 7,
    swipeWindowMs: 1300, minTravelNorm: 0.06, minTravelHands: 0.7,
    cooldownMs: 180,
  },
};

export const PRESET_ORDER = ['tenang', 'normal', 'sensitif'];

/** Live tuning values. Mutated by setSensitivity(); edit defaults via PRESETS. */
export const CONFIG = {
  ...PRESETS.normal,
  /** Flip if "right" ends up feeling backwards to you. */
  invertDirection: false,
  /**
   * Safety net for the re-arm gate. Normally the next swipe unlocks the instant
   * the palm relaxes; if a hand stubbornly keeps reading as open, unlock anyway
   * after this long so the deck can never wedge mid-presentation.
   */
  rearmTimeoutMs: 1500,
  /**
   * Kadang kamera menyala tetapi tidak pernah mengirim frame: play() ditolak
   * diam-diam, tab sempat tersembunyi saat start, atau track direbut aplikasi
   * lain. Kalau selama ini tidak ada satu pun frame terproses, sesi kamera
   * dibangun ulang. Tanpa ini deck diam di "Mencari tangan..." selamanya.
   */
  stallTimeoutMs: 2500,
};

export const STATE = {
  LOADING: 'loading',
  STARTING: 'starting',
  NO_CAMERA: 'no-camera',
  OFF: 'off',
  SEARCHING: 'searching',
  TRACKING: 'tracking',
  ARMED: 'armed',
  COOLDOWN: 'cooldown',
  REARM: 'rearm',
};

export class HandGestureController extends EventTarget {
  constructor({ video, canvas }) {
    super();
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.landmarker = null;
    this.stream = null;
    this.enabled = true;
    this.state = STATE.LOADING;
    this.preset = 'normal';

    this._openFrames = 0;
    this._missFrames = 0;
    this._samples = [];
    this._cooldownUntil = 0;
    this._rearmBlocked = false;
    this._rearmDeadline = 0;
    this._lastVideoTime = -1;
    this._rafId = null;
    this._progress = 0;
    this._lastFrameAt = 0;
    this._recovering = false;
    this._starting = null;

    /* Baca-saja, untuk mode uji. Ditulis sebagai properti, bukan lewat event,
       karena mode uji membacanya di dalam loop gambarnya sendiri; menembakkan
       event 30 kali per detik hanya akan memaksa render ulang sia-sia. */
    this.lastHand = null;
    this.fps = 0;
    this.extended = 0;
    this._fpsCount = 0;
    this._fpsAt = 0;
  }

  /**
   * Sengaja bukan async: metode async selalu membungkus hasilnya dalam promise
   * baru, sehingga dua pemanggilan tetap menghasilkan dua promise berbeda dan
   * penjaga di bawah tidak benar-benar berbagi proses. Dengan mengembalikan
   * promise yang sama secara langsung, pemanggil kedua ikut menunggu proses
   * yang pertama.
   *
   * start() dipanggil saat mount, saat pengguna mengklik status untuk mencoba
   * lagi, dan oleh penjaga kemacetan. Tanpa ini dua pemanggilan yang tumpang
   * tindih bisa meminta getUserMedia dua kali dan saling menimpa srcObject,
   * yang persis menghasilkan kamera menyala tanpa pelacakan.
   */
  start() {
    if (this._starting) return this._starting;
    this._starting = this._start().finally(() => {
      this._starting = null;
    });
    return this._starting;
  }

  async _start() {
    this._setState(STATE.LOADING);

    // Guarded so a retry after a denied prompt doesn't rebuild the model.
    if (!this.landmarker) {
      const fileset = await FilesetResolver.forVisionTasks('./vendor/wasm');
      this.landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: './vendor/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    }

    if (!(await this._openCamera())) return;
    this._setState(STATE.SEARCHING);
    this._startLoop();
  }

  setSensitivity(name) {
    if (!PRESETS[name]) return this.preset;
    this.preset = name;
    Object.assign(CONFIG, PRESETS[name]);
    this._reset();
    this.dispatchEvent(new CustomEvent('sensitivity', {
      detail: { key: name, label: PRESETS[name].label },
    }));
    return name;
  }

  cycleSensitivity() {
    const i = PRESET_ORDER.indexOf(this.preset);
    return this.setSensitivity(PRESET_ORDER[(i + 1) % PRESET_ORDER.length]);
  }

  /**
   * Turning tracking off releases the camera and stops the detection loop, not
   * just the gesture logic. Leaving the loop running kept MediaPipe inferring
   * ~30x a second off a live camera feed — the expensive part — so "off" cost
   * nearly as much battery as "on". Switching back on re-acquires the stream;
   * permission is already granted, so there is no second prompt.
   */
  async setEnabled(on) {
    this.enabled = on;
    this._reset();

    if (!on) {
      this._stopLoop();
      this._closeCamera();
      this._setState(STATE.OFF);
      return;
    }

    this._setState(STATE.STARTING);
    if (!(await this._openCamera())) return;
    this._setState(STATE.SEARCHING);
    this._startLoop();
  }

  toggle() {
    const next = !this.enabled;
    this.setEnabled(next);
    return next;
  }

  stop() {
    this._stopLoop();
    this._closeCamera();
  }

  // ------------------------------------------------------------ camera / loop

  async _openCamera() {
    if (this.stream) return true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
    } catch (err) {
      this._setState(STATE.NO_CAMERA);
      this.dispatchEvent(new CustomEvent('error', { detail: err }));
      return false;
    }

    this.video.srcObject = this.stream;
    // Deliberately not awaited. play() can stall until the first frame lands,
    // which left the deck wedged on "starting" — camera powered up, no
    // detection. The loop already waits on readyState, so let it do that.
    this.video.play().catch(() => {});
    return true;
  }

  /** Stopping the tracks is what actually powers the sensor down (LED off). */
  _closeCamera() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video.srcObject = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._lastVideoTime = -1;
    this._lastFrameAt = 0;
    this.lastHand = null;
    this.fps = 0;
    this.extended = 0;
  }

  _startLoop() {
    this._lastVideoTime = -1;
    this._lastFrameAt = performance.now();
    if (this._rafId === null) this._loop();
  }

  _stopLoop() {
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  // ---------------------------------------------------------------- internals

  _setState(next) {
    if (this.state === next) return;
    this.state = next;
    this.dispatchEvent(new CustomEvent('state', { detail: next }));
  }

  _reset() {
    this._openFrames = 0;
    this._missFrames = 0;
    this._samples = [];
    this._rearmBlocked = false;
    if (this._progress !== 0) {
      this._progress = 0;
      this.dispatchEvent(new CustomEvent('progress', { detail: 0 }));
    }
  }

  _loop = () => {
    this._rafId = requestAnimationFrame(this._loop);

    if (!this.landmarker) return;

    if (this.video.readyState < 2 || this.video.currentTime === this._lastVideoTime) {
      this._checkStall();
      return;
    }

    this._lastVideoTime = this.video.currentTime;
    this._lastFrameAt = performance.now();

    // Sized here rather than at open time: the camera reports its dimensions a
    // few frames in, and they can differ between sessions.
    if (this.video.videoWidth && this.canvas.width !== this.video.videoWidth) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    }

    const result = this.landmarker.detectForVideo(this.video, performance.now());
    const hand = result.landmarks?.[0] ?? null;

    this.lastHand = hand;
    this._fpsCount++;
    const tick = performance.now();
    if (tick - this._fpsAt >= 1000) {
      this.fps = this._fpsCount;
      this._fpsCount = 0;
      this._fpsAt = tick;
    }
    if (hand) this._isOpenPalm(hand);

    this._draw(hand);
    if (this.enabled) this._evaluate(hand);
  };

  /**
   * Kamera menyala tetapi tidak ada frame yang masuk. Sesi videonya dibangun
   * ulang: srcObject dipasang lagi lalu play() diulang. Kalau track-nya memang
   * sudah mati, misalnya karena direbut Zoom, stream-nya diminta dari awal.
   */
  _checkStall() {
    if (!this.stream || !this.enabled || this._recovering) return;

    const now = performance.now();
    if (now - this._lastFrameAt < CONFIG.stallTimeoutMs) return;

    this._recovering = true;
    this._lastFrameAt = now;
    this._setState(STATE.STARTING);

    const track = this.stream.getVideoTracks()[0];
    const dead = !track || track.readyState === 'ended';

    if (dead) {
      this._closeCamera();
      this._openCamera()
        .then((ok) => {
          if (ok) this._startLoop();
        })
        .finally(() => {
          this._recovering = false;
        });
      return;
    }

    if (this.video.srcObject !== this.stream) this.video.srcObject = this.stream;
    this._lastVideoTime = -1;
    Promise.resolve(this.video.play())
      .catch(() => {})
      .finally(() => {
        this._recovering = false;
      });
  }

  _evaluate(hand) {
    const now = performance.now();
    const open = hand ? this._isOpenPalm(hand) : false;

    // Short hard floor: stops the tail of one motion registering as a second.
    if (now < this._cooldownUntil) {
      this._setState(STATE.COOLDOWN);
      return;
    }

    // Re-arm gate. Pulling the hand back after a swipe is itself a sideways
    // motion, so something has to absorb it — but a fixed wait punishes every
    // swipe. Instead, unlock the moment the palm relaxes: no timer, and the
    // return stroke can't fire because a closed hand is never armed.
    if (this._rearmBlocked) {
      if (open && now < this._rearmDeadline) {
        this._setState(STATE.REARM);
        return;
      }
      this._reset();
    }

    if (this.state === STATE.COOLDOWN || this.state === STATE.REARM) {
      this._setState(STATE.SEARCHING);
    }

    if (!open) {
      this._setState(hand ? STATE.TRACKING : STATE.SEARCHING);
      this._missFrames++;
      // A brief detection dropout shouldn't void a swipe already in progress —
      // hold the samples for a few frames and let the hand come back.
      if (this._missFrames > CONFIG.graceFrames && (this._samples.length || this._openFrames)) {
        this._reset();
      }
      return;
    }

    this._missFrames = 0;
    this._openFrames++;
    if (this._openFrames < CONFIG.framesToArm) {
      this._setState(STATE.TRACKING);
      return;
    }
    this._setState(STATE.ARMED);

    // Work in mirrored coordinates so "x increasing" means "the presenter's
    // hand moved to their own right" — matching what they see in the preview.
    const x = 1 - this._centroidX(hand);
    this._samples.push({ x, t: now });
    while (this._samples.length && now - this._samples[0].t > CONFIG.swipeWindowMs) {
      this._samples.shift();
    }
    if (this._samples.length < 3) return;

    // Measure against the furthest point back in the window rather than the
    // oldest sample, so a small drift before the real swipe doesn't cancel it.
    const latest = this._samples[this._samples.length - 1].x;
    let travel = 0;
    for (const s of this._samples) {
      if (Math.abs(latest - s.x) > Math.abs(travel)) travel = latest - s.x;
    }

    const threshold = Math.max(
      CONFIG.minTravelNorm,
      CONFIG.minTravelHands * this._handScale(hand),
    );

    const next = Math.min(1, Math.abs(travel) / threshold);
    if (next !== this._progress) {
      this._progress = next;
      this.dispatchEvent(new CustomEvent('progress', { detail: next }));
    }

    if (Math.abs(travel) >= threshold) {
      const rightward = CONFIG.invertDirection ? travel < 0 : travel > 0;
      this._fire(rightward ? 'next' : 'prev');
    }
  }

  _fire(direction) {
    const now = performance.now();
    this._reset();
    this._cooldownUntil = now + CONFIG.cooldownMs;
    this._rearmBlocked = true;
    this._rearmDeadline = now + CONFIG.rearmTimeoutMs;
    this._setState(STATE.COOLDOWN);
    this.dispatchEvent(new CustomEvent('gesture', { detail: direction }));
  }

  /**
   * Mean x of all 21 landmarks. The wrist alone barely moves when someone
   * swipes by pivoting at the wrist, which reads as "nothing happened"; the
   * centroid picks up both translation and rotation, and averaging 21 points
   * smooths out per-frame jitter for free.
   */
  _centroidX(hand) {
    let sum = 0;
    for (const p of hand) sum += p.x;
    return sum / hand.length;
  }

  /** Wrist-to-middle-knuckle span: a stand-in for how big the hand reads. */
  _handScale(hand) {
    return Math.hypot(hand[9].x - hand[0].x, hand[9].y - hand[0].y);
  }

  _isOpenPalm(hand) {
    const wrist = hand[0];
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    let extended = 0;
    for (const { tip, pip } of FINGERS) {
      if (dist(wrist, hand[tip]) > dist(wrist, hand[pip]) * CONFIG.extendRatio) extended++;
    }
    this.extended = extended;
    return extended >= CONFIG.fingersForOpenPalm;
  }

  _draw(hand) {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!hand) return;

    const armed = this.state === STATE.ARMED;
    const color = armed ? '#4ade80' : '#94a3b8';
    const px = (p) => [(1 - p.x) * canvas.width, p.y * canvas.height];

    ctx.strokeStyle = color;
    ctx.lineWidth = armed ? 3 : 2;
    ctx.lineCap = 'round';
    for (const [a, b] of CONNECTIONS) {
      const [x1, y1] = px(hand[a]);
      const [x2, y2] = px(hand[b]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.fillStyle = color;
    for (const p of hand) {
      const [x, y] = px(p);
      ctx.beginPath();
      ctx.arc(x, y, armed ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
