/**
 * Les huit peluches du proto — direction artistique : LA CONTREFACON.
 *
 * Une vraie machine a pince de fete foraine est pleine de peluches ratees :
 * mal cousues, un oeil plus haut que l'autre, la couleur du mauvais bain de
 * teinture, un sourire qui part de travers. C'est ce registre-la qu'on vise.
 * Le gag est de LOUPER la ressemblance, pas de l'atteindre.
 *
 * Regles du style, appliquees a chaque peluche :
 *  - rien n'est symetrique : les deux yeux n'ont ni la meme taille ni la meme
 *    hauteur, les pieds n'ont pas la meme largeur ;
 *  - le contour n'est jamais noir pur mais une version sale de la couleur —
 *    l'usine a pris le fil le moins cher ;
 *  - la silhouette est bosselee : le rembourrage a mal vieilli ;
 *  - le regard est vide ou trop enthousiaste, jamais entre les deux.
 *
 * ART ORIGINAL. Ce sont des creations, pas des reproductions : aucun asset
 * repris, aucun personnage sous licence, aucun logo, aucune combinaison
 * forme/couleur distinctive d'une oeuvre existante. Les noms sont ceux d'une
 * etiquette de contrefacon, pas d'une marque.
 *
 * Grille : 20x20 pour toutes. '.' = transparent.
 */
import type { PixelArt } from '../sprites.ts';

/** Plombax — le plombier. Casquette de travers, un oeil deux fois trop grand. */
export const plombax: PixelArt = {
  palette: {
    K: '#3a2418',
    R: '#e04a2a',
    r: '#a82d18',
    S: '#f5c48e',
    W: '#ffffff',
    E: '#3a2418',
    M: '#7a4520',
    T: '#e8607a',
    B: '#3560d0',
    G: '#ece8dc',
    Y: '#f0c83c',
    N: '#6b4020',
  },
  rows: [
    '.....KKKKKKK........',
    '...KKRRRRRRRKK......',
    '..KRRRRRRRRRRK......',
    '..KRRRRRRRRRRRRK....',
    '..KRRWRRRRRRRRRK....',
    '..KrrrrrrrrrrrrK....',
    '..KSSWWWWSSSSSSK....',
    '.KSSSWWEWSSWWSSSK...',
    '.KSSSSWWWSSSWESSSK..',
    '.KSSSSSSSSSSSSSSSK..',
    '.KSMMMMMMMMMMMMSSK..',
    '.KSSMMMTTTTMMMMSSK..',
    '..KSSSSTTTTSSSSSK...',
    '...KKSSSSSSSSKKK....',
    '..KGGKBBBBBBKGGGK...',
    '.KGGGKBYBBYBKGGGGK..',
    '.KGGGKBBBBBBKKGGKK..',
    '..KKKKBBBBBBBKKK....',
    '.....KNNNKKNNNNK....',
    '.....KNNKKKNNNNK....',
  ],
};

/** Vroomz — la creature rapide. Piquants inegaux, yeux qui ne se croisent jamais. */
export const vroomz: PixelArt = {
  palette: {
    K: '#1c3350',
    B: '#3ea0dd',
    W: '#ffffff',
    E: '#1c3350',
    P: '#ffe0a8',
    T: '#ffffff',
    M: '#7a2038',
    O: '#f08a2a',
  },
  rows: [
    '....K.....KK...K....',
    '...KBK...KBBK.KBK...',
    '..KBBBK.KBBBBKKBBK..',
    '..KBBBBKKBBBBBBBBK..',
    '.KBBBBBBBBBBBBBBBK..',
    '.KBWWWWWBBBBBWWEBK..',
    '.KBWWEWWBBBBBWWWBK..',
    '.KBWWWWWBBBBBBBBBK..',
    '.KBBBBBBPPPPPBBBBK..',
    '.KBBBBKPPPPPPPKBBK..',
    '.KBBBKPTTKKTTTPKBK..',
    '.KBBBKPMMMMMMMPKBK..',
    '.KBBBKKPPPPPPPKKBK..',
    '..KOOOOOOOOOOOOOK...',
    '..KBBKOOOOOOOKBBK...',
    '.KBBBKPPPPPPPKBBBK..',
    '.KBBBKPPPPPPPKBBBK..',
    '..KBBKPPPPPPPKBBK...',
    '..KKKBBBBBBBBBKKK...',
    '....KWWWK..KWWK.....',
  ],
};

