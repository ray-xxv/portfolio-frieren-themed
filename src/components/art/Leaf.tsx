import type { CSSProperties } from 'react';

export type LeafTone = 'royal' | 'sky' | 'line';

const BLADE = 'M0 0 C 13 -10 15 -34 0 -52 C -15 -34 -13 -10 0 0 Z';
const RIB = 'M0 -3 Q 1 -26 0 -47 M0 -14 L 7 -21 M0 -24 L 7.5 -31 M0 -14 L -7 -21 M0 -24 L -7.5 -31 M0 -34 L 5 -39 M0 -34 L -5 -39';

interface LeafShapeProps {
  tone?: LeafTone;
  className?: string;
  transform?: string;
}

/** A leaf as an SVG <g>, base at (0,0), pointing up. */
export function LeafShape({ tone = 'royal', className, transform }: LeafShapeProps) {
  const fill = tone === 'royal' ? 'url(#leaf-royal)' : tone === 'sky' ? 'url(#leaf-sky)' : 'var(--paper)';
  const rib = tone === 'line' ? 'var(--royal)' : tone === 'royal' ? 'var(--sky-soft)' : 'var(--royal-deep)';
  return (
    <g className={className} transform={transform}>
      <path d={BLADE} fill={fill} stroke={tone === 'line' ? 'var(--ink)' : 'var(--royal-deep)'} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={RIB} fill="none" stroke={rib} strokeOpacity={0.6} strokeWidth={0.9} strokeLinecap="round" />
    </g>
  );
}

interface LeafProps extends LeafShapeProps {
  size?: number;
  rotate?: number;
  style?: CSSProperties;
}

export function Leaf({ size = 40, rotate = 0, style, className, tone }: LeafProps) {
  return (
    <svg viewBox="-18 -55 36 58" width={size * 0.62} height={size} className={className} style={style} aria-hidden="true">
      <LeafShape tone={tone} transform={`rotate(${rotate} 0 -26)`} />
    </svg>
  );
}
