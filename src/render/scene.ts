/**
 * Dessin de la borne et de son contenu : enseigne, vitrine, pile de peluches,
 * rail, cable et pince. Aucune logique de jeu ici — on lit `Machine` et on
 * dessine.
 */
import { C } from './palette.ts';
import { bevel, box, dither, fill, hline, vline } from './shapes.ts';
import { drawSprite, type Sprite } from './sprites.ts';
import { drawText } from './font.ts';
import {
  CARRIAGE,
  CHUTE,
  CHUTE_LIP,
  CLAW,
  FLOOR_Y,
  GLASS,
  MARQUEE,
  PLAY,
  RAIL_Y,
  SHELL,
} from '../game/cabinet.ts';
import type { Machine } from '../game/machine.ts';
import { VIRTUAL_H, VIRTUAL_W } from './canvas.ts';

export interface SceneSprites {
  plushies: Record<string, Sprite>;
}

export function drawBackground(ctx: CanvasRenderingContext2D, time: number): void {
  fill(ctx, { x: 0, y: 0, w: VIRTUAL_W, h: VIRTUAL_H }, C.night);
  // Halo doux derriere la borne, anime tres lentement.
  const glowW = 150 + Math.sin(time * 0.7) * 6;
  dither(
    ctx,
    { x: (VIRTUAL_W - glowW) / 2, y: 28, w: glowW, h: 210 },
    C.nightLit,
  );
  // Sol de la fete foraine.
  fill(ctx, { x: 0, y: 232, w: VIRTUAL_W, h: VIRTUAL_H - 232 }, C.void);
}

export function drawMarquee(ctx: CanvasRenderingContext2D, time: number): void {
  bevel(ctx, MARQUEE, C.shell, C.shellHi, C.shellLo, 3);
  box(ctx, { x: MARQUEE.x + 2, y: MARQUEE.y + 2, w: MARQUEE.w - 4, h: MARQUEE.h - 4 }, C.shellLo);

  drawText(ctx, 'CLAW-O-RAMA', MARQUEE.x + MARQUEE.w / 2, MARQUEE.y + 6, C.trim, {
    align: 'center',
    shadow: C.shellDark,
  });

  // Guirlande d'ampoules : la chenille tourne, la borne a l'air allumee.
  const bulbs = 14;
  const spacing = (MARQUEE.w - 10) / (bulbs - 1);
  const head = Math.floor(time * 7) % bulbs;
  for (let i = 0; i < bulbs; i++) {
    const bx = Math.round(MARQUEE.x + 5 + i * spacing);
    const lit = (i - head + bulbs) % bulbs < 3;
    fill(ctx, { x: bx, y: MARQUEE.y + MARQUEE.h - 3, w: 2, h: 2 }, lit ? C.trim : C.shellDark);
  }
}

