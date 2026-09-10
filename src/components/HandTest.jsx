import { useEffect, useRef, useState } from 'react';

/**
 * Mode uji hand tracking.
 *
 * Gunanya bukan sekadar memastikan "tangan terdeteksi", tetapi memperlihatkan
 * dua hal yang benar-benar menentukan saat presentasi: seberapa luas jangkauan
 * yang masih terbaca kamera di ruangan itu, dan semulus apa pelacakannya di
 * bawah pencahayaan yang ada.
 *
 * Karena itu layarnya diisi kisi titik. Titik yang dekat dengan tangan menyala
 * emas, membesar, dan terdorong menjauh. Kalau ada sudut layar yang titiknya
 * tidak pernah bereaksi, di situlah tangan keluar dari bidang pandang kamera.
 * Kalau reaksinya tersendat, pencahayaannya kurang.
 *
 * Geseran tidak memindahkan slide selama mode ini terbuka; ia hanya
 * dilaporkan, supaya bisa dilatih tanpa mengacak-acak posisi deck.
 */

/* Titik acuan: pergelangan, kelima ujung jari, dan buku jari tengah. Cukup
   untuk membentuk medan yang terasa mengikuti tangan, tanpa memaksa 21 titik
   dihitung terhadap setiap titik kisi di setiap frame. */
const ACUAN = [0, 4, 8, 12, 16, 20, 9];

const JARAK_KISI = 38;
const RADIUS = 165;

export default function HandTest({ getHand, getStats, connections, fire, onClose }) {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ state: 'loading', label: 'Memuat…', preset: '', fps: 0, extended: 0, progress: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let statTick = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const hand = getHand?.() ?? null;

      // Koordinat MediaPipe berada di frame kamera yang belum dicerminkan.
      // Dibalik di sini supaya gerakannya searah dengan tangan sungguhan.
      const titik = hand ? ACUAN.map((i) => ({ x: (1 - hand[i].x) * w, y: hand[i].y * h })) : [];

      for (let gy = JARAK_KISI / 2; gy < h; gy += JARAK_KISI) {
        for (let gx = JARAK_KISI / 2; gx < w; gx += JARAK_KISI) {
          let dekat = Infinity;
          let dx = 0;
          let dy = 0;
          for (const p of titik) {
            const ax = gx - p.x;
            const ay = gy - p.y;
            const d = Math.hypot(ax, ay);
            if (d < dekat) { dekat = d; dx = ax; dy = ay; }
          }

          const t = dekat < RADIUS ? 1 - dekat / RADIUS : 0;
          const k = t * t;
          const dorong = k * 20;
          const norm = dekat || 1;
          const x = gx + (dx / norm) * dorong;
          const y = gy + (dy / norm) * dorong;

          ctx.beginPath();
          ctx.arc(x, y, 1.2 + k * 4.4, 0, Math.PI * 2);
          ctx.fillStyle = k > 0.01
            ? `rgba(${239 - (239 - 247) * (1 - k)}, ${194 + (245 - 194) * (1 - k)}, ${94 + (241 - 94) * (1 - k)}, ${0.12 + k * 0.85})`
            : 'rgba(247, 245, 241, 0.12)';
          ctx.fill();
        }
      }

      if (hand && connections) {
        ctx.strokeStyle = 'rgba(239, 194, 94, 0.75)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (const [a, b] of connections) {
          ctx.beginPath();
          ctx.moveTo((1 - hand[a].x) * w, hand[a].y * h);
          ctx.lineTo((1 - hand[b].x) * w, hand[b].y * h);
          ctx.stroke();
        }
        ctx.fillStyle = '#efc25e';
        for (const p of hand) {
          ctx.beginPath();
          ctx.arc((1 - p.x) * w, p.y * h, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Angka diagnostik cukup disegarkan beberapa kali per detik.
      if (performance.now() - statTick > 240) {
        statTick = performance.now();
        const s = getStats?.();
        if (s) setStats(s);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [getHand, getStats, connections]);

  const adaTangan = stats.state !== 'searching' && stats.state !== 'off' && stats.state !== 'no-camera';
  const baruGeser = fire && Date.now() - fire.at < 1200;

  return (
    <div className="test">
      <canvas ref={canvasRef} className="test-canvas" />

      <div className="test-panel">
        <div className="test-title">Uji hand tracking</div>
        <dl className="test-stats">
          <dt>Status</dt><dd className={adaTangan ? 'ok' : ''}>{stats.label}</dd>
          <dt>Sensitivitas</dt><dd>{stats.preset}</dd>
          <dt>Frame per detik</dt><dd className={stats.fps >= 20 ? 'ok' : 'warn'}>{stats.fps}</dd>
          <dt>Jari terentang</dt><dd className={stats.extended >= 3 ? 'ok' : ''}>{stats.extended} dari 4</dd>
        </dl>
        <div className="test-bar"><div style={{ transform: `scaleX(${stats.progress})` }} /></div>
        <p className="test-help">
          Gerakkan telapak ke seluruh sudut layar. Bagian yang titiknya tidak pernah
          bereaksi berarti di luar jangkauan kamera dari posisi Anda berdiri.
        </p>
      </div>

      <div className={`test-fire${baruGeser ? ' is-on' : ''}`}>
        {fire ? (fire.dir === 'next' ? 'Geseran kanan terbaca' : 'Geseran kiri terbaca') : ''}
      </div>

      <div className="test-keys">
        <span><b>S</b> ganti sensitivitas</span>
        <span><b>H</b> matikan kamera</span>
        <span><b>T</b> atau <b>Esc</b> keluar</span>
      </div>
    </div>
  );
}
