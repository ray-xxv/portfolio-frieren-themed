import { useEffect, useState, type ReactNode } from 'react';
import styles from './Terminal.module.css';

export interface TermLine {
  text: string;
  /** Typed character-by-character with a `$` prompt. Otherwise printed as output. */
  cmd?: boolean;
  tone?: 'muted' | 'ok' | 'accent';
}

interface Props {
  title: string;
  lines: TermLine[];
  /** Begin typing. */
  start: boolean;
  /** Render everything immediately (reduced motion). */
  instant?: boolean;
  onDone?: () => void;
  className?: string;
  children?: ReactNode;
  prompt?: string;
}

/** A little terminal window that types out its lines once `start` is true. */
export function Terminal({ title, lines, start, instant = false, onDone, className, children, prompt = '~/frieren $' }: Props) {
  const [line, setLine] = useState(instant ? lines.length : 0);
  const [char, setChar] = useState(0);
  const done = line >= lines.length;

  useEffect(() => {
    if (instant) setLine(lines.length);
  }, [instant, lines.length]);

  useEffect(() => {
    if (!start || done) return;
    const current = lines[line];
    let id: number;
    if (current.cmd && char < current.text.length) {
      id = window.setTimeout(() => setChar((c) => c + 1), 34 + Math.random() * 46);
    } else {
      id = window.setTimeout(
        () => {
          setLine((l) => l + 1);
          setChar(0);
        },
        current.cmd ? 380 : 260,
      );
    }
    return () => clearTimeout(id);
  }, [start, done, line, char, lines]);

  useEffect(() => {
    if (done && start) onDone?.();
  }, [done, start]);

  const visible = lines.slice(0, Math.min(line + 1, lines.length));

  return (
    <div className={`${styles.term} ${className ?? ''}`}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={`mono ${styles.title}`}>{title}</span>
      </div>
      <div className={styles.body}>
        {/* Screen readers get the full transcript at once instead of a character stream. */}
        <p className="sr-only">{lines.map((l) => l.text).join('. ')}</p>
        <div aria-hidden="true">
          {visible.map((l, i) => {
            const typing = i === line && !done;
            const text = l.cmd && typing ? l.text.slice(0, char) : l.text;
            if (typing && !l.cmd) return null;
            return (
              <div key={i} className={`${styles.line} ${l.tone ? styles[l.tone] : ''}`}>
                {l.cmd && <span className={styles.prompt}>{prompt} </span>}
                <span>{text}</span>
                {typing && <span className={styles.caret} />}
              </div>
            );
          })}
          {done && !children && (
            <div className={styles.line}>
              <span className={styles.prompt}>{prompt} </span>
              <span className={styles.caret} />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
