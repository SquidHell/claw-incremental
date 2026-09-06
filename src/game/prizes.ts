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
    id: 'pim',
    name: 'Pim',
    blurb: 'Repare tout sauf la borne.',
    rarity: 'common',
    value: 5,
    mass: 1.0,
    grip: 1.05,
    size: [20, 20],
    sprite: 'pim',
    spawnWeight: 18,
  },
  {
    id: 'zeb',
    name: 'Zeb',
    blurb: 'Trop rapide pour la pince.',
    rarity: 'common',
    value: 6,
    mass: 0.85,
    grip: 0.9,
    size: [20, 20],
    sprite: 'zeb',
    spawnWeight: 16,
  },
  {
    id: 'blip',
    name: 'Blip',
    blurb: 'Leger comme l air.',
    rarity: 'common',
    value: 4,
    mass: 0.62,
    grip: 0.85,
    size: [20, 20],
    sprite: 'blip',
    spawnWeight: 16,
  },
  {
    id: 'gloop',
    name: 'Gloop',
    blurb: 'Glisse entre les pinces.',
    rarity: 'uncommon',
    value: 12,
    mass: 1.1,
    grip: 0.95,
    size: [20, 20],
    sprite: 'gloop',
    spawnWeight: 13,
  },
  {
    id: 'elira',
    name: 'Elira',
    blurb: 'Exige un transport digne.',
    rarity: 'uncommon',
    value: 14,
    mass: 1.05,
    grip: 0.9,
    size: [20, 20],
    sprite: 'elira',
    spawnWeight: 13,
  },
  {
    id: 'sirCube',
    name: 'Sir Cube',
    blurb: 'Armure integrale, poids idem.',
    rarity: 'uncommon',
    value: 16,
    mass: 1.3,
    grip: 1.1,
    size: [20, 20],
    sprite: 'sirCube',
    spawnWeight: 10,
  },
  {
    id: 'draka',
    name: 'Draka',
    blurb: 'Ailes deployees, prise dure.',
    rarity: 'rare',
    value: 40,
    mass: 1.2,
    grip: 1.0,
    size: [20, 20],
    sprite: 'draka',
    spawnWeight: 4,
  },
  {
    id: 'aurex',
    name: 'Aurex',
    blurb: 'Une seule par borne. On dit.',
    rarity: 'legendary',
    value: 120,
    mass: 1.22,
    grip: 1.0,
    size: [20, 20],
    sprite: 'aurex',
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
