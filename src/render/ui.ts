/**
 * Interface : boutons tactiles, HUD, bandeau d'aide, carte de recompense.
 *
 * Les boutons sont dessines DANS le canvas (et non en DOM) pour rester
 * pixel-perfect et faire partie du panneau de commande de la borne.
 * Chaque couche de feedback est isolee dans sa propre fonction.
 */
import { C, RARITY_COLOR } from './palette.ts';
import { bevel, box, dither, fill, hline, roundRect } from './shapes.ts';
import { drawText, drawTextWrapped, textWidth } from './font.ts';
import { bake, drawSprite, tinted, type Sprite } from './sprites.ts';
import { UI_ART } from './art/ui.ts';
import { PLUSH_ART } from './art/plushies.ts';
import { BTN_DROP, BTN_LEFT, BTN_RIGHT, HINT_Y, HUD, PANEL, SHELL } from '../game/cabinet.ts';
import { RARITY_LABEL } from '../game/prizes.ts';
import type { ButtonState } from '../core/input.ts';
import type { Machine, Phase } from '../game/machine.ts';
import type { GameState } from '../game/state.ts';
import { collectionSize } from '../game/state.ts';
import { PRIZES } from '../game/prizes.ts';
import { VIRTUAL_W } from './canvas.ts';
import type { Rect } from '../core/math.ts';

/** Textes courts : la largeur utile du bandeau est de 170 px. */
const PHASE_HINT: Record<Phase, string> = {
  ready: 'Place, puis descends',
  descend: 'Descente...',
  settle: 'Attention...',
  close: 'Prise !',
  ascend: 'Remontee',
  return: 'Retour au bac',
  release: 'Largage',
  payout: 'Tape pour continuer',
};

export interface UiSprites {
  plushies: Record<string, Sprite>;
  icons: Record<string, Sprite>;
  iconsDark: Record<string, Sprite>;
}

export function buildSprites(): UiSprites {
  const plushies: Record<string, Sprite> = {};
  for (const prize of PRIZES) {
    const art = PLUSH_ART[prize.sprite];
    if (!art) throw new Error(`Sprite manquant pour ${prize.id}: ${prize.sprite}`);
    plushies[prize.id] = bake(art, prize.sprite);
  }

  const icons: Record<string, Sprite> = {};
  const iconsDark: Record<string, Sprite> = {};
  for (const [name, art] of Object.entries(UI_ART)) {
    const sprite = bake(art, name);
    icons[name] = sprite;
    iconsDark[name] = tinted(sprite, C.inkDark);
  }
  return { plushies, icons, iconsDark };
}

// --- panneau de commande ------------------------------------------------

export function drawPanel(ctx: CanvasRenderingContext2D): void {
  bevel(ctx, PANEL, C.panel, C.panelHi, C.panelLo, 3);
  // Grilles de ventilation sur les cotes : le bandeau d'aide occupe le centre.
  for (let y = PANEL.y + 20; y < PANEL.y + 34; y += 3) {
    dither(ctx, { x: PANEL.x + 4, y, w: 5, h: 1 }, C.panelLo);
    dither(ctx, { x: PANEL.x + PANEL.w - 9, y, w: 5, h: 1 }, C.panelLo);
  }
}

interface ButtonStyle {
  face: string;
  shadow: string;
  icon: string;
  label: string;
  /** Bandeau lumineux vert (actif) / ambre (indisponible). */
  led?: boolean;
}

const STYLE_LEFT: ButtonStyle = {
  face: C.btnLeft,
  shadow: C.btnLeftLo,
  icon: 'arrowLeft',
  label: '',
};
const STYLE_RIGHT: ButtonStyle = {
  face: C.btnRight,
  shadow: C.btnRightLo,
  icon: 'arrowRight',
  label: '',
};
const STYLE_DROP: ButtonStyle = {
  face: C.btnDrop,
  shadow: C.btnDropLo,
  icon: 'arrowDown',
  label: 'DESCENDS',
  led: true,
};

/**
 * Un bouton, avec ses couches de feedback :
 *  1. socle fixe (l'ombre qui reste quand le capuchon s'enfonce) ;
 *  2. capuchon, decale de 2 px vers le bas quand il est enfonce ;
 *  3. halo lumineux qui s'eteint en ~150 ms apres l'appui ;
 *  4. voile tram + cadenas quand le bouton est indisponible.
 */
