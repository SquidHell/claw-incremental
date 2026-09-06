/**
 * Bus d'evenements type. C'est le point d'accroche de la future couche
 * incrementale : le HUD, l'audio et les FX s'y abonnent aujourd'hui, des
 * upgrades / quetes / prestige pourront s'y brancher sans toucher au coeur.
 */
import type { Rarity } from '../game/prizes.ts';

export interface GameEvents {
  'run:start': { cost: number };
  'claw:move': { dir: -1 | 1 };
  'claw:drop': Record<string, never>;
  'claw:bottom': { x: number; y: number };
  'body:impact': { x: number; y: number; force: number };
  'grab:success': { prizeId: string; grip: number };
  'grab:missed': Record<string, never>;
  'grab:slipping': { progress: number };
  'grab:lost': { prizeId: string };
  'prize:won': { prizeId: string; rarity: Rarity; value: number; isNew: boolean };
  'coins:changed': { coins: number; delta: number };
  'pile:refilled': { count: number };
}

type Handler<K extends keyof GameEvents> = (payload: GameEvents[K]) => void;

const handlers = new Map<keyof GameEvents, Set<Handler<never>>>();

export function on<K extends keyof GameEvents>(type: K, fn: Handler<K>): () => void {
  let set = handlers.get(type);
  if (!set) {
    set = new Set();
    handlers.set(type, set);
  }
  set.add(fn as Handler<never>);
  return () => set!.delete(fn as Handler<never>);
}

export function emit<K extends keyof GameEvents>(type: K, payload: GameEvents[K]): void {
  const set = handlers.get(type);
  if (!set) return;
  for (const fn of set) (fn as Handler<K>)(payload);
}
