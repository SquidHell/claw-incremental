/**
 * Entrees tactiles / souris / clavier.
 *
 * Regles de qualite tactile appliquees ici :
 *  - multi-pointeurs : tenir GAUCHE et appuyer sur DESCENDRE simultanement marche ;
 *  - `setPointerCapture` : le doigt garde la main sur le canvas meme s'il sort ;
 *  - un pointeur possede le bouton sur lequel il a commence. S'il glisse hors de
 *    la zone le bouton se relache visuellement, et se re-enfonce s'il revient
 *    (comportement d'un bouton natif) — il ne peut pas "voler" un autre bouton ;
 *  - `pointerdown` declenche l'action, jamais `pointerup` : zero latence percue ;
 *  - miroir clavier qui passe par le meme chemin de code que le tactile.
 */
import { pointInRect, type Rect } from './math.ts';

export interface ButtonSpec {
  id: string;
  rect: Rect;
  keys?: string[];
}

export interface ButtonState {
  /** Le bouton est enfonce a cet instant. */
  down: boolean;
  /** Front montant sur la frame courante. */
  pressed: boolean;
  /** Front descendant sur la frame courante. */
  released: boolean;
  /** Secondes depuis l'enfoncement (0 si relache). */
  heldFor: number;
  /** 1 -> 0 sur ~150 ms apres l'appui : pilote le halo de feedback. */
  flash: number;
  /** Le bouton refuse les entrees (grise a l'ecran). */
  disabled: boolean;
}

interface PointerOwner {
  buttonId: string;
  inside: boolean;
}

export type VirtualPoint = { x: number; y: number };

/**
 * Le joueur est-il en train d'ecrire ? Le miroir clavier appelle
 * `preventDefault()` sur Espace et les fleches ; sans ce garde-fou, le jeu
 * volerait ces touches a n'importe quel champ de saisie de la page hote —
 * ce qui casse net un formulaire a cote du canvas (page de playtest, page de
 * documentation, iframe embarquee).
 */
