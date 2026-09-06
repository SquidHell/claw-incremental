/**
 * Les huit peluches du proto.
 *
 * ART ORIGINAL. Ce sont des mascottes inventees qui evoquent des ARCHETYPES du
 * genre (le plombier moustachu, la creature rapide, la princesse, le fantome,
 * le chevalier, le blob, le dragonnet, la relique doree) — pas des
 * reproductions de personnages sous licence. Aucun logo, aucune marque, aucune
 * combinaison forme/couleur distinctive d'une oeuvre existante, et des noms
 * inventes.
 *
 * Le parti pris graphique est la GUEULE : yeux desassortis, pupilles qui
 * partent chacune de leur cote, dents du bonheur, langues qui pendent. Une
 * peluche de machine a pince doit se lire et faire rire en 20x20, pas etre
 * jolie.
 *
 * Pour mettre ton propre art : remplace la pixel-map ici, ou passe par
 * `loadSheet()` dans sprites.ts et pointe `PrizeDef.sprite` vers la frame.
 *
 * Grille : 20x20 pour toutes. '.' = transparent.
 */
import type { PixelArt } from '../sprites.ts';

/** Pim — le plombier moustachu, yeux qui divergent et langue sortie. */
export const pim: PixelArt = {
  palette: {
    K: '#241a2e',
    R: '#d83a2a',
    r: '#9c2418',
    S: '#f2c08a',
    W: '#ffffff',
    E: '#241a2e',
    M: '#6b3a1f',
    T: '#e2607a',
    B: '#2a5bd7',
    G: '#f4f4f4',
    Y: '#f7d354',
    N: '#7a4a22',
  },
  rows: [
    '......KKKKKKKK......',
    '....KKRRRRRRRRKK....',
    '...KRRRRRRRRRRRRK...',
    '..KRRRRRRRRRRRRRRK..',
    '..KRRRRWWRRRRRRRRK..',
    '..KrrrrrrrrrrrrrrK..',
    '..KSSWWWSSSSWWWSSK..',
    '..KSSEWWSSSSWWESSK..',
    '..KSSWWWSSSSWWWSSK..',
    '..KSMMMMMMMMMMMMSK..',
    '..KSMMMTTTTTTMMMSK..',
    '...KSSSSTTTTSSSSK...',
    '....KKSSSSSSSSKK....',
    '...KGGKBBBBBBKGGK...',
    '..KGGGKBYBBYBKGGGK..',
    '..KGGGKBBBBBBKGGGK..',
    '...KKKKBBBBBBKKKK...',
    '......KBBBBBBK......',
    '.....KNNNKKNNNK.....',
    '.....KNNNKKNNNK.....',
  ],
};

/** Zeb — la creature veloce. Yeux qui louchent chacun de leur cote, dents du bonheur. */
export const zeb: PixelArt = {
  palette: {
    K: '#17233d',
    B: '#3aa7e8',
    W: '#ffffff',
    E: '#17233d',
    P: '#ffe3b0',
    T: '#ffffff',
    M: '#7a2038',
    O: '#f28a2e',
  },
  rows: [
    '.....K....K...K.....',
    '....KBK..KBK.KBK....',
    '...KBBBKKBBBKKBBBK..',
    '..KBBBBBBBBBBBBBBK..',
    '.KBBBBBBBBBBBBBBBBK.',
    '.KBWWWWBBBBBBWWEWBK.',
    '.KBWEWWBBBBBBWWWWBK.',
    '.KBWWWWBBBBBBWWWWBK.',
    '.KBBBBBBPPPPBBBBBBK.',
    '.KBBBBKPPPPPPKBBBBK.',
    '.KBBBKPTTKKTTPKBBBK.',
    '.KBBBKPMMMMMMPKBBBK.',
    '.KBBBKKPPPPPPKKBBBK.',
    '..KOOOOOOOOOOOOOOK..',
    '..KBBKOOOOOOOOKBBK..',
    '.KBBBKPPPPPPPPKBBBK.',
    '.KBBBKPPPPPPPPKBBBK.',
    '..KBBKPPPPPPPPKBBK..',
    '...KKKBBBBBBBBKKK...',
    '.....KWWK..KWWK.....',
  ],
};

