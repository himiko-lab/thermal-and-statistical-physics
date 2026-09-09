import { X } from '@phosphor-icons/react';

/**
 * Catatan presenter versi layar sentuh.
 *
 * Di desktop, tombol N membuka jendela terpisah supaya catatan bisa ditaruh di
 * layar laptop sementara deck tampil di proyektor. Di ponsel tidak ada layar
 * kedua, dan jendela baru berarti tab baru yang justru menutupi decknya. Jadi
 * di sini catatannya muncul sebagai lembar yang menutup dari bawah.
 */
export default function NotesSheet({ no, total, title, entry, onClose }) {
  const simbol = entry?.simbol ?? [];

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <div className="sheet-no">Slide {no} / {total}</div>
            <h3 className="sheet-title">{title}</h3>
          </div>
          <button className="sheet-close" onClick={onClose} aria-label="Tutup catatan">
            <X size={18} weight="light" />
          </button>
        </div>

        <div className="sheet-body">
          {entry?.target ? (
            <p className="sheet-meta">Target bicara {entry.target} detik</p>
          ) : null}

          <ul className="sheet-notes">
            {(entry?.notes ?? []).map((n, i) => <li key={i}>{n}</li>)}
          </ul>

          {simbol.length ? (
            <div className="sheet-sym">
              <div className="sheet-symhead">Cara baca simbol di slide ini</div>
              <dl>
                {simbol.map((x, i) => (
                  <div key={i} className="sheet-symrow">
                    <dt>{x.s}</dt>
                    <dd><b>{x.baca}</b>{x.arti ? ` · ${x.arti}` : ''}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
