/**
 * Les huit peluches du proto.
 *
 * ART ORIGINAL. Ce sont des mascottes inventees qui evoquent des ARCHETYPES du
 * genre (le plombier moustachu, la creature rapide, la princesse, le fantome,
 * le chevalier, le blob, le dragonnet, la relique doree) — pas des reproductions
 * de personnages sous licence. Aucun logo, aucune marque, aucune combinaison
 * forme/couleur distinctive d'une oeuvre existante, et des noms inventes.
 *
 * Pour mettre ton propre art : remplace la pixel-map ici, ou passe par
 * `loadSheet()` dans sprites.ts et pointe `PrizeDef.sprite` vers la frame.
 *
 * Grille : 20x20 pour toutes. '.' = transparent.
 */
import type { PixelArt } from '../sprites.ts';

/** Pim — le petit plombier moustachu. */
export const pim: PixelArt = {
  palette: {
    K: '#241a2e',
    R: '#d83a2a',
    r: '#9c2418',
    S: '#f2c08a',
    M: '#6b3a1f',
    B: '#2a5bd7',
    W: '#f4f4f4',
    Y: '#f7d354',
    N: '#7a4a22',
  },
  rows: [
    '......KKKKKKKK......',
    '....KKRRRRRRRRKK....',
    '...KRRRRRRRRRRRRK...',
    '..KRRRRRRRRRRRRRRK..',
    '..KRRRRRRRRRRRRRRK..',
    '..KrrrrrrrrrrrrrrK..',
    '..KSSSKKSSSSKKSSSK..',
    '..KSSSKKSSSSKKSSSK..',
    '..KSSSSSSSSSSSSSSK..',
    '..KSSMMMMMMMMMMSSK..',
    '..KSSMMSSSSSSMMSSK..',
    '...KSSSSSSSSSSSSK...',
    '....KKSSSSSSSSKK....',
    '...KWWKBBBBBBKWWK...',
    '..KWWWKBYBBYBKWWWK..',
    '..KWWWKBBBBBBKWWWK..',
    '...KKKKBBBBBBKKKK...',
    '......KBBBBBBK......',
    '.....KNNNKKNNNK.....',
    '.....KNNNKKNNNK.....',
  ],
};

/** Zeb — la creature bleue veloce, echarpe au vent. */
export const zeb: PixelArt = {
  palette: {
    K: '#17233d',
    B: '#3aa7e8',
    W: '#ffffff',
    E: '#17233d',
    O: '#f28a2e',
    S: '#ffe3b0',
  },
  rows: [
    '.....K....K...K.....',
    '....KBK..KBK.KBK....',
    '...KBBBKKBBBKKBBBK..',
    '..KBBBBBBBBBBBBBBK..',
    '..KBBBBBBBBBBBBBBK..',
    '.KBBBBBBBBBBBBBBBBK.',
    '.KBBWWWKBBBBKWWWBBK.',
    '.KBBWEWKBBBBKWEWBBK.',
    '.KBBWWWKBBBBKWWWBBK.',
    '.KBBBBBBBKKBBBBBBBK.',
    '..KBBBBKSSSSKBBBBK..',
    '...KOOOOOOOOOOOOK...',
    '..KOOOOOOOOOOOOOOK..',
    '..KBBKSSSSSSSSKBBK..',
    '.KBBBKSSSSSSSSKBBBK.',
    '.KBBBKSSSSSSSSKBBBK.',
    '..KBBKSSSSSSSSKBBK..',
    '...KKKBBBBBBBBKKK...',
    '......KWWKKWWK......',
    '......KWWKKWWK......',
  ],
};

/** Elira — la princesse couronnee. */
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
    '..KHHHSKKSSKKSHHHK..',
    '..KHHHSSSSSSSSHHHK..',
    '..KHHHSSSppSSSHHHK..',
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

/** Blip — le petit fantome timide. */
export const blip: PixelArt = {
  palette: {
    K: '#2a2440',
    W: '#f6f6ff',
    w: '#ccccec',
    P: '#ff9ec4',
  },
  rows: [
    '.......KKKKKK.......',
    '.....KKWWWWWWKK.....',
    '....KWWWWWWWWWWK....',
    '...KWWWWWWWWWWWWK...',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWKKWWWWWWKKWWK..',
    '..KWWKKWWWWWWKKWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWPPWWWKKKKWWPPWK.',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWWWWWWWWWWWWWWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwwwwwwwwwwwWK..',
    '..KWwwKKwwwwKKwwWK..',
    '..KKK..KKKKKK..KKK..',
  ],
};

/** Sir Cube — le chevalier cubique. */
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
    '..KMKYYKKKKKKYYKMK..',
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

/** Gloop — le blob gluant. */
export const gloop: PixelArt = {
  palette: {
    K: '#14321e',
    G: '#7de08a',
    g: '#3fae5c',
    W: '#ffffff',
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
    '.KGGGKKGGGGGGKKGGGK.',
    '.KGGKKKKGGGGKKKKGGK.',
    '.KGGGKKGGGGGGKKGGGK.',
    '.KGGGGGGKKKKGGGGGGK.',
    '.KGGGGGGGGGGGGGGGGK.',
    '.KGGGGGGGGGGGGGGGGK.',
    '.KggggggggggggggggK.',
    '.KggggggggggggggggK.',
    '.KggggggggggggggggK.',
    '.KKggggggggggggggKK.',
    '..KKggggggggggggKK..',
    '...KKKKKKKKKKKKKK...',
  ],
};

/** Draka — le dragonnet aile (rare). */
export const draka: PixelArt = {
  palette: {
    K: '#241338',
    V: '#a05ce0',
    v: '#6a33a0',
    Y: '#ffd88a',
    O: '#ff9a3c',
    W: '#ffffff',
    E: '#241338',
  },
  rows: [
    '....K..........K....',
    '...KOK........KOK...',
    '...KOKKVVVVVVKKOK...',
    '..KVVVVVVVVVVVVVVK..',
    '.KVVVVVVVVVVVVVVVVK.',
    '.KVVWWKVVVVVVKWWVVK.',
    '.KVVWEKVVVVVVKEWVVK.',
    '.KVVVVVVVVVVVVVVVVK.',
    '.KVVVKKYYYYYYKKVVVK.',
    '..KVVVKYYYYYYKVVVK..',
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

/** Aurex — la relique doree (legendaire). */
export const aurex: PixelArt = {
  palette: {
    K: '#4a3208',
    Y: '#ffd94a',
    y: '#d9a520',
    W: '#fff6cf',
  },
  rows: [
    '.........KK.........',
    '........KYYK........',
    '........KYYK........',
    '.......KYYYYK.......',
    'KKKKKKKYYYYYYKKKKKKK',
    'KYYYYYYYYYYYYYYYYYYK',
    'KYYWWYYYYYYYYYYWWYYK',
    '.KYYKKYYYYYYYYKKYYK.',
    '..KYYYYYYKKYYYYYYK..',
    '..KYYYYYYYYYYYYYYK..',
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
