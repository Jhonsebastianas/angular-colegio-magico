import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimuladorComponent } from './simulador/simulador.component';

// ---------- Tipos ----------
export type Elemento = 'fuego' | 'agua' | 'tierra' | 'viento';
export type ElementoHechizo = Elemento | 'luz';
export type EstadoDuelo = 'PREPARACION' | 'EN_CURSO' | 'FINALIZADO'; // RÚBRICA a) 3 estados
export type Turno = 'jugador' | 'defensa' | 'animando';
export type Lado = 'izq' | 'der';
export type TipoHechizo = 'Ataque' | 'Curacion';
type Mezcla = 'multiply' | 'screen' | 'normal';

export interface Hechizo {
  nombre: string;
  elemento: ElementoHechizo;
  tipo: TipoHechizo;
  poder: number; // Ataque: daño base. Curacion: % de vida que recupera
  costo: number;
  descripcion: string;
}

export interface Personaje {
  id: string;
  nombre: string;
  titulo: string;
  habilidad?: string;
  imagen: string;
  imagenMK0?: string;
  mezcla: Mezcla; // cómo se funde la imagen con el escenario
  mezclaMK0?: Mezcla;
  ajuste: 'cover' | 'contain';
  mira: 'izq' | 'der' | 'frente'; // hacia dónde mira la imagen original
  elementoPrincipal: Elemento;
  hpMax: number;
  manaMax: number;
  ataque: number; // multiplicador de daño (1 = 100)
  velocidad: number; // 1-100: decide quién actúa primero desde la ronda 2
  defensa: number; // % de daño que reduce
  critico: number; // % de probabilidad de golpe crítico (x1.5)
  regenMana: number; // maná que recupera por ronda
  hechizos: Hechizo[];
}

export interface Combatiente {
  datos: Personaje;
  hp: number;
  hpVisible: number; // lo que muestra la barra (va detrás de la lógica para sincronizar con la animación)
  hpMax: number;
  mana: number;
  manaVisible: number;
  manaMax: number;
  ataque: number;
  velocidad: number;
  defensa: number;
  critico: number;
  mk0: boolean;
  imagen: string;
  mezcla: Mezcla;
}

export interface Animacion {
  elemento: Elemento;
  lado: Lado;
  contra: Elemento | null;
  ranMa: boolean;
  dur: number; // segundos; menor = hechizo más rápido
}
export interface Corte { nombre: string; elemento: ElementoHechizo; lado: Lado; }
export interface Efecto { lado: Lado | 'centro'; elemento: ElementoHechizo; tipo: 'golpe' | 'choque' | 'ranma' | 'curacion'; }
export interface Flotante { texto: string; lado: Lado; tipo: 'danio' | 'critico' | 'curacion' | 'anulado'; }

// ---------- Datos ----------
// Regla de contrarresto: fuego ↔ agua, tierra ↔ viento
const OPUESTO: Record<Elemento, Elemento> = { fuego: 'agua', agua: 'fuego', tierra: 'viento', viento: 'tierra' };
const ICONOS: Record<ElementoHechizo, string> = { fuego: '🔥', agua: '💧', tierra: '🪨', viento: '🌪️', luz: '✨' };

const at = (nombre: string, elemento: Elemento, poder: number, descripcion: string, costo = Math.ceil(poder / 2)): Hechizo => ({
  nombre, elemento, tipo: 'Ataque', poder, costo, descripcion,
});
const cu = (nombre: string, poder: number, costo: number, descripcion: string): Hechizo => ({
  nombre, elemento: 'luz', tipo: 'Curacion', poder, costo, descripcion,
});

