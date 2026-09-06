/**
 * Etat de jeu persistant.
 *
 * HOOK INCREMENTAL : c'est volontairement un objet plat et serialisable, sans
 * classe ni reference circulaire. Ajouter `upgrades`, `prestige` ou `quests`
 * ici suffira — la sauvegarde suit toute seule, et `migrate()` gere les
 * anciennes sauvegardes.
 */
import { TUNING } from './tuning.ts';
import { emit } from '../core/events.ts';

const SAVE_KEY = 'claw-incremental:v1';
const SAVE_VERSION = 1;

export interface GameState {
  version: number;
  seed: number;
  credits: number;
  coins: number;
  plays: number;
  wins: number;
  /** id de peluche -> nombre obtenu. Pilote le tampon "NEW!". */
  collection: Record<string, number>;
  /** Lu par grab.ts a chaque prise : une upgrade n'aura qu'a monter ce nombre. */
  claw: { power: number };
  settings: { haptics: boolean; audio: boolean };
}

export function createInitialState(seed = (Math.random() * 2 ** 32) >>> 0): GameState {
  return {
    version: SAVE_VERSION,
    seed: seed >>> 0,
    credits: TUNING.startingCredits,
    coins: 0,
    plays: 0,
    wins: 0,
    collection: {},
    claw: { power: TUNING.clawPower },
    settings: { haptics: true, audio: true },
  };
}

export function addCoins(state: GameState, delta: number): void {
  state.coins += delta;
  emit('coins:changed', { coins: state.coins, delta });
}

/** Premiere fois qu'on obtient cette peluche ? (a appeler AVANT recordPrize) */
export const isNewPrize = (state: GameState, prizeId: string): boolean =>
  (state.collection[prizeId] ?? 0) === 0;

export function recordPrize(state: GameState, prizeId: string): void {
  state.collection[prizeId] = (state.collection[prizeId] ?? 0) + 1;
  state.wins++;
}

export const collectionSize = (state: GameState): number =>
  Object.keys(state.collection).length;

// --- persistance -------------------------------------------------------

export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

function migrate(raw: Partial<GameState>): GameState {
  const base = createInitialState(raw.seed);
  return {
    ...base,
    ...raw,
    version: SAVE_VERSION,
    collection: { ...raw.collection },
    claw: { ...base.claw, ...raw.claw },
    settings: { ...base.settings, ...raw.settings },
  };
}

export function deserialize(text: string): GameState | null {
  try {
    const raw = JSON.parse(text) as Partial<GameState>;
    if (typeof raw !== 'object' || raw === null) return null;
    return migrate(raw);
  } catch {
    return null;
  }
}

export function loadState(): GameState {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (text) {
      const state = deserialize(text);
      if (state) return state;
    }
  } catch {
    /* mode navigation privee, stockage bloque : on joue sans sauvegarde */
  }
  return createInitialState();
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state));
  } catch {
    /* idem */
  }
}

export function resetState(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* idem */
  }
}