function drawButton(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  state: ButtonState,
  style: ButtonStyle,
  sprites: UiSprites,
): void {
  const depth = 3;
  const pressed = state.down && !state.disabled;
  const sink = pressed ? depth : 0;

  // 1. socle
  roundRect(ctx, { x: rect.x, y: rect.y + 2, w: rect.w, h: rect.h }, C.panelLo, 3);

  // 2. capuchon
  const cap: Rect = { x: rect.x, y: rect.y + sink, w: rect.w, h: rect.h - depth };
  const face = state.disabled ? C.btnDead : style.face;
  const shadow = state.disabled ? C.btnDeadLo : style.shadow;
  bevel(ctx, cap, face, pressed ? shadow : C.ink, shadow, 3);
  if (!pressed && !state.disabled) {
    // Reflet superieur : le bouton a du volume tant qu'il n'est pas enfonce.
    hline(ctx, cap.x + 4, cap.y + 2, cap.w - 8, C.ink);
  } else if (pressed) {
    // Ombre interne : le capuchon est rentre dans le panneau.
    hline(ctx, cap.x + 3, cap.y + 1, cap.w - 6, shadow);
    hline(ctx, cap.x + 3, cap.y + 2, cap.w - 6, shadow);
  }

  // 3. halo d'appui
  if (state.flash > 0 && !state.disabled) {
    const grow = Math.round((1 - state.flash) * 3);
    ctx.save();
    ctx.globalAlpha = state.flash * 0.9;
    box(
      ctx,
      { x: cap.x - grow, y: cap.y - grow, w: cap.w + grow * 2, h: cap.h + grow * 2 },
      C.ink,
    );
    ctx.restore();
  }

  // icone
  const icon = state.disabled ? sprites.iconsDark[style.icon] : sprites.icons[style.icon];
  const iconY = cap.y + (style.label ? 12 : (cap.h - icon.h) / 2);
  drawSprite(ctx, icon, cap.x + (cap.w - icon.w) / 2, iconY);

  if (style.label) {
    drawText(ctx, style.label, cap.x + cap.w / 2, cap.y + cap.h - 11, state.disabled ? C.inkDim : C.ink, {
      align: 'center',
      shadow,
    });
  }

  // 4. indisponible
  if (state.disabled) {
    dither(ctx, cap, C.panelLo);
    const lock = sprites.iconsDark.lock;
    drawSprite(ctx, lock, cap.x + cap.w - lock.w - 3, cap.y + 3);
  }

  // 5. LED d'etat, dessinee EN DERNIER pour rester nette meme sous le voile :
  // c'est elle qui dit si le bouton repondra.
  if (style.led) {
    const led: Rect = { x: cap.x + cap.w / 2 - 8, y: cap.y + 5, w: 16, h: 3 };
    fill(ctx, { x: led.x - 1, y: led.y - 1, w: led.w + 2, h: led.h + 2 }, C.panelLo);
    fill(ctx, led, state.disabled ? C.warn : C.good);
  }
}

export function drawControls(
  ctx: CanvasRenderingContext2D,
  sprites: UiSprites,
  left: ButtonState,
  drop: ButtonState,
  right: ButtonState,
): void {
  drawButton(ctx, BTN_LEFT, left, STYLE_LEFT, sprites);
  drawButton(ctx, BTN_RIGHT, right, STYLE_RIGHT, sprites);
  drawButton(ctx, BTN_DROP, drop, STYLE_DROP, sprites);
}

// --- HUD ----------------------------------------------------------------

export function drawHud(
  ctx: CanvasRenderingContext2D,
  sprites: UiSprites,
  state: GameState,
): void {
  fill(ctx, HUD, C.panelLo);
  box(ctx, HUD, C.panel);

  const coinIcon = sprites.icons.coin;
  drawSprite(ctx, coinIcon, HUD.x + 3, HUD.y + 2);
  drawText(ctx, `${state.coins}`, HUD.x + 12, HUD.y + 2, C.trim, { shadow: C.void });

  drawText(ctx, `CRED ${state.credits}`, HUD.x + HUD.w / 2, HUD.y + 2, C.inkDim, {
    align: 'center',
  });

  const total = PRIZES.length;
  drawText(
    ctx,
    `${collectionSize(state)}/${total}`,
    HUD.x + HUD.w - 3,
    HUD.y + 2,
    C.ink,
    { align: 'right', shadow: C.void },
  );
}

