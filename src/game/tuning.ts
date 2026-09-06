/**
 * TOUS les reglages d'equilibrage du proto. Un seul fichier a ouvrir pour
 * regler la sensation de jeu — et c'est ici que les futures upgrades de la
 * couche incrementale viendront appliquer leurs modificateurs.
 */
export const TUNING = {
  /** Physique (pixels virtuels / seconde). */
  gravity: 560,
  airDrag: 0.02,
  groundFriction: 0.72,
  restitution: 0.08,
  /** Sous ce seuil de vitesse, un corps peut s'endormir. */
  sleepSpeed: 3,
  sleepDelay: 0.35,
  /** Fraction minimale de la largeur qui doit reposer sur un appui stable. */
  minSupport: 0.34,
  /** Acceleration de bascule quand l'appui est trop etroit. */
  topplePush: 150,
  solverIterations: 4,

  /** Chariot / pince. */
  moveSpeed: 52,
  moveAccel: 320,
  moveDecel: 480,
  descendSpeed: 46,
  ascendSpeed: 40,
  returnSpeed: 54,
  closeTime: 0.32,
  openTime: 0.22,
  /** Petite pause en bas, avant la fermeture : lisibilite. */
  settleTime: 0.12,
  /** Profondeur d'enfoncement dans la pile avant de fermer les pinces. */
  biteDepth: 7,

  /** Modele de prise. */
  clawPower: 1.0,
  /** Penalite de decentrage : 0 = centre, 1 = au bord de la peluche. */
  offsetPenalty: 0.7,
  /** Vitesse de glissement par unite de deficit de prise, par seconde. */
  slipRate: 0.62,
  /** A-coup au demarrage du retour : le "jerk" des vraies machines. */
  returnJerk: 0.17,
  /** Bruit de glissement : rend deux prises identiques legerement differentes. */
  slipNoise: 0.25,
  /** En dessous, la peluche est consideree fermement tenue (pas de tremblement). */
  safeGripMargin: 0.18,

  /** Pile. */
  pileCount: 14,
  refillBelow: 6,

  /** Economie (hooks incrementaux : rien n'est depensable pour l'instant). */
  playCost: 1,
  startingCredits: 20,
  freePlayRefill: 10,
} as const;

export type Tuning = typeof TUNING;
