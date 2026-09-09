import { useLayoutEffect, useRef } from 'react';

/**
 * Sekumpulan kartu yang meledak keluar dari satu titik di tengah.
 *
 * Jarak tiap kartu ke pusat diukur dari tata letak sebenarnya, bukan ditulis
 * tangan, supaya susunan kolom boleh berubah tanpa menyetel ulang angka.
 * Dipakai offsetLeft/offsetTop, bukan getBoundingClientRect, karena panggung
 * diskalakan dengan transform dan rect ikut terskala.
 */
export default function ExplodedGrid({ out = false, columns = 3, stagger = 78, className = '', style, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cx = el.offsetWidth / 2;
    const cy = el.offsetHeight / 2;
    Array.from(el.children).forEach((child, i) => {
      const px = child.offsetLeft + child.offsetWidth / 2;
      const py = child.offsetTop + child.offsetHeight / 2;
      child.style.setProperty('--cx', `${(cx - px) * 0.78}px`);
      child.style.setProperty('--cy', `${(cy - py) * 0.78}px`);
      child.style.setProperty('--d', `${i * stagger}ms`);
    });
  });

  return (
    <div
      ref={ref}
      className={`exploded${out ? ' is-out' : ''}${className ? ' ' + className : ''}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }}
    >
      {children}
    </div>
  );
}
