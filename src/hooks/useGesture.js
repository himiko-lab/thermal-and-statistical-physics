import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Menyambungkan HandGestureController ke navigasi deck.
 *
 * gesture.js disalin apa adanya dari deck Sensatype dan sengaja tidak diubah
 * sedikit pun: ia sudah melewati penyetelan di ruangan sungguhan. Berkas itu
 * duduk di public/ dan dimuat lewat dynamic import berpath absolut supaya
 * jalur relatifnya ke ./vendor/ tetap utuh dan Vite tidak ikut membundelnya.
 *
 * Kamera hanya jalan di secure context. `npm run dev` dan serve.py sama-sama
 * http://localhost, jadi keduanya memenuhi syarat; file:// tidak.
 */

const LABELS = {
  loading: ['Memuat model…', 'idle'],
  starting: ['Menyalakan kamera…', 'idle'],
  'no-camera': ['Kamera ditolak - klik untuk coba lagi', 'error'],
  off: ['Kamera MATI - tekan H', 'idle'],
  searching: ['Mencari tangan…', 'idle'],
  tracking: ['Tangan terlihat - buka telapak', 'idle'],
  armed: ['Siap - geser!', 'armed'],
  cooldown: ['Terkirim', 'cooldown'],
  rearm: ['Kendurkan telapak', 'cooldown'],
};

export default function useGesture({ videoRef, canvasRef, onNext, onPrev, active = true }) {
  const [state, setState] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [preset, setPreset] = useState('Normal');
  const controllerRef = useRef(null);

  // Simpan callback di ref supaya controller tidak perlu dipasang ulang tiap
  // kali indeks slide berubah - membangun ulang model itu mahal.
  const nextRef = useRef(onNext);
  const prevRef = useRef(onPrev);
  nextRef.current = onNext;
  prevRef.current = onPrev;

  useEffect(() => {
    if (!active || __OFFLINE__) return;
    let disposed = false;

    let controller = null;

    (async () => {
      let mod;
      try {
        // Spesifier dirakit saat runtime supaya Vite tidak ikut membundel
        // gesture.js, sehingga jalur relatifnya ke ./vendor/ tetap utuh.
        const url = new URL('gesture.js', document.baseURI).href;
        mod = await import(/* @vite-ignore */ url);
      } catch {
        if (!disposed) setState('no-camera');
        return;
      }
      if (disposed || !videoRef.current || !canvasRef.current) return;

      controller = new mod.HandGestureController({
        video: videoRef.current,
        canvas: canvasRef.current,
      });
      controllerRef.current = controller;

      controller.addEventListener('state', (e) => setState(e.detail));
      controller.addEventListener('progress', (e) => setProgress(e.detail));
      controller.addEventListener('sensitivity', (e) => setPreset(e.detail.label ?? e.detail));
      controller.addEventListener('gesture', (e) => {
        if (e.detail === 'prev') prevRef.current?.();
        else nextRef.current?.();
      });
      controller.addEventListener('error', () => setState('no-camera'));

      setPreset(mod.PRESETS[controller.preset]?.label ?? 'Normal');
      await controller.start();

      // start() menunggu izin kamera, jadi ia bisa selesai jauh setelah efek
      // ini dibersihkan. Kalau itu terjadi, kameranya sudah menyala tanpa
      // pemilik dan akan bentrok dengan controller berikutnya. Lepaskan.
      if (disposed) controller.stop();
    })();

    return () => {
      disposed = true;
      controller?.stop?.();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [active, videoRef, canvasRef]);

  const toggle = useCallback(() => controllerRef.current?.toggle?.(), []);
  const cycleSensitivity = useCallback(() => controllerRef.current?.cycleSensitivity?.(), []);
  const retry = useCallback(() => controllerRef.current?.start?.(), []);

  const [label, tone] = LABELS[state] ?? [state, 'idle'];
  return { state, label, tone, progress, preset, toggle, cycleSensitivity, retry };
}
