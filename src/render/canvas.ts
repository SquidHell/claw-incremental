/**
 * Ecran virtuel a resolution fixe, mis a l'echelle par un facteur ENTIER.
 * C'est la seule facon d'obtenir du pixel art net : jamais de 1.37x.
 * Tout le jeu raisonne en pixels virtuels ; seul ce module connait le DOM.
 */
export const VIRTUAL_W = 180;
export const VIRTUAL_H = 320;

export class Screen {
  readonly ctx: CanvasRenderingContext2D;
  scale = 1;

  constructor(readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D indisponible');
    this.ctx = ctx;
    canvas.width = VIRTUAL_W;
    canvas.height = VIRTUAL_H;
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationchange', this.resize);
  }

  resize = (): void => {
    const stage = this.canvas.parentElement ?? document.body;
    const availW = stage.clientWidth || window.innerWidth;
    const availH = stage.clientHeight || window.innerHeight;

    // Facteur entier, mais jamais 0 sur un tres petit ecran.
    const scale = Math.max(1, Math.floor(Math.min(availW / VIRTUAL_W, availH / VIRTUAL_H)));
    this.scale = scale;

    const cssW = VIRTUAL_W * scale;
    const cssH = VIRTUAL_H * scale;
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;

    this.ctx.imageSmoothingEnabled = false;
  };

  /**
   * Coordonnees ecran -> coordonnees virtuelles.
   *
   * Le facteur est deduit du rectangle REELLEMENT rendu, jamais de `this.scale`.
   * `getBoundingClientRect()` tient compte des transformations CSS de la page
   * hote : diviser par le facteur entier alors qu'un `transform: scale()` est
   * applique decale toutes les touches, de plus en plus loin du coin haut-gauche.
   * C'est ce qui rendait les boutons injouables des que la page reduisait la
   * borne pour la faire tenir sur un telephone.
   */
  toVirtual = (clientX: number, clientY: number): { x: number; y: number } => {
    // Le rect peut bouger (clavier virtuel, barre d'URL mobile) : on relit.
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: -1, y: -1 };
    return {
      x: (clientX - rect.left) * (VIRTUAL_W / rect.width),
      y: (clientY - rect.top) * (VIRTUAL_H / rect.height),
    };
  };

  /** Taille en pixels CSS d'un pixel virtuel : sert a verifier les cibles tactiles. */
  get cssPixelsPerVirtual(): number {
    return this.scale;
  }
}