/** Elira — la princesse couronnee, regard qui converge et sourire trop large. */
export const elira: PixelArt = {
  palette: {
    K: '#3a1f3d',
    P: '#f28ab8',
    p: '#c95a90',
    H: '#f6d97a',
    S: '#f7cfa6',
    Y: '#ffd94a',
  },
  rows: [
    '.....K.K.K.K.K......',
    '....KYKYKYKYKYK.....',
    '....KYYYYYYYYYK.....',
    '...KHHHHHHHHHHHK....',
    '..KHHHHHHHHHHHHHK...',
    '..KHHHSSSSSSSSHHHK..',
    '..KHHHKKSSSKKSHHHK..',
    '..KHHHKKSSSKKSHHHK..',
    '..KHHHSSppppSSHHHK..',
    '...KHHHHSSSSHHHHK...',
    '...KKHHHHHHHHHHKK...',
    '....KKPPPPPPPPKK....',
    '...KSKPPPPPPPPKSK...',
    '..KSSKPPPPPPPPKSSK..',
    '..KKKPPPPPPPPPPKKK..',
    '...KPPPPPPPPPPPPK...',
    '..KPPPPPPPPPPPPPPK..',
    '.KPPPPPPPPPPPPPPPPK.',
    '.KppppppppppppppppK.',
    '.KKKKKKKKKKKKKKKKKK.',
  ],
};

/** Blip — le fantome ahuri : grands yeux depareilles, bouche ouverte, langue pendante. */
export const blip: PixelArt = {
  palette: {
    K: '#2a2440',
    W: '#f6f6ff',
    w: '#ccccec',
    P: '#ff9ec4',
    M: '#3a2038',
    T: '#e2607a',
  },
  rows: [
    '.......KKKKKK.......',
    '.....KKWWWWWWKK.....',
    '....KWWWWWWWWWWK....',
    '...KWWWWWWWWWWWWK...',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWKKKWWWWWWKKKWWK.',
    '..KWKKKWWWWWWKKKWWK.',
    '..KWWWWWWWWWWWWWWK..',
    '..KPPWKKKKKKKKWPPWK.',
    '..KWWWKMMMMMMMMKWWK.',
    '..KWWWKMMTTTTMMKWWK.',
    '..KWWWWKKTTTTKKWWWK.',
    '..KWWWWWWKKKKWWWWWK.',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwKKwwwwKKwwWK..',
    '..KKK..KKKKKK..KKK..',
  ],
};

/** Sir Cube — le chevalier cubique. Une fente d'oeil large, l'autre minuscule. */
export const sirCube: PixelArt = {
  palette: {
    K: '#1c2a1c',
    G: '#5ec25e',
    g: '#2f8a3f',
    M: '#b8c4d0',
    Y: '#ffd24a',
  },
  rows: [
    '.........KK.........',
    '........KYYK........',
    '........KYYK........',
    '.....KKKKMMKKKK.....',
    '....KMMMMMMMMMMK....',
    '...KMMMMMMMMMMMMK...',
    '..KMMMMMMMMMMMMMMK..',
    '..KMKKKKKKKKKKKKMK..',
    '..KMKYYYKKKKKYKKMK..',
    '..KMKKKKKKKKKKKKMK..',
    '..KMMMMMMMMMMMMMMK..',
    '...KMMMMMMMMMMMMK...',
    '..KKKKGGGGGGGGKKKK..',
    '.KMMKGGGGGGGGGGKMMK.',
    '.KMMKGGYYYYYYGGKMMK.',
    '.KMMKGGYggggYGGKMMK.',
    '.KKKKGGYYYYYYGGKKKK.',
    '....KGGGGGGGGGGGK...',
    '....KggggKKggggK....',
    '....KKKKKKKKKKKK....',
  ],
};

