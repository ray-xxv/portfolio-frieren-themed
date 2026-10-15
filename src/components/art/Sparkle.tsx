import type { CSSProperties } from 'react';

/** 4-point star from the 実験体δ / Background Color Theory posters. */
export const SPARKLE_PATH =
  'M0 -50 C 3 -14 14 -3 50 0 C 14 3 3 14 0 50 C -3 14 -14 3 -50 0 C -14 -3 -3 -14 0 -50 Z';

interface SparkleProps {
  size?: number;
  variant?: 'fill' | 'outline';
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function Sparkle({ size = 24, variant = 'fill', color = 'var(--royal)', className, style }: SparkleProps) {
  return (
    <svg viewBox="-52 -52 104 104" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path
        d={SPARKLE_PATH}
        fill={variant === 'fill' ? color : 'none'}
        stroke={color}
        strokeWidth={variant === 'fill' ? 0 : 2.4}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
