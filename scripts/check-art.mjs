/**
 * Verifie que chaque pixel-map est une grille rectangulaire et que tous les
 * caracteres utilises existent dans la palette. Une ligne trop courte est
 * l'erreur la plus facile a faire en pixel art texte et la plus penible a
 * diagnostiquer a l'ecran — autant la bloquer ici.
 *
 * Usage: npm run check:art
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const artDir = resolve(here, '../src/render/art');
const TRANSPARENT = new Set(['.', ' ']);

let errors = 0;
const report = (msg) => {
  errors++;
  console.error(`  x ${msg}`);
};

for (const file of readdirSync(artDir).filter((f) => f.endsWith('.ts'))) {
  const source = readFileSync(join(artDir, file), 'utf8');
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  );

  console.log(`${file}`);
  for (const [name, art] of Object.entries(mod)) {
    if (!art || !Array.isArray(art.rows) || typeof art.palette !== 'object') continue;
    const w = art.rows[0]?.length ?? 0;
    if (w === 0) {
      report(`${name}: aucune ligne`);
      continue;
    }
    const used = new Set();
    art.rows.forEach((row, y) => {
      if (row.length !== w) {
        report(`${name}: ligne ${y} fait ${row.length} px, attendu ${w} -> "${row}"`);
      }
      for (const ch of row) if (!TRANSPARENT.has(ch)) used.add(ch);
    });
    for (const ch of used) {
      if (!art.palette[ch]) report(`${name}: caractere '${ch}' absent de la palette`);
    }
    const unused = Object.keys(art.palette).filter((ch) => !used.has(ch));
    if (unused.length) console.log(`  ! ${name}: palette inutilisee: ${unused.join(', ')}`);
    console.log(`  - ${name}: ${w}x${art.rows.length}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} erreur(s) d'art.`);
  process.exit(1);
}
console.log('\nArt OK.');