/** Gloop — le blob gluant, un gros oeil et un petit, bouche beante. */
export const gloop: PixelArt = {
  palette: {
    K: '#14321e',
    G: '#7de08a',
    g: '#3fae5c',
    W: '#ffffff',
    M: '#123a1e',
  },
  rows: [
    '........KKKK........',
    '......KKGGGGKK......',
    '.....KGGGGGGGGK.....',
    '....KGGGGGGGGGGK....',
    '...KGGGWWGGGGGGGK...',
    '..KGGGWWWGGGGGGGGK..',
    '..KGGGGWGGGGGGGGGK..',
    '.KGGGGGGGGGGGGGGGGK.',
    '.KGGKKKKGGGGGGKKGGK.',
    '.KGGKKKKGGGGGGKKGGK.',
    '.KGGGGGGGGGGGGGGGGK.',
    '.KGGGGKKMMMMKKGGGGK.',
    '.KGGGGGKMMMMKGGGGGK.',
    '.KGGGGGGKKKKGGGGGGK.',
    '.KggggggggggggggggK.',
    '.KggggggggggggggggK.',
    '.KggggggggggggggggK.',
    '.KKggggggggggggggKK.',
    '..KKggggggggggggKK..',
    '...KKKKKKKKKKKKKK...',
  ],
};

/** Draka — le dragonnet aile (rare), langue dehors et regard divergent. */
export const draka: PixelArt = {
  palette: {
    K: '#241338',
    V: '#a05ce0',
    v: '#6a33a0',
    Y: '#ffd88a',
    O: '#ff9a3c',
    W: '#ffffff',
    E: '#241338',
    M: '#3d1030',
    T: '#e2607a',
  },
  rows: [
    '....K..........K....',
    '...KOK........KOK...',
    '...KOKKVVVVVVKKOK...',
    '..KVVVVVVVVVVVVVVK..',
    '.KVVVVVVVVVVVVVVVVK.',
    '.KVVWWWKVVVVKWWWVVK.',
    '.KVVEWWKVVVVKWWEVVK.',
    '.KVVWWWKVVVVKWWWVVK.',
    '.KVVVKKMMMMMMKKVVVK.',
    '..KVVVKMTTTTMKVVVK..',
    'KKKVVVKYYYYYYKVVVKKK',
    'KvvKVVKYYYYYYKVVKvvK',
    'KvvKVVKYYYYYYKVVKvvK',
    'KvvKVVKYYYYYYKVVKvvK',
    'KKvKVVKYYYYYYKVVKvKK',
    '.KKKVVKYYYYYYKVVKKK.',
    '...KVVVKYYYYKVVVK...',
    '...KVVVVKKKKVVVVK...',
    '...KOOOKK..KKOOOK...',
    '...KKKKK....KKKKK...',
  ],
};

/** Aurex — la relique doree (legendaire). Paupieres lourdes et rictus en coin. */
export const aurex: PixelArt = {
  palette: {
    K: '#4a3208',
    Y: '#ffd94a',
    y: '#d9a520',
  },
  rows: [
    '.........KK.........',
    '........KYYK........',
    '........KYYK........',
    '.......KYYYYK.......',
    'KKKKKKKYYYYYYKKKKKKK',
    'KYYYYYYYYYYYYYYYYYYK',
    'KYYKKKYYYYYYYYKKKYYK',
    '.KYKKKYYYYYYYYKKKYK.',
    '..KYYYYYYYYYYYYYYK..',
    '..KYYYKKKKYYYYYYYK..',
    '...KYYYYYYYYYYYYK...',
    '...KYYYYYYYYYYYYK...',
    '..KYYYYYYYYYYYYYYK..',
    '.KYYYYYYYYYYYYYYYYK.',
    'KYYYYKyyyyyyyyKYYYYK',
    'KYYYKKyyyyyyyyKKYYYK',
    'KYYKK.KyyyyyyK.KKYYK',
    'KYK....KyyyyK....KYK',
    'KK.....KKyyKK.....KK',
    '.......KKKKKK.......',
  ],
};

export const PLUSH_ART: Record<string, PixelArt> = {
  pim,
  zeb,
  elira,
  blip,
  sirCube,
  gloop,
  draka,
  aurex,
};
