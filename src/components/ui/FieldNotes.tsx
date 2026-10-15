import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { about } from '../../data/content';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import { Leaf } from '../art/Leaf';
import styles from './FieldNotes.module.css';

/** The specimen form from the line-sketch reference, filled in by hand. */
export function FieldNotes({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { fieldNotes } = about;

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
      tl.from(root.current, { rotate: -10, y: 80, autoAlpha: 0, duration: 1.3, ease: 'expo.out' })
        .from(q('.fn-value'), { clipPath: 'inset(0 100% 0 0)', duration: 0.7, stagger: 0.12, ease: 'power2.inOut' }, 0.5)
        .fromTo(q('.fn-tick'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, stagger: 0.1, ease: 'power1.in' }, 0.9)
        .from(q('.fn-flower'), { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(1.7)' }, 0.8);
    },
    { scope: root },
  );

  return (
    <figure ref={root} className={styles.card} aria-label="Field notes about me">
      <span className={styles.tape} aria-hidden="true" />
      <header className={styles.head}>
        <span className="mono">{fieldNotes.id}</span>
        <span className="mono">DATE: {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}</span>
      </header>

      <dl className={styles.rows}>
        {fieldNotes.rows.map((r) => (
          <div key={r.label} className={styles.row}>
            <dt className="mono">{r.label.toUpperCase()}:</dt>
            <dd className={`hand fn-value ${styles.value}`}>{r.value}</dd>
          </div>
        ))}
      </dl>

      <ul className={styles.checks}>
        {fieldNotes.checks.map((c) => (
          <li key={c.label}>
            <svg viewBox="0 0 20 20" className={styles.box} aria-hidden="true">
              <rect x="1.5" y="1.5" width="17" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {c.on && <path className="fn-tick" d="M4 10.5 L8.5 15 L17 3" fill="none" stroke="var(--royal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            <span className="mono">{c.label}</span>
            <span className="sr-only">{c.on ? ': yes' : ': not yet'}</span>
          </li>
        ))}
      </ul>

      <div className={styles.desc}>
        <span className="mono">DESCRIPTION:</span>
        <ol>
          {fieldNotes.notes.map((n, i) => (
            <li key={n}>
              <span className="mono">0{i + 1}</span> <span className={`hand fn-value ${styles.value}`}>{n}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={`fn-flower ${styles.pressed}`} aria-hidden="true">
        <Leaf size={58} rotate={-40} tone="royal" className={styles.pressedLeaf} />
        <BlueMoonWeed size={92} rotate={12} />
      </div>
    </figure>
  );
}
