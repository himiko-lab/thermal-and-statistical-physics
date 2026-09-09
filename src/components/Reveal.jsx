/**
 * Elemen yang muncul pada tahap tertentu dari staged build.
 *
 * `at` adalah nomor tahap; elemen tampil begitu step slide mencapai angka itu
 * dan tetap tampil sesudahnya, supaya presenter bisa mundur tanpa slide
 * terlihat rusak.
 */
export default function Reveal({ at = 0, step = 0, delay = 0, as: Tag = 'div', className = '', style, children, ...rest }) {
  const shown = step >= at;
  return (
    <Tag
      className={`reveal${shown ? ' is-shown' : ''}${className ? ' ' + className : ''}`}
      style={{ '--d': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
