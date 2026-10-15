import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';
import { scrollToId } from '../../lib/scroll';
import { Accent } from '../../lib/accent';
import { profile } from '../../data/content';
import { PetalField } from '../art/PetalField';
import { Sparkle } from '../art/Sparkle';
import { Orbit, Barcode, ThoughtMarks } from '../art/Decor';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import { Leaf } from '../art/Leaf';
import { Terminal, type TermLine } from '../ui/Terminal';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './Hero.module.css';

const castLines: TermLine[] = [
  { text: 'cast --spell flowerField --bloom', cmd: true },
  { text: '› opening grimoire.ts ............ ok', tone: 'muted' },
  { text: '› summoning 蒼月草 × 128 ......... ok', tone: 'muted' },
  { text: '› wind: gentle · sky: clear ...... ok', tone: 'muted' },
  { text: '✿ the field is in bloom.', tone: 'accent' },
];

const sparkles = [
  { top: '18%', left: '6%', size: 22, d: 0 },
  { top: '12%', left: '48%', size: 14, d: 1.2 },
  { top: '30%', left: '92%', size: 26, d: 0.6 },
  { top: '58%', left: '44%', size: 12, d: 2 },
  { top: '64%', left: '3%', size: 16, d: 1.6 },
  { top: '8%', left: '74%', size: 18, d: 0.3, outline: true },
  { top: '46%', left: '60%', size: 20, d: 2.4, outline: true },
];

interface Props {
  ready: boolean;
  reduced: boolean;
  /** The terminal finished casting — petals fly and the vines grow. */
  cast: boolean;
  onCast: () => void;
}

export function Hero({ ready, reduced, cast, onCast }: Props) {
  const root = useRef<HTMLElement>(null);
  const small = useMediaQuery('(max-width: 720px)');

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q('.hero-title'), { type: 'lines', mask: 'lines' });
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('.hero-meta > *'), { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0)
        // un-split afterwards so the line masks stop clipping the accent underline
        .from(split.lines, { yPercent: 115, duration: 1.4, stagger: 0.12, onComplete: () => split.revert() }, 0.05)
        .from(q('.hero-fade'), { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.45)
        .from(q('.hero-term'), { y: 80, rotate: 8, autoAlpha: 0, duration: 1.4 }, 0.35)
        .from(q('.hero-orbit'), { scale: 0.6, autoAlpha: 0, duration: 2 }, 0)
        .from(q('.hero-jp'), { yPercent: -30, autoAlpha: 0, duration: 1.6 }, 0.4);

      // gentle parallax as the hero scrolls away
      gsap.to(q('.hero-orbit'), {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(q('.hero-copy'), {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  return (
    <section id="hero" ref={root} className={styles.hero} aria-labelledby="hero-title">
      {/* background layers */}
      <div className={styles.rays} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Orbit className={`hero-orbit ${styles.orbit}`} rings={4} />
      {sparkles.map((s, i) => (
        <Sparkle
          key={i}
          size={s.size}
          variant={s.outline ? 'outline' : 'fill'}
          className={styles.sparkle}
          style={{ top: s.top, left: s.left, animationDelay: `${s.d}s` }}
        />
      ))}
      <div className={styles.petals}>
        <PetalField active={cast && !reduced} density={small ? 0.6 : 1} />
      </div>

      <p className={`hero-jp ${styles.jp}`} aria-hidden="true">
        魔法使いの旅路
      </p>

      <div className={`container ${styles.inner}`}>
        <div className={`hero-copy ${styles.copy}`}>
          <div className={`hero-meta mono ${styles.meta}`}>
            <div className={styles.metaLines}>
              {profile.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className={styles.barcode} aria-hidden="true">
              <Barcode seed={11} />
              <span>FRN-0001 · {new Date().getFullYear()}</span>
            </div>
          </div>

          <p className={`mono hero-fade ${styles.kicker}`}>
            <span aria-hidden="true">{'//'} </span>hello, world — I’m <strong>{profile.name}</strong>, {profile.role.toLowerCase()}
          </p>

          <h1 id="hero-title" className={`display hero-title ${styles.title}`}>
            {profile.headline.map((line, i) => (
              <span key={i} className={styles.titleLine}>
                <Accent text={line} />
              </span>
            ))}
          </h1>

          <p className={`hero-fade ${styles.intro}`}>{profile.intro}</p>

          <div className={`hero-fade ${styles.ctas}`}>
            <a
              href="#projects"
              className="btn btn--solid"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('projects');
              }}
            >
              view projects <span aria-hidden="true">→</span>
            </a>
            <a
              href="#grimoire"
              className="btn btn--ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('grimoire');
              }}
            >
              open the grimoire
            </a>
          </div>
        </div>

        <div className={`hero-term ${styles.termWrap}`}>
          <ThoughtMarks className={styles.thought} />
          <Terminal
            title="~/frieren — spell.sh"
            lines={castLines}
            start={ready}
            instant={reduced}
            onDone={onCast}
          />
          <div className={styles.termTag}>
            <BlueMoonWeed size={38} rotate={18} />
            <span className="hand">蒼月草 — blue-moon weed</span>
          </div>
          <Leaf size={46} rotate={-30} className={styles.termLeaf} />
        </div>
      </div>

    </section>
  );
}
