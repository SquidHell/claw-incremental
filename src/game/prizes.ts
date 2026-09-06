/**
 * Catalogue des peluches — donnees pures.
 *
 * Ajouter une peluche = ajouter une entree ici + une pixel-map dans
 * render/art/plushies.ts. Aucun autre fichier a toucher.
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface PrizeDef {
  id: string;
  name: string;
  /** Une ligne de saveur affichee sur la carte de recompense. */
  blurb: string;
  rarity: Rarity;
  /** Pieces gagnees quand elle tombe dans le trou. */
  value: number;
  /** 0.6 = plume, 1.6 = brique. Plus lourd = plus dur a garder. */
  mass: number;
  /** 0.5 = tissu glissant, 1.2 = la pince mord bien. */
  grip: number;
  /** Boite de collision ET taille du sprite, en pixels virtuels. */
  size: [number, number];
  /** Cle dans PLUSH_ART. */
  sprite: string;
  /** Ponderation au remplissage de la vitrine. */
  spawnWeight: number;
}

export const PRIZES: readonly PrizeDef[] = [
  {
    id: 'plombax',
    name: 'Plombax',
    blurb: 'Repare les tuyaux. Pas garanti.',
    rarity: 'common',
    value: 5,
    mass: 1.0,
    grip: 1.05,
    size: [20, 20],
    sprite: 'plombax',
    spawnWeight: 18,
  },
  {
    id: 'vroomz',
    name: 'Vroomz',
    blurb: 'Vitesse extreme ! Coutures fragiles.',
    rarity: 'common',
    value: 6,
    mass: 0.85,
    grip: 0.9,
    size: [20, 20],
    sprite: 'vroomz',
    spawnWeight: 16,
  },
  {
    id: 'ectoblob',
    name: 'Ectoblob',
    blurb: 'Fantome amusant pour enfant.',
    rarity: 'common',
    value: 4,
    mass: 0.62,
    grip: 0.85,
    size: [20, 20],
    sprite: 'ectoblob',
    spawnWeight: 16,
  },
  {
    id: 'slimu',
    name: 'Slimu',
    blurb: 'Gelee vivante non toxique.',
    rarity: 'uncommon',
    value: 12,
    mass: 1.1,
    grip: 0.95,
    size: [20, 20],
    sprite: 'slimu',
    spawnWeight: 13,
  },
  {
    id: 'rozalind',
    name: 'Rozalind',
    blurb: 'Vraie princesse authentique.',
    rarity: 'uncommon',
    value: 14,
    mass: 1.05,
    grip: 0.9,
    size: [20, 20],
    sprite: 'rozalind',
    spawnWeight: 13,
  },
  {
    id: 'chevalor',
    name: 'Chevalor',
    blurb: 'Chevalier de la justice metal.',
    rarity: 'uncommon',
    value: 16,
    mass: 1.3,
    grip: 1.1,
    size: [20, 20],
    sprite: 'chevalor',
    spawnWeight: 10,
  },
  {
    id: 'dragonz',
    name: 'Dragonz',
    blurb: 'Dragon de feu ! Aile vendue a part.',
    rarity: 'rare',
    value: 40,
    mass: 1.2,
    grip: 1.0,
    size: [20, 20],
    sprite: 'dragonz',
    spawnWeight: 4,
  },
  {
    id: 'superstarr',
    name: 'Superstarr',
    blurb: 'Etoile de super chance premium.',
    rarity: 'legendary',
    value: 120,
    mass: 1.22,
    grip: 1.0,
    size: [20, 20],
    sprite: 'superstarr',
    spawnWeight: 2,
  },
];

export const PRIZE_BY_ID = new Map(PRIZES.map((p) => [p.id, p]));

export function getPrize(id: string): PrizeDef {
  const prize = PRIZE_BY_ID.get(id);
  if (!prize) throw new Error(`Peluche inconnue: ${id}`);
  return prize;
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Commun',
  uncommon: 'Peu commun',
  rare: 'Rare',
  legendary: 'Legendaire',
};
