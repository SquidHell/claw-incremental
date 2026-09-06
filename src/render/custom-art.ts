/**
 * Surcharge de l'art par des PNG deposes dans `art/custom/`.
 *
 * Ce fichier vit hors de `art/` a dessein : `art/` ne contient que des donnees
 * de pixel-map, ce que `npm run check:art` valide en important tout le dossier.
 * Un module avec de vraies dependances n'y a pas sa place.
 *
 * C'est le chemin « ton art a toi » : un fichier `art/custom/zeb.png` remplace
 * la pixel-map de Zeb au demarrage, sans toucher une ligne de code. Voir
 * `art/custom/README.md`.
 *
 * Volontairement NON bloquant : le jeu demarre sur les pixel-maps et les PNG
 * se substituent quand ils sont decodes. Un fichier corrompu ne peut donc pas
 * empecher le proto de se lancer.
 */
import { PRIZES } from '../game/prizes.ts';
import { spriteFromUrl, type Sprite } from './sprites.ts';

// Vite resout ce glob a la compilation : un dossier vide donne un objet vide.
const FILES = import.meta.glob('./art/custom/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Cle de sprite (le nom de fichier sans extension) -> URL. */
const BY_NAME = new Map<string, string>(
  Object.entries(FILES).map(([path, url]) => [
    path.replace(/^.*\//, '').replace(/\.png$/i, ''),
    url,
  ]),
);

export interface CustomArtResult {
  /** Identifiants de lots dont le sprite a ete remplace. */
  applied: string[];
  /** Messages a montrer au developpeur (mauvaise taille, decodage rate). */
  warnings: string[];
}

/**
 * Remplace en place les sprites de `plushies` par les PNG trouves.
 * Le rendu relit `plushies[id]` a chaque frame, donc la substitution est
 * visible des que l'image est prete.
 */
export async function loadCustomArt(
  plushies: Record<string, Sprite>,
): Promise<CustomArtResult> {
  const applied: string[] = [];
  const warnings: string[] = [];
  if (BY_NAME.size === 0) return { applied, warnings };

  await Promise.all(
    PRIZES.map(async (prize) => {
      // On accepte la cle de sprite ou l'identifiant du lot comme nom de fichier.
      const url = BY_NAME.get(prize.sprite) ?? BY_NAME.get(prize.id);
      if (!url) return;
      try {
        const sprite = await spriteFromUrl(url);
        const [w, h] = prize.size;
        if (sprite.w !== w || sprite.h !== h) {
          warnings.push(
            `${prize.id}: PNG ${sprite.w}x${sprite.h}, attendu ${w}x${h} — ` +
              `l'image depassera sa boite de collision.`,
          );
        }
        plushies[prize.id] = sprite;
        applied.push(prize.id);
      } catch {
        warnings.push(`${prize.id}: PNG illisible, la pixel-map est conservee.`);
      }
    }),
  );

  return { applied, warnings };
}
