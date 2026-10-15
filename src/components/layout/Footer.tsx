import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../../lib/gsap';
import { contact, profile } from '../../data/content';
import { scrollToId } from '../../lib/scroll';
import { Meadow } from '../art/Meadow';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './Footer.module.css';

export function Footer({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [bloom, setBloom] = useState(false);
  const small = useMediaQuery('(max-width: 720px)');

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 95%', once: true, onEnter: () => setBloom(true) });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <code className={styles.signoff}>{contact.signoff}</code>
        <p className={`mono ${styles.copy}`}>
          © {new Date().getFullYear()} {profile.name} · built with React, GSAP &amp; 蒼月草
        </p>
        <button type="button" className={`mono ${styles.top}`} onClick={() => scrollToId('hero')}>
          back to the start <span aria-hidden="true">↑</span>
        </button>
      </div>
      <Meadow count={small ? 16 : 36} height={small ? 120 : 170} seed={21} bloom={bloom} instant={reduced} />
    </footer>
  );
}
