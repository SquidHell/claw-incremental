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
  private offsetX = 0;
  private offsetY = 0;

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

    const rect = this.canvas.getBoundingClientRect();
    this.offsetX = rect.left;
    this.offsetY = rect.top;

    this.ctx.imageSmoothingEnabled = false;
  };

  /** Coordonnees ecran -> coordonnees virtuelles. */
  toVirtual = (clientX: number, clientY: number): { x: number; y: number } => {
    // Le rect peut bouger (clavier virtuel, barre d'URL mobile) : on relit.
    const rect = this.canvas.getBoundingClientRect();
    this.offsetX = rect.left;
    this.offsetY = rect.top;
    return {
      x: (clientX - this.offsetX) / this.scale,
      y: (clientY - this.offsetY) / this.scale,
    };
  };

  /** Taille en pixels CSS d'un pixel virtuel : sert a verifier les cibles tactiles. */
  get cssPixelsPerVirtual(): number {
    return this.scale;
  }
}
