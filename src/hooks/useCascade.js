import { useEffect, useState } from 'react';

/**
 * Koreografi berbasis waktu, bukan berbasis klik.
 *
 * Deck ini dibatasi dua klik per slide: satu untuk tiba, satu untuk membuka
 * isinya. Slide yang punya urutan bertahap (misalnya suku VdP yang baru boleh
 * hilang setelah labelnya sempat terbaca) tetap butuh tahapan, jadi tahapan
 * itu dipindah ke timer. Sekali klik memicu seluruh rangkaian.
 *
 * Mengembalikan nomor fase: 0 sebelum dipicu, lalu naik mengikuti `timings`.
 */
export const CASCADE = [0, 380, 1100, 1720];

export default function useCascade(active, timings = CASCADE, immediate = false) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    if (immediate) {
      setPhase(timings.length);
      return;
    }
    const ids = timings.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => ids.forEach(window.clearTimeout);
    // timings adalah konstanta modul; tidak perlu ikut jadi dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, immediate]);

  return phase;
}
