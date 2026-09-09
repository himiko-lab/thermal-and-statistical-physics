import { useId } from 'react';

/**
 * Silinder gas dengan piston, dipakai untuk membedakan pemanasan pada volume
 * tetap (piston dipaku) dan pada tekanan tetap (piston bebas naik).
 *
 * Molekul digambar sebagai titik yang bergetar; getarannya melambangkan energi
 * kinetik, jadi ia dipercepat saat `heated` menyala di kedua kasus.
 */
export default function Piston({ free = false, heated = false, play, lift = 34, width = 210, height = 250 }) {
  const clipId = `cyl-${useId().replace(/:/g, '')}`;
  const running = play ?? heated;
  // Gas digambar emas di kedua kasus, karena dua-duanya memang dipanaskan.
  // Yang membedakan sengaja dibuat struktural, bukan warna: piston terpaku
  // versus piston yang naik.
  const wall = 'rgba(247,245,241,0.34)';
  const gas = 'var(--gold)';
  const rise = free && running ? lift : 0;

  const dots = [
    [40, 60], [86, 44], [130, 68], [58, 100], [104, 92], [148, 108],
    [34, 132], [78, 140], [122, 130], [156, 62], [64, 172], [116, 168],
  ];

  return (
    <svg viewBox="0 0 190 260" width={width} height={height} role="img" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="18" y="30" width="154" height="200" rx="4" />
        </clipPath>
      </defs>

      {/* rongga gas */}
      <rect x="18" y="30" width="154" height="200" rx="4" fill="rgba(255,255,255,0.02)" />

      <g clipPath={`url(#${clipId})`}>
        <rect
          x="18"
          y="70"
          width="154"
          height="160"
          fill={gas}
          opacity="0.10"
          style={{
            transform: `scaleY(${(160 + rise) / 160})`,
            transformBox: 'view-box',
            transformOrigin: '95px 230px',
            transition: 'transform 1000ms var(--ease)',
          }}
        />
        {dots.map(([x, y], i) => (
          <circle
            key={i}
            cx={x + 18}
            cy={y + 46}
            r="3.4"
            fill={gas}
            opacity="0.9"
            style={{
              animation: `jiggle ${heated ? 620 : 1500}ms ease-in-out ${i * 70}ms infinite alternate`,
              transformOrigin: `${x + 18}px ${y + 46}px`,
            }}
          />
        ))}
      </g>

      {/* dinding silinder */}
      <rect x="18" y="30" width="154" height="200" rx="4" fill="none" stroke={wall} strokeWidth="2.5" />

      {/* piston */}
      <g style={{ transform: `translate3d(0, ${-rise}px, 0)`, transition: 'transform 1000ms var(--ease)' }}>
        <rect x="20" y="58" width="150" height="14" rx="3" fill="rgba(247,245,241,0.16)" stroke={wall} strokeWidth="2" />
        <rect x="88" y="18" width="14" height="42" rx="3" fill="rgba(247,245,241,0.12)" stroke={wall} strokeWidth="2" />
        {free ? null : (
          /* paku penahan: penanda visual bahwa volume terkunci */
          <>
            <line x1="8" y1="65" x2="34" y2="65" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="156" y1="65" x2="182" y2="65" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* kalor masuk dari bawah */}
      {heated ? (
        <g stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" opacity="0.9">
          {[52, 95, 138].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1="252"
              x2={x}
              y2="238"
              style={{ animation: `heat-rise 1200ms ease-in-out ${i * 200}ms infinite` }}
            />
          ))}
        </g>
      ) : null}

      <style>{`
        @keyframes jiggle {
          from { transform: translate(0, 0); }
          to   { transform: translate(3px, -3px); }
        }
        @keyframes heat-rise {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          circle, line { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}
