/**
 * Petit moteur AABB dedie a une pile de peluches.
 *
 * Choix assumes :
 *  - pas de rotation : les peluches restent droites, c'est plus lisible en
 *    pixel art et ca evite un solveur d'impulsions complet ;
 *  - resolution POSITIONNELLE iterative, triee du bas vers le haut : les piles
 *    se tassent proprement en 4 passes ;
 *  - SLEEPING : sans lui la pile vibre en permanence et le proto a l'air casse.
 *    Un corps immobile assez longtemps sort de la simulation jusqu'a ce qu'un
 *    voisin, la pince ou une suppression le reveille.
 */
import { clamp, overlapAmount, rectsOverlap, type Rect } from '../core/math.ts';
import { TUNING } from './tuning.ts';
import { CHUTE, CHUTE_LIP, FLOOR_Y, PLAY } from './cabinet.ts';

export interface Body {
  id: number;
  prizeId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  mass: number;
  grip: number;
  /** Tenue par la pince : la physique ne la touche plus. */
  held: boolean;
  asleep: boolean;
  sleepTimer: number;
  /** Position au pas precedent, pour l'interpolation au rendu. */
  prevX: number;
  prevY: number;
  /** Amortissement visuel apres un choc (0..1). */
  squash: number;
}

let nextId = 1;

export function createBody(
  prizeId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  mass: number,
  grip: number,
): Body {
  return {
    id: nextId++,
    prizeId,
    x,
    y,
    w,
    h,
    vx: 0,
    vy: 0,
    mass,
    grip,
    held: false,
    asleep: false,
    sleepTimer: 0,
    prevX: x,
    prevY: y,
    squash: 0,
  };
}

export const bodyRect = (b: Body): Rect => ({ x: b.x, y: b.y, w: b.w, h: b.h });
export const centerX = (b: Body): number => b.x + b.w / 2;
export const centerY = (b: Body): number => b.y + b.h / 2;

export function wake(b: Body): void {
  b.asleep = false;
  b.sleepTimer = 0;
}

export function wakeAll(bodies: Body[]): void {
  for (const b of bodies) wake(b);
}

/** Le corps est-il au-dessus du trou (donc en train de tomber dedans) ? */
export const overChute = (b: Body): boolean => {
  const cx = centerX(b);
  return cx > CHUTE.left && cx < CHUTE.right - 3;
};

export interface StepResult {
  /** Corps tombes dans le trou pendant ce pas (retires de la liste). */
  collected: Body[];
  /** Un corps a heurte le sol ou la pile assez fort pour meriter un bruit. */
  impact: { x: number; y: number; force: number } | null;
}

export function step(bodies: Body[], dt: number): StepResult {
  const result: StepResult = { collected: [], impact: null };

  // 1. Integration
  for (const b of bodies) {
    b.prevX = b.x;
    b.prevY = b.y;
    if (b.squash > 0) b.squash = Math.max(0, b.squash - dt * 4);
    if (b.held || b.asleep) continue;

    b.vy += TUNING.gravity * dt;
    b.vx *= 1 - TUNING.airDrag;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }

  // 2. Murs, sol, rebord du trou
  for (const b of bodies) {
    if (b.held) continue;
    resolveStatic(b, result);
  }

  // 3. Corps contre corps, du plus bas vers le plus haut
  const active = bodies.filter((b) => !b.held);
  active.sort((a, b) => b.y - a.y);
  for (let iter = 0; iter < TUNING.solverIterations; iter++) {
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        resolvePair(active[i], active[j]);
      }
    }
    for (const b of active) resolveStatic(b, result);
  }

  // 4. Recuperation dans le trou + sommeil
  for (let i = bodies.length - 1; i >= 0; i--) {
    const b = bodies[i];
    if (b.held) continue;

    if (b.y > CHUTE.bottom + 4) {
      bodies.splice(i, 1);
      result.collected.push(b);
      continue;
    }

    const speed = Math.abs(b.vx) + Math.abs(b.vy);
    const support = supportInfo(b, bodies);

    if (speed < TUNING.sleepSpeed && support.ratio >= TUNING.minSupport) {
      b.sleepTimer += dt;
      if (b.sleepTimer >= TUNING.sleepDelay) {
        b.asleep = true;
        b.vx = 0;
        b.vy = 0;
      }
    } else {
      b.sleepTimer = 0;
      if (speed > TUNING.sleepSpeed * 2) b.asleep = false;
    }

    // Bascule : sans rotation, une peluche posee sur 2 px de son voisin
    // resterait suspendue en l'air. On la pousse doucement dans le vide, elle
    // glisse et retombe — la pile se tasse au lieu de faire des tours.
    if (support.ratio > 0 && support.ratio < TUNING.minSupport) {
      const dir = Math.sign(centerX(b) - support.cx) || 1;
      b.vx += dir * TUNING.topplePush * dt;
      b.asleep = false;
      b.sleepTimer = 0;
    }
  }

  return result;
}

