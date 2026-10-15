import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { journey } from '../../data/content';
import { SectionHeader } from '../ui/SectionHeader';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import { Bird, CheckerBand, Orbit } from '../art/Decor';
import { Sparkle } from '../art/Sparkle';
import { PetalField } from '../art/PetalField';
import styles from './Experience.module.css';

const birds = [
  { top: '14%', dur: 26, delay: -4, size: 34 },
  { top: '22%', dur: 32, delay: -18, size: 22 },
  { top: '9%', dur: 38, delay: -9, size: 18 },
  { top: '48%', dur: 30, delay: -22, size: 26 },
  { top: '70%', dur: 36, delay: -2, size: 20 },
];

/** Builds a winding road through each waypoint node. */
function buildPath(points: { x: number; y: number }[], height: number, amp: number) {
  if (!points.length) return '';
  const cx = points[0].x;
  let d = `M ${cx} 0`;
  let prevY = 0;
  [...points, { x: cx, y: height }].forEach((p, i) => {
    const mid = (prevY + p.y) / 2;
    const swing = i % 2 === 0 ? amp : -amp;
    d += ` C ${cx + swing} ${prevY + (mid - prevY) * 0.9}, ${cx + swing} ${mid + (p.y - mid) * 0.1}, ${cx} ${p.y}`;
    prevY = p.y;
  });
  return d;
}

export function Experience({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const ribbon = useRef<SVGTextPathElement>(null);
  const [geo, setGeo] = useState({ d: '', w: 0, h: 0 });
  useReveal(root, reduced);

  // Measure the nodes and draw a road that passes through each of them.
  useLayoutEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const measure = () => {
      const box = ol.getBoundingClientRect();
      const nodes = Array.from(ol.querySelectorAll<HTMLElement>('[data-node]'));
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
      const amp = box.width < 700 ? 22 : 90;
      setGeo({ d: buildPath(pts, box.height, amp), w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ol);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced || !geo.d) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q('.road-drawn'),
        { drawSVG: '0%' },
        { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: list.current, start: 'top 65%', end: 'bottom 65%', scrub: 0.6 } },
      );
      q('.waypoint').forEach((wp: HTMLElement) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: wp, start: 'top 72%', once: true } });
        tl.from(wp.querySelector('.wp-flower'), { scale: 0, rotate: -160, duration: 1.1, ease: 'back.out(2)' })
          .from(wp.querySelector('.wp-card'), { x: wp.dataset.side === 'left' ? -50 : 50, autoAlpha: 0, duration: 1, ease: 'expo.out' }, 0.1);
      });
      if (ribbon.current) {
        gsap.fromTo(
          ribbon.current,
          { attr: { startOffset: '0%' } },
          { attr: { startOffset: '-50%' }, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      }
    },
    { scope: root, dependencies: [geo.d, reduced], revertOnUpdate: true },
  );

  return (
    <section id="journey" ref={root} className={styles.journey} aria-labelledby="journey-title">
      <CheckerBand />

      <div className={styles.sky} aria-hidden="true">
        <Orbit className={styles.orbit} color="var(--sky)" rings={3} />
        {birds.map((b, i) => (
          <div key={i} className={styles.birdLane} style={{ top: b.top, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
            <Bird className={styles.bird} style={{ width: b.size, animationDelay: `${i * 0.13}s` }} />
          </div>
        ))}
        {[
          ['10%', '8%', 18],
          ['30%', '88%', 26],
          ['62%', '12%', 14],
          ['84%', '80%', 20],
        ].map(([top, left, size], i) => (
          <Sparkle key={i} size={size as number} color="var(--sky-soft)" className={styles.star} style={{ top: top as string, left: left as string, animationDelay: `${i * 0.7}s` }} />
        ))}
        <div className={styles.petals}>
          <PetalField active={!reduced} density={0.35} night />
        </div>
      </div>

      <svg className={styles.ribbon} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path id="ribbon-path" d="M -20 80 C 200 10, 380 120, 600 60 S 1000 0, 1220 70" fill="none" stroke="var(--sky)" strokeOpacity="0.35" />
        <text className="mono" fill="var(--sky-soft)" fontSize="15" letterSpacing="3">
          <textPath ref={ribbon} href="#ribbon-path" startOffset="0%">
            {journey.ribbon.repeat(4)}
          </textPath>
        </text>
      </svg>

      <div className={`container ${styles.inner}`}>
        <SectionHeader index="03" file="journey.log" title={journey.title} id="journey-title" tone="night" />

        <ol ref={list} className={styles.timeline}>
          {geo.d && (
            <svg className={styles.road} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
              <path d={geo.d} fill="none" stroke="var(--sky)" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
              <path className="road-drawn" d={geo.d} fill="none" stroke="var(--sky)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
          {journey.waypoints.map((w, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <li key={w.period + w.role} className={`waypoint ${styles.waypoint} ${styles[side]}`} data-side={side}>
                <span className={styles.node} data-node>
                  <BlueMoonWeed size={44} tone="night" rotate={i * 23} className="wp-flower" />
                </span>
                <article className={`wp-card ${styles.card}`}>
                  <p className={`mono ${styles.period}`}>{w.period}</p>
                  <h3 className={styles.role}>{w.role}</h3>
                  <p className={`mono ${styles.place}`}>@ {w.place}</p>
                  <p className={styles.summary}>{w.summary}</p>
                  <ul className={styles.tags} aria-label="Skills">
                    {w.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <CheckerBand reverse />
    </section>
  );
}
