/**
 * Machine a etats de la pince + monde de jeu.
 *
 *   READY -> DESCEND -> SETTLE -> CLOSE -> ASCEND -> RETURN -> RELEASE -> PAYOUT -> READY
 *
 * READY est le seul etat qui accepte les entrees du joueur ; le bouton
 * DESCENDRE est grise partout ailleurs (l'input est bloque ET le joueur voit
 * pourquoi).
 */
import { approach, clamp, type Rect } from '../core/math.ts';
import { Rng } from '../core/rng.ts';
import { emit } from '../core/events.ts';
import { TUNING } from './tuning.ts';
import {
  CLAW,
  CLAW_BOTTOM_Y,
  CLAW_MAX_X,
  CLAW_MIN_X,
  CLAW_TOP_Y,
  CHUTE,
  FLOOR_Y,
  HOME_X,
  PLAY,
} from './cabinet.ts';
import { PRIZES, getPrize, type PrizeDef } from './prizes.ts';
import {
  bodyRect,
  centerX,
  createBody,
  pushBodies,
  step,
  wakeAll,
  type Body,
} from './physics.ts';
import { findGrab, isSecure, slipDelta } from './grab.ts';
import {
  addCoins,
  isNewPrize,
  recordPrize,
  saveState,
  type GameState,
} from './state.ts';

export type Phase =
  | 'ready'
  | 'descend'
  | 'settle'
  | 'close'
  | 'ascend'
  | 'return'
  | 'release'
  | 'payout';

export interface PayoutInfo {
  prize: PrizeDef;
  isNew: boolean;
  value: number;
}

export class Machine {
  phase: Phase = 'ready';
  bodies: Body[] = [];

  /** Centre de la pince. */
  clawX = HOME_X;
  clawY = CLAW_TOP_Y;
  clawVX = 0;
  /** 0 = pinces fermees, 1 = grandes ouvertes. */
  aperture = 1;

  held: Body | null = null;
  heldGrip = 0;
  /** 0 -> 1. A 1 la peluche s'echappe. */
  slip = 0;
  /** Tremblement de la prise, pour le rendu (0..1). */
  tension = 0;

  payout: PayoutInfo | null = null;
  /** Message ephemere affiche dans le bandeau (recharge de credits...). */
  toast: { text: string; time: number } | null = null;

  /** Balancement du cable, ressort amorti — pur feedback visuel. */
  sway = 0;
  private swayVel = 0;

  private timer = 0;
  private moveDir: -1 | 0 | 1 = 0;
  private droppedId = -1;
  private readonly rng: Rng;

  constructor(
    private readonly state: GameState,
    seed = state.seed,
  ) {
    this.rng = new Rng(seed);
    this.fillPile(TUNING.pileCount);
  }

  // --- entrees -----------------------------------------------------------

  setMove(dir: -1 | 0 | 1): void {
    if (this.phase !== 'ready') {
      this.moveDir = 0;
      return;
    }
    if (dir !== 0 && this.moveDir !== dir) emit('claw:move', { dir });
    this.moveDir = dir;
  }

  get canDrop(): boolean {
    return this.phase === 'ready';
  }

  requestDrop(): boolean {
    if (!this.canDrop) return false;
    if (this.state.credits < TUNING.playCost) this.refillCredits();
    this.state.credits -= TUNING.playCost;
    this.state.plays++;
    this.moveDir = 0;
    this.phase = 'descend';
    this.timer = 0;
    emit('run:start', { cost: TUNING.playCost });
    emit('claw:drop', {});
    return true;
  }

  dismissPayout(): void {
    if (this.phase !== 'payout') return;
    this.payout = null;
    this.phase = 'ready';
    this.aperture = 1;
    if (this.bodies.length < TUNING.refillBelow) {
      this.fillPile(TUNING.pileCount - this.bodies.length);
    }
  }

  // --- simulation --------------------------------------------------------

  update(dt: number): void {
    this.timer += dt;
    if (this.toast) {
      this.toast.time -= dt;
      if (this.toast.time <= 0) this.toast = null;
    }

    switch (this.phase) {
      case 'ready':
        this.updateReady(dt);
        break;
      case 'descend':
        this.updateDescend(dt);
        break;
      case 'settle':
        if (this.timer >= TUNING.settleTime) this.enter('close');
        break;
      case 'close':
        this.updateClose(dt);
        break;
      case 'ascend':
        this.updateAscend(dt);
        break;
      case 'return':
        this.updateReturn(dt);
        break;
      case 'release':
        this.updateRelease(dt);
        break;
      case 'payout':
        break;
    }

    this.updateSway(dt);
    this.followClaw();

    const res = step(this.bodies, dt);
    for (const body of res.collected) this.onCollected(body);
    if (res.impact) {
      emit('body:impact', { x: res.impact.x, y: res.impact.y, force: res.impact.force });
    }
  }

