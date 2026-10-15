import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { nav, profile } from '../../data/content';
import { scrollToId, getLenis } from '../../lib/scroll';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import styles from './Nav.module.css';

type Id = (typeof nav)[number]['id'];

/** Floating pill nav with file-tab links; the active tab follows the section in view. */
export function Nav({ visible }: { visible: boolean }) {
  const [active, setActive] = useState<Id>('hero');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  // Track which section is crossing the middle of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as Id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Slide the underline under the active tab.
  useLayoutEffect(() => {
    const place = () => {
      const link = list.current?.querySelector<HTMLAnchorElement>(`[data-id="${active}"]`);
      const bar = indicator.current;
      if (!link || !bar) return;
      bar.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth / 100})`;
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  // Lock scrolling while the mobile sheet is open; Esc closes it.
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${visible ? styles.visible : ''}`}>
        <a href="#hero" className={styles.logo} onClick={go('hero')} aria-label={`${profile.name} — back to top`}>
          <BlueMoonWeed size={22} className={styles.logoFlower} />
          <span className="mono">{profile.handle}</span>
        </a>

        <nav aria-label="Primary" className={styles.desktop}>
          <ul ref={list} className={styles.tabs}>
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  onClick={go(n.id)}
                  aria-current={active === n.id ? 'location' : undefined}
                  className={`mono ${styles.tab}`}
                >
                  <span className={styles.tilde}>~/</span>
                  {n.file}
                </a>
              </li>
            ))}
          </ul>
          <span ref={indicator} className={styles.indicator} aria-hidden="true" />
        </nav>

        {profile.available && (
          <span className={`mono ${styles.status}`}>
            <i aria-hidden="true" /> available
          </span>
        )}

        <button
          type="button"
          className={`mono ${styles.menuBtn}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'close' : 'menu'}
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div id="mobile-menu" className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`} inert={!open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ol className={styles.sheetList}>
            {nav.map((n, i) => (
              <li key={n.id} style={{ transitionDelay: `${0.05 * i + 0.1}s` }}>
                <a href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? 'location' : undefined}>
                  <span className="mono">0{i}  ~/{n.file}</span>
                  <span className="display">{n.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <BlueMoonWeed size={180} className={styles.sheetFlower} tone="deep" />
      </div>
    </>
  );
}
