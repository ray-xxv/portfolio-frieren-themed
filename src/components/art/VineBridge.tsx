import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { FlowerHead, type FlowerTone } from './BlueMoonWeed';
import { LeafShape } from './Leaf';
import styles from './VineBridge.module.css';

/*
 * Two flowering vines that straddle the hero → grimoire boundary.
 * They grow across the bottom of the hero when the spell is cast, then keep
 * drawing down into the grimoire as you scroll — the vine carries you between sections.
 *
 * Geometry is authored in relative units (x: 0–1 of width, y: offset from the
 * boundary `b` in fractions of height) and rebuilt on resize, so it fits any viewport.
 */

type Side = 1 | -1;
type Item =
  | { kind: 'leaf'; t: number; side: Side; size: number }
  | { kind: 'bud'; t: number; side: Side; size: number }
  | { kind: 'tendril'; t: number; side: Side; size: number }
  | { kind: 'flower'; t: number; side: Side; size: number; tone: FlowerTone; rot: number };

interface Spec {
  /** [x, yFromBoundary] */
  start: [number, number];
  /** cubic segments: [c1, c2, end], each [x, yFromBoundary] */
  segs: [[number, number], [number, number], [number, number]][];
  items: Item[];
}

const flower = (t: number, side: Side, size: number, tone: FlowerTone, rot: number): Item => ({ kind: 'flower', t, side, size, tone, rot });

/** Leaves at a regular rhythm, alternating sides, skipping spots taken by blooms. */
function leaves(step: number, avoid: number[], from = 0.04, to = 0.97): Item[] {
  const out: Item[] = [];
  let side: Side = 1;
  for (let t = from; t <= to; t += step) {
    side = side === 1 ? -1 : 1;
    if (avoid.some((a) => Math.abs(a - t) < 0.028)) continue;
    out.push({ kind: 'leaf', t, side, size: 38 + ((t * 97) % 1) * 22 });
  }
  return out;
}

const VINE_A: Spec = {
  // the hero stretch hugs the bottom ~14% of the screen so it never reaches the CTAs
  start: [-0.04, -0.14],
  segs: [
    [[0.1, -0.22], [0.2, 0.0], [0.32, -0.06]],
    [[0.43, -0.1], [0.5, 0.02], [0.44, 0.12]],
    [[0.38, 0.22], [0.2, 0.12], [0.12, 0.24]],
    [[0.05, 0.34], [0.1, 0.46], [0.02, 0.53]],
  ],
  items: [
    flower(0.15, 1, 92, 'day', 10),
    flower(0.34, 1, 118, 'deep', 40),
    flower(0.56, 1, 84, 'day', 22),
    flower(0.79, -1, 96, 'deep', 64),
    flower(1, 1, 104, 'day', 5),
    { kind: 'bud', t: 0.25, side: 1, size: 30 },
    { kind: 'bud', t: 0.47, side: -1, size: 34 },
    { kind: 'bud', t: 0.69, side: 1, size: 28 },
    { kind: 'bud', t: 0.9, side: -1, size: 30 },
    { kind: 'tendril', t: 0.09, side: 1, size: 34 },
    { kind: 'tendril', t: 0.41, side: 1, size: 40 },
    { kind: 'tendril', t: 0.63, side: -1, size: 36 },
    { kind: 'tendril', t: 0.86, side: 1, size: 32 },
    ...leaves(0.052, [0.15, 0.34, 0.56, 0.79, 1, 0.25, 0.47, 0.69, 0.9]),
  ],
};

const VINE_B: Spec = {
  start: [1.04, -0.45],
  segs: [
    [[0.95, -0.39], [1.0, -0.2], [0.93, -0.08]],
    [[0.88, 0.0], [0.9, 0.14], [0.95, 0.2]],
    [[1.0, 0.26], [0.99, 0.38], [0.94, 0.46]],
  ],
  items: [
    flower(0.24, -1, 100, 'day', 30),
    flower(0.53, 1, 78, 'deep', 12),
    flower(1, -1, 96, 'day', 50),
    { kind: 'bud', t: 0.38, side: 1, size: 30 },
    { kind: 'bud', t: 0.76, side: -1, size: 28 },
    { kind: 'tendril', t: 0.14, side: 1, size: 34 },
    { kind: 'tendril', t: 0.64, side: -1, size: 30 },
    { kind: 'tendril', t: 0.88, side: 1, size: 32 },
    ...leaves(0.062, [0.24, 0.53, 1, 0.38, 0.76]),
  ],
};