export function drawCabinet(ctx: CanvasRenderingContext2D, time: number): void {
  // Coque
  bevel(ctx, SHELL, C.shell, C.shellHi, C.shellLo, 3);
  box(ctx, { x: SHELL.x + 2, y: SHELL.y + 2, w: SHELL.w - 4, h: SHELL.h - 4 }, C.shellLo);

  // Vitre
  fill(ctx, GLASS, C.glass);
  box(ctx, GLASS, C.glassEdge);

  // Fond eclaire de l'interieur
  dither(ctx, { x: GLASS.x + 1, y: GLASS.y + 1, w: GLASS.w - 2, h: 90 }, C.glassLit);

  // Sol de la vitrine (absent au-dessus du trou)
  const floorLeft = CHUTE.right;
  fill(
    ctx,
    { x: floorLeft, y: FLOOR_Y, w: PLAY.right - floorLeft, h: PLAY.bottom - FLOOR_Y },
    C.floor,
  );
  hline(ctx, floorLeft, FLOOR_Y, PLAY.right - floorLeft, C.floorLit);

  // Trou de recuperation, encadre pour se lire comme un bac a lots
  const chuteRect = {
    x: CHUTE.left,
    y: FLOOR_Y - 2,
    w: CHUTE.right - CHUTE.left - 3,
    h: PLAY.bottom - FLOOR_Y + 2,
  };
  fill(ctx, chuteRect, C.void);
  hline(ctx, chuteRect.x, chuteRect.y, chuteRect.w, C.floorDark);
  drawText(ctx, 'BAC', chuteRect.x + chuteRect.w / 2, chuteRect.y + 6, C.floorLit, {
    align: 'center',
  });
  // Rebord anti-glissade
  bevel(ctx, CHUTE_LIP, C.floorLit, C.railHi, C.floorDark, 1);

  // Rail
  fill(ctx, { x: PLAY.left, y: RAIL_Y, w: PLAY.right - PLAY.left, h: 3 }, C.railDark);
  hline(ctx, PLAY.left, RAIL_Y, PLAY.right - PLAY.left, C.rail);

  // Reflets de vitre, legerement mobiles : la vitre a l'air d'exister.
  const shift = Math.sin(time * 0.5) * 2;
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.moveTo(GLASS.x + 14 + shift, GLASS.y + GLASS.h);
  ctx.lineTo(GLASS.x + 40 + shift, GLASS.y);
  ctx.lineTo(GLASS.x + 50 + shift, GLASS.y);
  ctx.lineTo(GLASS.x + 24 + shift, GLASS.y + GLASS.h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawBase(ctx: CanvasRenderingContext2D): void {
  const y = SHELL.y + SHELL.h;
  bevel(ctx, { x: SHELL.x - 1, y, w: SHELL.w + 2, h: 6 }, C.shellLo, C.shell, C.shellDark, 1);
}

export function drawPlushies(
  ctx: CanvasRenderingContext2D,
  machine: Machine,
  sprites: SceneSprites,
  alpha: number,
): void {
  for (const body of machine.bodies) {
    const sprite = sprites.plushies[body.prizeId];
    if (!sprite) continue;
    // Interpolation entre les deux derniers pas de simulation.
    const x = body.prevX + (body.x - body.prevX) * alpha;
    const y = body.prevY + (body.y - body.prevY) * alpha;

    // Ombre portee au sol, seulement pour les peluches posees.
    if (!body.held && body.y + body.h > FLOOR_Y - 3) {
      dither(ctx, { x: x + 2, y: FLOOR_Y - 1, w: body.w - 4, h: 2 }, C.floorDark);
    }

    // Ecrasement a l'impact : 1 px suffit a vendre le poids.
    const squash = body.squash > 0 ? 1 : 0;
    drawSprite(ctx, sprite, x, y + squash);
  }
}

export function drawClaw(ctx: CanvasRenderingContext2D, machine: Machine): void {
  const cx = Math.round(machine.clawX);
  const clawY = Math.round(machine.clawY);
  const sway = Math.round(machine.sway);

  // Chariot sur le rail
  const carX = cx - CARRIAGE.w / 2;
  bevel(
    ctx,
    { x: carX, y: RAIL_Y - CARRIAGE.h + 3, w: CARRIAGE.w, h: CARRIAGE.h },
    C.metal,
    C.railHi,
    C.metalDark,
    1,
  );
  fill(ctx, { x: carX + 4, y: RAIL_Y - 1, w: CARRIAGE.w - 8, h: 3 }, C.metalDark);

  // Cable : il se balance avec le chariot.
  const cableTop = RAIL_Y + 2;
  const steps = Math.max(1, clawY - cableTop);
  ctx.fillStyle = C.cable;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const x = cx + sway * t * t;
    ctx.fillRect(Math.round(x), cableTop + i, 1, 1);
  }

  const headX = cx + sway;
  const tension = machine.tension;
  const shakeX = tension > 0 ? Math.round((Math.random() - 0.5) * 2 * tension * 2) : 0;
  const hx = headX + shakeX;

  // Tete de pince
  bevel(
    ctx,
    { x: hx - CLAW.headW / 2, y: clawY, w: CLAW.headW, h: CLAW.headH },
    C.metal,
    C.railHi,
    C.metalDark,
    1,
  );
  fill(ctx, { x: hx - 2, y: clawY - 2, w: 4, h: 3 }, C.metalLo);

  // Pinces : deux bras qui s'ecartent selon l'ouverture.
  const half = machine.halfSpan;
  drawProng(ctx, hx, clawY + CLAW.headH, -half);
  drawProng(ctx, hx, clawY + CLAW.headH, half);
}

/** Un bras : segment oblique vers l'exterieur puis pointe verticale. */
function drawProng(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  offset: number,
): void {
  const dir = Math.sign(offset) || 1;
  const span = Math.abs(offset);
  const bend = Math.round(CLAW.prongH * 0.55);

  for (let i = 0; i < bend; i++) {
    const t = i / Math.max(1, bend - 1);
    const x = Math.round(cx + dir * (2 + (span - 2) * t));
    ctx.fillStyle = C.metal;
    ctx.fillRect(x, topY + i, 2, 1);
    ctx.fillStyle = C.metalDark;
    ctx.fillRect(x + (dir > 0 ? 2 : -1), topY + i, 1, 1);
  }
  const tipX = Math.round(cx + dir * span);
  fill(ctx, { x: tipX - (dir > 0 ? 0 : 1), y: topY + bend, w: 2, h: CLAW.prongH - bend }, C.metalLo);
  fill(ctx, { x: tipX - (dir > 0 ? 0 : 1), y: topY + CLAW.prongH - 2, w: 2, h: 2 }, C.railHi);
}

/** Jauge de prise : le joueur VOIT la peluche lui echapper. */
export function drawGripMeter(ctx: CanvasRenderingContext2D, machine: Machine): void {
  if (!machine.held) return;
  const remaining = 1 - machine.slip;
  if (remaining >= 0.999) return;

  const w = 22;
  const x = Math.round(machine.clawX - w / 2);
  const y = Math.round(machine.clawY - 9);
  fill(ctx, { x: x - 1, y: y - 1, w: w + 2, h: 5 }, C.inkDark);
  fill(ctx, { x, y, w, h: 3 }, C.floorDark);
  const color = remaining > 0.6 ? C.good : remaining > 0.3 ? C.warn : C.bad;
  fill(ctx, { x, y, w: Math.max(1, Math.round(w * remaining)), h: 3 }, color);

  // "!" clignotant quand ca part vraiment mal.
  if (remaining < 0.45 && Math.floor(performance.now() / 120) % 2 === 0) {
    drawText(ctx, '!', machine.clawX + w / 2 + 4, y - 2, C.bad, { outline: C.inkDark });
  }
}

/** Rectangles de debug : boites de collision, zone de prise, rebord. */
export function drawDebug(ctx: CanvasRenderingContext2D, machine: Machine): void {
  ctx.save();
  ctx.globalAlpha = 0.85;
  for (const body of machine.bodies) {
    box(ctx, { x: body.x, y: body.y, w: body.w, h: body.h }, body.asleep ? C.rare : C.good);
  }
  box(ctx, machine.grabZone(), C.warn);
  box(ctx, machine.headRect(), C.bad);
  box(ctx, CHUTE_LIP, C.legendary);
  vline(ctx, machine.clawX, PLAY.top, PLAY.bottom - PLAY.top, C.bad);
  ctx.restore();
}