/** Rozalind — la princesse. Couronne posee de travers, un oeil a moitie ferme. */
export const rozalind: PixelArt = {
  palette: {
    K: '#4a2440',
    P: '#f07ab0',
    p: '#c04a80',
    H: '#f5d060',
    S: '#f8cfa0',
    Y: '#ffd020',
  },
  rows: [
    '....K.K.K.K.K.......',
    '...KYKYKYKYKYK......',
    '...KYYYYYYYYYK......',
    '..KHHHHHHHHHHHK.....',
    '..KHHHHHHHHHHHHK....',
    '..KHHHSSSSSSSSHHK...',
    '..KHHKKSSSSKSSHHK...',
    '..KHHKKSSSSKSSHHK...',
    '..KHHHSSpppSSSHHK...',
    '..KHHHHSSSSHHHHK....',
    '...KKHHHHHHHHKKK....',
    '....KKPPPPPPPKK.....',
    '...KSKPPPPPPPKSSK...',
    '..KSSKPPPPPPPKSSK...',
    '..KKKPPPPPPPPPKKK...',
    '...KPPPPPPPPPPPK....',
    '..KPPPPPPPPPPPPPK...',
    '.KPPPPPPPPPPPPPPPK..',
    '.KpppppppppppppppK..',
    '.KKKKKKKKKKKKKKKKK..',
  ],
};

/** Ectoblob — le fantome. Bosselé, un oeil enorme, langue qui pend d'un cote. */
export const ectoblob: PixelArt = {
  palette: {
    K: '#3a3050',
    W: '#f4f4ff',
    w: '#c4c4e4',
    P: '#ff9ec4',
    M: '#48283f',
    T: '#e8607a',
  },
  rows: [
    '......KKKKKK........',
    '....KKWWWWWWKK......',
    '...KWWWWWWWWWWK.....',
    '..KWWWWWWWWWWWWK....',
    '..KWWWWWWWWWWWWWK...',
    '.KWWWWWWWWWWWWWWK...',
    '.KWKKKKWWWWWKKWWK...',
    '.KWKKKKWWWWWKKWWK...',
    '.KWKKKKWWWWWWWWWK...',
    '.KWPPWWWWWWWWPPWK...',
    '.KWWWKKKKKKKWWWWK...',
    '.KWWKMMMMMMMKWWWK...',
    '.KWWKMMTTTMMKWWWK...',
    '.KWWWKKTTTKKWWWWK...',
    '.KWwwwwwTTwwwwwWK...',
    '.KWwwwwwwwwwwwwWK...',
    '.KWwwwwwwwwwwwwWK...',
    '.KWwwwwwwwwwwwwWK...',
    '.KWwKKwwwwKKwwwWK...',
    '.KKK..KKKKK..KKKK...',
  ],
};

/** Chevalor — le chevalier. Casque cabosse, fentes d'yeux depareillees. */
export const chevalor: PixelArt = {
  palette: {
    K: '#243024',
    G: '#5cc05c',
    g: '#2d8038',
    M: '#b0bcc8',
    m: '#7c8894',
    Y: '#f0c83c',
  },
  rows: [
    '........KK..........',
    '.......KYYK.........',
    '.......KYYK.........',
    '....KKKKMMKKKKK.....',
    '...KMMMMMMMMMMMK....',
    '..KMMMMMMMMMMMMMK...',
    '..KMMMMMMMMMMMMMK...',
    '..KMKKKKKKKKKKKMK...',
    '..KMKYYYYKKKYKKMK...',
    '..KMKKKKKKKKKKKMK...',
    '..KMMMMMMMMMMMMMK...',
    '..KmMMMMMMMMMMMK....',
    '.KKKKGGGGGGGGKKKK...',
    '.KMMKGGGGGGGGGKMMK..',
    '.KMMKGGYYYYYGGKMMK..',
    '.KMMKGGYggggYGKMMK..',
    '.KKKKGGYYYYYGGKKKK..',
    '...KGGGGGGGGGGGK....',
    '...KgggKKKggggK.....',
    '...KKKKKKKKKKKK.....',
  ],
};