export const PERSONAJES: Personaje[] = [
  {
    id: 'rudeus', nombre: 'Rudeus', titulo: 'Mago de todos los elementos',
    habilidad: 'Ojo de la clarividencia: cada 3 rondas ve el ataque que lanzará el rival. Puede equiparse la armadura MK0.',
    imagen: 'rudeus.jpg', imagenMK0: 'rudeus-mk0.jpg', mezcla: 'screen', mezclaMK0: 'multiply', ajuste: 'cover', mira: 'frente',
    elementoPrincipal: 'tierra', hpMax: 110, manaMax: 120, ataque: 1.0, velocidad: 60, defensa: 8, critico: 12, regenMana: 12,
    hechizos: [
      at('Bala de roca', 'tierra', 12, 'Materializa una roca pequeña y la dispara contra el objetivo.'),
      at('Cañón de piedra', 'tierra', 24, 'Roca lanzada a gran velocidad; es su hechizo insignia.'),
      at('Llama del Éxodo', 'fuego', 34, 'Reúne una gran ola de llamas y la libera; explota al impactar.'),
      at('Cañón de agua', 'agua', 22, 'Lanza una gran concentración de agua a presión.'),
      at('Tornado', 'viento', 30, 'Crea un tornado capaz de arrasar una zona amplia.'),
      at('Explosión nuclear', 'fuego', 52, 'Magia única de Rudeus: una explosión muy poderosa.', 34),
      cu('X-Healing', 20, 14, 'Magia curativa intermedia que restaura huesos rotos.'),
    ],
  },
  {
    id: 'sylphy', nombre: 'Sylphy', titulo: 'Maga del viento y la sanación',
    imagen: 'sylphy.jpg', mezcla: 'multiply', ajuste: 'cover', mira: 'frente',
    elementoPrincipal: 'viento', hpMax: 90, manaMax: 105, ataque: 0.95, velocidad: 90, defensa: 4, critico: 18, regenMana: 12,
    hechizos: [
      at('Rebanada de viento', 'viento', 12, 'Lanza una ráfaga de viento cortante.'),
      at('Explosión sónica', 'viento', 22, 'Cuchilla de viento que corta y arroja lejos al objetivo.'),
      at('Impacto del tornado', 'viento', 30, 'Convierte el viento en un taladro giratorio que perfora.'),
      at('Flecha de agua', 'agua', 10, 'Un chorro de agua dirigido al objetivo.'),
      at('Bola de fuego', 'fuego', 12, 'Esfera de fuego lanzada contra el rival.'),
      at('Bala de roca', 'tierra', 12, 'Roca pequeña disparada contra el objetivo.'),
      cu('Sanación del brillo', 30, 24, 'Cierra heridas abiertas importantes.'),
    ],
  },
  {
    id: 'roxy', nombre: 'Roxy', titulo: 'Maga del agua con gran reserva de maná',
    imagen: 'roxy.jpg', mezcla: 'normal', ajuste: 'contain', mira: 'frente',
    elementoPrincipal: 'agua', hpMax: 95, manaMax: 130, ataque: 1.0, velocidad: 70, defensa: 6, critico: 10, regenMana: 16,
    hechizos: [
      at('Bola de agua', 'agua', 12, 'Masa de agua materializada y lanzada al rival.'),
      at('Lanza de hielo', 'agua', 24, 'Estaca de hielo que brota del suelo y empala al enemigo.'),
      at('Rebanada de llama', 'fuego', 16, 'Hoja de fuego que abrasa y corta.'),
      at('Lanzallamas', 'fuego', 22, 'Chorro de llamas que cubre una zona amplia.'),
      at('Pilar de tierra', 'tierra', 20, 'Invoca una roca sobre el objetivo y la deja caer.'),
      at('Ráfaga de viento', 'viento', 10, 'Libera una ráfaga de viento fuerte.'),
      cu('Cicatrización', 12, 6, 'Magia curativa elemental que cierra cortes menores.'),
    ],
  },
  {
    id: 'eris', nombre: 'Eris Greyrat', titulo: 'Espadachina de fuego: golpes duros y maná barato',
    imagen: 'eris.jpg', mezcla: 'multiply', ajuste: 'cover', mira: 'izq',
    elementoPrincipal: 'fuego', hpMax: 135, manaMax: 70, ataque: 1.2, velocidad: 85, defensa: 14, critico: 25, regenMana: 8,
    hechizos: [
      at('Tajo ardiente', 'fuego', 20, 'Un tajo de espada envuelto en llamas.', 8),
      at('Estocada llameante', 'fuego', 32, 'Una estocada tan rápida que deja una estela de fuego.', 13),
      at('Corte de viento', 'viento', 20, 'Un tajo tan veloz que corta el aire.', 8),
      at('Golpe sísmico', 'tierra', 24, 'Clava la espada en el suelo y rompe la tierra.', 10),
      at('Corte fluido', 'agua', 20, 'Un tajo continuo que rompe como una ola.', 8),
    ],
  },
  {
    id: 'orsted', nombre: 'Orsted', titulo: 'El más fuerte del duelo',
    habilidad: 'Ran Ma (Perturbar la magia): en las rondas pares anula el hechizo que recibe.',
    imagen: 'orsted.jpg', mezcla: 'multiply', ajuste: 'cover', mira: 'izq',
    elementoPrincipal: 'fuego', hpMax: 210, manaMax: 220, ataque: 1.2, velocidad: 80, defensa: 22, critico: 20, regenMana: 18,
    hechizos: [
      at('Llama del Éxodo', 'fuego', 36, 'Ola de llamas que explota al impactar.'),
      at('Sobreexposición', 'fuego', 44, 'Propaga las llamas al instante sobre una zona enorme.'),
      at('Cumulonimbo', 'agua', 36, 'Nubes de tormenta con lluvia torrencial y relámpagos.'),
      at('Tormenta violenta', 'viento', 36, 'Desata una fuerte ráfaga de viento sobre toda la zona.'),
      at('Erizo terrestre', 'tierra', 34, 'Púas de tierra brotan del suelo y empalan al enemigo.'),
    ],
  },
];

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule, SimuladorComponent], // RÚBRICA c) FormsModule para [(ngModel)]
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css',
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  readonly personajes = PERSONAJES;
  // Rutas de las imágenes. Se detectan solas en ngOnInit: src/assets (Angular 17) o public/ (Angular 18+)
  rutaImg = 'assets/personajes/';
  escenarioImg = 'assets/escenario/escenario-de-combate.jpeg';
  private readonly basesPosibles = ['assets/', ''];
  private readonly cdr = inject(ChangeDetectorRef);

  readonly estela = [0, 1, 2, 3, 4, 5];
  readonly chispas = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly copos = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 37) % 100, tam: 2 + (i % 4), dur: 7 + (i % 6) * 1.7, ret: -((i * 1.3) % 10),
  }));

  verSimulador = false; // alterna entre el duelo rápido y el simulador avanzado
  estadoDuelo: EstadoDuelo = 'PREPARACION';
  turno: Turno = 'jugador';

  // Enlazados con [(ngModel)]
  nombreJugador = 'Aprendiz';
  idJugador = 'rudeus';
  idRival = 'orsted';
  armaduraMK0 = false;

  jugador!: Combatiente;
  rival!: Combatiente;
  vencedor: Combatiente | null = null;
  ronda = 1;
  segundos = 0;
  ataqueRival: Hechizo | null = null;
  ojoActivo = false;
  hechizoVista: Hechizo | null = null;
  historialDuelo: string[] = [];

  // Estado visual
  intro = false;
  temblor = false;
  anim: Animacion | null = null;
  corte: Corte | null = null;
  efecto: Efecto | null = null;
  flotante: Flotante | null = null;

  private ordenRonda: Lado[] = ['izq', 'der'];
  private paso = 0;
  private reloj: ReturnType<typeof setInterval> | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];

  // RÚBRICA d) hook 1
  ngOnInit(): void {
    this.detectarRuta();
    this.reloj = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.segundos++;
        this.cdr.markForCheck();
      }
    }, 1000);
  }

  // RÚBRICA d) hook 2
  ngOnDestroy(): void {
    if (this.reloj !== null) {
      window.clearInterval(this.reloj);
      this.reloj = null;
    }
    this.limpiarTimers();
  }

  // ---------- Datos para la vista ----------
  get hechizosDuelo(): Hechizo[] {
    return (this.jugador ?? { datos: this.buscar(this.idJugador) }).datos.hechizos;
  }

  /** Salud en porcentaje (0-100). Cada mago tiene vida distinta, por eso se expresa en %. */
  get saludMago(): number {
    return this.jugador ? Math.floor((this.jugador.hp / this.jugador.hpMax) * 100) : 100;
  }

  get saludRival(): number {
    return this.rival ? Math.floor((this.rival.hp / this.rival.hpMax) * 100) : 100;
  }

  get previewJugador(): Personaje {
    return this.buscar(this.idJugador);
  }

  get combatientes(): { c: Combatiente; lado: Lado; nombre: string }[] {
    return [
      { c: this.jugador, lado: 'izq', nombre: this.nombre(this.jugador) },
      { c: this.rival, lado: 'der', nombre: this.nombre(this.rival) },
    ];
  }

  get hayOrsted(): boolean {
    return this.jugador?.datos.id === 'orsted' || this.rival?.datos.id === 'orsted';
  }

  img(archivo: string): string {
    return this.rutaImg + archivo;
  }

  imagenCarta(p: Personaje): string {
    return this.img(p.id === 'rudeus' && this.armaduraMK0 && p.imagenMK0 ? p.imagenMK0 : p.imagen);
  }

  icono(e: ElementoHechizo): string {
    return ICONOS[e];
  }

  opuesto(e: ElementoHechizo): ElementoHechizo {
    return e === 'luz' ? 'luz' : OPUESTO[e];
  }

  /** Un hechizo solo se contrarresta con el elemento opuesto. */
  esContra(ataque: ElementoHechizo, respuesta: ElementoHechizo): boolean {
    return ataque !== 'luz' && respuesta !== 'luz' && OPUESTO[ataque] === respuesta;
  }

  /** Voltea la imagen para que cada mago mire hacia su rival. */
  espeja(c: Combatiente, lado: Lado): boolean {
    return (c.datos.mira === 'izq' && lado === 'izq') || (c.datos.mira === 'der' && lado === 'der');
  }

  estadisticas(p: Personaje): { nombre: string; valor: number; pct: number }[] {
    const mk0 = p.id === 'rudeus' && this.armaduraMK0;
    const f = (valor: number, tope: number, nombre: string) => ({
      nombre, valor, pct: Math.min(100, (valor / tope) * 100),
    });
    return [
      f(Math.round(p.hpMax * (mk0 ? 1.3 : 1)), 250, 'Vida'),
      f(Math.round(p.manaMax * (mk0 ? 1.4 : 1)), 250, 'Maná'),
      f(Math.round(p.ataque * 100 * (mk0 ? 1.25 : 1)), 150, 'Ataque'),
      f(Math.round(p.velocidad * (mk0 ? 1.25 : 1)), 100, 'Velocidad'),
      f(p.defensa + (mk0 ? 10 : 0), 40, 'Defensa'),
      f(p.critico, 30, 'Crítico'),
    ];
  }

  puedeContrarrestar(hz: Hechizo): boolean {
    return (
      this.turno === 'defensa' &&
      this.ronda > 1 && // la ronda 1 es de apertura: no se contrarresta
      !this.intro &&
      this.ataqueRival !== null &&
      hz.tipo === 'Ataque' &&
      this.esContra(this.ataqueRival.elemento, hz.elemento) &&
      hz.costo <= this.jugador.mana
    );
  }

  claseProyectil(a: Animacion): string[] {
    const corto = a.contra !== null || a.ranMa;
    const dir = a.lado === 'izq' ? (corto ? 'ida-corta' : 'ida') : corto ? 'vuelta-corta' : 'vuelta';
    return ['proy-' + a.elemento, dir];
  }

  claseContra(a: Animacion): string[] {
    return ['proy-' + (a.contra ?? 'agua'), a.lado === 'izq' ? 'vuelta-corta' : 'ida-corta'];
  }

  // ---------- Flujo del duelo ----------
  iniciarDuelo(): void {
    this.limpiarTimers();
    this.jugador = this.crear(this.idJugador, this.idJugador === 'rudeus' && this.armaduraMK0);
    this.rival = this.crear(this.idRival, false);
    this.ronda = 1;
    this.segundos = 0;
    this.historialDuelo = [];
    this.vencedor = null;
    this.anim = this.corte = this.efecto = this.flotante = null;
    this.temblor = false;
    this.estadoDuelo = 'EN_CURSO';
    this.intro = true; // presentación estilo anime
    this.programar(() => (this.intro = false), 2900);
    this.log(`⚔️ ${this.nombre(this.jugador)} se enfrenta a ${this.rival.datos.nombre}.`);
    if (this.jugador.mk0) this.log('🛡️ Rudeus viste la armadura mágica MK0.');
    this.prepararRonda();
  }

  reiniciar(): void {
    this.limpiarTimers();
    this.intro = false;
    this.anim = this.corte = this.efecto = this.flotante = null;
    this.estadoDuelo = 'PREPARACION';
  }

  lanzarHechizo(hz: Hechizo): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turno !== 'jugador' || hz.costo > this.jugador.mana) return;
    this.jugador.mana -= hz.costo;
    this.jugador.manaVisible = this.jugador.mana;
    this.turno = 'animando';
    if (hz.tipo === 'Curacion') {
      this.log(`${this.nombre(this.jugador)} lanza ${hz.nombre} ✨.`);
      this.curar(this.jugador, 'izq', hz.poder, 0, `💚 ${hz.nombre}`, () => this.siguientePaso());
      return;
    }
    this.ejecutarAtaque(this.jugador, this.rival, 'izq', hz, this.contraIA(this.rival, hz), () => this.siguientePaso());
  }

  meditar(): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turno !== 'jugador') return;
    this.turno = 'animando';
    this.curar(this.jugador, 'izq', 10, 20, `🧘 ${this.nombre(this.jugador)} medita`, () => this.siguientePaso());
  }

  responder(contra: Hechizo | null): void {
    if (this.turno !== 'defensa' || !this.ataqueRival) return;
    if (contra) {
      if (!this.puedeContrarrestar(contra)) return;
      this.jugador.mana -= contra.costo;
      this.jugador.manaVisible = this.jugador.mana;
    }
    this.turno = 'animando';
    this.ejecutarAtaque(this.rival, this.jugador, 'der', this.ataqueRival, contra, () => this.siguientePaso());
  }

  // ---------- Lógica interna ----------
  private prepararRonda(): void {
    this.hechizoVista = null;
    const opciones = this.rival.datos.hechizos.filter((x) => x.tipo === 'Ataque' && x.costo <= this.rival.mana);
    this.ataqueRival = opciones.length ? opciones[Math.floor(Math.random() * opciones.length)] : null;
    // Ronda 1: empieza el jugador. Desde la 2, actúa primero el más veloz.
    this.ordenRonda = this.ronda === 1 || this.jugador.velocidad >= this.rival.velocidad ? ['izq', 'der'] : ['der', 'izq'];
    this.paso = 0;
    this.ojoActivo = this.jugador.datos.id === 'rudeus' && this.ronda % 3 === 0;
    this.log(`— Ronda ${this.ronda} —`);
    if (this.ojoActivo) {
      this.log(
        this.ataqueRival
          ? `👁️ Ojo de la clarividencia: ${this.rival.datos.nombre} lanzará ${this.ataqueRival.nombre} ${ICONOS[this.ataqueRival.elemento]}.`
          : `👁️ Ojo de la clarividencia: ${this.rival.datos.nombre} no tiene maná y meditará.`,
      );
    }
    if (this.hayOrsted && this.ronda % 2 === 0) this.log('🌀 Ran Ma de Orsted está activo esta ronda.');
    this.siguientePaso();
  }

  private siguientePaso(): void {
    if (this.paso >= 2) {
      this.cerrarRonda();
      return;
    }
    if (this.ordenRonda[this.paso++] === 'izq') this.turno = 'jugador';
    else this.faseRival();
  }

  private faseRival(): void {
    const a = this.ataqueRival;
    if (!a || a.costo > this.rival.mana) {
      this.turno = 'animando';
      this.curar(this.rival, 'der', 10, 20, `🧘 ${this.rival.datos.nombre} medita`, () => this.siguientePaso());
      return;
    }
    this.rival.mana -= a.costo;
    this.rival.manaVisible = this.rival.mana;
    this.turno = 'defensa';
    this.log(`${this.rival.datos.nombre} prepara ${a.nombre} (${ICONOS[a.elemento]}).`);
  }

  private cerrarRonda(): void {
    for (const c of [this.jugador, this.rival]) {
      c.mana = Math.min(c.manaMax, c.mana + c.datos.regenMana);
      c.manaVisible = c.mana;
    }
    this.ronda++;
    this.prepararRonda();
  }

  private ejecutarAtaque(atq: Combatiente, def: Combatiente, lado: Lado, hz: Hechizo, contra: Hechizo | null, siguiente: () => void): void {
    const elem = hz.elemento as Elemento;
    const ladoDef: Lado = lado === 'izq' ? 'der' : 'izq';
    const dur = Math.min(1.2, Math.max(0.6, 1.6 - atq.velocidad / 100)); // más velocidad = proyectil más rápido
    const ranMa = !contra && def.datos.id === 'orsted' && this.ronda % 2 === 0;
    let danio = 0;
    let critico = false;

    // La lógica se resuelve al instante; la animación solo la muestra después.
    if (!contra && !ranMa) {
      critico = Math.random() * 100 < atq.critico;
      const bruto = hz.poder * atq.ataque * (critico ? 1.5 : 1);
      danio = Math.max(1, Math.round(bruto * (1 - def.defensa / 100)));
      def.hp = Math.max(0, def.hp - danio);
    }

    this.log(`${this.nombre(atq)} lanza ${hz.nombre} (${ICONOS[elem]}).`);
    if (contra) this.log(`💥 ${this.nombre(def)} contrarresta con ${contra.nombre} (${ICONOS[contra.elemento]}).`);
    else if (ranMa) this.log('🌀 Ran Ma: Orsted anula el hechizo.');
    else this.log(`🎯 ${this.nombre(def)} recibe ${danio} de daño${critico ? ' (¡crítico!)' : ''}.`);

    this.corte = { nombre: hz.nombre, elemento: elem, lado };
    this.anim = { elemento: elem, lado, contra: contra ? (contra.elemento as Elemento) : null, ranMa, dur };

    this.programar(() => {
      this.anim = null;
      this.corte = null;
      this.efecto = { lado: contra || ranMa ? 'centro' : ladoDef, elemento: elem, tipo: contra ? 'choque' : ranMa ? 'ranma' : 'golpe' };
      this.temblor = !ranMa;
      if (contra) this.flotar('Contrarrestado', ladoDef, 'anulado');
      else if (ranMa) this.flotar('Ran Ma', ladoDef, 'anulado');
      else {
        def.hpVisible = def.hp;
        this.flotar('-' + danio, ladoDef, critico ? 'critico' : 'danio');
      }
      this.programar(() => {
        this.efecto = null;
        this.temblor = false;
      }, 750);
      this.programar(() => (def.hp <= 0 ? this.terminar(atq) : siguiente()), 1150);
    }, Math.round(dur * 1000));
  }

  private contraIA(def: Combatiente, atq: Hechizo): Hechizo | null {
    if (this.ronda === 1) return null; // ronda de apertura
    const reserva = this.ataqueRival?.costo ?? 0; // guarda maná para su propio ataque
    const opciones = def.datos.hechizos.filter(
      (x) => x.tipo === 'Ataque' && this.esContra(atq.elemento, x.elemento) && def.mana - x.costo >= reserva,
    );
    if (!opciones.length || Math.random() > 0.6) return null;
    const elegido = opciones[Math.floor(Math.random() * opciones.length)];
    def.mana -= elegido.costo;
    def.manaVisible = def.mana;
    return elegido;
  }

  private curar(c: Combatiente, lado: Lado, pct: number, mana: number, etiqueta: string, siguiente: () => void): void {
    const cura = Math.max(1, Math.round((c.hpMax * pct) / 100));
    c.hp = Math.min(c.hpMax, c.hp + cura);
    c.mana = Math.min(c.manaMax, c.mana + mana);
    c.manaVisible = c.mana;
    this.log(`${etiqueta} (+${cura} de vida).`);
    this.efecto = { lado, elemento: 'luz', tipo: 'curacion' };
    this.programar(() => {
      c.hpVisible = c.hp;
      this.flotar('+' + cura, lado, 'curacion');
    }, 450);
    this.programar(() => {
      this.efecto = null;
      siguiente();
    }, 1400);
  }

  private terminar(g: Combatiente): void {
    this.vencedor = g;
    this.estadoDuelo = 'FINALIZADO';
    this.log(`🏆 ${this.nombre(g)} gana el duelo.`);
  }

  private crear(id: string, mk0: boolean): Combatiente {
    const p = this.buscar(id);
    const hpMax = Math.round(p.hpMax * (mk0 ? 1.3 : 1));
    const manaMax = Math.round(p.manaMax * (mk0 ? 1.4 : 1));
    return {
      datos: p, hp: hpMax, hpVisible: hpMax, hpMax, mana: manaMax, manaVisible: manaMax, manaMax,
      ataque: p.ataque * (mk0 ? 1.25 : 1),
      velocidad: Math.round(p.velocidad * (mk0 ? 1.25 : 1)),
      defensa: p.defensa + (mk0 ? 10 : 0),
      critico: p.critico,
      mk0,
      imagen: mk0 && p.imagenMK0 ? p.imagenMK0 : p.imagen,
      mezcla: mk0 && p.mezclaMK0 ? p.mezclaMK0 : p.mezcla,
    };
  }

  private buscar(id: string): Personaje {
    return this.personajes.find((p) => p.id === id) ?? this.personajes[0];
  }

  private nombre(c: Combatiente): string {
    if (c === this.jugador) {
      const n = this.nombreJugador.trim();
      return n ? `${n} (${c.datos.nombre})` : c.datos.nombre;
    }
    return c.datos.nombre;
  }

  private flotar(texto: string, lado: Lado, tipo: Flotante['tipo']): void {
    this.flotante = { texto, lado, tipo };
    this.programar(() => (this.flotante = null), 1000);
  }

  private log(msg: string): void {
    this.historialDuelo.unshift(msg);
    if (this.historialDuelo.length > 50) this.historialDuelo.pop();
  }

  /** Ejecuta fn tras ms y avisa a Angular para que redibuje (necesario en apps sin zone.js). */
  private programar(fn: () => void, ms: number): void {
    this.timers.push(
      setTimeout(() => {
        fn();
        this.cdr.markForCheck();
      }, ms),
    );
  }

  /** Prueba cada carpeta posible hasta que carga el escenario y usa esa para todas las imágenes. */
  private detectarRuta(): void {
    if (typeof Image === 'undefined') return;
    const probar = (i: number): void => {
      if (i >= this.basesPosibles.length) return;
      const base = this.basesPosibles[i];
      const sonda = new Image();
      sonda.onload = () => {
        this.rutaImg = base + 'personajes/';
        this.escenarioImg = base + 'escenario/escenario-de-combate.jpeg';
        this.cdr.markForCheck();
      };
      sonda.onerror = () => probar(i + 1);
      sonda.src = base + 'escenario/escenario-de-combate.jpeg';
    };
    probar(0);
  }

  private limpiarTimers(): void {
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
  }
}