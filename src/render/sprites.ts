/**
 * Sprites en "pixel-map" : une palette + des lignes de caracteres.
 * C'est lisible, versionnable et editable directement dans le diff git —
 * bien plus pratique qu'un PNG binaire pour un proto.
 *
 * Les maps sont cuites une seule fois au demarrage dans des canvas hors ecran ;
 * le rendu ne fait plus que des drawImage.
 *
 * Pour brancher du vrai art plus tard : `loadSheet()` produit exactement le
 * meme type `Sprite`, donc aucun code de dessin n'a besoin de changer.
 */

export interface PixelArt {
  /** Caractere -> couleur CSS. '.' et ' ' sont toujours transparents. */
  palette: Record<string, string>;
  rows: string[];
}

export interface Sprite {
  canvas: CanvasImageSource;
  w: number;
  h: number;
}

const TRANSPARENT = new Set(['.', ' ']);

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Cuit une pixel-map. Jette si la grille n'est pas rectangulaire. */
export function bake(art: PixelArt, name = 'sprite'): Sprite {
  const h = art.rows.length;
  if (h === 0) throw new Error(`${name}: aucune ligne`);
  const w = art.rows[0].length;
  for (let y = 0; y < h; y++) {
    if (art.rows[y].length !== w) {
      throw new Error(`${name}: ligne ${y} fait ${art.rows[y].length} px, attendu ${w}`);
    }
  }

  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < h; y++) {
    const row = art.rows[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (TRANSPARENT.has(ch)) continue;
      const color = art.palette[ch];
      if (!color) throw new Error(`${name}: caractere '${ch}' absent de la palette`);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return { canvas, w, h };
}

/** Variante teintee (silhouette monochrome) : sert au flash de recompense. */
export function tinted(sprite: Sprite, color: string): Sprite {
  const canvas = makeCanvas(sprite.w, sprite.h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(sprite.canvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, sprite.w, sprite.h);
  return { canvas, w: sprite.w, h: sprite.h };
}

/** Charge un PNG entier comme un seul sprite. */
export async function spriteFromUrl(url: string): Promise<Sprite> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const canvas = makeCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0);
  return { canvas, w: img.naturalWidth, h: img.naturalHeight };
}

/**
 * Decoupe une feuille PNG en frames de taille fixe. Point d'entree pour une
 * planche de sprites complete, sans toucher au code de rendu.
 */
export async function loadSheet(
  url: string,
  frameW: number,
  frameH: number,
): Promise<Sprite[]> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const cols = Math.floor(img.width / frameW);
  const rows = Math.floor(img.height / frameH);
  const out: Sprite[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = makeCanvas(frameW, frameH);
      canvas
        .getContext('2d')!
        .drawImage(img, c * frameW, r * frameH, frameW, frameH, 0, 0, frameW, frameH);
      out.push({ canvas, w: frameW, h: frameH });
    }
  }
  return out;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
): void {
  // Arrondi obligatoire : un drawImage a coordonnee fractionnaire floute le pixel art.
  ctx.drawImage(sprite.canvas, Math.round(x), Math.round(y));
}
