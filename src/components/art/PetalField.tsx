import { useEffect, useRef } from 'react';

type Kind = 'flower' | 'petal' | 'leaf';

interface Particle {
  kind: Kind;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  flip: number;
  vflip: number;
  phase: number;
  alpha: number;
}

const PETAL = 'M0 -5 C -15 -9 -28 -27 -18.5 -41 C -12 -49.5 12 -49.5 18.5 -41 C 28 -27 15 -9 0 -5 Z';
const LEAF = 'M0 26 C 13 16 15 -8 0 -26 C -15 -8 -13 16 0 26 Z';
const SPRITE = 96;

function makeSprite(kind: Kind, night: boolean, dpr: number) {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE * dpr;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr * (SPRITE / 104), dpr * (SPRITE / 104));
  ctx.translate(52, 52);
  const petal = new Path2D(PETAL);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 48);
  grad.addColorStop(0, night ? '#FFFFFF' : '#FBF8F0');
  grad.addColorStop(0.35, night ? '#CFE6F8' : '#E4F0FB');
  grad.addColorStop(0.65, '#8EC3EE');
  grad.addColorStop(1, night ? '#5F9BE6' : '#2645D8');
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = night ? 'rgba(207,230,248,.9)' : '#12238A';
  ctx.lineJoin = 'round';

  if (kind === 'flower') {
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.fillStyle = grad;
      ctx.fill(petal);
      ctx.stroke(petal);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FBF8F0';
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'petal') {
    ctx.translate(0, 26);
    ctx.scale(1.15, 1.15);
    ctx.fillStyle = grad;
    ctx.fill(petal);
    ctx.stroke(petal);
  } else {
    const leaf = new Path2D(LEAF);
    ctx.scale(1.5, 1.5);
    const lg = ctx.createLinearGradient(0, 26, 6, -26);
    lg.addColorStop(0, night ? '#5F9BE6' : '#12238A');
    lg.addColorStop(1, night ? '#CFE6F8' : '#5F9BE6');
    ctx.fillStyle = lg;
    ctx.fill(leaf);
    ctx.lineWidth = 1.4;
    ctx.stroke(leaf);
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.lineTo(0, -20);
    ctx.strokeStyle = night ? '#12238A' : 'rgba(207,230,248,.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  return c;
}

interface PetalFieldProps {
  active: boolean;
  /** Multiplier on the automatic particle count. */
  density?: number;
  night?: boolean;
  className?: string;
}

/**
 * Canvas particle system: Blue-Moon Weed blossoms, loose petals and leaves drifting on the wind.
 * Pauses when off-screen or the tab is hidden, and scatters away from the pointer.
 */
export function PetalField({ active, density = 1, night = false, className }: PetalFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites: Record<Kind, HTMLCanvasElement> = {
      flower: makeSprite('flower', night, dpr),
      petal: makeSprite('petal', night, dpr),
      leaf: makeSprite('leaf', night, dpr),
    };

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999 };

    const spawn = (p: Partial<Particle> = {}, initial = false): Particle => {
      const r = Math.random();
      const kind: Kind = r < 0.3 ? 'flower' : r < 0.72 ? 'petal' : 'leaf';
      const size = kind === 'flower' ? 18 + Math.random() * 18 : 14 + Math.random() * 14;
      return {
        kind,
        x: initial ? Math.random() * w : -40 + Math.random() * w * 0.6,
        y: initial ? Math.random() * h : -40 - Math.random() * 60,
        size,
        vx: 14 + Math.random() * 26,
        vy: 18 + Math.random() * 26,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 1.4,
        flip: Math.random() * Math.PI * 2,
        vflip: 0.8 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        alpha: initial ? 0 : 1,
        ...p,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(48, (w * h) / 30000) * density);
      while (particles.length < target) particles.push(spawn({}, true));
      particles.length = Math.min(particles.length, target);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.alpha = Math.min(1, p.alpha + dt * 0.8);
        p.x += (p.vx + Math.sin(t * 0.7 + p.phase) * 18) * dt;
        p.y += (p.vy + Math.cos(t * 0.9 + p.phase) * 8) * dt;
        p.rot += p.vr * dt;
        p.flip += p.vflip * dt;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 120) * 240 * dt;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
          p.vr += (Math.random() - 0.5) * 0.2;
        }

        if (p.y > h + 40 || p.x > w + 40) {
          particles[i] = Math.random() < 0.5 ? spawn({ x: -30, y: Math.random() * h * 0.7 }) : spawn();
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha * (p.kind === 'leaf' ? 0.85 : 0.95);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // fake 3D tumble by squashing one axis
        ctx.scale(Math.max(0.15, Math.abs(Math.cos(p.flip))), 1);
        ctx.drawImage(sprites[p.kind], -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      particles = [];
    };
  }, [active, density, night]);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
