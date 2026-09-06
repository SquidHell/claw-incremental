/**
 * Assemble la page de playtest : le bundle de jeu compile est injecte dans
 * artifact/template.html a la place du marqueur.
 *
 * Le template reste lisible et versionne ; c'est la seule facon de garder la
 * page publiee synchronisee avec le code du jeu.
 *
 * Usage: VITE_PLAYTEST=1 vite build --outDir dist-playtest && node scripts/build-artifact.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'dist-playtest', 'assets');

const bundleName = readdirSync(buildDir).find((f) => f.endsWith('.js'));
if (!bundleName) throw new Error('Aucun bundle dans dist-playtest/assets — lance vite build.');

const bundle = readFileSync(join(buildDir, bundleName), 'utf8');
if (!bundle.includes('__claw')) {
  throw new Error('Le bundle n’expose pas window.__claw — compile avec VITE_PLAYTEST=1.');
}
if (/^\s*import\s/m.test(bundle)) {
  throw new Error('Le bundle importe un module externe : il ne peut pas etre inline.');
}

const template = readFileSync(join(root, 'artifact', 'template.html'), 'utf8');
const MARKER = '/*__GAME_BUNDLE__*/';
if (!template.includes(MARKER)) throw new Error(`Marqueur ${MARKER} absent du template.`);

const out = template.replace(MARKER, () => bundle);
mkdirSync(join(root, 'dist-artifact'), { recursive: true });
const outPath = join(root, 'dist-artifact', 'playtest.html');
writeFileSync(outPath, out);

console.log(`${outPath} — ${(out.length / 1024).toFixed(1)} ko (bundle ${bundleName})`);