export function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export class Input {
  readonly buttons = new Map<string, ButtonState>();
  private readonly specs = new Map<string, ButtonSpec>();
  private readonly owners = new Map<number, PointerOwner>();
  private readonly keyDown = new Set<string>();
  private readonly detach: Array<() => void> = [];

  /** Dernier point touche (coordonnees virtuelles), pour les taps hors bouton. */
  tap: VirtualPoint | null = null;
  /** Vrai le temps d'une frame apres n'importe quel contact : sert a reveiller l'audio. */
  anyPress = false;

  constructor(
    private readonly target: HTMLElement,
    private readonly toVirtual: (clientX: number, clientY: number) => VirtualPoint,
  ) {
    const add = <K extends keyof HTMLElementEventMap>(
      type: K,
      fn: (ev: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn as EventListener, opts);
      this.detach.push(() => target.removeEventListener(type, fn as EventListener));
    };

    add('pointerdown', this.onPointerDown, { passive: false });
    add('pointermove', this.onPointerMove, { passive: false });
    add('pointerup', this.onPointerUp);
    add('pointercancel', this.onPointerUp);
    // Le menu contextuel du appui-long mobile tuerait la sensation de bouton.
    add('contextmenu', (ev) => ev.preventDefault());

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.repeat || isTextEntry(ev.target)) return;
      const id = this.buttonForKey(ev.code);
      if (!id) return;
      ev.preventDefault();
      this.keyDown.add(ev.code);
      this.anyPress = true;
      this.setDown(id, true);
    };
    const onKeyUp = (ev: KeyboardEvent) => {
      if (isTextEntry(ev.target)) return;
      const id = this.buttonForKey(ev.code);
      if (!id) return;
      this.keyDown.delete(ev.code);
      if (!this.isHeld(id)) this.setDown(id, false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    this.detach.push(() => window.removeEventListener('keydown', onKeyDown));
    this.detach.push(() => window.removeEventListener('keyup', onKeyUp));
  }

  register(spec: ButtonSpec): void {
    this.specs.set(spec.id, spec);
    if (!this.buttons.has(spec.id)) {
      this.buttons.set(spec.id, {
        down: false,
        pressed: false,
        released: false,
        heldFor: 0,
        flash: 0,
        disabled: false,
      });
    }
  }

  /** Les rects sont recalcules a chaque resize : on met a jour sans perdre l'etat. */
  updateRect(id: string, rect: Rect): void {
    const spec = this.specs.get(id);
    if (spec) spec.rect = rect;
  }

  get(id: string): ButtonState {
    const state = this.buttons.get(id);
    if (!state) throw new Error(`Bouton inconnu: ${id}`);
    return state;
  }

  setDisabled(id: string, disabled: boolean): void {
    const state = this.get(id);
    if (disabled && state.down) this.setDown(id, false);
    state.disabled = disabled;
  }

  /** A appeler une fois par pas de simulation, AVANT de lire les etats. */
  update(dt: number): void {
    for (const state of this.buttons.values()) {
      state.heldFor = state.down ? state.heldFor + dt : 0;
      if (state.flash > 0) state.flash = Math.max(0, state.flash - dt / 0.15);
    }
  }

  /** A appeler une fois par pas de simulation, APRES avoir lu les etats. */
  endFrame(): void {
    for (const state of this.buttons.values()) {
      state.pressed = false;
      state.released = false;
    }
    this.tap = null;
    this.anyPress = false;
  }

  dispose(): void {
    for (const fn of this.detach) fn();
    this.detach.length = 0;
  }

  // --- interne ---------------------------------------------------------

  private buttonForKey(code: string): string | null {
    for (const spec of this.specs.values()) {
      if (spec.keys?.includes(code)) return spec.id;
    }
    return null;
  }

  /** Le bouton est-il maintenu par un pointeur ou une touche clavier ? */
  private isHeld(id: string): boolean {
    for (const owner of this.owners.values()) {
      if (owner.buttonId === id && owner.inside) return true;
    }
    const spec = this.specs.get(id);
    if (spec?.keys?.some((k) => this.keyDown.has(k))) return true;
    return false;
  }

  private setDown(id: string, down: boolean): void {
    const state = this.buttons.get(id);
    if (!state || state.down === down) return;
    if (down && state.disabled) return;
    state.down = down;
    if (down) {
      state.pressed = true;
      state.flash = 1;
      state.heldFor = 0;
    } else {
      state.released = true;
    }
  }

  private hitTest(p: VirtualPoint): ButtonSpec | null {
    for (const spec of this.specs.values()) {
      if (pointInRect(p.x, p.y, spec.rect)) return spec;
    }
    return null;
  }

  private onPointerDown = (ev: PointerEvent): void => {
    ev.preventDefault();
    this.target.setPointerCapture?.(ev.pointerId);
    this.anyPress = true;

    const p = this.toVirtual(ev.clientX, ev.clientY);
    const spec = this.hitTest(p);
    if (spec) {
      this.owners.set(ev.pointerId, { buttonId: spec.id, inside: true });
      this.setDown(spec.id, true);
    } else {
      // Tap "hors bouton" : sert a fermer la carte de recompense.
      this.tap = p;
    }
  };

  private onPointerMove = (ev: PointerEvent): void => {
    const owner = this.owners.get(ev.pointerId);
    if (!owner) return;
    ev.preventDefault();

    const spec = this.specs.get(owner.buttonId);
    if (!spec) return;
    const p = this.toVirtual(ev.clientX, ev.clientY);
    const inside = pointInRect(p.x, p.y, spec.rect);
    if (inside === owner.inside) return;

    owner.inside = inside;
    if (inside) this.setDown(spec.id, true);
    else if (!this.isHeld(spec.id)) this.setDown(spec.id, false);
  };

  private onPointerUp = (ev: PointerEvent): void => {
    const owner = this.owners.get(ev.pointerId);
    this.owners.delete(ev.pointerId);
    this.target.releasePointerCapture?.(ev.pointerId);
    if (owner && !this.isHeld(owner.buttonId)) this.setDown(owner.buttonId, false);
  };
}
