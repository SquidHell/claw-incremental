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

/**
 * Le test qui compte le plus de ce fichier.
 *
 * Le jeu se met a l'echelle par un facteur entier, et les pages hotes finissent
 * la mise en page avec un `transform: scale()` pour occuper l'ecran. Si la
 * conversion ecran -> virtuel ignore cette transformation, TOUTES les touches
 * se decalent, de plus en plus loin du coin haut-gauche : les boutons deviennent
 * injouables sur telephone alors que tout va bien sur un grand ecran. C'est
 * arrive une fois ; ce test l'empeche de revenir.
 */
const TARGETS = [
  { name: 'DESCENDRE', vx: 90, vy: 282, expect: 'descend' },
  { name: 'GAUCHE', vx: 34, vy: 284, expect: 'ready' },
];

for (const phone of [...PHONES, { name: 'Galaxy S23 FE', w: 386, h: 836 }]) {
  test(`banc d essai : le hit-test suit la mise a l echelle sur ${phone.name}`, async ({ page }) => {
    await page.setViewportSize({ width: phone.w, height: phone.h });
    await page.goto(wrap('playtest.html'));
    await page.waitForFunction(() => Boolean((window as never as { __claw?: unknown }).__claw));
    await page.waitForTimeout(600);

    for (const target of TARGETS) {
      // Le point ECRAN qui correspond au centre du bouton, mesure sur le canvas
      // tel qu'il est reellement rendu, transformations comprises.
      const virtual = await page.evaluate(
        ([vx, vy]) => {
          const c = document.getElementById('screen') as HTMLCanvasElement;
          const r = c.getBoundingClientRect();
          const claw = (window as never as { __claw: { screen: { toVirtual: (x: number, y: number) => { x: number; y: number } } } }).__claw;
          return claw.screen.toVirtual(
            r.left + (vx / 180) * r.width,
            r.top + (vy / 320) * r.height,
          );
        },
        [target.vx, target.vy],
      );

      // Le jeu doit retrouver la case qu'on visait, a un pixel virtuel pres.
      expect(Math.abs(virtual.x - target.vx)).toBeLessThan(1);
      expect(Math.abs(virtual.y - target.vy)).toBeLessThan(1);
    }
  });
}

test('jeu seul : remplit la largeur du telephone et les boutons repondent', async ({ page }) => {
  await page.setViewportSize({ width: 386, height: 836 });
  await page.goto(wrap('jeu.html'));
  await page.waitForFunction(() => Boolean((window as never as { __claw?: unknown }).__claw));
  await page.waitForTimeout(800);

  const box = await page.evaluate(() => {
    const r = document.getElementById('screen')!.getBoundingClientRect();
    return { left: r.left, top: r.top, w: r.width, h: r.height, vw: window.innerWidth };
  });

  // « Proche du plein ecran » : au moins 95 % de la largeur utile.
  expect(box.w / box.vw).toBeGreaterThan(0.95);

  const point = (vx: number, vy: number) => ({
    x: box.left + (vx / 180) * box.w,
    y: box.top + (vy / 320) * box.h,
  });

  // Maintenir GAUCHE deplace vraiment la pince.
  const before = await page.evaluate(() => (window as never as { __claw: { machine: { clawX: number } } }).__claw.machine.clawX);
  const left = point(34, 284);
  await page.mouse.move(left.x, left.y);
  await page.mouse.down();
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => (window as never as { __claw: { machine: { clawX: number } } }).__claw.machine.clawX);
  await page.mouse.up();
  expect(after).toBeLessThan(before);

  // Et DESCENDRE lance vraiment le cycle.
  const drop = point(90, 282);
  await page.mouse.click(drop.x, drop.y);
  await page.waitForTimeout(300);
  const phase = await page.evaluate(() => (window as never as { __claw: { machine: { phase: string } } }).__claw.machine.phase);
  expect(phase).not.toBe('ready');
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
