import type { CSSProperties } from 'react';

export type FlowerTone = 'day' | 'deep' | 'night' | 'line';

const PETAL = 'M0 -5 C -15 -9 -28 -27 -18.5 -41 C -12 -49.5 12 -49.5 18.5 -41 C 28 -27 15 -9 0 -5 Z';
const VEINS = 'M0 -9 L0 -40 M-4 -10 Q -10 -22 -12.5 -36 M4 -10 Q 10 -22 12.5 -36';

const fills: Record<FlowerTone, string> = {
  day: 'url(#bmw-day)',
  deep: 'url(#bmw-deep)',
  night: 'url(#bmw-night)',
  line: 'var(--paper)',
};

interface HeadProps {
  tone?: FlowerTone;
  /** Draw the ink outline (the hand-drawn look from the chibi reference). */
  outline?: boolean;
  className?: string;
  transform?: string;
}

/**
 * The flower head as an SVG <g> in a -50…50 coordinate space, so it can be placed inside other SVGs.
 * Blue-Moon Weed (蒼月草) — five broad petals, pale centre, fine veins and freckles near the throat.
 */
export function FlowerHead({ tone = 'day', outline = true, className, transform }: HeadProps) {
  const stroke = tone === 'night' ? 'rgba(207,230,248,0.9)' : tone === 'line' ? 'var(--ink)' : 'var(--royal-deep)';
  return (
    <g className={className} transform={transform}>
      <g className="bmw-petals">
        {[0, 72, 144, 216, 288].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path
              className="bmw-petal"
              d={PETAL}
              fill={fills[tone]}
              stroke={outline ? stroke : 'none'}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <path d={VEINS} fill="none" stroke={tone === 'line' ? 'var(--royal)' : 'var(--royal-deep)'} strokeOpacity={0.32} strokeWidth={1} strokeLinecap="round" />
            <circle cx={-4.5} cy={-15} r={1.3} fill="var(--royal-deep)" opacity={0.7} />
            <circle cx={4.5} cy={-15} r={1.3} fill="var(--royal-deep)" opacity={0.7} />
          </g>
        ))}
      </g>
      <circle r={7.5} fill="var(--paper)" stroke={outline ? stroke : 'none'} strokeWidth={1.4} />
      <circle r={3.4} fill="var(--sky-soft)" />
      {[0, 72, 144, 216, 288].map((r) => (
        <circle key={r} r={1.5} cx={0} cy={-5} transform={`rotate(${r + 36})`} fill="var(--royal-deep)" />
      ))}
    </g>
  );
}

interface FlowerProps extends HeadProps {
  size?: number | string;
  rotate?: number;
  style?: CSSProperties;
  title?: string;
}

/** Standalone Blue-Moon Weed SVG. Decorative unless a `title` is given. */
export function BlueMoonWeed({ size = 64, rotate = 0, style, className, title, ...head }: FlowerProps) {
  return (
    <svg
      viewBox="-52 -52 104 104"
      width={size}
      height={size}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <FlowerHead {...head} transform={`rotate(${rotate})`} />
    </svg>
  );
}
