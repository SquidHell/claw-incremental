/**
 * Boucle a pas de temps fixe avec accumulateur. La simulation avance toujours
 * par pas de 1/60 s quelle que soit la frequence de l'ecran (60, 90, 120 Hz),
 * donc la physique est deterministe ; le rendu recoit un `alpha` pour
 * interpoler entre les deux derniers etats.
 */
export const FIXED_DT = 1 / 60;
const MAX_FRAME = 0.25; // anti "spirale de la mort" apres un onglet en arriere-plan

export interface LoopHandlers {
  update: (dt: number) => void;
  render: (alpha: number) => void;
}

export function startLoop({ update, render }: LoopHandlers): () => void {
  let last = performance.now();
  let acc = 0;
  let raf = 0;
  let running = true;

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    let elapsed = (now - last) / 1000;
    last = now;
    if (elapsed > MAX_FRAME) elapsed = MAX_FRAME;
    acc += elapsed;

    let steps = 0;
    while (acc >= FIXED_DT && steps < 8) {
      update(FIXED_DT);
      acc -= FIXED_DT;
      steps++;
    }
    render(acc / FIXED_DT);
  };

  raf = requestAnimationFrame(frame);

  // Repartir proprement au retour d'arriere-plan plutot que de rattraper 10 s.
  const onVisibility = () => {
    if (!document.hidden) {
      last = performance.now();
      acc = 0;
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