const SPECS = [VINE_A, VINE_B];

/*
 * Phones have no side margin, so here the grimoire stretch hugs the screen edges
 * and blooms hang outward (half off-screen) instead of sitting under the text.
 */
const MOBILE_A: Spec = {
  start: [-0.06, -0.1],
  segs: [
    [[0.25, -0.2], [0.5, 0.02], [0.72, -0.05]],
    [[0.9, -0.1], [1.0, 0.02], [0.97, 0.12]],
    [[0.94, 0.22], [1.02, 0.3], [0.97, 0.4]],
  ],
  items: [
    flower(0.18, 1, 96, 'day', 10),
    flower(0.45, 1, 110, 'deep', 40),
    flower(0.8, -1, 90, 'day', 20),
    flower(1, -1, 100, 'deep', 60),
    { kind: 'bud', t: 0.3, side: -1, size: 34 },
    { kind: 'bud', t: 0.62, side: -1, size: 30 },
    { kind: 'tendril', t: 0.1, side: 1, size: 40 },
    { kind: 'tendril', t: 0.52, side: -1, size: 40 },
    { kind: 'tendril', t: 0.9, side: -1, size: 36 },
    ...leaves(0.07, [0.18, 0.45, 0.8, 1, 0.3, 0.62]),
  ],
};

const MOBILE_B: Spec = {
  start: [-0.06, 0.04],
  segs: [
    [[0.04, 0.12], [-0.01, 0.22], [0.03, 0.3]],
    [[0.06, 0.38], [0.0, 0.46], [0.02, 0.55]],
  ],
  items: [
    flower(0.35, 1, 96, 'day', 30),
    flower(1, 1, 104, 'deep', 10),
    { kind: 'bud', t: 0.66, side: 1, size: 32 },
    { kind: 'tendril', t: 0.2, side: -1, size: 36 },
    { kind: 'tendril', t: 0.82, side: -1, size: 32 },
    ...leaves(0.09, [0.35, 1, 0.66]),
  ],
};

const MOBILE = [MOBILE_A, MOBILE_B];

interface Placed {
  item: Item;
  x: number;
  y: number;
  ang: number;
  /** pre-built path for tendrils */
  d?: string;
}

