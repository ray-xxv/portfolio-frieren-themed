import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { FlowerHead } from '../art/BlueMoonWeed';
import { SPARKLE_PATH } from '../art/Sparkle';
import { profile } from '../../data/content';
import styles from './Loader.module.css';

interface Props {
  /** Fired as the curtain starts lifting — the page begins its entrance here. */
  onReveal: () => void;
  /** Fired once the loader is fully gone. */
  onDone: () => void;
}

/** Intro: a sparkle draws itself, a Blue-Moon Weed blooms, the counter hits 100, the curtain lifts. */
export function Loader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: onDone });
      tl.from(q('.ld-meta'), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 }, 0)
        .fromTo(q('.ld-sparkle'), { drawSVG: '0%', fillOpacity: 0 }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.1)
        .to(q('.ld-sparkle'), { fillOpacity: 1, duration: 0.35 }, '>-0.1')
        .from(q('.bmw-petals > g'), { scale: 0, svgOrigin: '0 0', duration: 0.9, stagger: 0.09, ease: 'back.out(2)' }, 0.35)
        .from(q('.ld-flower'), { rotate: -90, svgOrigin: '0 0', duration: 1.4, ease: 'expo.out' }, 0.35)
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        }, 0)
        .add(onReveal, '+=0.15')
        .to(root.current, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '<')
        .to(q('.ld-stage'), { y: 120, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, '<');
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite">
      <span className="sr-only">Loading portfolio…</span>
      <div className={`ld-stage ${styles.stage}`} aria-hidden="true">
        <svg viewBox="-80 -80 160 160" className={styles.mark}>
          <g transform="translate(34 -34) scale(0.42)">
            <path className="ld-sparkle" d={SPARKLE_PATH} fill="var(--royal)" stroke="var(--royal)" strokeWidth="3" />
          </g>
          <g className="ld-flower">
            <FlowerHead tone="day" />
          </g>
        </svg>
        <p className={`mono ld-meta ${styles.casting}`}>casting 蒼月草 …</p>
      </div>
      <p className={`mono ld-meta ${styles.corner}`} aria-hidden="true">
        {profile.handle} <br /> {profile.meta[2]}
      </p>
      <p className={`display ${styles.count}`} aria-hidden="true">
        <span ref={count}>000</span>
      </p>
    </div>
  );
}
