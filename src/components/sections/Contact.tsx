import { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { contact, profile } from '../../data/content';
import { Accent } from '../../lib/accent';
import { Terminal } from '../ui/Terminal';
import { BrushWash } from '../art/Decor';
import { BlueMoonWeed } from '../art/BlueMoonWeed';
import { Sparkle } from '../art/Sparkle';
import { ScrollTrigger, useGSAP } from '../../lib/gsap';
import styles from './Contact.module.css';

export function Contact({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [toast, setToast] = useState('');
  const [typing, setTyping] = useState(reduced);
  useReveal(root, reduced);

  useGSAP(
    () => {
      if (reduced) return;
      ScrollTrigger.create({ trigger: root.current, start: 'top 60%', once: true, onEnter: () => setTyping(true) });
    },
    { scope: root },
  );

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast(`✿ copied ${value}`);
    } catch {
      setToast('Could not copy — select the address instead.');
    }
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <section id="contact" ref={root} className={`section ${styles.contact}`} aria-labelledby="contact-title">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={`mono ${styles.comment}`} data-reveal>
              <span aria-hidden="true">{'//'} </span>04 — <span className={styles.file}>contact.sh</span>
            </p>
            <h2 id="contact-title" className={`display ${styles.title}`} data-split>
              {contact.title.map((l, i) => (
                <span key={i} className={styles.line}>
                  <Accent text={l} />
                </span>
              ))}
            </h2>
            <p className={styles.blurb} data-reveal>
              {contact.blurb}
            </p>
            {profile.available && (
              <p className={`mono ${styles.badge}`} data-reveal>
                <i aria-hidden="true" /> currently accepting new quests
              </p>
            )}
          </div>

          <div className={styles.termCol} data-reveal>
            <BrushWash className={styles.wash} />
            <BlueMoonWeed size={80} rotate={-14} className={styles.flower} />
            <Sparkle size={28} className={styles.spark} />
            <Terminal
              title="~/frieren — contact.sh"
              prompt="~/contact $"
              start={typing}
              instant={reduced}
              lines={[
                { text: './contact.sh --party-invite', cmd: true },
                { text: '? choose a way to reach me', tone: 'muted' },
              ]}
            >
              <ul className={`${styles.links} ${typing ? styles.linksOn : ''}`}>
                {contact.links.map((l) => (
                  <li key={l.label}>
                    <span className={styles.arrow} aria-hidden="true">
                      ▸
                    </span>
                    <span className={styles.label}>{l.label}</span>
                    {l.copy ? (
                      <span className={styles.valueRow}>
                        <a href={l.href} className={styles.value}>
                          {l.value}
                        </a>
                        <button type="button" className={styles.copyBtn} onClick={() => copy(l.value)}>
                          copy<span className="sr-only"> {l.label} address</span>
                        </button>
                      </span>
                    ) : (
                      <a href={l.href} target="_blank" rel="noreferrer" className={styles.value}>
                        {l.value} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Terminal>
          </div>
        </div>
      </div>

      <div className={`mono ${styles.toast} ${toast ? styles.toastOn : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </section>
  );
}
