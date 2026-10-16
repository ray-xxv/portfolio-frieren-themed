import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { FlowerHead } from './BlueMoonWeed';
import { SPARKLE_PATH } from './Sparkle';
import styles from './SpellCast.module.css';

/*
 * The Projects → Journey transition: a magic circle draws itself as you scroll,
 * holds while the spell completes, then night spreads out from its centre and
 * fills the screen — so you arrive inside the Journey's dark band without a seam.
 *
 * The circle is rendered twice: royal ink on cream, and sky light on night.
 * The night copy lives inside the expanding clip-path, so lines "invert" as the
 * spell washes over them.
 */

const RUNES = 'const journey = await cast(spell) ✦ for (const step of path) bloom(step) ✦ return memories ✦ ';

/** {8/3} octagram inscribed in radius r. */
function octagram(r: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  let d = '';
  for (let i = 0, k = 0; i <= 8; i++, k = (k + 3) % 8) d += `${i ? 'L' : 'M'} ${pts[k][0].toFixed(1)} ${pts[k][1].toFixed(1)} `;
  return d + 'Z';
}

/** a ring as a path (so DrawSVG can draw it), starting at the top */
const ringPath = (r: number) => `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;

function MagicCircle({ night, id }: { night: boolean; id: string }) {
  const ink = night ? 'var(--sky)' : 'var(--royal)';
  const soft = night ? 'var(--sky-soft)' : 'var(--royal-deep)';
  return (
    <svg viewBox="-310 -310 620 620" className={styles.circle}>
      <defs>
        <path id={id} d={ringPath(236)} />
      </defs>

      {/* outer tick ring */}
      <g className="sc-ticks" stroke={ink} strokeWidth={1.2} opacity={0.7}>
        {Array.from({ length: 72 }, (_, i) => (
          <line key={i} x1={0} y1={-292} x2={0} y2={i % 6 === 0 ? -304 : -298} transform={`rotate(${i * 5})`} />
        ))}
      </g>

      <g fill="none" strokeLinecap="round">
        <path className="sc-ring" d={ringPath(282)} stroke={ink} strokeWidth={2.4} />
        <path className="sc-ring" d={ringPath(268)} stroke={ink} strokeWidth={0.9} />
        <path className="sc-ring" d={ringPath(204)} stroke={ink} strokeWidth={1.8} />
        <path className="sc-ring" d={ringPath(128)} stroke={soft} strokeWidth={1} strokeDasharray="3 7" />
        <path className="sc-star" d={octagram(204)} stroke={ink} strokeWidth={1.3} strokeLinejoin="round" />
        <path className="sc-star" d={`M 0 -204 L 177 102 L -177 102 Z M 0 204 L 177 -102 L -177 -102 Z`} stroke={soft} strokeWidth={0.8} opacity={0.6} />
      </g>

      {/* runes: code written around the circle, slowly turning */}
      <g className="sc-runes">
        <text fill={ink} fontFamily="JetBrains Mono Variable, monospace" fontSize={15} letterSpacing={2.2}>
          <textPath href={`#${id}`}>{RUNES.repeat(2)}</textPath>
        </text>
      </g>

      {/* nodes on the outer ring */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45}) translate(0 -282)`}>
          <circle className="sc-node" r={7} fill={night ? 'var(--night)' : 'var(--paper)'} stroke={ink} strokeWidth={1.6} />
        </g>
      ))}

      {/* centre: a Blue-Moon Weed inside a sparkle */}
      <g className="sc-core">
        <path d={SPARKLE_PATH} transform="scale(2.1)" fill="none" stroke={soft} strokeWidth={0.8} />
        <FlowerHead tone={night ? 'night' : 'day'} transform="scale(1.05)" />
      </g>

      {/* the shockwave when the spell lands */}
      <circle className="sc-burst" r={210} fill="none" stroke={night ? 'var(--sky-soft)' : 'var(--royal)'} strokeWidth={3} opacity={0} />
    </svg>
  );
}

export function SpellCast({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      const rings = q('.sc-ring');
      const stars = q('.sc-star');
      const night = q(`.${styles.night}`);

      gsap.set([...rings, ...stars], { drawSVG: '0%' });
      gsap.set(q('.sc-ticks, .sc-runes'), { autoAlpha: 0 });
      gsap.set(q('.sc-node'), { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(q('.sc-core'), { scale: 0, rotate: -180, transformOrigin: '50% 50%' });
      gsap.set(q('.sc-caption-wipe'), { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(night, { clipPath: 'circle(0% at 50% 50%)' });
      gsap.to(q('.sc-runes'), { rotation: 360, svgOrigin: '0 0', duration: 70, repeat: -1, ease: 'none' });

      // 1. while the circle scrolls into view, the outer rings begin to draw
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top top', scrub: 1 } })
        .to(rings, { drawSVG: '55%', stagger: 0.08, ease: 'none' }, 0)
        .to(q('.sc-ticks'), { autoAlpha: 1, duration: 0.4 }, 0.2)
        .to(q('.sc-caption-wipe'), { clipPath: 'inset(0 45% 0 0)', ease: 'none' }, 0);

      // 2. the cast itself — held in place on larger screens
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 961px)', mobile: '(max-width: 960px)' }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        gsap
          .timeline({
            scrollTrigger: desktop
              ? { trigger: root.current, start: 'top top', end: '+=130%', scrub: 1, pin: true }
              : { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
          })
          .fromTo(rings, { drawSVG: '55%' }, { drawSVG: '100%', duration: 0.3, stagger: 0.04, ease: 'none', immediateRender: false }, 0)
          .to(stars, { drawSVG: '100%', duration: 0.3, stagger: 0.08, ease: 'power1.inOut' }, 0.1)
          .to(q('.sc-runes'), { autoAlpha: 1, duration: 0.15 }, 0.15)
          .to(q('.sc-node'), { scale: 1, duration: 0.12, stagger: 0.02, ease: 'back.out(3)' }, 0.25)
          .fromTo(q('.sc-caption-wipe'), { clipPath: 'inset(0 45% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.2, ease: 'none', immediateRender: false }, 0.2)
          .to(q('.sc-core'), { scale: 1, rotate: 0, duration: 0.18, ease: 'back.out(1.8)' }, 0.42)
          // the spell lands: shockwave + night spreading from the centre
          .fromTo(q('.sc-burst'), { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' }, { scale: 2.4, opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.58)
          .to(q('.sc-burst'), { opacity: 0, duration: 0.12 }, 0.66)
          .to(night, { clipPath: 'circle(85% at 50% 50%)', duration: 0.42, ease: 'power2.in' }, 0.58)
          .to(q(`.${styles.dayLayer}`), { scale: 1.06, duration: 0.42, ease: 'none' }, 0.58);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-nav="journey" className={`${styles.cast} ${reduced ? styles.static : ''}`} aria-hidden="true">
      <div className={styles.dayLayer}>
        <MagicCircle night={false} id="sc-runes-day" />
        <p className={`mono ${styles.caption}`}>
          <span className="sc-caption-wipe">$ cast --spell journey.log</span>
        </p>
      </div>
      <div className={styles.night}>
        <div className={styles.glow} />
        <MagicCircle night id="sc-runes-night" />
        <p className={`mono ${styles.caption}`}>
          <span className="sc-caption-wipe">$ cast --spell journey.log</span>
        </p>
      </div>
    </div>
  );
}
