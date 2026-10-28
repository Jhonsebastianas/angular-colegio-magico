import { AfterViewInit, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';

// ============================================================================
// ✨ CAPA MÁGICA (solo visual, no toca la lógica del juego)
// ----------------------------------------------------------------------------
//  1. Cielo de estrellas planas que titilan + dos estrellas fugaces (CSS puro).
//  2. Estela de varita: el cursor deja polvo de estrellas; al hacer clic
//     (o tocar la pantalla) explota un puñado de ellas.
// Todo con colores planos del DESIGN.md: sin sombras ni degradados.
// ============================================================================

interface Estrella {
  id: number;
  x: number; // % desde la izquierda
  y: number; // % desde arriba
  tam: number; // px
  color: string;
  retraso: number; // s
  duracion: number; // s
  cruz: boolean; // true = estrella de 4 puntas, false = puntito
}

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number; // ms vividos
  max: number; // ms totales
  tam: number;
  rot: number;
  vrot: number;
  color: string;
  cruz: boolean;
}

const COLORES = ['#fdf9f0', '#c7ff69', '#ccccff', '#ffc412'];

@Component({
  selector: 'app-magia-visual',
  standalone: true,
  template: `
    <div class="cielo" aria-hidden="true">
      @for (e of estrellas; track e.id) {
        <span
          class="estrella"
          [class.cruz]="e.cruz"
          [style.left.%]="e.x"
          [style.top.%]="e.y"
          [style.width.px]="e.tam"
          [style.height.px]="e.tam"
          [style.background]="e.color"
          [style.animation-delay.s]="e.retraso"
          [style.animation-duration.s]="e.duracion"
        ></span>
      }
      <span class="fugaz f1"></span>
      <span class="fugaz f2"></span>
    </div>
    <canvas #estela class="estela" aria-hidden="true"></canvas>
  `,
  styles: `
    /* Sin z-index a propósito: así el canvas fijo puede quedar por encima de todo */
    :host {
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: none;
      overflow: hidden;
    }

    .cielo { position: absolute; inset: 0; }

    .estrella {
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
      animation: titilar-estrella 3s ease-in-out infinite;
    }

    /* Estrella de 4 puntas con clip-path (forma plana, sin imágenes) */
    .estrella.cruz {
      border-radius: 0;
      clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
      animation-name: titilar-cruz;
    }

    .fugaz {
      position: absolute;
      width: 130px;
      height: 3px;
      border-radius: 1000px;
      background: #fdf9f0;
      opacity: 0;
      transform: rotate(32deg);
      animation: fugaz 11s linear infinite;
    }
    .f1 { top: 6%; left: 8%; animation-delay: 2s; }
    .f2 { top: 34%; left: 52%; animation-delay: 8s; animation-duration: 14s; background: #c7ff69; }

    .estela {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
    }

    @keyframes titilar-estrella {
      0%, 100% { opacity: 0.15; transform: scale(0.7); }
      50% { opacity: 0.95; transform: scale(1.15); }
    }
    @keyframes titilar-cruz {
      0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.1) rotate(45deg); }
    }
    @keyframes fugaz {
      0% { opacity: 0; transform: rotate(32deg) translateX(0); }
      2% { opacity: 1; }
      7% { opacity: 0; transform: rotate(32deg) translateX(520px); }
      100% { opacity: 0; transform: rotate(32deg) translateX(520px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .estrella { animation: none; opacity: 0.55; }
      .fugaz { display: none; }
    }
  `
})
export class MagiaVisualComponent implements AfterViewInit, OnDestroy {
  readonly estrellas: Estrella[] = this.crearEstrellas(90);

  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('estela');

  private ctx: CanvasRenderingContext2D | null = null;
  private particulas: Particula[] = [];
  private rafId = 0;
  private ultimoFrame = 0;
  private ultimoX = -999;
  private ultimoY = -999;
  private ancho = 0;
  private alto = 0;
  private dpr = 1;
  private reducirMovimiento = false;

  // ---------------------------------------------------------------------------
  // Ciclo de vida
  // ---------------------------------------------------------------------------
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ctx = this.lienzo().nativeElement.getContext('2d');
    if (!this.ctx || this.reducirMovimiento) return;

