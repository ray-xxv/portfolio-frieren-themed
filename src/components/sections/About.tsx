import { useRef, useState } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { about, schools, spells, type School } from '../../data/content';
import { SectionHeader } from '../ui/SectionHeader';
import { FieldNotes } from '../ui/FieldNotes';
import { SpellCard } from '../ui/SpellCard';
import { BrushWash } from '../art/Decor';
import { Sparkle } from '../art/Sparkle';
import { Leaf } from '../art/Leaf';
import styles from './About.module.css';

type Filter = School | 'all';
const filters: Filter[] = ['all', 'offensive', 'defensive', 'utility'];

export function About({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const lastFilter = useRef<Filter>('all');
  const [filter, setFilter] = useState<Filter>('all');
  useReveal(root, reduced);

  const shown = spells.filter((s) => filter === 'all' || s.school === filter);

  // first appearance of the spell grid
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('.spell-card', {
        y: 60,
        autoAlpha: 0,
        rotate: () => gsap.utils.random(-6, 6),
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: grid.current, start: 'top 85%', once: true },
      });
    },
    { scope: grid },
  );

  // re-deal the cards when the filter changes
  useGSAP(
    () => {
      // compare against the last filter so StrictMode's double-run doesn't fire this on mount
      if (lastFilter.current === filter) return;
      lastFilter.current = filter;
      if (reduced) return;
      gsap.from('.spell-card', { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    },
    { scope: grid, dependencies: [filter] },
  );

  return (
    <section id="grimoire" ref={root} className={`section ${styles.about}`} aria-labelledby="grimoire-title">
      <Sparkle size={40} className={styles.spark1} />
      <Sparkle size={22} variant="outline" className={styles.spark2} />

      <div className="container">
        <div className={styles.split}>
          <div className={styles.notesCol}>
            <div className={`halftone ${styles.halftone}`} aria-hidden="true" />
            <BrushWash className={styles.wash} />
            <FieldNotes reduced={reduced} />
          </div>

          <div className={styles.bio}>
            <SectionHeader index="01" file="grimoire.ts" title={about.title} id="grimoire-title" />
            <div data-reveal="stagger" className={styles.paras}>
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <blockquote className={styles.quote} data-reveal>
              <Leaf size={36} rotate={20} className={styles.quoteLeaf} />
              <p className="display">“{about.quote}”</p>
            </blockquote>
          </div>
        </div>

        <div className={styles.spells}>
          <div className={styles.spellHead} data-reveal>
            <div>
              <p className={`mono ${styles.label}`}>
                <span aria-hidden="true">{'//'} </span>collected spells — {spells.length} known
              </p>
              <h3 className={`display ${styles.spellTitle}`}>
                The <em>spellbook</em>
              </h3>
            </div>
            <div className={styles.filters} role="group" aria-label="Filter spells by school">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`mono ${styles.filter}`}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  title={f === 'all' ? 'All spells' : schools[f].blurb}
                >
                  {f === 'all' ? 'all' : schools[f].label.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <p className={`mono ${styles.blurb}`} aria-live="polite">
            {filter === 'all' ? 'Showing every school of magic.' : `${schools[filter].label} magic — ${schools[filter].blurb.toLowerCase()}.`}
          </p>

          <div ref={grid} className={styles.grid}>
            {shown.map((s) => (
              <SpellCard key={s.name} spell={s} index={spells.indexOf(s)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
