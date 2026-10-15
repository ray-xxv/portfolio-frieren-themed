import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { projects, contact } from '../../data/content';
import { SectionHeader } from '../ui/SectionHeader';
import { Polaroid } from '../ui/Polaroid';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import { Sparkle } from '../art/Sparkle';
import { Leaf } from '../art/Leaf';
import styles from './Projects.module.css';

const github = contact.links.find((l) => l.label === 'github');

export function Projects({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  useReveal(root, reduced);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the polaroids sideways.
      mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const total = projects.length;
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (counter.current) {
                const n = Math.min(total, Math.floor(self.progress * total) + 1);
                counter.current.textContent = String(n).padStart(2, '0');
              }
            },
          },
        });
        // cards drift in slightly as the track moves
        gsap.from('.project-card', {
          y: 80,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
        });
      });

      // Tablet / mobile: simple reveal per card.
      mm.add('(max-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
          gsap.from(card, { y: 60, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="projects" ref={root} className={styles.projects} aria-labelledby="projects-title">
      <div className={styles.decor} aria-hidden="true">
        <Sparkle size={30} className={styles.s1} />
        <Sparkle size={18} variant="outline" className={styles.s2} />
      </div>

      <div className={styles.viewport}>
        <div ref={track} className={styles.track}>
          <div className={styles.intro}>
            <SectionHeader index="02" file="projects/" title={['Spells I’ve', '*cast* lately.']} id="projects-title" />
            <p className={styles.lede} data-reveal>
              A few things I’ve built — tools, experiments and products. Each one taught me a new spell.
            </p>
            <div className={`mono ${styles.progress}`} aria-hidden="true">
              <span>
                <span ref={counter}>01</span> / {String(projects.length).padStart(2, '0')}
              </span>
              <span className={styles.barTrack}>
                <span ref={bar} className={styles.bar} />
              </span>
              <span>keep scrolling</span>
            </div>
          </div>
          {projects.map((p, i) => (
            <Polaroid key={p.title} project={p} index={i} />
          ))}
          <aside className={styles.end}>
            <BlueMoonWeed size={100} rotate={20} tone="deep" className={styles.endFlower} />
            <Leaf size={50} rotate={-30} className={styles.endLeaf} />
            <p className="display">
              More spells in <em>the archive.</em>
            </p>
            {github && (
              <a href={github.href} target="_blank" rel="noreferrer" className="btn btn--solid">
                browse GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
