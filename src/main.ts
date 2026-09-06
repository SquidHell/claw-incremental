/**
 * Point d'entree : cable l'ecran, les entrees, la machine, les FX et l'audio,
 * puis lance la boucle a pas fixe.
 */
import { Screen, VIRTUAL_H, VIRTUAL_W } from './render/canvas.ts';
import { Input } from './core/input.ts';
import { startLoop } from './core/loop.ts';
import { on } from './core/events.ts';
import { haptic, setHapticsEnabled } from './core/haptics.ts';
import { Machine, type Phase } from './game/machine.ts';
import { loadState, saveState } from './game/state.ts';
import { BTN_DROP, BTN_LEFT, BTN_RIGHT, MARQUEE } from './game/cabinet.ts';
import { RARITY_COLOR, C } from './render/palette.ts';
import { Fx } from './render/fx.ts';
import {
  drawBackground,
  drawBase,
  drawCabinet,
  drawClaw,
  drawDebug,
  drawGripMeter,
  drawMarquee,
  drawPlushies,
} from './render/scene.ts';
import {
  buildSprites,
  drawControls,
  drawDebugPanel,
  drawHint,
  drawHud,
  drawPanel,
  drawPayout,
} from './render/ui.ts';
import { setAudioEnabled, sfx, startMotor, stopMotor, unlockAudio } from './audio/sfx.ts';
import { pointInRect } from './core/math.ts';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) throw new Error('Canvas #screen introuvable');

const screen = new Screen(canvas);
const ctx = screen.ctx;
const input = new Input(canvas, screen.toVirtual);
const sprites = buildSprites();
const state = loadState();
const machine = new Machine(state);
const fx = new Fx();

setHapticsEnabled(state.settings.haptics);
setAudioEnabled(state.settings.audio);

input.register({ id: 'left', rect: BTN_LEFT, keys: ['ArrowLeft', 'KeyA', 'KeyQ'] });
input.register({ id: 'right', rect: BTN_RIGHT, keys: ['ArrowRight', 'KeyD'] });
input.register({ id: 'drop', rect: BTN_DROP, keys: ['Space', 'ArrowDown', 'KeyS'] });

let debug = false;
let dismissKey = false;
let marqueeTaps = 0;
let marqueeTapTime = 0;
let time = 0;
let fps = 0;
let fpsAcc = 0;
let fpsFrames = 0;
let prevPhase: Phase = machine.phase;

// --- reactions aux evenements de jeu (son, vibration, particules) --------

on('claw:move', () => sfx.click());

on('claw:drop', () => {
  sfx.clickLow();
  sfx.servo();
  haptic.tap();
});

on('claw:bottom', ({ x, y }) => {
  sfx.clunk();
  fx.dust(x, y);
  fx.addShake(1.5);
  haptic.thunk();
});

on('body:impact', ({ x, y, force }) => {
  sfx.thud();
  fx.dust(x, y);
  if (force > 190) fx.addShake(1);
});

on('grab:success', () => sfx.grip());
on('grab:missed', () => sfx.fail());

on('grab:lost', () => {
  sfx.slip();
  haptic.fail();
  fx.floatText(machine.clawX, machine.clawY + 4, 'RATE', C.bad);
  fx.addShake(1.2);
});

on('prize:won', ({ rarity, isNew }) => {
  const color = RARITY_COLOR[rarity] ?? C.ink;
  const rare = rarity === 'rare' || rarity === 'legendary';
  if (rare) {
    sfx.jackpot();
    fx.confetti(VIRTUAL_W / 2, 120, [color, C.ink, C.trim]);
    fx.addFlash(color, 0.9);
    fx.addShake(2.5);
  } else {
    sfx.win();
    fx.confetti(VIRTUAL_W / 2, 130, [color, C.ink]);
    fx.addFlash(C.ink, 0.5);
  }
  if (isNew) fx.addFlash(color, 1);
  haptic.win();
});

on('coins:changed', ({ delta }) => {
  if (delta <= 0) return;
  sfx.coin();
  fx.floatText(VIRTUAL_W / 2, 100, `+${delta}`, C.trim);
});

// --- entrees additionnelles ---------------------------------------------

