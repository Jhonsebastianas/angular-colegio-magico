import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FORCEJEO,
  ID_FORCEJEO,
  PORCENTAJE_RETROCESO,
  calcularGolpe,
  cantidadCura,
  crearCombatiente,
  elegirMovimientoCpu,
  opcionesTurno,
  statsTotal
} from './batalla';
import { PokeapiService } from './pokeapi.service';
import {
  GENERACIONES,
  POKEBOLA,
  POKEMON_RESPALDO,
  TIPOS,
  TIPO_INFO,
  efectividad,
  urlSprite
} from './pokemon-data';
import {
  Combatiente,
  EfectoFlotante,
  Lado,
  ModoJuego,
  Movimiento,
  PokemonDatos,
  PokemonResumen,
  Proyectil,
  RegistroTurno,
  TipoPokemon,
  TipoRegistro
} from './pokemon.models';

export type EstadoDuelo = 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA';

const PAUSA_TURNO_MS = 1300;
const PAUSA_CPU_MS = 750;
const MAX_REGISTROS = 60;

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  private readonly api = inject(PokeapiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly info = TIPO_INFO;
  readonly tipos = TIPOS;
  readonly generaciones = GENERACIONES;
  readonly tamanoPagina = 48;

  // --- Estados: PREPARACION (selección) -> EN_CURSO -> VICTORIA | DERROTA
  estadoDuelo: EstadoDuelo = 'PREPARACION';
  modo: ModoJuego = 'CPU';
  nombreJugador1 = 'Entrenador';
  nombreJugador2 = 'Rival';

  // --- Selección
  catalogo: PokemonResumen[] = [];
  cargandoCatalogo = true;
  sinConexion = false;
  busqueda = '';
  filtroTipo: TipoPokemon | '' = '';
  filtroGeneracion = 0;
  limiteVisible = this.tamanoPagina;
  cargandoTipo = false;
  previa: PokemonDatos | null = null;
  previaStats: { etiqueta: string; valor: number; pct: number }[] = [];
  cargandoPrevia = false;
  errorPrevia = '';
  seleccionActual: Lado = 1;
  cpuEligiendo = false;
  jugador1: Combatiente | null = null;
  jugador2: Combatiente | null = null;

  // --- Combate
  turno: Lado = 1;
  numeroTurno = 1;
  bloqueado = false;
  ganadorLado: Lado | null = null;
  historialDuelo: RegistroTurno[] = [];
  efectos: EfectoFlotante[] = [];
  proyectil: Proyectil | null = null;
  animAtaque: 0 | Lado = 0;
  animGolpe: 0 | Lado = 0;
  animCura: 0 | Lado = 0;

  private idsTipo: Set<number> | null = null;
  private claveFiltro = '';
  private cacheResultados: PokemonResumen[] = [];
  private ticketPrevia = 0;
  private ticketCpu = 0;
  private ticketTipo = 0;
  private contadorEfectos = 0;
  private destruido = false;
  private readonly temporizadores = new Set<ReturnType<typeof setTimeout>>();
  private readonly grimorioInicial = POKEMON_RESPALDO[0].movimientos;

  // -------------------------------------------------------------------------
  // Ciclo de vida
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    void this.cargarCatalogo();
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.limpiarTemporizadores();
  }

  // -------------------------------------------------------------------------
  // Compatibilidad con el spec del Tribunal (porcentaje de salud y hechizos activos)
  // -------------------------------------------------------------------------
  get saludMago(): number {
    return this.pct(this.jugador1);
  }

  get saludRival(): number {
    return this.pct(this.jugador2);
  }

  get hechizosDuelo(): Movimiento[] {
    const activo = this.atacante ?? this.jugador1;
    if (!activo) return this.grimorioInicial;
    return opcionesTurno(activo, this.combatiente(activo === this.jugador1 ? 2 : 1));
  }

  // -------------------------------------------------------------------------
  // Getters de vista
  // -------------------------------------------------------------------------
  get atacante(): Combatiente | null {
    return this.estadoDuelo === 'EN_CURSO' ? this.combatiente(this.turno) : null;
  }

  get defensor(): Combatiente | null {
    return this.combatiente(this.turno === 1 ? 2 : 1);
  }

  get esTurnoCpu(): boolean {
    return this.modo === 'CPU' && this.turno === 2;
  }

  get mostrarSelector(): boolean {
    return this.modo === 'CPU' ? this.jugador1 === null : this.jugador1 === null || this.jugador2 === null;
  }

  get puedeComenzar(): boolean {
    return this.jugador1 !== null && this.jugador2 !== null && !this.cpuEligiendo;
  }

  get ganador(): Combatiente | null {
    return this.ganadorLado ? this.combatiente(this.ganadorLado) : null;
  }

  get tituloFinal(): string {
    if (this.modo === 'CPU') return this.ganadorLado === 1 ? '¡VICTORIA!' : 'DERROTA';
    return `¡${this.nombreDe(this.ganadorLado ?? 1)} gana!`;
  }

  get subtituloFinal(): string {
    const ganador = this.ganador;
    if (!ganador || !this.ganadorLado) return '';
    return `${ganador.nombre} de ${this.nombreDe(this.ganadorLado)} se impone tras ${this.numeroTurno} rondas.`;
  }

  /** Resultados filtrados, memoizados para no recalcular la lista en cada detección de cambios. */
  get resultados(): PokemonResumen[] {
    const texto = this.busqueda.trim().toLowerCase().replace(/^#/, '');
    const clave = [texto, this.filtroTipo, this.filtroGeneracion, this.idsTipo ? this.idsTipo.size : -1, this.catalogo.length].join('|');
    if (clave === this.claveFiltro) return this.cacheResultados;

    const gen = GENERACIONES.find((g) => g.n === this.filtroGeneracion);
    this.cacheResultados = this.catalogo.filter((p) => {
      if (texto && !p.nombre.toLowerCase().includes(texto) && String(p.id) !== texto) return false;
      if (gen && (p.id < gen.desde || p.id > gen.hasta)) return false;
      if (this.filtroTipo && !this.idsTipo?.has(p.id)) return false;
      return true;
    });
    this.claveFiltro = clave;
    return this.cacheResultados;
  }

  get visibles(): PokemonResumen[] {
    return this.resultados.slice(0, this.limiteVisible);
  }

  nombreDe(lado: Lado): string {
    if (lado === 1) return this.nombreJugador1.trim() || 'Jugador 1';
    return this.modo === 'CPU' ? 'CPU' : this.nombreJugador2.trim() || 'Jugador 2';
  }

  pct(c: Combatiente | null): number {
    return c ? Math.max(0, (c.hp / c.hpMax) * 100) : 100;
  }

  claseHp(c: Combatiente): string {
    const p = this.pct(c);
    return p > 50 ? 'alto' : p > 20 ? 'medio' : 'bajo';
  }

  efectividadContra(mov: Movimiento): number {
    const rival = this.defensor;
    return rival && mov.id !== ID_FORCEJEO ? efectividad(mov.elemento, rival.tipos) : 1;
  }

  sprite(id: number): string {
    return urlSprite(id);
  }

  alFallarImagen(evento: Event): void {
    const img = evento.target as HTMLImageElement;
    if (!img.src.startsWith('data:')) img.src = POKEBOLA;
  }

  // -------------------------------------------------------------------------
  // Selección de Pokémon
  // -------------------------------------------------------------------------
  async cargarCatalogo(): Promise<void> {
    this.cargandoCatalogo = true;
    const { lista, completo } = await this.api.obtenerCatalogo();
    if (this.destruido) return;
    this.catalogo = lista;
    this.sinConexion = !completo;
    this.cargandoCatalogo = false;
    this.refrescar();
  }

  async cambiarTipo(tipo: TipoPokemon | ''): Promise<void> {
    const ticket = ++this.ticketTipo;
    this.filtroTipo = tipo;
    this.idsTipo = null;
    this.limiteVisible = this.tamanoPagina;
    if (!tipo) {
      this.cargandoTipo = false;
      return;
    }
    this.cargandoTipo = true;
    const ids = await this.api.obtenerIdsPorTipo(tipo);
    if (ticket !== this.ticketTipo || this.destruido) return;
    this.idsTipo = ids;
    this.cargandoTipo = false;
    this.refrescar();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroGeneracion = 0;
    void this.cambiarTipo('');
  }

  elegirAlAzar(): void {
    const fuente: PokemonResumen[] = this.resultados.length > 0 ? this.resultados : this.catalogo;
    const pool = fuente.length > 0 ? fuente : POKEMON_RESPALDO;
    void this.previsualizar(pool[Math.floor(Math.random() * pool.length)].id);
  }

  async previsualizar(id: number): Promise<void> {
    const ticket = ++this.ticketPrevia;
    this.cargandoPrevia = true;
    this.errorPrevia = '';
    try {
      const datos = await this.api.obtenerPokemon(id);
      if (ticket !== this.ticketPrevia || this.destruido) return;
      this.previa = datos;
      this.previaStats = this.construirStats(datos);
    } catch {
      if (ticket !== this.ticketPrevia || this.destruido) return;
      this.previa = null;
      this.errorPrevia = 'No se pudo cargar este Pokémon. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      if (ticket === this.ticketPrevia && !this.destruido) {
        this.cargandoPrevia = false;
        this.refrescar();
      }
    }
  }

  confirmarSeleccion(): void {
    if (!this.previa) return;
    const elegido = crearCombatiente(this.previa);
    this.previa = null;

    if (this.seleccionActual === 1) {
      this.jugador1 = elegido;
      if (this.modo === 'CPU') void this.elegirRivalCpu();
      else if (!this.jugador2) this.seleccionActual = 2;
    } else {
      this.jugador2 = elegido;
    }
  }

  cambiarModo(modo: ModoJuego): void {
    if (modo === this.modo) return;
    this.modo = modo;
    this.reiniciarSeleccion();
  }

  editarJugador(lado: Lado): void {
    this.previa = null;
    if (lado === 2 && this.modo === 'CPU') {
      void this.elegirRivalCpu();
      return;
    }
    if (lado === 1) this.jugador1 = null;
    else this.jugador2 = null;
    this.seleccionActual = lado;
  }

  volverASeleccion(): void {
    this.limpiarTemporizadores();
    this.estadoDuelo = 'PREPARACION';
    this.reiniciarSeleccion();
  }

  // -------------------------------------------------------------------------
  // Combate
  // -------------------------------------------------------------------------
  iniciarDuelo(): void {
    this.limpiarTemporizadores();
    this.ticketCpu++;
    this.cpuEligiendo = false;
    this.jugador1 = crearCombatiente(this.jugador1?.datos ?? POKEMON_RESPALDO[0]);
    this.jugador2 = crearCombatiente(this.jugador2?.datos ?? POKEMON_RESPALDO[1]);

    this.estadoDuelo = 'EN_CURSO';
    this.turno = 1;
    this.numeroTurno = 1;
    this.bloqueado = false;
    this.ganadorLado = null;
    this.efectos = [];
    this.proyectil = null;
    this.animAtaque = 0;
    this.animGolpe = 0;
    this.animCura = 0;
    this.previa = null;
    this.historialDuelo = [];
    this.registrar(
      'Árbitro',
      'Inicio',
      `${this.nombreDe(1)} envía a ${this.jugador1.nombre} y ${this.nombreDe(2)} a ${this.jugador2.nombre}.`,
      'info'
    );
  }

  lanzarHechizo(mov: Movimiento): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.bloqueado || this.esTurnoCpu) return;
    this.ejecutar(this.turno, mov);
  }

  private ejecutar(lado: Lado, mov: Movimiento): void {
    const rivalLado: Lado = lado === 1 ? 2 : 1;
    const atacante = this.combatiente(lado);
    const defensor = this.combatiente(rivalLado);
    if (!atacante || !defensor || this.estadoDuelo !== 'EN_CURSO') return;

    const esForcejeo = mov.id === ID_FORCEJEO;
    const propio = esForcejeo ? FORCEJEO : atacante.movimientos.find((m) => m.id === mov.id);
    if (!propio || (!esForcejeo && propio.pp <= 0)) return;
    if (!esForcejeo) propio.pp--;

    this.bloqueado = true;

    if (propio.tipo === 'Sanacion') {
      const antes = atacante.hp;
      atacante.hp = Math.min(atacante.hpMax, atacante.hp + cantidadCura(atacante));
      const curado = atacante.hp - antes;
      this.animar('cura', lado, 900);
      this.mostrarEfecto(lado, `+${curado}`, '', 'cura');
      this.registrar(atacante.nombre, propio.nombre, `Recupera ${curado} PS.`, 'heal');
      this.pasarTurno();
      return;
    }

    const golpe = calcularGolpe(atacante, defensor, propio, true);
    const danio = Math.min(golpe.danio, defensor.hp);
    defensor.hp -= danio;

    this.animar('ataque', lado, 450);
    this.proyectil = { de: lado, color: this.info[propio.elemento].color };
    this.esperar(420, () => {
      this.proyectil = null;
      this.animar('golpe', rivalLado, 550);
      if (golpe.efectividad === 0) {
        this.mostrarEfecto(rivalLado, 'Inmune', '', 'inmune');
      } else {
        const nota = golpe.critico ? '¡Crítico!' : golpe.efectividad > 1 ? '¡Súper eficaz!' : golpe.efectividad < 1 ? 'Poco eficaz' : '';
        this.mostrarEfecto(rivalLado, `-${danio}`, nota, golpe.critico ? 'critico' : 'dano');
      }
    });

    const notas: string[] = [];
    if (golpe.critico) notas.push('¡Golpe crítico!');
    if (golpe.efectividad > 1) notas.push('¡Es súper eficaz!');
    if (golpe.efectividad > 0 && golpe.efectividad < 1) notas.push('No es muy eficaz...');
    const efecto =
      golpe.efectividad === 0
        ? `No afecta a ${defensor.nombre}.`
        : `Causa ${danio} de daño a ${defensor.nombre}. ${notas.join(' ')}`.trim();
    const tipoRegistro: TipoRegistro = golpe.efectividad > 1 ? 'super' : golpe.efectividad < 1 ? 'weak' : 'damage';
    this.registrar(atacante.nombre, propio.nombre, efecto, tipoRegistro);

    if (esForcejeo) {
      const retroceso = Math.max(1, Math.round(atacante.hpMax * PORCENTAJE_RETROCESO));
      atacante.hp = Math.max(1, atacante.hp - retroceso);
      this.registrar(atacante.nombre, 'Retroceso', `${atacante.nombre} pierde ${retroceso} PS por el esfuerzo.`, 'weak');
    }

    if (defensor.hp <= 0) {
      this.registrar(defensor.nombre, 'Debilitado', `¡${defensor.nombre} no puede continuar!`, 'ko');
      this.finalizar(lado);
      return;
    }
    this.pasarTurno();
  }

  private pasarTurno(): void {
    this.bloqueado = true;
    this.esperar(PAUSA_TURNO_MS, () => {
      if (this.estadoDuelo !== 'EN_CURSO') return;
      this.turno = this.turno === 1 ? 2 : 1;
      if (this.turno === 1) this.numeroTurno++;

      if (this.esTurnoCpu) {
        this.esperar(PAUSA_CPU_MS, () => this.turnoCpu());
      } else {
        this.bloqueado = false;
      }
    });
  }

  private turnoCpu(): void {
    const cpu = this.jugador2;
    const rival = this.jugador1;
    if (this.estadoDuelo !== 'EN_CURSO' || !cpu || !rival) return;
    this.bloqueado = false;
    this.ejecutar(2, elegirMovimientoCpu(cpu, rival));
  }

  private finalizar(ganador: Lado): void {
    this.ganadorLado = ganador;
    this.estadoDuelo = ganador === 1 ? 'VICTORIA' : 'DERROTA';
    this.bloqueado = true;
  }

  private async elegirRivalCpu(): Promise<void> {
    const ticket = ++this.ticketCpu;
    this.cpuEligiendo = true;
    this.jugador2 = null;

    const objetivo = this.jugador1 ? statsTotal(this.jugador1.datos.stats) : 450;
    const ids = this.catalogo.length > 0 ? this.catalogo.map((p) => p.id) : POKEMON_RESPALDO.map((p) => p.id);
    let elegido: PokemonDatos | null = null;

    // Busca un rival de fuerza parecida (±30 % de stats totales) para que el duelo sea justo.
    for (let intento = 0; intento < 4 && !elegido; intento++) {
      try {
        const datos = await this.api.obtenerPokemon(ids[Math.floor(Math.random() * ids.length)]);
        if (ticket !== this.ticketCpu || this.destruido) return;
        const diferencia = Math.abs(statsTotal(datos.stats) - objetivo) / objetivo;
        if (diferencia <= 0.3 || intento === 3) elegido = datos;
      } catch {
        // Se intenta con otro Pokémon.
      }
    }

    if (ticket !== this.ticketCpu || this.destruido) return;
    const rival = elegido ?? POKEMON_RESPALDO[Math.floor(Math.random() * POKEMON_RESPALDO.length)];
    this.jugador2 = crearCombatiente(rival);
    this.cpuEligiendo = false;
    this.refrescar();
  }

  // -------------------------------------------------------------------------
  // Utilidades internas
  // -------------------------------------------------------------------------
  private combatiente(lado: Lado): Combatiente | null {
    return lado === 1 ? this.jugador1 : this.jugador2;
  }

  private reiniciarSeleccion(): void {
    this.ticketCpu++;
    this.cpuEligiendo = false;
    this.jugador1 = null;
    this.jugador2 = null;
    this.previa = null;
    this.seleccionActual = 1;
  }

  private construirStats(datos: PokemonDatos): { etiqueta: string; valor: number; pct: number }[] {
    const s = datos.stats;
    const filas: [string, number][] = [
      ['PS', s.hp],
      ['Ataque', s.attack],
      ['Defensa', s.defense],
      ['At. Esp.', s.spAttack],
      ['Def. Esp.', s.spDefense],
      ['Velocidad', s.speed]
    ];
    return filas.map(([etiqueta, valor]) => ({ etiqueta, valor, pct: Math.min(100, (valor / 160) * 100) }));
  }

  private registrar(emisor: string, hechizo: string, efecto: string, tipo: TipoRegistro): void {
    this.historialDuelo = [{ turno: this.numeroTurno, emisor, hechizo, efecto, tipo }, ...this.historialDuelo].slice(0, MAX_REGISTROS);
  }

  private mostrarEfecto(lado: Lado, texto: string, nota: string, clase: EfectoFlotante['clase']): void {
    const id = ++this.contadorEfectos;
    this.efectos = [...this.efectos, { id, lado, texto, nota, clase }];
    this.esperar(1300, () => {
      this.efectos = this.efectos.filter((e) => e.id !== id);
    });
  }

  private animar(tipo: 'ataque' | 'golpe' | 'cura', lado: Lado, duracion: number): void {
    if (tipo === 'ataque') this.animAtaque = lado;
    else if (tipo === 'golpe') this.animGolpe = lado;
    else this.animCura = lado;

    this.esperar(duracion, () => {
      if (tipo === 'ataque') this.animAtaque = 0;
      else if (tipo === 'golpe') this.animGolpe = 0;
      else this.animCura = 0;
    });
  }

  /** Programa una acción diferida; todos los temporizadores se cancelan en ngOnDestroy. */
  private esperar(ms: number, accion: () => void): void {
    const id = setTimeout(() => {
      this.temporizadores.delete(id);
      if (this.destruido) return;
      accion();
      this.refrescar();
    }, ms);
    this.temporizadores.add(id);
  }

  private limpiarTemporizadores(): void {
    this.temporizadores.forEach((id) => clearTimeout(id));
    this.temporizadores.clear();
  }

  /** El proyecto es zoneless: tras trabajo asíncrono hay que avisar a Angular para repintar. */
  private refrescar(): void {
    if (!this.destruido) this.cdr.markForCheck();
  }
}