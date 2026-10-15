import type { Spell } from '../../data/content';
import { schools } from '../../data/content';
import { Sparkle } from '../art/Sparkle';
import styles from './SpellCard.module.css';

export function SpellCard({ spell, index }: { spell: Spell; index: number }) {
  return (
    <div className={`spell-card ${styles.wrap}`}>
      <article className={styles.card} data-school={spell.school}>
        <header className={styles.top}>
          <span className="mono">spell #{String(index + 1).padStart(2, '0')}</span>
          <span className={`mono ${styles.school}`}>{schools[spell.school].label}</span>
        </header>
        <h3 className={styles.name}>{spell.name}</h3>
        <p className={styles.lore}>{spell.lore}</p>
        <div className={styles.mastery} role="img" aria-label={`Mastery ${spell.mastery} of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Sparkle key={i} size={11} variant={i < spell.mastery ? 'fill' : 'outline'} color={i < spell.mastery ? 'var(--royal)' : 'var(--ink-soft)'} />
          ))}
          <span className="mono">mastery</span>
        </div>
        <code className={styles.incant}>
          <span aria-hidden="true">›</span> {spell.incantation}
        </code>
        <Sparkle size={28} className={styles.corner} variant="outline" />
      </article>
    </div>
  );
}