window.addEventListener('keydown', (ev) => {
  if (ev.code === 'F3' || ev.code === 'Backquote') {
    debug = !debug;
    ev.preventDefault();
  }
  if (ev.code === 'Enter' || ev.code === 'Space') dismissKey = true;
});

// --- simulation ----------------------------------------------------------

function update(dt: number): void {
  time += dt;
  input.update(dt);

  const left = input.get('left');
  const right = input.get('right');
  const drop = input.get('drop');

  if (input.anyPress) unlockAudio();

  // Le bouton DESCENDRE n'est actif qu'en phase READY : l'entree est bloquee
  // ET le joueur voit pourquoi (capuchon grise + LED WAIT).
  input.setDisabled('drop', !machine.canDrop);
  input.setDisabled('left', !machine.canDrop);
  input.setDisabled('right', !machine.canDrop);

  if (machine.phase === 'payout') {
    const tapped = input.tap !== null || dismissKey;
    if (tapped) {
      machine.dismissPayout();
      sfx.click();
      saveState(state);
    }
  } else if (input.tap) {
    // Triple tap sur l'enseigne : overlay de debug, sans clavier.
    const now = time;
    if (pointInRect(input.tap.x, input.tap.y, MARQUEE)) {
      if (now - marqueeTapTime > 1.2) marqueeTaps = 0;
      marqueeTapTime = now;
      marqueeTaps++;
      if (marqueeTaps >= 3) {
        debug = !debug;
        marqueeTaps = 0;
      }
    } else {
      marqueeTaps = 0;
    }
  }
  dismissKey = false;

  const dir: -1 | 0 | 1 = left.down === right.down ? 0 : left.down ? -1 : 1;
  machine.setMove(dir);
  if (drop.pressed) machine.requestDrop();

  machine.update(dt);
  fx.update(dt);

  // Ronflement moteur tant que le chariot bouge vraiment.
  if (machine.phase === 'ready' && Math.abs(machine.clawVX) > 3) startMotor();
  else stopMotor();

  if (machine.phase !== prevPhase) {
    if (machine.phase === 'ascend') sfx.whine();
    prevPhase = machine.phase;
  }

  input.endFrame();
}

// --- rendu ---------------------------------------------------------------

function render(alpha: number): void {
  fpsFrames++;
  const nowSec = performance.now() / 1000;
  if (nowSec - fpsAcc >= 0.5) {
    fps = Math.round(fpsFrames / (nowSec - fpsAcc));
    fpsAcc = nowSec;
    fpsFrames = 0;
  }

  ctx.imageSmoothingEnabled = false;
  drawBackground(ctx, time);

  const shake = fx.shakeOffset;
  ctx.save();
  ctx.translate(shake.x, shake.y);

  drawMarquee(ctx, time);
  drawCabinet(ctx, time);
  drawPlushies(ctx, machine, sprites, alpha);
  drawClaw(ctx, machine);
  drawGripMeter(ctx, machine);
  drawBase(ctx);
  fx.draw(ctx);
  if (debug) drawDebug(ctx, machine);

  ctx.restore();

  drawHud(ctx, sprites, state);
  drawPanel(ctx);
  drawHint(ctx, machine);
  drawControls(ctx, sprites, input.get('left'), input.get('drop'), input.get('right'));
  drawPayout(ctx, sprites, machine, time);

  if (debug) {
    drawDebugPanel(ctx, [
      `FPS ${fps}`,
      `PHASE ${machine.phase}`,
      `BODIES ${machine.bodies.length}`,
      `SLEEP ${machine.bodies.filter((b) => b.asleep).length}`,
      `GRIP ${machine.heldGrip.toFixed(2)}`,
      `SLIP ${machine.slip.toFixed(2)}`,
      `SCALE X${screen.scale}`,
      `SEED ${state.seed}`,
    ]);
  }

  fx.drawFlash(ctx, VIRTUAL_W, VIRTUAL_H);
}

// --- cycle de vie --------------------------------------------------------

startLoop({ update, render });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopMotor();
    saveState(state);
  }
});
window.addEventListener('pagehide', () => saveState(state));

// Poignee de debug utilisee par le test de fumee Playwright.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__claw = {
    machine,
    state,
    screen,
    input,
    toggleDebug: () => (debug = !debug),
  };
}