  private enter(phase: Phase): void {
    this.phase = phase;
    this.timer = 0;
  }

  private updateReady(dt: number): void {
    const target = this.moveDir * TUNING.moveSpeed;
    const rate = this.moveDir === 0 ? TUNING.moveDecel : TUNING.moveAccel;
    this.clawVX = approach(this.clawVX, target, rate * dt);

    const before = this.clawX;
    this.clawX = clamp(this.clawX + this.clawVX * dt, CLAW_MIN_X, CLAW_MAX_X);
    if (this.clawX === before && this.clawVX !== 0) this.clawVX = 0;

    this.aperture = approach(this.aperture, 1, dt / TUNING.openTime);
  }

  private updateDescend(dt: number): void {
    this.clawVX = approach(this.clawVX, 0, TUNING.moveDecel * dt);
    this.clawY += TUNING.descendSpeed * dt;

    pushBodies(this.bodies, this.headRect());

    const stopY = this.descendStopY();
    if (this.clawY >= stopY) {
      this.clawY = stopY;
      emit('claw:bottom', { x: this.clawX, y: this.tipY });
      this.enter('settle');
    }
  }

  /** Hauteur a laquelle la pince cesse de descendre (pile ou plancher). */
  private descendStopY(): number {
    const span = { left: this.clawX - CLAW.apertureOpen, right: this.clawX + CLAW.apertureOpen };
    let topY = FLOOR_Y;
    for (const body of this.bodies) {
      if (body.held) continue;
      if (body.x + body.w <= span.left || body.x >= span.right) continue;
      if (body.y < topY) topY = body.y;
    }
    // On s'enfonce de `biteDepth` dans la pile pour que les pinces enserrent
    // vraiment le haut de la peluche au lieu de l'effleurer.
    const tipTarget = Math.min(topY + TUNING.biteDepth, FLOOR_Y - 1);
    const y = tipTarget - CLAW.headH - CLAW.prongH;
    return Math.min(Math.max(y, CLAW_TOP_Y), CLAW_BOTTOM_Y);
  }

  private updateClose(dt: number): void {
    this.aperture = approach(this.aperture, 0, dt / TUNING.closeTime);
    if (this.aperture > 0) return;

    const candidate = findGrab(
      this.bodies,
      this.grabZone(),
      this.clawX,
      this.state.claw.power,
    );

    if (candidate) {
      this.held = candidate.body;
      this.held.held = true;
      this.held.vx = 0;
      this.held.vy = 0;
      this.heldGrip = candidate.grip;
      this.slip = 0;
      emit('grab:success', { prizeId: this.held.prizeId, grip: candidate.grip });
    } else {
      emit('grab:missed', {});
    }
    wakeAll(this.bodies);
    this.enter('ascend');
  }

  private updateAscend(dt: number): void {
    this.clawY -= TUNING.ascendSpeed * dt;
    pushBodies(this.bodies, this.headRect());
    this.applySlip(dt, 1);

    if (this.clawY <= CLAW_TOP_Y) {
      this.clawY = CLAW_TOP_Y;
      // Arret sec en haut de course : l'a-coup classique des vraies machines.
      this.slipImpulse(TUNING.returnJerk);
      this.swayVel += 40;
      this.enter('return');
    }
  }

  private updateReturn(dt: number): void {
    const dir = Math.sign(HOME_X - this.clawX);
    this.clawVX = dir * TUNING.returnSpeed;
    this.clawX += this.clawVX * dt;
    if (dir === 0 || Math.sign(HOME_X - this.clawX) !== dir) {
      this.clawX = HOME_X;
      this.clawVX = 0;
      this.enter('release');
      return;
    }
    this.applySlip(dt, 1.35);
  }

  private updateRelease(dt: number): void {
    this.aperture = approach(this.aperture, 1, dt / TUNING.openTime);
    if (this.aperture < 0.55) return;

    if (this.held) {
      this.dropHeld();
    } else if (this.timer > TUNING.openTime + 0.15) {
      // Rien a livrer : retour direct en jeu.
      this.enter('ready');
    }
  }

  // --- prise / glissement ------------------------------------------------

  private applySlip(dt: number, agitation: number): void {
    if (!this.held) return;
    const mass = this.held.mass;
    this.slip += slipDelta(this.heldGrip, mass, dt, agitation, this.rng);
    this.tension = isSecure(this.heldGrip, mass) ? 0 : clamp(this.slip, 0, 1);
    if (this.slip > 0.15) emit('grab:slipping', { progress: this.slip });
    if (this.slip >= 1) this.loseHeld();
  }

