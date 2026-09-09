/**
 * Kepala slide yang sama persis di seluruh deck: penanda bagian, garis rambut
 * emas, dan nomor slide. Konstan seperti ini yang membuat deck terbaca sebagai
 * satu dokumen, bukan lima belas layout yang berbeda-beda.
 */
export default function SlideHead({ eyebrow, no, total }) {
  return (
    <div className="head">
      <span className="head-eyebrow">{eyebrow}</span>
      <span className="head-rule" />
      <span className="head-no">
        {String(no).padStart(2, '0')} / {total}
      </span>
    </div>
  );
}
