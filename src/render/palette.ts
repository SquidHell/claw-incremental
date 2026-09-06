/** Palette globale. Une couleur ne doit jamais etre ecrite en dur ailleurs. */
export const C = {
  // fond / ambiance
  void: '#0b0713',
  night: '#120b1e',
  nightLit: '#1d1230',

  // structure de la borne
  shellHi: '#e8447a',
  shell: '#c22a5f',
  shellLo: '#7d1740',
  shellDark: '#4a0d28',
  trim: '#ffd94a',
  trimLo: '#d9a520',

  // vitre / interieur
  glass: '#2a1b46',
  glassLit: '#3b2760',
  glassEdge: '#6f4fb0',
  floorLit: '#5b3f92',
  floor: '#3f2a6b',
  floorDark: '#2b1c4c',

  // mecanique
  railDark: '#3a3350',
  rail: '#8a86a8',
  railHi: '#d5d2e6',
  cable: '#cfcbe4',
  metal: '#b8c4d0',
  metalLo: '#6c7a8a',
  metalDark: '#39424f',

  // panneau de commande
  panel: '#241634',
  panelHi: '#3a2450',
  panelLo: '#160d22',
  btnLeft: '#3ad1c4',
  btnLeftLo: '#1c8a83',
  btnRight: '#3ad1c4',
  btnRightLo: '#1c8a83',
  btnDrop: '#ff4d5e',
  btnDropLo: '#a3162a',
  btnDead: '#4a4360',
  btnDeadLo: '#2e2940',

  // UI / texte
  ink: '#ffffff',
  inkDim: '#a99cc4',
  inkDark: '#241a2e',
  good: '#7bf07b',
  bad: '#ff6b6b',
  warn: '#ffc447',

  // raretes
  common: '#b9c4d6',
  uncommon: '#5fd97a',
  rare: '#57a8ff',
  legendary: '#ffcc3d',
} as const;

export const RARITY_COLOR: Record<string, string> = {
  common: C.common,
  uncommon: C.uncommon,
  rare: C.rare,
  legendary: C.legendary,
};
