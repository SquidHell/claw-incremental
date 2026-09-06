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

/** Kartono — le carton a tete dessinee au marqueur. Rabats inegaux, scotch de travers. */
export const kartono: PixelArt = {
  palette: {
    K: '#6b4a28',
    C: '#c89a5e',
    c: '#a87a42',
    E: '#3a2a18',
    T: '#e8d8b0',
  },
  rows: [
    '..KKKK......KKKK....',
    '..KCCK......KCCK....',
    '..KCCKKKKKKKKCCK....',
    '..KCCCCCCCCCCCCCK...',
    '.KCCCCCCCCCCCCCCK...',
    '.KCCCCCCCCCCCCCCCK..',
    '.KCEEECCCCCCCEECCK..',
    '.KCEEECCCCCCCEECCK..',
    '.KCCCCCCCCCCCCCCCK..',
    '.KCCCEEEEEEECCCCCK..',
    '.KCCCCEEEEECCCCCCK..',
    '.KCCCCCCCCCCCCCCCK..',
    'KKKCCCCCCCCCCCCCKKK.',
    'KccKCCCCCCCCCCCKccK.',
    'KccKCCTTTTTTTCCKccK.',
    'KKKKCCTTTTTTTCCKKKK.',
    '...KCCCCCCCCCCCCK...',
    '...KcccccccccccK....',
    '...KccKKKKKKcccK....',
    '...KKK......KKKK....',
  ],
};

/** Kapsul — la capsule a surprise. Plastique glissant, joint mal aligne. */
export const kapsul: PixelArt = {
  palette: {
    K: '#703040',
    R: '#e03a5a',
    r: '#a82038',
    C: '#dfe8f5',
    c: '#a8b8cc',
    W: '#ffffff',
    E: '#3a2030',
    M: '#5a2038',
  },
  rows: [
    '......KKKKKK........',
    '....KKRRRRRRKK......',
    '...KRRRRRRRRRRK.....',
    '..KRRRRRRRRRRRRK....',
    '..KRRWWRRRRRRRRK....',
    '.KRRRRRRRRRRRRRRK...',
    '.KRRRRRRRRRRRRRRRK..',
    '.KrrrrrrrrrrrrrrrK..',
    'KKKKKKKKKKKKKKKKKKK.',
    '.KCCCCCCCCCCCCCCCK..',
    '.KCEEECCCCCCCEECCK..',
    '.KCEEECCCCCCCEECCK..',
    '.KCCCCCCCCCCCCCCCK..',
    '.KCCCCKMMMMMKCCCCK..',
    '.KCCCCKMMMMMKCCCCK..',
    '.KCCCCCKKKKKCCCCCK..',
    '.KcccccccccccccccK..',
    '..KccccccccccccccK..',
    '...KKcccccccccKKK...',
    '.....KKKKKKKKKK.....',
  ],
};

/** Voltik — la bestiole electrique. Une oreille plus grande, zigzag cousu de travers. */
export const voltik: PixelArt = {
  palette: {
    K: '#6b3a10',
    O: '#f08a30',
    C: '#ffe8c0',
    W: '#ffffff',
    E: '#3a2008',
    B: '#40b0f0',
    P: '#f06a80',
  },
  rows: [
    '..KK.........KKK....',
    '.KOOK.......KOOOK...',
    '.KOOK.......KOOOK...',
    '.KOOKKKKKKKKKOOOK...',
    '.KOOOOOOOOOOOOOOK...',
    'KOOOOOOOOOOOOOOOOK..',
    'KOOWWWOOOOOOOWWOOK..',
    'KOOWEWOOOOOOOWEOOK..',
    'KOOWWWOOOOOOOWWOOK..',
    'KOPPOOOKCCCKOOPPOK..',
    'KOOOOOKCCCCCKOOOOK..',
    'KOOOOOKCCCCCKOOOOK..',
    '.KOOOOOKCCCKOOOOOK..',
    '.KOOOCCCCCCCCCOOOK..',
    '.KOOCCBBCCCBBCCOOK..',
    '.KOOCCCBBBBBCCCOOK..',
    '.KOOOCCCCCCCCCOOOK..',
    '..KOOOOOOOOOOOOOK...',
    '..KKOOOKKKKOOOOKK...',
    '...KKKK...KKKKK.....',
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

/** Minipince — la machine a pince en peluche. Le lot le plus rare est la borne elle-meme. */
export const minipince: PixelArt = {
  palette: {
    K: '#4a1028',
    S: '#d0356a',
    s: '#8a1a44',
    G: '#4a3070',
    Y: '#ffd040',
    M: '#b8c4d0',
    W: '#ffffff',
    E: '#1a0a14',
  },
  rows: [
    '..KKKKKKKKKKKKKK....',
    '..KYYYYYYYYYYYYK....',
    '..KSSSSSSSSSSSSK....',
    '.KSSSSSSSSSSSSSSK...',
    '.KSKKKKKKKKKKKKSK...',
    '.KSKGGGGGGGGGGKSK...',
    '.KSKGMMMMMMGGGKSK...',
    '.KSKGGMGGGGGGGKSSK..',
    '.KSKGGMMMGGGGGKSSK..',
    '.KSKGMGGGMGGGGKSSK..',
    '.KSKGGGGGGGGGGKSSK..',
    '.KSKGWWGGGGWGGKSSK..',
    '.KSKGWEGGGGWEGKSSK..',
    '.KSKGGGGGGGGGGKSSK..',
    '.KSKGGKKKKKGGGKSSK..',
    '.KSKKKKKKKKKKKKSSK..',
    '.KSSSSSSSSSSSSSSSK..',
    '.KSSYYYYSSYYYYSSSK..',
    '.KsssssssssssssssK..',
    '..KKKKKKKKKKKKKKK...',
  ],
};

export const PLUSH_ART: Record<string, PixelArt> = {
  plombax,
  vroomz,
  rozalind,
  kartono,
  kapsul,
  voltik,
  dragonz,
  minipince,
};
