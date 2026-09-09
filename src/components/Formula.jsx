/**
 * Rumus sebagai exploded view.
 *
 * Rumus disusun dari potongan per suku, bukan satu blok teks, sehingga tiap
 * suku bisa terbang terpisah sambil membawa label penjelasnya. Ledakannya
 * dipakai untuk mengerjakan fisika: suku yang nol pada suatu batasan
 * (`VdP` saat `dP = 0`, misalnya) benar-benar terbang keluar dan memudar.
 *
 * Menambah rumus baru cukup dengan menambah data, tanpa menyentuh berkas ini.
 *
 *   terms: [{ t, label, dir: [x, y], op, state }]
 *     t     - teks suku, boleh JSX
 *     label - keterangan yang muncul di tahap berlabel
 *     dir   - arah terbang, satuan relatif; dikali `spread`
 *     side  - paksa label ke 'up' atau 'down'; default mengikuti tanda dir[1]
 *     op    - true untuk operator (=, +), tampil redup dan tidak diberi label
 *     state - 'dim' | 'hot' | 'cool' | 'gone'
 */
export default function Formula({
  terms,
  exploded = false,
  labels = false,
  size = 62,
  spread = { x: 128, y: 76 },
  box,
  note,
  align = 'center',
  className = '',
}) {
  const cls = [
    'formula',
    align === 'left' ? 'formula--left' : '',
    exploded ? 'is-exploded' : '',
    exploded && labels ? 'has-labels' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <div className={cls} style={{ '--fsize': `${size}px`, '--fbox': box ? `${box}px` : undefined }}>
        {terms.map((term, i) => {
          let [dx = 0, dy = -1] = term.dir ?? [0, -1];

          if (term.op) {
            // Operator dibawa ke titik tengah antara dua suku yang ia
            // sambungkan. Kalau dibiarkan diam di tengah sementara sukunya
            // terbang menjauh, ia akan mendarat menimpa suku lain: itulah
            // tanda "+" dan "=" yang saling bertabrakan.
            const before = [...terms.slice(0, i)].reverse().find((t) => !t.op);
            const after = terms.slice(i + 1).find((t) => !t.op);
            const a = before?.dir ?? [0, 0];
            const b = after?.dir ?? [0, 0];
            dx = (a[0] + b[0]) / 2;
            dy = (a[1] + b[1]) / 2;
          }

          // Operator ikut hilang bersama suku yang dihapusnya, kalau tidak
          // akan tertinggal tanda "+" menggantung tanpa apa-apa di belakangnya.
          const orphan = term.op && terms.slice(i + 1).find((t) => !t.op)?.state === 'gone';
          const state = orphan ? 'gone' : term.state;
          return (
            <span
              key={i}
              className="term"
              data-op={term.op ? 'true' : undefined}
              data-state={state}
              data-side={term.side ?? (dy < 0 ? 'up' : 'down')}
              style={{
                '--dx': dx * spread.x,
                '--dy': dy * spread.y,
                '--ld': `${260 + i * 90}ms`,
              }}
            >
              <span className="term-body">{term.t}</span>
              {term.label ? <span className="term-label">{term.label}</span> : null}
            </span>
          );
        })}
      </div>
      {note ? <p className="formula-note">{note}</p> : null}
    </div>
  );
}

/** Pecahan tegak, dipakai untuk turunan seperti dQ/dT. */
export function Frac({ a, b }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.08, fontSize: '0.78em', padding: '0 0.1em' }}>
      <span style={{ padding: '0 0.22em 0.06em' }}>{a}</span>
      <span style={{ width: '100%', height: 1, background: 'currentColor', opacity: 0.55 }} />
      <span style={{ padding: '0.06em 0.22em 0' }}>{b}</span>
    </span>
  );
}

/** Kurung besar dengan subskrip, bentuk baku untuk turunan parsial berbatas. */
export function Paren({ children, sub }) {
  const bar = { fontSize: '1.5em', fontWeight: 300, opacity: 0.75, lineHeight: 0.9 };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={bar}>(</span>
      {children}
      <span style={bar}>)</span>
      {sub ? <sub style={{ fontSize: '0.42em', marginLeft: '0.05em', opacity: 0.85 }}>{sub}</sub> : null}
    </span>
  );
}

/** Variabel miring, konsisten dengan notasi fisika. */
export function V({ children }) {
  return <em style={{ fontStyle: 'italic' }}>{children}</em>;
}
