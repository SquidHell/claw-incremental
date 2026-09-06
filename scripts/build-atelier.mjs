/**
 * Assemble l'atelier de sprites : les pixel-maps du jeu sont injectees en JSON
 * dans artifact/atelier.html, pour que l'atelier parte toujours de l'art reel
 * du depot et pas d'une copie qui derive.
 *
 * Usage: node scripts/build-atelier.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function loadModule(relPath) {
  const source = readFileSync(join(root, relPath), 'utf8');
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const art = await loadModule('src/render/art/plushies.ts');
const prizes = await loadModule('src/game/prizes.ts');

// On ne garde que ce dont l'atelier a besoin : la pixel-map et l'etiquette.
const seed = prizes.PRIZES.map((p) => ({
  id: p.id,
  name: p.name,
  key: p.sprite,
  rarity: p.rarity,
  art: art.PLUSH_ART[p.sprite],
}));
for (const entry of seed) {
  if (!entry.art) throw new Error(`Pixel-map manquante pour ${entry.id} (${entry.key})`);
}

const template = readFileSync(join(root, 'artifact', 'atelier.html'), 'utf8');
const MARKER = '/*__SEED__*/null';
if (!template.includes(MARKER)) throw new Error(`Marqueur ${MARKER} absent du template.`);

const out = template.replace(MARKER, () => JSON.stringify(seed));
mkdirSync(join(root, 'dist-artifact'), { recursive: true });
const outPath = join(root, 'dist-artifact', 'atelier.html');
writeFileSync(outPath, out);

console.log(`${outPath} — ${(out.length / 1024).toFixed(1)} ko (${seed.length} peluches)`);
