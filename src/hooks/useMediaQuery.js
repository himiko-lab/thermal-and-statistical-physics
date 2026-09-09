import { useEffect, useState } from 'react';

/**
 * Melacak sebuah media query dan ikut berubah saat kondisinya berubah.
 *
 * Dipakai untuk dua hal di deck ini:
 *
 *   TOUCH    perangkat sentuh tanpa tetikus. Memunculkan tombol navigasi di
 *            layar (di ponsel tidak ada tombol panah) dan mematikan hand
 *            tracking, karena di ponsel tangan dipakai memegang perangkatnya
 *            sehingga kamera hanya memunculkan permintaan izin yang sia-sia.
 *
 *   PORTRAIT layar tegak. Panggung 16:9 jadi strip tipis di sana, jadi
 *            petunjuknya diganti menjadi ajakan memutar layar.
 *
 * Diperiksa lewat media query, bukan user agent, supaya iPad berpapan tik dan
 * laptop berlayar sentuh tetap tertangani dengan benar.
 */
export const TOUCH = '(hover: none) and (pointer: coarse)';
export const PORTRAIT = '(orientation: portrait)';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
