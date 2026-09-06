import { test, expect, type Page } from '@playwright/test';

/**
 * Test de fumee. Il pilote la vraie page avec de vrais evenements pointer :
 * si le hit-test, la mise a l'echelle entiere ou la machine a etats cassent,
 * ce test tombe.
 *
 * `window.__claw` n'est expose qu'en build de developpement.
 */

type ClawHandle = {
  machine: {
    phase: string;
    clawX: number;
    bodies: unknown[];
    payout: { prize: { id: string } } | null;
    requestDrop: () => boolean;
    dismissPayout: () => void;
  };
  state: { plays: number; coins: number; credits: number };
  screen: { scale: number };
};

declare global {
  interface Window {
    __claw: ClawHandle;
  }
}

/** Centre d'un bouton, converti en coordonnees ecran. */
async function buttonPoint(page: Page, id: 'left' | 'right' | 'drop') {
  return page.evaluate((buttonId) => {
    const rects = {
      left: { x: 12, y: 262, w: 44, h: 44 },
      right: { x: 124, y: 262, w: 44, h: 44 },
      drop: { x: 64, y: 256, w: 52, h: 52 },
    } as const;
    const r = rects[buttonId];
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    const box = canvas.getBoundingClientRect();
    const scale = window.__claw.screen.scale;
    return { x: box.left + (r.x + r.w / 2) * scale, y: box.top + (r.y + r.h / 2) * scale };
  }, id);
}

async function holdButton(
  page: Page,
  id: 'left' | 'right' | 'drop',
  ms: number,
): Promise<void> {
  const point = await buttonPoint(page, id);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
  await page.waitForTimeout(150);
}

async function clickButton(page: Page, id: 'left' | 'right' | 'drop'): Promise<void> {
  const point = await buttonPoint(page, id);
  await page.mouse.click(point.x, point.y);
}

async function waitForPhase(page: Page, phase: string, timeout = 15_000) {
  await page.waitForFunction((p) => window.__claw.machine.phase === p, phase, { timeout });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/');
  await page.waitForFunction(() => Boolean(window.__claw));
  // La pile doit se tasser avant de jouer.
  await page.waitForTimeout(1500);
});

test('la page se charge, se met a l echelle en entier et remplit la vitrine', async ({ page }) => {
  const info = await page.evaluate(() => ({
    scale: window.__claw.screen.scale,
    bodies: window.__claw.machine.bodies.length,
    phase: window.__claw.machine.phase,
  }));
  expect(Number.isInteger(info.scale)).toBe(true);
  expect(info.scale).toBeGreaterThanOrEqual(1);
  expect(info.bodies).toBeGreaterThan(8);
  expect(info.phase).toBe('ready');
});

test('la page ne defile jamais horizontalement ni verticalement', async ({ page }) => {
  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }));
  expect(overflow.x).toBeLessThanOrEqual(0);
  expect(overflow.y).toBeLessThanOrEqual(0);
});

test('maintenir le bouton DROITE deplace la pince, la relacher l arrete', async ({ page }) => {
  const start = await page.evaluate(() => window.__claw.machine.clawX);
  const point = await buttonPoint(page, 'right');

  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(700);
  const moving = await page.evaluate(() => window.__claw.machine.clawX);
  await page.mouse.up();
  await page.waitForTimeout(400);
  const stopped = await page.evaluate(() => window.__claw.machine.clawX);

  expect(moving).toBeGreaterThan(start + 5);
  expect(Math.abs(stopped - moving)).toBeLessThan(12);
});

test('glisser hors du bouton pendant l appui relache le bouton', async ({ page }) => {
  const point = await buttonPoint(page, 'right');
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(300);
  // On sort du bouton par le haut, sans lever le doigt.
  await page.mouse.move(point.x, point.y - 200);
  await page.waitForTimeout(150);
  const a = await page.evaluate(() => window.__claw.machine.clawX);
  await page.waitForTimeout(400);
  const b = await page.evaluate(() => window.__claw.machine.clawX);
  await page.mouse.up();
  expect(Math.abs(b - a)).toBeLessThan(3);
});

test('un appui sur DESCENDRE deroule tout le cycle jusqu au retour au bac', async ({ page }) => {
  const point = await buttonPoint(page, 'drop');
  await page.mouse.click(point.x, point.y);

  await waitForPhase(page, 'descend');
  await waitForPhase(page, 'close');
  await waitForPhase(page, 'ascend');
  await waitForPhase(page, 'return');

  const plays = await page.evaluate(() => window.__claw.state.plays);
  expect(plays).toBe(1);
});

test('DESCENDRE est ignore tant que le cycle n est pas fini', async ({ page }) => {
  const point = await buttonPoint(page, 'drop');
  await page.mouse.click(point.x, point.y);
  await waitForPhase(page, 'descend');
  await page.mouse.click(point.x, point.y);
  await page.mouse.click(point.x, point.y);
  const plays = await page.evaluate(() => window.__claw.state.plays);
  expect(plays).toBe(1);
});

test('le jeu ne vole pas les touches d un champ de saisie', async ({ page }) => {
  // Le miroir clavier appelle preventDefault() sur Espace et les fleches. Sans
  // garde-fou il casserait n'importe quel formulaire sur la meme page — c'est
  // exactement ce que fait la page de playtest, qui embarque le jeu a cote
  // d'un champ de texte.
  const before = await page.evaluate(() => window.__claw.machine.clawX);

  await page.evaluate(() => {
    const input = document.createElement('input');
    input.id = 'probe';
    document.body.appendChild(input);
    input.focus();
  });

  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('abc');
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);

  const after = await page.evaluate(() => ({
    clawX: window.__claw.machine.clawX,
    phase: window.__claw.machine.phase,
    typed: (document.getElementById('probe') as HTMLInputElement).value,
  }));

  expect(after.clawX).toBeCloseTo(before, 3);
  expect(after.phase).toBe('ready');
  // Espace doit atteindre le champ, pas la pince.
  expect(after.typed).toBe('abc ');
});

test('une peluche finit par tomber dans le bac et declenche la carte de gain', async ({
  page,
}) => {
  // La pince revient toujours au-dessus du bac : il faut la deplacer vers la
  // pile avant chaque essai, exactement comme un joueur. Et la prise n'est pas
  // garantie, donc on rejoue jusqu'a un gain.
  test.setTimeout(180_000);

  let won = false;
  for (let attempt = 0; attempt < 10 && !won; attempt++) {
    await holdButton(page, 'right', 1200 + attempt * 180);
    await clickButton(page, 'drop');
    await page.waitForFunction(
      () => ['ready', 'payout'].includes(window.__claw.machine.phase),
      undefined,
      { timeout: 30_000 },
    );
    won = await page.evaluate(() => window.__claw.machine.phase === 'payout');
  }

  expect(won).toBe(true);
  const payout = await page.evaluate(() => ({
    prize: window.__claw.machine.payout?.prize.id ?? null,
    coins: window.__claw.state.coins,
  }));
  expect(payout.prize).not.toBeNull();
  expect(payout.coins).toBeGreaterThan(0);

  // Un tap hors bouton ferme la carte et rend la main.
  await page.mouse.click(90, 200);
  await waitForPhase(page, 'ready');
});
