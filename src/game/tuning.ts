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
  /**
   * Sous ce seuil de vitesse, un corps peut s'endormir. Il doit rester au-dessus
   * de ce que la gravite ajoute en une frame (560/60 = 9.3) : un corps pose
   * reprend cette vitesse a chaque pas avant que le contact ne la remette a
   * zero, et un seuil plus bas empecherait la pile de s'endormir.
   */
  sleepSpeed: 12,
  sleepDelay: 0.35,
  /** Deplacement net par pas en dessous duquel un corps est juge immobile. */
  sleepDrift: 0.12,
  /**
   * Profondeur de penetration au-dela de laquelle un contact est considere
   * comme un vrai choc (et reveille les corps). En dessous, c'est la derive
   * d'un pixel due a la gravite sur un corps deja pose : la reveiller
   * empecherait la pile de s'endormir un jour.
   */
  contactEpsilon: 0.5,
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
