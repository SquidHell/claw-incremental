/**
 * Geometrie de la borne, en pixels virtuels (ecran 180x320).
 * Un seul endroit ou vivent ces nombres : le rendu, la physique et l'input
 * lisent tous ici, donc deplacer un mur ne casse jamais la collision.
 */
import { VIRTUAL_W, VIRTUAL_H } from '../render/canvas.ts';
import type { Rect } from '../core/math.ts';

export const SCREEN = { w: VIRTUAL_W, h: VIRTUAL_H };

/** Enseigne lumineuse. */
export const MARQUEE: Rect = { x: 8, y: 2, w: 164, h: 19 };

/** Bandeau credits / pieces / collection. */
export const HUD: Rect = { x: 4, y: 23, w: 172, h: 10 };

/** Coque exterieure de la borne. */
export const SHELL: Rect = { x: 5, y: 35, w: 170, h: 200 };

/** Vitre (interieur visible). */
export const GLASS: Rect = { x: 11, y: 41, w: 158, h: 188 };

/** Zone de jeu : ou les peluches et la pince peuvent aller. */
export const PLAY = { left: 14, right: 166, top: 44, bottom: 226 };

/** Hauteur du sol sur lequel la pile repose. */
export const FLOOR_Y = 212;

/** Trou de recuperation, a gauche. Pas de sol au-dessus. */
export const CHUTE = { left: 14, right: 46, bottom: 226 };

/**
 * Rebord qui empeche la pile de glisser toute seule dans le trou.
 * La pince passe au-dessus, donc elle peut y deposer une peluche.
 */
export const CHUTE_LIP: Rect = {
  x: CHUTE.right - 3,
  y: FLOOR_Y - 9,
  w: 3,
  h: 9,
};

/** Rail horizontal en haut de la vitre : le chariot y circule. */
export const RAIL_Y = 47;
export const CARRIAGE = { w: 24, h: 7 };

/** Tete de pince et pinces. */
export const CLAW = {
  headW: 16,
  headH: 6,
  prongH: 11,
  /** Demi-ecartement des pinces, ferme -> ouvert. */
  apertureClosed: 3,
  apertureOpen: 9,
};

/** Position de repos du chariot : pile au-dessus du trou. */
export const HOME_X = Math.round((CHUTE.left + CHUTE.right) / 2);

/** Bornes du centre de la pince. */
export const CLAW_MIN_X = PLAY.left + CLAW.headW / 2 + 1;
export const CLAW_MAX_X = PLAY.right - CLAW.headW / 2 - 1;

/** Hauteur (haut de la tete de pince) au repos et au plus bas. */
export const CLAW_TOP_Y = RAIL_Y + CARRIAGE.h + 4;
export const CLAW_BOTTOM_Y = FLOOR_Y - CLAW.headH - CLAW.prongH + 2;

/** Panneau de commande. */
export const PANEL: Rect = { x: 5, y: 237, w: 170, h: 78 };

/**
 * Boutons, en coordonnees virtuelles.
 * 44 px virtuels = 44 px CSS au facteur 1 : on reste au-dessus de la cible
 * tactile minimale recommandee meme sur le plus petit ecran supporte.
 */
export const BTN_LEFT: Rect = { x: 12, y: 262, w: 44, h: 44 };
export const BTN_DROP: Rect = { x: 64, y: 256, w: 52, h: 52 };
export const BTN_RIGHT: Rect = { x: 124, y: 262, w: 44, h: 44 };

/** Bandeau d'aide entre la borne et les boutons. */
export const HINT_Y = 241;

export const SAFE_BOTTOM = VIRTUAL_H;
