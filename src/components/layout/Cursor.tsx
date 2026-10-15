import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { SPARKLE_PATH } from '../art/Sparkle';
import styles from './Cursor.module.css';

/**
 * A sparkle that trails the (still visible) native cursor and opens up over links.
 * Only mounted on fine pointers with motion allowed.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const xTo = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      node.classList.add(styles.on);
      xTo(e.clientX + 14);
      yTo(e.clientY + 14);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element).closest('a, button, [data-cursor]');
      node.classList.toggle(styles.hover, !!hit);
    };
    const leave = () => node.classList.remove(styles.on);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={el} className={styles.cursor} aria-hidden="true">
      <span className={styles.inner}>
        <svg viewBox="-52 -52 104 104">
          <path d={SPARKLE_PATH} />
        </svg>
      </span>
    </div>
  );
}
