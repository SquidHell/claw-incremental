/**
 * Sons generes a la volee via WebAudio : aucun fichier asset, aucun chargement,
 * aucun risque de son manquant. Des bips carres/triangles suffisent largement a
 * l'esthetique borne d'arcade.
 *
 * L'AudioContext demarre suspendu sur mobile : `resume()` doit etre appele
 * depuis un vrai geste utilisateur (voir main.ts, sur le premier pointerdown).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let motor: { osc: OscillatorNode; gain: GainNode } | null = null;

function ensure(): AudioContext | null {
  if (!enabled) return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.32;
  master.connect(ctx.destination);
  return ctx;
}

/** A appeler depuis un geste utilisateur. Idempotent. */
export function unlockAudio(): void {
  const ac = ensure();
  if (ac && ac.state === 'suspended') void ac.resume();
}

export function setAudioEnabled(value: boolean): void {
  enabled = value;
  if (!value) {
    stopMotor();
    if (master) master.gain.value = 0;
  } else if (master) {
    master.gain.value = 0.32;
  }
}

export const audioEnabled = (): boolean => enabled;

interface ToneOptions {
  type?: OscillatorType;
  volume?: number;
  /** Glissando : frequence d'arrivee. */
  to?: number;
  delay?: number;
}

function tone(freq: number, dur: number, opts: ToneOptions = {}): void {
  const ac = ensure();
  if (!ac || !master) return;
  const t0 = ac.currentTime + (opts.delay ?? 0);
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = opts.type ?? 'square';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t0 + dur);

  const vol = opts.volume ?? 0.5;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(gain);
  gain.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, volume = 0.3, filterHz = 1400): void {
  const ac = ensure();
  if (!ac || !master) return;
  const frames = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterHz;
  const gain = ac.createGain();
  gain.gain.value = volume;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start();
}

/** Ronflement moteur maintenu pendant que le chariot se deplace. */
export function startMotor(): void {
  const ac = ensure();
  if (!ac || !master || motor) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 52;
  gain.gain.setValueAtTime(0.0001, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, ac.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  motor = { osc, gain };
}

export function stopMotor(): void {
  if (!motor || !ctx) return;
  const { osc, gain } = motor;
  motor = null;
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  osc.stop(t + 0.1);
}

export const sfx = {
  click: () => tone(660, 0.05, { type: 'square', volume: 0.35 }),
  clickLow: () => tone(320, 0.07, { type: 'square', volume: 0.4 }),
  coin: () => {
    tone(988, 0.06, { type: 'square', volume: 0.4 });
    tone(1319, 0.12, { type: 'square', volume: 0.35, delay: 0.06 });
  },
  servo: () => tone(180, 0.5, { type: 'sawtooth', volume: 0.14, to: 120 }),
  clunk: () => {
    noise(0.09, 0.35, 900);
    tone(90, 0.1, { type: 'square', volume: 0.3, to: 55 });
  },
  grip: () => tone(420, 0.09, { type: 'square', volume: 0.3, to: 300 }),
  whine: () => tone(240, 0.4, { type: 'triangle', volume: 0.14, to: 380 }),
  slip: () => tone(300, 0.1, { type: 'triangle', volume: 0.25, to: 180 }),
  fail: () => {
    tone(320, 0.12, { type: 'square', volume: 0.3 });
    tone(220, 0.2, { type: 'square', volume: 0.3, delay: 0.1 });
  },
  win: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => tone(n, 0.14, { type: 'square', volume: 0.34, delay: i * 0.075 }));
  },
  jackpot: () => {
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((n, i) => tone(n, 0.16, { type: 'square', volume: 0.36, delay: i * 0.07 }));
  },
  thud: () => noise(0.06, 0.22, 700),
};