  private slipImpulse(amount: number): void {
    if (!this.held) return;
    if (isSecure(this.heldGrip, this.held.mass)) return;
    this.slip += amount;
    if (this.slip >= 1) this.loseHeld();
  }

  /** La peluche s'echappe en cours de route : elle retombe dans la vitrine. */
  private loseHeld(): void {
    const body = this.held;
    if (!body) return;
    this.held = null;
    this.slip = 0;
    this.tension = 0;
    body.held = false;
    body.vx = (this.rng.next() - 0.5) * 30;
    body.vy = 20;
    body.asleep = false;
    wakeAll(this.bodies);
    emit('grab:lost', { prizeId: body.prizeId });
  }

  /** Ouverture au-dessus du trou : la peluche part au payout. */
  private dropHeld(): void {
    const body = this.held;
    if (!body) return;
    this.held = null;
    this.slip = 0;
    this.tension = 0;
    body.held = false;
    body.vy = 30;
    body.vx = 0;
    this.droppedId = body.id;
  }

  private onCollected(body: Body): void {
    if (body.id !== this.droppedId) {
      // Une peluche perdue est tombee dans le trou toute seule : cadeau.
      this.award(body);
      return;
    }
    this.droppedId = -1;
    this.award(body);
  }

  private award(body: Body): void {
    const prize = getPrize(body.prizeId);
    const first = isNewPrize(this.state, prize.id);
    recordPrize(this.state, prize.id);
    addCoins(this.state, prize.value);
    this.payout = { prize, isNew: first, value: prize.value };
    this.phase = 'payout';
    this.timer = 0;
    emit('prize:won', {
      prizeId: prize.id,
      rarity: prize.rarity,
      value: prize.value,
      isNew: first,
    });
    saveState(this.state);
  }

  // --- pile --------------------------------------------------------------

  private fillPile(count: number): void {
    if (count <= 0) return;
    const minX = CHUTE.right + 2;
    for (let i = 0; i < count; i++) {
      const prize = this.rng.weighted(PRIZES, (p) => p.spawnWeight);
      const [w, h] = prize.size;
      const x = this.rng.range(minX, PLAY.right - w - 2);
      const y = this.rng.range(PLAY.top + 4, FLOOR_Y - h - 4) - i * 3;
      const body = createBody(prize.id, x, y, w, h, prize.mass, prize.grip);
      body.vx = (this.rng.next() - 0.5) * 20;
      this.bodies.push(body);
    }
    wakeAll(this.bodies);
    emit('pile:refilled', { count: this.bodies.length });
  }

  private refillCredits(): void {
    this.state.credits += TUNING.freePlayRefill;
    this.toast = { text: 'Partie offerte !', time: 2.2 };
  }

  /** La peluche tenue suit la pince. */
  private followClaw(): void {
    const body = this.held;
    if (!body) return;
    const shake = this.tension * 1.5;
    const jitter = shake > 0 ? (this.rng.next() - 0.5) * 2 * shake : 0;
    body.prevX = body.x;
    body.prevY = body.y;
    body.x = this.clawX - body.w / 2 + this.sway * 0.35 + jitter;
    body.y = this.tipY - body.h * 0.6;
    body.vx = 0;
    body.vy = 0;
  }

  /** Ressort amorti : le cable balance quand le chariot accelere ou stoppe. */
  private updateSway(dt: number): void {
    const drive = -this.clawVX * 0.05;
    const stiffness = 34;
    const damping = 5.2;
    this.swayVel += (drive - this.sway) * stiffness * dt;
    this.swayVel -= this.swayVel * damping * dt;
    this.sway += this.swayVel * dt;
    this.sway = clamp(this.sway, -4, 4);
  }

  // --- geometrie derivee -------------------------------------------------

  get tipY(): number {
    return this.clawY + CLAW.headH + CLAW.prongH;
  }

  /** Ecartement courant des pinces, en pixels depuis l'axe. */
  get halfSpan(): number {
    return CLAW.apertureClosed + (CLAW.apertureOpen - CLAW.apertureClosed) * this.aperture;
  }

  headRect(): Rect {
    return {
      x: this.clawX - CLAW.headW / 2,
      y: this.clawY,
      w: CLAW.headW,
      h: CLAW.headH,
    };
  }

  /** Zone entre les pinces : c'est elle qui decide de la prise. */
  grabZone(): Rect {
    const half = CLAW.apertureOpen;
    return {
      x: this.clawX - half,
      y: this.clawY + CLAW.headH,
      w: half * 2,
      h: CLAW.prongH,
    };
  }

  /** Debug uniquement. */
  debugBodies(): Rect[] {
    return this.bodies.map(bodyRect);
  }

  debugCenters(): number[] {
    return this.bodies.map(centerX);
  }
}
