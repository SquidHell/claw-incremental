/**
 * Modele de prise — le coeur de la sensation de jeu.
 *
 * Pas de "jet de des" a la fermeture : on calcule une FORCE DE PRISE, puis on
 * accumule un GLISSEMENT continu pendant la remontee et le retour. La peluche
 * tombe quand le glissement atteint 1.
 *
 * Pourquoi : un jet de des cache la raison de l'echec au joueur. Le glissement
 * continu est lisible — la jauge se vide, la pince tremble, le "!" apparait —
 * donc le joueur apprend a mieux se placer au lieu de subir.
 */
import { clamp } from '../core/math.ts';
import type { Rng } from '../core/rng.ts';
import { TUNING } from './tuning.ts';
import { bodyRect, centerX, type Body } from './physics.ts';
import { rectsOverlap, type Rect } from '../core/math.ts';

export interface GrabCandidate {
  body: Body;
  /** 0 = parfaitement centre, 1 = accroche par le bord. */
  offset: number;
  /** Force de prise resultante. > mass = prise sure. */
  grip: number;
}

/**
 * Cherche la meilleure peluche dans la zone entre les pinces.
 * Priorite : la plus haute (celle du dessus de la pile), puis la plus centree.
 */
export function findGrab(
  bodies: Body[],
  zone: Rect,
  clawCenterX: number,
  clawPower: number,
): GrabCandidate | null {
  let best: GrabCandidate | null = null;

  for (const body of bodies) {
    if (body.held) continue;
    if (!rectsOverlap(zone, bodyRect(body))) continue;

    const offset = clamp(Math.abs(centerX(body) - clawCenterX) / (body.w / 2), 0, 1);
    const grip = clawPower * body.grip * (1 - TUNING.offsetPenalty * offset);
    const candidate: GrabCandidate = { body, offset, grip };

    if (!best) {
      best = candidate;
      continue;
    }
    // "Plus haute" l'emporte, sauf quasi-egalite ou on prend la plus centree.
    const dy = best.body.y - body.y;
    if (dy > 3) best = candidate;
    else if (dy > -3 && offset < best.offset) best = candidate;
  }

  return best;
}

/**
 * Deficit de prise : > 0 quand la pince n'est pas assez forte pour la masse.
 * C'est ce nombre qui pilote la vitesse de glissement.
 */
export const gripDeficit = (grip: number, mass: number): number => Math.max(0, mass - grip);

/** La prise est-elle franchement sure ? (pas de tremblement au rendu) */
export const isSecure = (grip: number, mass: number): boolean =>
  grip >= mass + TUNING.safeGripMargin;

/**
 * Increment de glissement pour un pas de temps.
 * `agitation` monte pendant les phases brusques (demarrage du retour, arret).
 */
export function slipDelta(
  grip: number,
  mass: number,
  dt: number,
  agitation: number,
  rng: Rng,
): number {
  const deficit = gripDeficit(grip, mass);
  if (deficit <= 0) return 0;
  const noise = 1 + (rng.next() - 0.5) * 2 * TUNING.slipNoise;
  return deficit * TUNING.slipRate * agitation * noise * dt;
}

/**
 * Estimation affichable des chances de tenir jusqu'au bout, pour le HUD de debug.
 * 1 = prise sure, 0 = la peluche est deja en train de partir.
 */
export function holdOutlook(grip: number, mass: number): number {
  const deficit = gripDeficit(grip, mass);
  if (deficit <= 0) return 1;
  return clamp(1 - deficit / Math.max(mass, 0.001), 0, 1);
}
