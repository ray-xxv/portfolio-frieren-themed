import { seeded, lerp } from '../../lib/random';
import { FlowerHead } from '../art/BlueMoonWeed';
import { LeafShape } from '../art/Leaf';
import { SPARKLE_PATH } from '../art/Sparkle';

/**
 * Generated royal-blue duotone cover art (stand-in until a real screenshot is added).
 * Each index gets its own arrangement of orbits, code lines, sparkles and blossoms.
 */
export function ProjectCover({ index, title }: { index: number; title: string }) {
  const rand = seeded(index * 97 + 13);
  const flowers = Array.from({ length: 2 + Math.floor(rand() * 3) }, () => ({
    x: lerp(30, 290, rand()),
    y: lerp(40, 200, rand()),
    s: lerp(0.35, 0.9, rand()),
    r: rand() * 72,
  }));
  const codeX = rand() < 0.5 ? 24 : 170;
  const lines = Array.from({ length: 6 }, () => lerp(40, 120, rand()));
  const orbitTilt = lerp(-40, 40, rand());
  const sparkle = { x: lerp(40, 280, rand()), y: lerp(30, 110, rand()) };
  const pid = `dots-${index}`;

  return (
    <svg viewBox="0 0 320 240" role="img" aria-label={`${title} cover art`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.2" fill="#8EC3EE" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="320" height="240" fill={index % 2 ? '#12238A' : '#1F3BD6'} />
      <rect width="320" height="240" fill={`url(#${pid})`} opacity="0.45" />
      {/* grid lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="240" stroke="#CFE6F8" strokeOpacity="0.12" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} stroke="#CFE6F8" strokeOpacity="0.12" />
      ))}
      <g transform={`translate(160 130) rotate(${orbitTilt})`} fill="none" stroke="#CFE6F8" strokeOpacity="0.6">
        <ellipse rx="150" ry="52" />
        <ellipse rx="110" ry="80" strokeDasharray="2 5" />
        <circle cx="150" cy="0" r="3.5" fill="#CFE6F8" />
      </g>
      {/* code window */}
      <g transform={`translate(${codeX} 34)`}>
        <rect width="126" height="98" rx="8" fill="#FBF8F0" opacity="0.95" />
        <rect width="126" height="16" rx="8" fill="#CFE6F8" />
        <circle cx="10" cy="8" r="3" fill="#1F3BD6" />
        <circle cx="20" cy="8" r="3" fill="#8EC3EE" />
        {lines.map((w, i) => (
          <rect key={i} x={10 + (i % 3) * 8} y={26 + i * 11} width={w * 0.8} height="5" rx="2.5" fill={i % 2 ? '#8EC3EE' : '#1F3BD6'} opacity={i % 2 ? 0.9 : 0.75} />
        ))}
      </g>
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
          {i % 2 === 0 && <LeafShape tone="sky" transform="rotate(130) translate(0 -10) scale(0.9)" />}
          <FlowerHead tone="night" transform={`rotate(${f.r})`} />
        </g>
      ))}
      <path d={SPARKLE_PATH} transform={`translate(${sparkle.x} ${sparkle.y}) scale(0.3)`} fill="#FBF8F0" />
      <text x="14" y="228" fill="#CFE6F8" fontFamily="JetBrains Mono Variable, monospace" fontSize="10" letterSpacing="1">
        {String(index + 1).padStart(2, '0')} / {title.toUpperCase()}
      </text>
    </svg>
  );
}
