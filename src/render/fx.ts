/**
 * Effets : particules, secousse d'ecran, flashs, textes flottants.
 * Purement cosmetique — rien ici n'influence la simulation.
 */
import { clamp } from '../core/math.ts';
import { C } from './palette.ts';
import { drawText } from './font.ts';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  gravity: number;
  size: number;
}

interface FloatText {
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
}

export class Fx {
  private particles: Particle[] = [];
  private texts: FloatText[] = [];
  private shake = 0;
  private shakeDecay = 6;
  private flash = 0;
  private flashColor: string = C.ink;
  private time = 0;

  update(dt: number): void {
    this.time += dt;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.texts.splice(i, 1);
        continue;
      }
      t.y += t.vy * dt;
      t.vy *= 0.94;
    }

    if (this.shake > 0) this.shake = Math.max(0, this.shake - this.shakeDecay * dt);
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt / 0.18);
  }

  /** Decalage a appliquer avant de dessiner la scene. */
  get shakeOffset(): { x: number; y: number } {
    if (this.shake <= 0) return { x: 0, y: 0 };
    const a = this.shake;
    return {
      x: Math.round(Math.sin(this.time * 90) * a),
      y: Math.round(Math.cos(this.time * 71) * a * 0.7),
    };
  }

  addShake(amount: number, decay = 6): void {
    this.shake = Math.min(4, Math.max(this.shake, amount));
    this.shakeDecay = decay;
  }

  addFlash(color: string = C.ink, strength = 1): void {
    this.flash = clamp(strength, 0, 1);
    this.flashColor = color;
  }

  burst(
    x: number,
    y: number,
    count: number,
    colors: string[],
    opts: { speed?: number; gravity?: number; life?: number; spread?: number; up?: boolean } = {},
  ): void {
    const speed = opts.speed ?? 50;
    const gravity = opts.gravity ?? 180;
    const life = opts.life ?? 0.5;
    const spread = opts.spread ?? Math.PI * 2;
    const base = opts.up ? -Math.PI / 2 : 0;
    for (let i = 0; i < count; i++) {
      const angle = base + (Math.random() - 0.5) * spread;
      const v = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: life * (0.6 + Math.random() * 0.7),
        maxLife: life,
        color: colors[(Math.random() * colors.length) | 0],
        gravity,
        size: Math.random() < 0.25 ? 2 : 1,
      });
    }
  }

  dust(x: number, y: number): void {
    this.burst(x, y, 8, [C.inkDim, C.floorLit, C.ink], {
      speed: 34,
      gravity: 40,
      life: 0.38,
      spread: Math.PI * 0.8,
      up: true,
    });
  }

  confetti(x: number, y: number, colors: string[]): void {
    this.burst(x, y, 26, colors, { speed: 78, gravity: 130, life: 1.1, spread: Math.PI * 1.6, up: true });
  }

  floatText(x: number, y: number, text: string, color: string = C.ink): void {
    this.texts.push({ x, y, vy: -22, life: 0.9, maxLife: 0.9, text, color });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      // Clignotement en fin de vie : plus lisible que l'alpha en pixel art.
      const t = p.life / p.maxLife;
      if (t < 0.35 && Math.floor(p.life * 30) % 2 === 0) continue;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    for (const t of this.texts) {
      const fade = t.life / t.maxLife;
      if (fade < 0.4 && Math.floor(t.life * 24) % 2 === 0) continue;
      drawText(ctx, t.text, t.x, t.y, t.color, { align: 'center', outline: C.inkDark });
    }
  }

  /** Voile plein ecran, dessine par-dessus tout le reste. */
  drawFlash(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.flash <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.flash * 0.55;
    ctx.fillStyle = this.flashColor;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