/** Slimu — la gelee. Blob asymetrique, un gros oeil, un minuscule. */
export const slimu: PixelArt = {
  palette: {
    K: '#1c3a24',
    G: '#78d888',
    g: '#38a050',
    W: '#ffffff',
    M: '#14301c',
  },
  rows: [
    '.......KKKK.........',
    '.....KKGGGGKK.......',
    '....KGGGGGGGGK......',
    '...KGGGGGGGGGGK.....',
    '..KGGWWGGGGGGGGK....',
    '..KGGWWGGGGGGGGGK...',
    '.KGGGGGGGGGGGGGGK...',
    '.KGGKKKKGGGGGGGGK...',
    '.KGGKKKKGGGGKKGGK...',
    '.KGGKKKKGGGGKKGGK...',
    '.KGGGGGGGGGGGGGGK...',
    '.KGGGKKMMMMMKKGGK...',
    '.KGGGGKMMMMMKGGGK...',
    '.KGGGGGKKKKKGGGGK...',
    '.KgggggggggggggK....',
    '.KggggggggggggggK...',
    '.KggggggggggggggK...',
    '.KKgggggggggggKK....',
    '..KKgggggggggKK.....',
    '...KKKKKKKKKKK......',
  ],
};

/** Dragonz — le dragonnet. Une aile plus grande, regard vide, langue dehors. */
export const dragonz: PixelArt = {
  palette: {
    K: '#2c1c40',
    V: '#9c58d8',
    v: '#6428a0',
    Y: '#ffd898',
    O: '#f89838',
    W: '#ffffff',
    E: '#2c1c40',
    M: '#401030',
    T: '#e8607a',
  },
  rows: [
    '...K..........K.....',
    '..KOK........KOK....',
    '..KOKKVVVVVVKKOK....',
    '.KVVVVVVVVVVVVVVK...',
    '.KVVVVVVVVVVVVVVVK..',
    '.KVWWWKVVVVVKWWVVK..',
    '.KVWEWKVVVVVKWEVVK..',
    '.KVWWWKVVVVVKWWVVK..',
    '.KVVVKKMMMMMKKVVVK..',
    '.KVVVKMMTTTMMKVVK...',
    'KKKVVKMMTTTMMKVVKK..',
    'KvvKVVKYYYYYKVVKvK..',
    'KvvKVVKYYYYYKVVKvK..',
    'KvvKVVKYYYYYKVVKKK..',
    'KKvKVVKYYYYYKVVK....',
    '.KKKVVKYYYYYKVVK....',
    '...KVVKYYYYYKVVK....',
    '...KVVVKKKKKVVVK....',
    '...KOOOKK.KKOOK.....',
    '...KKKKK..KKKKK.....',
  ],
};

/** Superstarr — la relique. Etoile de guingois, paupieres lourdes, rictus. */
export const superstarr: PixelArt = {
  palette: {
    K: '#5a3c10',
    Y: '#ffd030',
    y: '#d09818',
  },
  rows: [
    '........KK..........',
    '.......KYYK.........',
    '.......KYYK.........',
    '......KYYYYK........',
    'KKKKKKYYYYYYKKKKKKK.',
    'KYYYYYYYYYYYYYYYYYK.',
    'KYYKKKYYYYYYYKKKYYK.',
    '.KYKKKYYYYYYYKKKYK..',
    '..KYYYYYYYYYYYYYK...',
    '..KYYKKKKYYYYYYYK...',
    '..KYYYYYYYYYYYYYK...',
    '..KYYYYYYYYYYYYYK...',
    '.KYYYYYYYYYYYYYYYK..',
    'KYYYYYYYYYYYYYYYYYK.',
    'KYYYKyyyyyyyyKYYYYK.',
    'KYYKKyyyyyyyyKKYYYK.',
    'KYKK.KyyyyyyK.KKYYK.',
    'KK....KyyyyK...KKYK.',
    '......KKyyKK....KKK.',
    '.......KKKK.........',
  ],
};

export const PLUSH_ART: Record<string, PixelArt> = {
  plombax,
  vroomz,
  rozalind,
  ectoblob,
  chevalor,
  slimu,
  dragonz,
  superstarr,
};
