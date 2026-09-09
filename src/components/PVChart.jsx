/**
 * Diagram P-V: kurva isotermal dibanding adiabatik dari titik awal yang sama.
 *
 * Poin yang ingin ditunjukkan bukan bentuk kurvanya, melainkan bahwa adiabatik
 * lebih curam dengan faktor gamma, karena tekanan turun bukan hanya oleh
 * pemuaian tetapi juga oleh turunnya energi internal.
 */
export default function PVChart({ gamma = 1.4, play = true, showAdiabat = true, width = 560, height = 330 }) {
  const L = 52, R = 18, T = 16, B = 44;
  const w = width - L - R;
  const h = height - T - B;

  const V0 = 1, V1 = 4.2, P0 = 1;
  const x = (v) => L + ((v - V0) / (V1 - V0)) * w;
  const y = (p) => T + (1 - p / P0) * h;

  const curve = (fn) => {
    const pts = [];
    for (let i = 0; i <= 90; i++) {
      const v = V0 + ((V1 - V0) * i) / 90;
      pts.push(`${x(v).toFixed(1)},${y(fn(v)).toFixed(1)}`);
    }
    return 'M' + pts.join(' L');
  };

  const iso = curve((v) => P0 / v);
  const adi = curve((v) => P0 / Math.pow(v, gamma));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img"
         aria-label="Diagram P-V membandingkan kurva isotermal dan adiabatik">
      {/* sumbu */}
      <line x1={L} y1={T} x2={L} y2={T + h} stroke="rgba(247,245,241,0.26)" strokeWidth="1.5" />
      <line x1={L} y1={T + h} x2={L + w} y2={T + h} stroke="rgba(247,245,241,0.26)" strokeWidth="1.5" />
      <text x={L - 12} y={T + 12} fill="var(--ink-3)" fontSize="19" textAnchor="end" fontStyle="italic">P</text>
      <text x={L + w} y={T + h + 30} fill="var(--ink-3)" fontSize="17" fontStyle="italic">V</text>

      {/* kurva */}
      <path
        d={iso}
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        style={{
          strokeDashoffset: play ? 0 : 1,
          transition: 'stroke-dashoffset 1150ms var(--ease)',
        }}
      />
      {showAdiabat ? (
        <path
          d={adi}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          style={{
            strokeDashoffset: showAdiabat ? 0 : 1,
            transition: 'stroke-dashoffset 1150ms var(--ease)',
          }}
        />
      ) : null}

      {/* titik awal bersama */}
      <circle
        cx={x(V0)}
        cy={y(P0)}
        r="5.5"
        fill="var(--gold)"
        style={{ opacity: play ? 1 : 0, transition: 'opacity 500ms var(--ease) 200ms' }}
      />

      {/* label kurva */}
      <text
        x={x(3.3)}
        y={y(P0 / 3.3) - 16}
        fill="var(--ink-2)"
        fontSize="17"
        fontWeight="500"
        style={{ opacity: play ? 1 : 0, transition: 'opacity 520ms var(--ease) 900ms' }}
      >
        isotermal
      </text>
      {showAdiabat ? (
        <text
          x={x(3.3)}
          y={y(P0 / Math.pow(3.3, gamma)) + 30}
          fill="var(--gold)"
          fontSize="17"
          fontWeight="500"
          style={{ opacity: showAdiabat ? 1 : 0, transition: 'opacity 520ms var(--ease) 900ms' }}
        >
          adiabatik
        </text>
      ) : null}
    </svg>
  );
}
