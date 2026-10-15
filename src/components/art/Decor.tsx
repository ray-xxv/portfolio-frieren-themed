import { useId, type CSSProperties } from 'react';
import { seeded } from '../../lib/random';

/* ── Orbit rings ─────────────────────────────────────────────── */
interface OrbitProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  rings?: number;
}

/** Thin elliptical orbits with a travelling dot on each. */
export function Orbit({ className, style, color = 'var(--royal)', rings = 3 }: OrbitProps) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} style={style} aria-hidden="true">
      {Array.from({ length: rings }, (_, i) => {
        const rx = 190 - i * 34;
        const ry = 70 + i * 22;
        const tilt = -24 + i * 31;
        return (
          <g key={i} transform={`rotate(${tilt})`}>
            <ellipse rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={0.8} strokeOpacity={0.55} strokeDasharray={i === 1 ? '2 6' : undefined} />
            <circle cx={rx} cy={0} r={4 - i} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Barcode ─────────────────────────────────────────────────── */
export function Barcode({ seed = 7, bars = 34, className, color = 'var(--ink)' }: { seed?: number; bars?: number; className?: string; color?: string }) {
  const rand = seeded(seed);
  let x = 0;
  const rects = Array.from({ length: bars }, () => {
    const w = 1 + Math.floor(rand() * 3);
    const gap = 1 + Math.floor(rand() * 2.5);
    const r = { x, w };
    x += w + gap;
    return r;
  });
  return (
    <svg viewBox={`0 0 ${x} 30`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={30} fill={color} />
      ))}
    </svg>
  );
}

/* ── Brush wash ──────────────────────────────────────────────── */
/** Watercolour-ish royal/sky blob with rough edges (feTurbulence displacement). */
export function BrushWash({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 400 300" className={className} style={style} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <filter id={`rough-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="26" />
        </filter>
      </defs>
      <g filter={`url(#rough-${id})`}>
        <path d="M40 70 C 120 20 260 30 350 60 C 380 120 360 210 300 250 C 200 280 90 270 50 220 C 20 170 20 110 40 70 Z" fill="var(--sky)" opacity="0.55" />
        <path d="M90 110 C 160 70 270 90 320 120 C 330 170 290 220 220 230 C 150 236 100 210 85 170 Z" fill="var(--royal)" opacity="0.18" />
        <path d="M20 250 C 80 230 150 228 210 240 L 200 262 C 140 256 80 262 26 276 Z" fill="var(--royal)" opacity="0.5" />
      </g>
    </svg>
  );
}

/* ── Bird ───────────────────────────────────────────────────── */
export function Bird({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-30 -20 60 36" className={className} style={style} aria-hidden="true">
      <path
        className="bird-wings"
        d="M-28 -16 C -16 -14 -7 -7 -1 3 L 0 4 L 1 3 C 7 -7 16 -14 28 -16 C 20 -8 12 1 5 7 L 3 13 L 0 10 L -3 13 L -5 7 C -12 1 -20 -8 -28 -16 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Diamond checker band (Background Color Theory) ─────────── */
const diamonds = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M14 0 L28 14 L14 28 L0 14Z" fill="#1F3BD6"/></svg>`,
);

export function CheckerBand({ className, reverse = false }: { className?: string; reverse?: boolean }) {
  return (
    <div className={className} aria-hidden="true" style={{ overflow: 'hidden', height: 28 }}>
      <div
        className="checker-track"
        style={{
          width: 'calc(100% + 56px)',
          height: 28,
          backgroundImage: `url("data:image/svg+xml,${diamonds}")`,
          backgroundSize: '28px 28px',
          animation: `checker 3.2s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      />
    </div>
  );
}

/* ── Doodle "thought" marks from the chibi reference ─────────── */
export function ThoughtMarks({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden="true" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 6 C 10 7 8 26 14 33 C 21 40 31 32 31 20 C 31 10 27 6 22 6 Z" />
      <path d="M36 48 L 46 50 L 40 58 Z" />
      <circle cx="48" cy="70" r="4" />
    </svg>
  );
}
