/** Petites aides mathematiques partagees par la physique et le rendu. */

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Rapproche `v` de `target` d'au plus `step` (utile pour les rampes moteur). */
export function approach(v: number, target: number, step: number): number {
  if (v < target) return Math.min(v + step, target);
  if (v > target) return Math.max(v - step, target);
  return target;
}

export const sign = (v: number): number => (v > 0 ? 1 : v < 0 ? -1 : 0);

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const pointInRect = (px: number, py: number, r: Rect): boolean =>
  px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h;

/** Chevauchement sur chaque axe (negatif ou nul = pas de collision). */
export function overlapAmount(a: Rect, b: Rect): { x: number; y: number } {
  return {
    x: Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x),
    y: Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y),
  };
}
