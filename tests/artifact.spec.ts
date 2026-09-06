import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect, type Page } from '@playwright/test';

/**
 * Tests des pages publiees (banc d'essai et atelier).
 *
 * Elles ne passent pas par le serveur de dev : on assemble le fichier reel,
 * on l'enveloppe comme le fait la visionneuse d'artefacts (doctype + reset
 * minimal, PAS de box-sizing global) et on le charge depuis le disque.
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRAPPER_HEAD =
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>:root{color-scheme:light dark}body{margin:0;font:14px system-ui}' +
  'img{max-width:100%}[hidden]{display:none!important}</style></head><body>';

let dir: string;

function wrap(name: string): string {
  const html = readFileSync(join(ROOT, 'dist-artifact', name), 'utf8');
  const out = join(dir, name);
  writeFileSync(out, WRAPPER_HEAD + html + '</body></html>');
  return 'file://' + out;
}

test.beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'claw-artifact-'));
  // On teste ce qui serait publie, pas une copie qui aurait derive.
  execFileSync('npm', ['run', 'build:playtest'], { cwd: ROOT, stdio: 'pipe' });
  execFileSync('npm', ['run', 'build:atelier'], { cwd: ROOT, stdio: 'pipe' });
});

/** Mesure la borne du banc d'essai une fois la page posee. */
async function cabinet(page: Page) {
  return page.evaluate(() => {
    const r = document.getElementById('stage')!.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      height: r.height,
      viewport: window.innerHeight,
    };
  });
}

const PHONES = [
  { name: 'iPhone 12', w: 390, h: 844 },
  { name: 'iPhone SE', w: 375, h: 667 },
];

for (const phone of PHONES) {
  test(`banc d essai : la borne entiere tient dans le premier ecran sur ${phone.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: phone.w, height: phone.h });
    await page.goto(wrap('playtest.html'));
    await page.waitForFunction(() => Boolean((window as never as { __claw?: unknown }).__claw));
    await page.waitForTimeout(600);

    const box = await cabinet(page);
    // Le panneau de commande est dans le bas de la borne : si elle deborde,
    // le testeur atterrit sur une page ou les boutons sont invisibles, et il
    // ne peut pas defiler avec le pouce pose dessus (touch-action: none).
    expect(box.bottom).toBeLessThanOrEqual(box.viewport);
    expect(box.height).toBeGreaterThan(300);
  });
}

test('banc d essai : la page ne deborde pas horizontalement sur telephone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(wrap('playtest.html'));
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('atelier : editer une peluche du casting produit un patch pour les deux fichiers', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.setViewportSize({ width: 1180, height: 1000 });
  await page.goto(wrap('atelier.html'));
  await page.waitForTimeout(500);

  // Au repos, le casting est conforme au depot.
  await expect(page.locator('#roster-note')).toHaveText('Conforme au dépôt');
  await expect(page.locator('.roster-card')).toHaveCount(8);

  // On selectionne une autre peluche, on la renomme.
  await page.locator('.roster-card').nth(3).click();
  await page.fill('#name', 'Voltik Deluxe');
  await page.waitForTimeout(200);

  await expect(page.locator('#roster-note')).toHaveText('1 modifiée');
  await expect(page.locator('#grid-title')).toHaveText('Voltik Deluxe');

  const patch = await page.locator('#export').textContent();
  expect(patch).toContain('plushies.ts');
  // Le nom a change : le patch doit aussi porter la ligne pour prizes.ts.
  expect(patch).toContain('prizes.ts');
  expect(patch).toContain("name: 'Voltik Deluxe'");

  // Retour a l'original : plus aucun ecart.
  await page.click('#reset-one');
  await page.waitForTimeout(200);
  await expect(page.locator('#roster-note')).toHaveText('Conforme au dépôt');

  expect(errors).toEqual([]);
});