interface VineLayout {
  twine: string;
  /** fraction of the vine that lives inside the hero */
  f0: number;
  placed: Placed[];
  /** where the vine leaves the hero (anchor for the "follow the vine" cue) */
  exit: { x: number; y: number };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function buildD(spec: Spec, w: number, h: number, b: number) {
  const P = ([x, y]: [number, number]) => `${(x * w).toFixed(1)} ${((b + y) * h).toFixed(1)}`;
  return `M ${P(spec.start)} ` + spec.segs.map(([c1, c2, e]) => `C ${P(c1)}, ${P(c2)}, ${P(e)}`).join(' ');
}

/** A curling tendril: a curve whose turn rate keeps increasing, so it rolls into a spiral. */
function tendril(x: number, y: number, headingDeg: number, side: Side, size: number) {
  let h = (headingDeg * Math.PI) / 180;
  const step = size / 16;
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
  for (let i = 0; i < 46; i++) {
    h += side * (0.03 + i * 0.0105);
    x += Math.cos(h) * step * (1 - i / 70);
    y += Math.sin(h) * step * (1 - i / 70);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

interface Props {
  /** The hero spell has been cast: grow the first stretch of vine. */
  cast: boolean;
  reduced: boolean;
}

export function VineBridge({ cast, reduced }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const grown = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [layout, setLayout] = useState<VineLayout[] | null>(null);

  // 1. track the bridge size
  useLayoutEffect(() => {
    const el = root.current!;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (Math.abs(s.w - r.width) < 2 && Math.abs(s.h - r.height) < 2 ? s : { w: Math.round(r.width), h: Math.round(r.height) }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = size.w < 720;
  const b = narrow ? 0.375 : 0.45;
  const k = clamp(size.w / 1440, narrow ? 0.48 : 0.62, 1.12);
  const specs = narrow ? MOBILE : SPECS;
  const mains = useMemo(() => (size.w ? specs.map((s) => buildD(s, size.w, size.h, b)) : []), [size, b, specs]);

  // 2. once the main stems are in the DOM, place leaves/flowers along them
  useLayoutEffect(() => {
    if (!mains.length) return;
    const next = specs.map((spec, i) => {
      const p = paths.current[i]!;
      const L = p.getTotalLength();
      const at = (t: number) => {
        const l = clamp(t, 0, 1) * L;
        const a = p.getPointAtLength(l);
        const n1 = p.getPointAtLength(Math.min(L, l + 2));
        const n0 = p.getPointAtLength(Math.max(0, l - 2));
        return { x: a.x, y: a.y, ang: (Math.atan2(n1.y - n0.y, n1.x - n0.x) * 180) / Math.PI };
      };

      // a thinner strand that twists around the main stem
      const pts: string[] = [];
      for (let l = 0; l <= L; l += 7) {
        const { x, y, ang } = at(l / L);
        const r = (ang * Math.PI) / 180;
        const off = Math.sin(l / 24) * 5.5 * k;
        pts.push(`${(x - Math.sin(r) * off).toFixed(1)} ${(y + Math.cos(r) * off).toFixed(1)}`);
      }

      let f0 = 1;
      for (let l = 0; l <= L; l += 4) {
        if (p.getPointAtLength(l).y > b * size.h) {
          f0 = l / L;
          break;
        }
      }

      const placed: Placed[] = spec.items.map((item) => {
        const pt = at(item.t);
        if (item.kind === 'tendril') {
          return { item, ...pt, d: tendril(pt.x, pt.y, pt.ang + item.side * 70, item.side, item.size * k) };
        }
        return { item, ...pt };
      });
      const exit = p.getPointAtLength(L * f0);
      return { twine: 'M ' + pts.join(' L '), f0, placed, exit: { x: exit.x, y: exit.y } };
    });
    setLayout(next);
  }, [mains, specs, k, b, size.h]);

  // 3. animation: grow the hero stretch on cast, then scrub the rest with scroll
  useGSAP(
    (_ctx, contextSafe) => {
      if (!layout || reduced) return;
      const q = gsap.utils.selector(root);

      const hide = (el: Element) => {
        const o = (el as HTMLElement).dataset.o;
        if (o === 'draw') gsap.set(el, { drawSVG: '0%' });
        else if (o === 'base') gsap.set(el, { scale: 0, transformOrigin: '50% 100%' });
        else gsap.set(el, { scale: 0, rotate: -120, transformOrigin: '50% 50%' });
      };
      const shown = (el: Element): gsap.TweenVars => {
        const o = (el as HTMLElement).dataset.o;
        if (o === 'draw') return { drawSVG: '100%', ease: 'power1.out' };
        if (o === 'base') return { scale: 1, ease: 'back.out(2)' };
        return { scale: 1, rotate: 0, ease: 'back.out(1.6)' };
      };

      layout.forEach((v, i) => {
        const strokes = q(`[data-stroke="${i}"]`);
        const items = q(`.vine-item[data-vine="${i}"]`) as Element[];
        const tOf = (el: Element) => Number((el as HTMLElement).dataset.t);
        const early = items.filter((el) => tOf(el) <= v.f0);
        const late = items.filter((el) => tOf(el) > v.f0);
        const f0 = `${(v.f0 * 100).toFixed(2)}%`;

        const buildScroll = contextSafe!(() => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top 55%', end: 'bottom 85%', scrub: 1 },
          });
          tl.fromTo(strokes, { drawSVG: `0% ${f0}` }, { drawSVG: '0% 100%', duration: 1, ease: 'none' }, 0);
          late.forEach((el) => tl.to(el, { ...shown(el), duration: 0.09 }, Math.max(0, (tOf(el) - v.f0) / (1 - v.f0) - 0.06)));
          if (i === 0 && label.current) tl.to(label.current, { autoAlpha: 0, y: 8, duration: 0.06 }, 0);
        });

        items.forEach(hide);

        if (grown.current) {
          // already grown once (e.g. after a resize): jump straight to the grown state
          gsap.set(strokes, { drawSVG: `0% ${f0}` });
          early.forEach((el) => gsap.set(el, { ...shown(el), ease: 'none' }));
          if (i === 0 && label.current) gsap.set(label.current, { autoAlpha: 1 });
          buildScroll();
          return;
        }

        gsap.set(strokes, { drawSVG: '0%' });
        if (i === 0 && label.current) gsap.set(label.current, { autoAlpha: 0 });
        if (!cast) return;

        const D = 2.6;
        const intro = gsap.timeline({
          onComplete: () => {
            grown.current = true;
            buildScroll();
          },
        });
        intro.to(strokes, { drawSVG: `0% ${f0}`, duration: D, ease: 'none' }, 0);
        early.forEach((el) => intro.to(el, { ...shown(el), duration: 0.9 }, v.f0 > 0 ? (tOf(el) / v.f0) * D * 0.92 : 0));
        if (i === 0 && label.current) intro.fromTo(label.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6 }, D - 0.3);
      });
    },
    { scope: root, dependencies: [layout, cast, reduced], revertOnUpdate: true },
  );

  // the "follow the vine" cue sits just past where vine A leaves the hero
  const cue = layout?.[0]?.exit;

  return (
    <div ref={root} className={styles.bridge} aria-hidden="true">
      <div className={styles.wash} />
      {size.w > 0 && (
        <svg className={styles.svg} width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
          {mains.map((d, i) => (
            <g key={i}>
              {layout?.[i] && (
                <path data-stroke={i} d={layout[i].twine} fill="none" stroke="var(--sky-mid)" strokeWidth={1.4 * k + 0.4} strokeLinecap="round" />
              )}
              <path
                ref={(el) => {
                  paths.current[i] = el;
                }}
                data-stroke={i}
                d={d}
                fill="none"
                stroke="var(--royal-deep)"
                strokeWidth={3.4 * k + 1}
                strokeLinecap="round"
              />
            </g>
          ))}

          {layout?.map((v, i) =>
            v.placed.map(({ item, x, y, ang, d }, j) => {
              const key = `${i}-${j}`;
              const common = { 'data-vine': i, 'data-t': item.t.toFixed(4) };
              if (item.kind === 'tendril') {
                return <path key={key} {...common} data-o="draw" className="vine-item" d={d} fill="none" stroke="var(--royal)" strokeWidth={1.3} strokeLinecap="round" />;
              }
              if (item.kind === 'leaf') {
                const s = (item.size * k) / 52;
                return (
                  <g key={key} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + item.side * 58 + 90).toFixed(1)})`}>
                    <g {...common} data-o="base" className="vine-item">
                      <LeafShape tone={item.t > 0.5 && i === 0 ? 'sky' : 'royal'} transform={`scale(${s.toFixed(3)})`} />
                    </g>
                  </g>
                );
              }
              if (item.kind === 'bud') {
                const s = (item.size * k) / 30;
                return (
                  <g key={key} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + item.side * 50 + 90).toFixed(1)}) scale(${s.toFixed(3)})`}>
                    <g {...common} data-o="base" className="vine-item">
                      <path d="M0 0 Q 2 -6 0 -12" fill="none" stroke="var(--royal-deep)" strokeWidth={1.6} strokeLinecap="round" />
                      <path d="M0 -12 C -7 -14 -8 -24 0 -32 C 8 -24 7 -14 0 -12 Z" fill="url(#bmw-deep)" stroke="var(--royal-deep)" strokeWidth={1.2} />
                      <path d="M0 -11 L -5 -19 M0 -11 L 5 -19" stroke="var(--royal-deep)" strokeWidth={1.2} strokeLinecap="round" />
                    </g>
                  </g>
                );
              }
              // flower on a short stalk, offset to one side of the vine
              const s = item.size * k;
              const r = (ang * Math.PI) / 180;
              const fx = x - Math.sin(r) * item.side * s * 0.42;
              const fy = y + Math.cos(r) * item.side * s * 0.42;
              return (
                <g key={key}>
                  <path
                    {...common}
                    data-o="draw"
                    className="vine-item"
                    d={`M ${x.toFixed(1)} ${y.toFixed(1)} Q ${((x + fx) / 2 + Math.cos(r) * 8).toFixed(1)} ${((y + fy) / 2 + Math.sin(r) * 8).toFixed(1)} ${fx.toFixed(1)} ${fy.toFixed(1)}`}
                    fill="none"
                    stroke="var(--royal-deep)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <g transform={`translate(${fx.toFixed(1)} ${fy.toFixed(1)})`}>
                    <g {...common} data-o="center" className="vine-item">
                      <FlowerHead tone={item.tone} transform={`scale(${(s / 100).toFixed(3)}) rotate(${item.rot})`} />
                    </g>
                  </g>
                </g>
              );
            }),
          )}
        </svg>
      )}
      {cue && (
        <div ref={label} className={`mono ${styles.cue}`} style={{ left: cue.x, top: cue.y }}>
          <span className={styles.arrow}>↓</span> follow the vine
          <span className={styles.next}>01 · grimoire.ts</span>
        </div>
      )}
    </div>
  );
}
