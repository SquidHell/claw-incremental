/** Icones d'interface. Toutes monochromes : la couleur est appliquee au bake. */
import type { PixelArt } from '../sprites.ts';

const MONO = { '#': '#ffffff' };

/** Triangle plein 11x11 pointant a gauche. */
export const arrowLeft: PixelArt = {
  palette: MONO,
  rows: [
    '......####.',
    '.....#####.',
    '....######.',
    '...#######.',
    '..########.',
    '.#########.',
    '..########.',
    '...#######.',
    '....######.',
    '.....#####.',
    '......####.',
  ],
};

export const arrowRight: PixelArt = {
  palette: MONO,
  rows: arrowLeft.rows.map((row) => [...row].reverse().join('')),
};

/** Fleche vers le bas, avec hampe. */
export const arrowDown: PixelArt = {
  palette: MONO,
  rows: [
    '....###....',
    '....###....',
    '....###....',
    '....###....',
    '###########',
    '.#########.',
    '..#######..',
    '...#####...',
    '....###....',
    '.....#.....',
    '...........',
  ],
};

export const coin: PixelArt = {
  palette: { K: '#7a5a10', Y: '#ffd94a', W: '#fff6cf' },
  rows: ['..KKK..', '.KYYYK.', 'KYWYYYK', 'KYWYYYK', 'KYYYYYK', '.KYYYK.', '..KKK..'],
};

export const star: PixelArt = {
  palette: MONO,
  rows: ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '##...##'],
};

/** Petit cadenas : etat "bouton indisponible". */
export const lock: PixelArt = {
  palette: MONO,
  rows: ['.#####.', '#.....#', '#.....#', '#######', '#..#..#', '#..#..#', '#######'],
};

export const UI_ART: Record<string, PixelArt> = {
  arrowLeft,
  arrowRight,
  arrowDown,
  coin,
  star,
  lock,
};
