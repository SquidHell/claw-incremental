/** Vibration tactile, silencieusement ignoree la ou l'API n'existe pas. */
let enabled = true;

const canVibrate = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export const hapticsSupported = canVibrate;

export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

export function buzz(pattern: number | number[]): void {
  if (!enabled || !canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* certains navigateurs jettent si le geste utilisateur manque */
  }
}

export const haptic = {
  tap: () => buzz(10),
  thunk: () => buzz(22),
  win: () => buzz([18, 40, 18, 40, 40]),
  fail: () => buzz([40, 60, 40]),
};
