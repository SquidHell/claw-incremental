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

/**
 * Trame 50% : sert aux ombres, aux voiles et aux etats grises sans alpha.
 *
 * Implementee avec un motif 2x2 mis en cache plutot qu'une double boucle de
 * fillRect : une grande surface tramee coutait des milliers d'appels par frame
 * (le fond et la vitre a eux seuls en demandaient ~23 000), ce qui plafonnait
 * le jeu bien en dessous de 60 fps.
 */
const ditherCache = new Map<string, CanvasPattern>();

function ditherPattern(
  ctx: CanvasRenderingContext2D,
  color: string,
  phase: number,
): CanvasPattern | null {
  const key = `${color}|${phase & 1}`;
  const cached = ditherCache.get(key);
  if (cached) return cached;

  const tile = document.createElement('canvas');
  tile.width = 2;
  tile.height = 2;
  const tileCtx = tile.getContext('2d');
  if (!tileCtx) return null;
  tileCtx.fillStyle = color;
  if ((phase & 1) === 0) {
    tileCtx.fillRect(0, 0, 1, 1);
    tileCtx.fillRect(1, 1, 1, 1);
  } else {
    tileCtx.fillRect(1, 0, 1, 1);
    tileCtx.fillRect(0, 1, 1, 1);
  }
  const pattern = ctx.createPattern(tile, 'repeat');
  if (pattern) ditherCache.set(key, pattern);
  return pattern;
}

export function dither(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  color: string,
  phase = 0,
): void {
  const pattern = ditherPattern(ctx, color, phase);
  if (!pattern) return;
  ctx.fillStyle = pattern;
  ctx.fillRect(Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h));
}