function resolveStatic(b: Body, result: StepResult): void {
  // Murs lateraux
  if (b.x < PLAY.left) {
    b.x = PLAY.left;
    if (b.vx < 0) b.vx = -b.vx * TUNING.restitution;
  }
  if (b.x + b.w > PLAY.right) {
    b.x = PLAY.right - b.w;
    if (b.vx > 0) b.vx = -b.vx * TUNING.restitution;
  }

  // Rebord du trou : empeche la pile d'y glisser toute seule.
  if (rectsOverlap(bodyRect(b), CHUTE_LIP)) {
    const ov = overlapAmount(bodyRect(b), CHUTE_LIP);
    if (ov.x > 0 && ov.y > 0) {
      if (ov.y < ov.x) {
        b.y -= ov.y;
        if (b.vy > 0) b.vy = 0;
      } else {
        b.x += ov.x; // toujours repousse vers la droite, cote pile
        if (b.vx < 0) b.vx = 0;
      }
    }
  }

  // Sol : absent au-dessus du trou.
  if (!overChute(b) && b.y + b.h > FLOOR_Y) {
    const impactSpeed = b.vy;
    b.y = FLOOR_Y - b.h;
    if (b.vy > 0) {
      if (impactSpeed > 60) {
        b.squash = 1;
        if (!result.impact || impactSpeed > result.impact.force) {
          result.impact = { x: centerX(b), y: FLOOR_Y, force: impactSpeed };
        }
      }
      b.vy = -b.vy * TUNING.restitution;
      if (Math.abs(b.vy) < 12) b.vy = 0;
    }
    b.vx *= TUNING.groundFriction;
  }

  b.x = clamp(b.x, PLAY.left, PLAY.right - b.w);
  if (b.y < PLAY.top) {
    b.y = PLAY.top;
    if (b.vy < 0) b.vy = 0;
  }
}

function resolvePair(a: Body, b: Body): void {
  if (a.asleep && b.asleep) return;
  const ra = bodyRect(a);
  const rb = bodyRect(b);
  if (!rectsOverlap(ra, rb)) return;

  const ov = overlapAmount(ra, rb);
  if (ov.x <= 0 || ov.y <= 0) return;

  // Une peluche endormie sert de sol : elle ne bouge pas, l'autre encaisse tout.
  const aFixed = a.asleep;
  const bFixed = b.asleep;
  const shareA = aFixed ? 0 : bFixed ? 1 : 0.5;
  const shareB = 1 - shareA;
  if (aFixed && bFixed) return;

  if (ov.y < ov.x) {
    const aOnTop = a.y < b.y;
    const push = ov.y;
    if (aOnTop) {
      a.y -= push * shareA;
      b.y += push * shareB;
      if (a.vy > 0) a.vy = 0;
      if (b.vy < 0) b.vy = 0;
    } else {
      a.y += push * shareA;
      b.y -= push * shareB;
      if (a.vy < 0) a.vy = 0;
      if (b.vy > 0) b.vy = 0;
    }
    // Friction laterale : les peluches empilees ne patinent pas.
    a.vx *= 0.9;
    b.vx *= 0.9;
  } else {
    const aLeft = a.x < b.x;
    const push = ov.x;
    if (aLeft) {
      a.x -= push * shareA;
      b.x += push * shareB;
    } else {
      a.x += push * shareA;
      b.x -= push * shareB;
    }
    a.vx *= 0.6;
    b.vx *= 0.6;
  }

  if (!aFixed) wake(a);
  if (!bFixed) wake(b);
}

interface Support {
  /** Fraction de la largeur du corps qui repose sur quelque chose (0..1). */
  ratio: number;
  /** Abscisse du milieu de la zone d'appui. */
  cx: number;
}

/** Sur quoi et sur quelle largeur ce corps repose-t-il ? */
function supportInfo(b: Body, bodies: Body[]): Support {
  if (!overChute(b) && b.y + b.h >= FLOOR_Y - 0.6) {
    return { ratio: 1, cx: centerX(b) };
  }

  // Intervalles d'appui, fusionnes pour ne pas compter deux fois un recouvrement.
  const spans: Array<[number, number]> = [];
  const probeTop = b.y + b.h - 0.5;
  const probeBottom = b.y + b.h + 2;
  for (const other of bodies) {
    if (other === b || other.held) continue;
    if (other.y > probeBottom || other.y + other.h < probeTop) continue;
    const lo = Math.max(b.x, other.x);
    const hi = Math.min(b.x + b.w, other.x + other.w);
    if (hi > lo) spans.push([lo, hi]);
  }
  if (spans.length === 0) return { ratio: 0, cx: centerX(b) };

  spans.sort((p, q) => p[0] - q[0]);
  let total = 0;
  let weighted = 0;
  let [curLo, curHi] = spans[0];
  const flush = () => {
    const width = curHi - curLo;
    total += width;
    weighted += ((curLo + curHi) / 2) * width;
  };
  for (let i = 1; i < spans.length; i++) {
    const [lo, hi] = spans[i];
    if (lo <= curHi) {
      curHi = Math.max(curHi, hi);
    } else {
      flush();
      curLo = lo;
      curHi = hi;
    }
  }
  flush();

  return { ratio: total / b.w, cx: total > 0 ? weighted / total : centerX(b) };
}

/**
 * La pince est un corps CINEMATIQUE : elle pousse les peluches, rien ne la
 * pousse. Appele pendant la descente et la remontee.
 */
export function pushBodies(bodies: Body[], claw: Rect): void {
  for (const b of bodies) {
    if (b.held) continue;
    const rb = bodyRect(b);
    if (!rectsOverlap(claw, rb)) continue;
    const ov = overlapAmount(claw, rb);
    if (ov.x <= 0 || ov.y <= 0) continue;

    wake(b);
    if (ov.x < ov.y) {
      const dir = centerX(b) < claw.x + claw.w / 2 ? -1 : 1;
      b.x += ov.x * dir;
      b.vx += dir * 18;
    } else {
      // La pince arrive par le haut : on enfonce la peluche vers le bas.
      b.y += ov.y;
      b.vy = Math.max(b.vy, 24);
    }
  }
}