    this.ajustarTamano();
    window.addEventListener('resize', this.alRedimensionar);
    window.addEventListener('pointermove', this.alMover, { passive: true });
    window.addEventListener('pointerdown', this.alPulsar, { passive: true });
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this.alRedimensionar);
    window.removeEventListener('pointermove', this.alMover);
    window.removeEventListener('pointerdown', this.alPulsar);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.particulas = [];
  }

  // ---------------------------------------------------------------------------
  // Eventos (funciones flecha para poder quitarlas en ngOnDestroy)
  // ---------------------------------------------------------------------------
  private alRedimensionar = (): void => this.ajustarTamano();

  private alMover = (e: PointerEvent): void => {
    if (e.pointerType === 'touch') return; // en móvil solo hay explosión al tocar
    const dx = e.clientX - this.ultimoX;
    const dy = e.clientY - this.ultimoY;
    if (dx * dx + dy * dy < 49) return; // menos de 7px: no hace falta soltar polvo
    this.ultimoX = e.clientX;
    this.ultimoY = e.clientY;

    const cantidad = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < cantidad; i++) {
      this.agregar({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.06,
        vy: 0.02 + Math.random() * 0.08,
        max: 600 + Math.random() * 500,
        tam: 3 + Math.random() * 6
      });
    }
    this.arrancar();
  };

  private alPulsar = (e: PointerEvent): void => {
    for (let i = 0; i < 16; i++) {
      const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const vel = 0.08 + Math.random() * 0.18;
      this.agregar({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel,
        max: 700 + Math.random() * 600,
        tam: 4 + Math.random() * 8
      });
    }
    this.arrancar();
  };

  // ---------------------------------------------------------------------------
  // Partículas
  // ---------------------------------------------------------------------------
  private agregar(p: Pick<Particula, 'x' | 'y' | 'vx' | 'vy' | 'max' | 'tam'>): void {
    if (this.particulas.length > 180) this.particulas.shift();
    this.particulas.push({
      ...p,
      vida: 0,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.008,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
      cruz: Math.random() < 0.65
    });
  }

  // El bucle solo corre mientras haya partículas (no gasta CPU en reposo)
  private arrancar(): void {
    if (this.rafId) return;
    this.ultimoFrame = performance.now();
    this.rafId = requestAnimationFrame(this.bucle);
  }

  private bucle = (ahora: number): void => {
    const ctx = this.ctx;
    if (!ctx) return;
    const dt = Math.min(48, ahora - this.ultimoFrame);
    this.ultimoFrame = ahora;

    ctx.clearRect(0, 0, this.ancho, this.alto);

    for (let i = this.particulas.length - 1; i >= 0; i--) {
      const p = this.particulas[i];
      p.vida += dt;
      if (p.vida >= p.max) {
        this.particulas.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.00012 * dt; // gravedad suavecita
      p.rot += p.vrot * dt;

      const t = p.vida / p.max;
      const r = p.tam * (1 - t * 0.7);
      ctx.save();
      ctx.globalAlpha = 1 - t * t;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.cruz) {
        const k = r * 0.28;
        ctx.moveTo(0, -r);
        ctx.lineTo(k, -k);
        ctx.lineTo(r, 0);
        ctx.lineTo(k, k);
        ctx.lineTo(0, r);
        ctx.lineTo(-k, k);
        ctx.lineTo(-r, 0);
        ctx.lineTo(-k, -k);
        ctx.closePath();
      } else {
        ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }

    this.rafId = this.particulas.length ? requestAnimationFrame(this.bucle) : 0;
  };

  private ajustarTamano(): void {
    const canvas = this.lienzo().nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    canvas.width = Math.round(this.ancho * this.dpr);
    canvas.height = Math.round(this.alto * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private crearEstrellas(n: number): Estrella[] {
    return Array.from({ length: n }, (_, i) => {
      const cruz = Math.random() < 0.4;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        tam: cruz ? 8 + Math.random() * 10 : 2 + Math.random() * 2.5,
        color: COLORES[Math.floor(Math.random() * 3)], // crema, lima o lila
        retraso: Math.random() * 4,
        duracion: 2.2 + Math.random() * 3,
        cruz
      };
    });
  }
}
