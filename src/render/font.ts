/**
 * Police bitmap 5x7 maison. Pas de webfont a charger, pas de flash de texte,
 * et un rendu pixel-perfect garanti a toutes les echelles.
 *
 * Chaque glyphe = 7 lignes de 5 caracteres separees par '/'.
 */
const GLYPHS: Record<string, string> = {
  A: '.###./#...#/#...#/#####/#...#/#...#/#...#',
  B: '####./#...#/#...#/####./#...#/#...#/####.',
  C: '.###./#...#/#..../#..../#..../#...#/.###.',
  D: '####./#...#/#...#/#...#/#...#/#...#/####.',
  E: '#####/#..../#..../####./#..../#..../#####',
  F: '#####/#..../#..../####./#..../#..../#....',
  G: '.###./#...#/#..../#.###/#...#/#...#/.###.',
  H: '#...#/#...#/#...#/#####/#...#/#...#/#...#',
  I: '.###./..#../..#../..#../..#../..#../.###.',
  J: '..###/...#./...#./...#./...#./#..#./.##..',
  K: '#...#/#..#./#.#../##.../#.#../#..#./#...#',
  L: '#..../#..../#..../#..../#..../#..../#####',
  M: '#...#/##.##/#.#.#/#...#/#...#/#...#/#...#',
  N: '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
  O: '.###./#...#/#...#/#...#/#...#/#...#/.###.',
  P: '####./#...#/#...#/####./#..../#..../#....',
  Q: '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
  R: '####./#...#/#...#/####./#.#../#..#./#...#',
  S: '.####/#..../#..../.###./....#/....#/####.',
  T: '#####/..#../..#../..#../..#../..#../..#..',
  U: '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
  V: '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
  W: '#...#/#...#/#...#/#...#/#.#.#/##.##/#...#',
  X: '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
  Y: '#...#/#...#/.#.#./..#../..#../..#../..#..',
  Z: '#####/....#/...#./..#../.#.../#..../#####',
  '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
  '1': '..#../.##../..#../..#../..#../..#../.###.',
  '2': '.###./#...#/....#/..##./.#.../#..../#####',
  '3': '####./....#/....#/.###./....#/....#/####.',
  '4': '#...#/#...#/#...#/#####/....#/....#/....#',
  '5': '#####/#..../####./....#/....#/#...#/.###.',
  '6': '.###./#..../#..../####./#...#/#...#/.###.',
  '7': '#####/....#/...#./..#../.#.../.#.../.#...',
  '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
  '9': '.###./#...#/#...#/.####/....#/....#/.###.',
  ' ': '...../...../...../...../...../...../.....',
  '.': '...../...../...../...../...../.##../.##..',
  ',': '...../...../...../...../..##./..##./.#...',
  ':': '...../.##../.##../...../.##../.##../.....',
  '!': '..#../..#../..#../..#../..#../...../..#..',
  '?': '.###./#...#/....#/..##./..#../...../..#..',
  '-': '...../...../...../#####/...../...../.....',
  '+': '...../..#../..#../#####/..#../..#../.....',
  '/': '....#/...#./...#./..#../.#.../.#.../#....',
  "'": '..#../..#../...../...../...../...../.....',
  '(': '...#./..#../.#.../.#.../.#.../..#../...#.',
  ')': '.#.../..#../...#./...#./...#./..#../.#...',
  '<': '...#./..#../.#.../#..../.#.../..#../...#.',
  '>': '.#.../..#../...#./....#/...#./..#../.#...',
  '*': '...../#.#.#/.###./#####/.###./#.#.#/.....',
  '%': '##..#/##..#/...#./..#../.#.../#..##/#..##',
  '=': '...../...../#####/...../#####/...../.....',
  '#': '.#.#./#####/.#.#./.#.#./.#.#./#####/.#.#.',
};

export const GLYPH_W = 5;
export const GLYPH_H = 7;
const TRACKING = 1;

/** Grilles booleennes pre-decodees : le rendu ne re-parse jamais les chaines. */
const MASKS = new Map<string, boolean[][]>();
for (const [ch, spec] of Object.entries(GLYPHS)) {
  MASKS.set(
    ch,
    spec.split('/').map((row) => [...row].map((c) => c === '#')),
  );
}
const FALLBACK = MASKS.get('?')!;

export function textWidth(text: string): number {
  if (text.length === 0) return 0;
  return text.length * (GLYPH_W + TRACKING) - TRACKING;
}

export type TextAlign = 'left' | 'center' | 'right';

export interface TextOptions {
  align?: TextAlign;
  /** Couleur d'ombre portee, decalee de 1 px en bas a droite. */
  shadow?: string;
  /** Contour 4-directions : lisible par-dessus n'importe quel fond. */
  outline?: string;
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  opts: TextOptions = {},
): number {
  const upper = text.toUpperCase();
  const width = textWidth(upper);
  let startX = Math.round(x);
  if (opts.align === 'center') startX = Math.round(x - width / 2);
  else if (opts.align === 'right') startX = Math.round(x - width);
  const startY = Math.round(y);

  const blit = (dx: number, dy: number, fill: string) => {
    ctx.fillStyle = fill;
    let penX = startX + dx;
    for (const ch of upper) {
      const mask = MASKS.get(ch) ?? FALLBACK;
      for (let ry = 0; ry < GLYPH_H; ry++) {
        const row = mask[ry];
        for (let rx = 0; rx < GLYPH_W; rx++) {
          if (row[rx]) ctx.fillRect(penX + rx, startY + dy + ry, 1, 1);
        }
      }
      penX += GLYPH_W + TRACKING;
    }
  };

  if (opts.outline) {
    blit(-1, 0, opts.outline);
    blit(1, 0, opts.outline);
    blit(0, -1, opts.outline);
    blit(0, 1, opts.outline);
  }
  if (opts.shadow) blit(1, 1, opts.shadow);
  blit(0, 0, color);

  return width;
}

/**
 * Texte multi-lignes avec retour a la ligne sur les mots.
 * Retourne le nombre de lignes ecrites — utile pour empiler des blocs.
 */
export function drawTextWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  color: string,
  opts: TextOptions = {},
): number {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  lines.forEach((line, i) => drawText(ctx, line, x, y + i * (GLYPH_H + 2), color, opts));
  return lines.length;
}
