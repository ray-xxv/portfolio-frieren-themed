import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { seeded, lerp } from '../../lib/random';
import { FlowerHead, type FlowerTone } from './BlueMoonWeed';
import { LeafShape, type LeafTone } from './Leaf';
import styles from './Meadow.module.css';

interface Sprig {
  x: number;
  h: number;
  size: number;
  curve: number;
  rot: number;
  back: boolean;
  tone: FlowerTone;
  leaves: { t: number; side: 1 | -1; s: number }[];
  blades: { dx: number; h: number; bend: number }[];
  sway: number;
  delay: number;
}

interface MeadowProps {
  /** Number of flowering stems. */
  count?: number;
  seed?: number;
  /** Max stem height in px. */
  height?: number;
  /** Start the bloom animation. */
  bloom: boolean;
  /** Skip the animation and render fully grown (reduced motion). */
  instant?: boolean;
  night?: boolean;
  className?: string;
}

function makeSprigs(count: number, seed: number, height: number, night: boolean): Sprig[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const back = rand() < 0.4;
    const h = back ? lerp(height * 0.35, height * 0.65, rand()) : lerp(height * 0.45, height, rand());
    const leafCount = 1 + Math.floor(rand() * 3);
    return {
      // spread evenly with jitter so there are no big gaps
      x: ((i + 0.15 + rand() * 0.7) / count) * 100,
      h,
      size: back ? lerp(26, 40, rand()) : lerp(38, 64, rand()),
      curve: lerp(-22, 22, rand()),
      rot: rand() * 72,
      back,
      tone: night ? 'night' : rand() < 0.3 ? 'deep' : 'day',
      leaves: Array.from({ length: leafCount }, (_, j) => ({
        t: lerp(0.18, 0.6, (j + rand()) / leafCount),
        side: rand() < 0.5 ? -1 : 1,
        s: lerp(0.38, 0.6, rand()),
      })),
      blades: Array.from({ length: 2 }, () => ({ dx: lerp(-18, 18, rand()), h: lerp(20, 60, rand()), bend: lerp(-14, 14, rand()) })),
      sway: lerp(4.5, 8, rand()),
      delay: -rand() * 8,
    };
  });
}

/** A strip of Blue-Moon Weed stems, leaves and grass that "grows" when `bloom` turns true. */
export function Meadow({ count = 24, seed = 3, height = 220, bloom, instant = false, night = false, className }: MeadowProps) {
  const root = useRef<HTMLDivElement>(null);
  const sprigs = useMemo(() => makeSprigs(count, seed, height, night), [count, seed, height, night]);

  useGSAP(
    () => {
      if (instant) return;
      const q = gsap.utils.selector(root);
      if (!bloom) {
        gsap.set(q('.sprig-stem, .sprig-blade'), { drawSVG: '0%' });
        gsap.set(q('.sprig-leaf'), { scale: 0, transformOrigin: '50% 100%' });
        gsap.set(q('.sprig-head'), { scale: 0, rotate: -140, transformOrigin: '50% 50%' });
        return;
      }
      const tl = gsap.timeline();
      tl.to(q('.sprig-blade'), { drawSVG: '100%', duration: 0.8, stagger: { each: 0.01, from: 'random' }, ease: 'power2.out' }, 0)
        .to(q('.sprig-stem'), { drawSVG: '100%', duration: 1.1, stagger: { each: 0.03, from: 'center' }, ease: 'power2.out' }, 0)
        .to(q('.sprig-leaf'), { scale: 1, duration: 0.8, stagger: { each: 0.02, from: 'center' }, ease: 'back.out(2)' }, 0.35)
        .to(q('.sprig-head'), { scale: 1, rotate: 0, duration: 1.1, stagger: { each: 0.035, from: 'center' }, ease: 'back.out(1.8)' }, 0.6);
    },
    { scope: root, dependencies: [bloom, instant], revertOnUpdate: false },
  );

  return (
    <div ref={root} className={`${styles.meadow} ${className ?? ''}`} style={{ height }} aria-hidden="true">
      {sprigs.map((s, i) => {
        const w = s.size * 1.9;
        const headY = -s.h + s.size / 2;
        const stem = `M0 0 Q ${s.curve * 1.6} ${-s.h * 0.5} ${s.curve} ${headY}`;
        const leafTone: LeafTone = night ? 'sky' : s.back ? 'sky' : 'royal';
        return (
          <div
            key={i}
            className={`${styles.sprig} ${s.back ? styles.back : ''}`}
            style={{
              left: `${s.x}%`,
              width: w,
              height: s.h + 6,
              marginLeft: -w / 2,
              animationDuration: `${s.sway}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <svg viewBox={`${-w / 2} ${-s.h - 6} ${w} ${s.h + 6}`} width="100%" height="100%" overflow="visible">
              {s.blades.map((b, j) => (
                <path
                  key={j}
                  className="sprig-blade"
                  d={`M${b.dx} 0 Q ${b.dx + b.bend * 0.3} ${-b.h * 0.6} ${b.dx + b.bend} ${-b.h}`}
                  fill="none"
                  stroke={night ? 'var(--sky)' : 'var(--royal-deep)'}
                  strokeOpacity={0.55}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
              ))}
              <path className="sprig-stem" d={stem} fill="none" stroke={night ? 'var(--sky)' : 'var(--royal-deep)'} strokeWidth={2} strokeLinecap="round" />
              {s.leaves.map((l, j) => {
                // point on the quadratic stem at t
                const t = l.t;
                const px = 2 * (1 - t) * t * s.curve * 1.6 + t * t * s.curve;
                const py = 2 * (1 - t) * t * (-s.h * 0.5) + t * t * headY;
                return (
                  <g key={j} transform={`translate(${px} ${py}) rotate(${l.side * 48}) scale(${l.s})`}>
                    <LeafShape className="sprig-leaf" tone={leafTone} />
                  </g>
                );
              })}
              <g transform={`translate(${s.curve} ${headY}) scale(${s.size / 100}) rotate(${s.rot})`}>
                <FlowerHead className="sprig-head" tone={s.tone} />
              </g>
            </svg>
          </div>
        );
      })}
    </div>
  );
}
