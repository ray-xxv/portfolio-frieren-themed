import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { useLenis } from './hooks/useLenis';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ArtDefs } from './components/art/ArtDefs';
import { Loader } from './components/layout/Loader';
import { Nav } from './components/layout/Nav';
import { Cursor } from './components/layout/Cursor';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { VineBridge } from './components/art/VineBridge';
import { SpellCast } from './components/art/SpellCast';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';

const VISITED = 'frieren:visited';

function firstVisit() {
  try {
    return !sessionStorage.getItem(VISITED);
  } catch {
    return true;
  }
}

export function App() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [showLoader, setShowLoader] = useState(() => !reduced && firstVisit());
  const [ready, setReady] = useState(!showLoader);
  const [cast, setCast] = useState(reduced);

  useLenis(!reduced);

  // Hold scrolling while the intro plays.
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', showLoader);
  }, [showLoader]);

  // Webfonts change line breaks and heights: once they land, re-sort and re-measure every trigger.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onReveal = useCallback(() => setReady(true), []);
  const onCast = useCallback(() => setCast(true), []);
  const onDone = useCallback(() => {
    setShowLoader(false);
    try {
      sessionStorage.setItem(VISITED, '1');
    } catch {
      /* storage unavailable — the intro simply plays again next time */
    }
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ArtDefs />
      {showLoader && <Loader onReveal={onReveal} onDone={onDone} />}
      {finePointer && !reduced && <Cursor />}
      <Nav visible={ready} />
      <main id="main">
        <Hero ready={ready} reduced={reduced} cast={cast} onCast={onCast} />
        <VineBridge cast={cast} reduced={reduced} />
        <About reduced={reduced} />
        <Projects reduced={reduced} />
        <SpellCast reduced={reduced} />
        <Experience reduced={reduced} />
        <Contact reduced={reduced} />
      </main>
      <Footer reduced={reduced} />
    </>
  );
}
