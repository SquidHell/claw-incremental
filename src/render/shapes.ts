/** Primitives de dessin pixel : tout est arrondi a l'entier, sans anticrenelage. */
import type { Rect } from '../core/math.ts';

export function fill(ctx: CanvasRenderingContext2D, r: Rect, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h));
}

export function box(ctx: CanvasRenderingContext2D, r: Rect, color: string, t = 1): void {
  const x = Math.round(r.x);
  const y = Math.round(r.y);
  const w = Math.round(r.w);
  const h = Math.round(r.h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, t);
  ctx.fillRect(x, y + h - t, w, t);
  ctx.fillRect(x, y, t, h);
  ctx.fillRect(x + w - t, y, t, h);
}

export function hline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), 1);
}

export function vline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 1, Math.round(h));
}

/** Rectangle aux quatre coins ronges d'un pixel : lit comme un coin arrondi. */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  color: string,
  radius = 2,
): void {
  const x = Math.round(r.x);
  const y = Math.round(r.y);
  const w = Math.round(r.w);
  const h = Math.round(r.h);
  ctx.fillStyle = color;
  ctx.fillRect(x + radius, y, w - radius * 2, h);
  ctx.fillRect(x, y + radius, radius, h - radius * 2);
  ctx.fillRect(x + w - radius, y + radius, radius, h - radius * 2);
  if (radius >= 2) {
    ctx.fillRect(x + 1, y + 1, radius - 1, radius - 1);
    ctx.fillRect(x + w - radius, y + 1, radius - 1, radius - 1);
    ctx.fillRect(x + 1, y + h - radius, radius - 1, radius - 1);
    ctx.fillRect(x + w - radius, y + h - radius, radius - 1, radius - 1);
  }
}

/** Panneau biseaute : lumiere en haut/gauche, ombre en bas/droite. */
export function bevel(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  face: string,
  light: string,
  shadow: string,
  radius = 2,
): void {
  roundRect(ctx, r, face, radius);
  const x = Math.round(r.x);
  const y = Math.round(r.y);
  const w = Math.round(r.w);
  const h = Math.round(r.h);
  hline(ctx, x + radius, y, w - radius * 2, light);
  vline(ctx, x, y + radius, h - radius * 2, light);
  hline(ctx, x + radius, y + h - 1, w - radius * 2, shadow);
  vline(ctx, x + w - 1, y + radius, h - radius * 2, shadow);
}

/** Trame 50% : sert aux ombres et aux etats grises sans alpha. */
export function dither(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  color: string,
  phase = 0,
): void {
  ctx.fillStyle = color;
  const x0 = Math.round(r.x);
  const y0 = Math.round(r.y);
  const x1 = x0 + Math.round(r.w);
  const y1 = y0 + Math.round(r.h);
  for (let y = y0; y < y1; y++) {
    for (let x = x0 + ((y + phase) % 2); x < x1; x += 2) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}
