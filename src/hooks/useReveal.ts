import type { RefObject } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';

/**
 * Scroll reveals inside `scope`:
 *  - [data-split]  → headings rise line-by-line from a mask
 *  - [data-reveal] → fade + lift (optional data-reveal="stagger" animates direct children)
 */
export function useReveal(scope: RefObject<HTMLElement | null>, reduced: boolean) {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const q = gsap.utils.selector(scope);

      q('[data-split]').forEach((el: HTMLElement) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.2,
              stagger: 0.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      });

      q('[data-reveal]').forEach((el: HTMLElement) => {
        const targets = el.dataset.reveal === 'stagger' ? Array.from(el.children) : el;
        gsap.from(targets, {
          y: 18,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    },
    { scope },
  );
}
