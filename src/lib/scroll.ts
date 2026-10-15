import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Smooth-scrolls to a section id, falling back to native scrolling when Lenis is off. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'hero' ? -200 : 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
  // move focus for keyboard / screen-reader users without jumping the page
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