export function drawHint(ctx: CanvasRenderingContext2D, machine: Machine): void {
  const text = machine.toast?.text ?? PHASE_HINT[machine.phase];
  const color = machine.toast ? C.trim : C.inkDim;
  const w = textWidth(text.toUpperCase());
  const left = Math.round((VIRTUAL_W - w) / 2);
  // Pastille de statut : verte quand la borne accepte une nouvelle partie.
  fill(ctx, { x: left - 7, y: HINT_Y + 2, w: 3, h: 3 }, machine.canDrop ? C.good : C.warn);
  drawText(ctx, text, left, HINT_Y, color, { shadow: C.void });
}

// --- carte de recompense ------------------------------------------------

export function drawPayout(
  ctx: CanvasRenderingContext2D,
  sprites: UiSprites,
  machine: Machine,
  time: number,
): void {
  const payout = machine.payout;
  if (!payout) return;

  // Voile sombre sur la borne uniquement : le panneau de commande reste lisible.
  ctx.save();
  ctx.globalAlpha = 0.72;
  fill(ctx, SHELL, C.void);
  ctx.restore();

  const card: Rect = { x: 22, y: 74, w: 136, h: 126 };
  const accent = RARITY_COLOR[payout.prize.rarity] ?? C.common;
  bevel(ctx, card, C.panel, C.panelHi, C.panelLo, 3);
  box(ctx, { x: card.x + 2, y: card.y + 2, w: card.w - 4, h: card.h - 4 }, accent);

  drawText(ctx, 'GAGNE !', card.x + card.w / 2, card.y + 7, accent, {
    align: 'center',
    shadow: C.panelLo,
  });

  // Peluche en x2, qui respire legerement.
  const sprite = sprites.plushies[payout.prize.id];
  const bob = Math.round(Math.sin(time * 4) * 1);
  const dw = sprite.w * 2;
  const dh = sprite.h * 2;
  const dx = Math.round(card.x + (card.w - dw) / 2);
  const dy = card.y + 18 + bob;
  dither(ctx, { x: dx + 6, y: dy + dh + 1, w: dw - 12, h: 2 }, C.panelLo);
  ctx.drawImage(sprite.canvas, dx, dy, dw, dh);

  drawText(ctx, payout.prize.name, card.x + card.w / 2, card.y + 62, C.ink, {
    align: 'center',
    shadow: C.panelLo,
  });
  drawText(ctx, RARITY_LABEL[payout.prize.rarity], card.x + card.w / 2, card.y + 72, accent, {
    align: 'center',
  });
  drawTextWrapped(ctx, payout.prize.blurb, card.x + card.w / 2, card.y + 84, card.w - 14, C.inkDim, {
    align: 'center',
  });

  // Gain
  const coinIcon = sprites.icons.coin;
  const label = `+${payout.value}`;
  const totalW = coinIcon.w + 2 + textWidth(label);
  const gx = Math.round(card.x + (card.w - totalW) / 2);
  drawSprite(ctx, coinIcon, gx, card.y + 106);
  drawText(ctx, label, gx + coinIcon.w + 2, card.y + 106, C.trim, { shadow: C.panelLo });

  // Tampon "NEW!" en diagonale, clignotant.
  if (payout.isNew && Math.floor(time * 4) % 2 === 0) {
    const stamp: Rect = { x: card.x + card.w - 42, y: card.y + 12, w: 36, h: 13 };
    fill(ctx, stamp, C.bad);
    box(ctx, stamp, C.ink);
    drawText(ctx, 'NEW!', stamp.x + stamp.w / 2, stamp.y + 3, C.ink, { align: 'center' });
  }

}

// --- debug --------------------------------------------------------------

export function drawDebugPanel(
  ctx: CanvasRenderingContext2D,
  lines: string[],
): void {
  const h = lines.length * 8 + 4;
  fill(ctx, { x: 2, y: 34, w: 92, h }, C.void);
  box(ctx, { x: 2, y: 34, w: 92, h }, C.good);
  lines.forEach((line, i) => {
    drawText(ctx, line, 5, 37 + i * 8, C.good);
  });
}
