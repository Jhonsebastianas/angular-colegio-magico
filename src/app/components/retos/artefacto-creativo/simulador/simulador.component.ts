import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CombatEngine, Disponible } from './core/engine';
import { CATALOGO, CATALOGO_POR_ID } from './core/catalogo';
import { PERSONAJES, PERSONAJES_POR_ID } from './data/characters.data';
import { IMAGENES } from './data/assets.config';
import { categoriaDePoder, puntuacionPoder } from './core/ranking';
import { BALANCE } from './core/balance.config';
import { semillaDeTexto } from './core/rng';
import { ESTADOS } from './core/status';
import { Combatiente, ConfigCombate, DefPersonaje, EfectoDef, EstiloIA, Habilidad } from './core/models';

type Vista = 'inicio' | 'personajes' | 'hechizos' | 'preparacion' | 'combate' | 'resultado';
const unicos = <T,>(xs: T[]): T[] => Array.from(new Set(xs));

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulador.component.html',//nuevo
  styleUrl: './simulador.component.css',
})
export class SimuladorComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  readonly escenario = IMAGENES.escenario;
  readonly personajes = PERSONAJES;
  readonly estilos: EstiloIA[] = ['agresivo', 'defensivo', 'equilibrado', 'tactico', 'magico', 'fisico', 'adaptativo'];
  readonly maxEquipadas = BALANCE.maxEquipadas;
  readonly total = CATALOGO.length;
  readonly opElementos = unicos(CATALOGO.map((h) => h.elemento));
  readonly opCategorias = unicos(CATALOGO.map((h) => h.categoria));
  readonly opRangos = unicos(CATALOGO.map((h) => h.rango));
  readonly opFunciones = unicos(CATALOGO.map((h) => h.funcion));

  vista: Vista = 'inicio';

  // Catálogo de hechizos
  busqueda = '';
  fElemento = '';
  fCategoria = '';
  fRango = '';
  fFuncion = '';
  fPersonaje = '';
  fManaMax = 0;
  fichaH: Habilidad | null = null;
  fichaP: DefPersonaje | null = null;

  // Preparación
  modo: 'manual' | 'auto' = 'manual';
  idA = 'rudeus-adulto';
  idB = 'orsted';
  mk0 = false;
  semillaTxt = '42';
  velocidad = 2;
  iaB: EstiloIA | '' = '';
  equipadasA: string[] = [...PERSONAJES_POR_ID['rudeus-adulto'].equipadas];

  // Combate
  motor: CombatEngine | null = null;
  pausado = false;
  private ultimaConfig: ConfigCombate | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnDestroy(): void {
    this.limpiar();
  }

  ir(v: Vista): void {
    if (v !== 'combate' && v !== 'resultado') this.limpiar();
    this.vista = v;
    this.fichaH = null;
    this.fichaP = null;
  }

  // ---------- Personajes ----------
  puntos(p: DefPersonaje): number { return puntuacionPoder(p); }
  categoriaPoder(p: DefPersonaje): string { return categoriaDePoder(puntuacionPoder(p)); }
  retrato(p: DefPersonaje, mk0 = false): string { return IMAGENES.retrato(p, mk0) || IMAGENES.placeholder; }
  alFallar(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img.dataset['fallo']) return;
    img.dataset['fallo'] = '1';
    img.src = IMAGENES.placeholder;
  }
  habilidadesDe(p: DefPersonaje): Habilidad[] { return p.habilidades.map((id) => CATALOGO_POR_ID[id]); }
  nombrePersonaje(p: DefPersonaje): string { return p.nombre + (p.version ? ` (${p.version})` : ''); }
  atributos(p: DefPersonaje): { n: string; v: number | string }[] {
    const a = p.atributos;
    return [
      { n: 'Vida', v: a.hpMax }, { n: 'Maná', v: a.manaMax }, { n: 'Ataque físico', v: a.atkFis }, { n: 'Poder mágico', v: a.poderMag },
      { n: 'Defensa física', v: a.defFis }, { n: 'Resistencia mágica', v: a.resMag }, { n: 'Velocidad', v: a.vel }, { n: 'Precisión', v: a.precision },
      { n: 'Evasión', v: a.evasion }, { n: 'Resist. a estados', v: Math.round(a.resEstado * 100) + ' %' }, { n: 'Regeneración de maná', v: a.regenMana },
    ];
  }

  // ---------- Hechizos ----------
  get hechizosFiltrados(): Habilidad[] {
    const q = this.busqueda.trim().toLowerCase();
    const permitidas = this.fPersonaje ? PERSONAJES_POR_ID[this.fPersonaje].habilidades : null;
    return CATALOGO.filter((h) =>
      (!q || h.nombre.toLowerCase().includes(q) || h.descripcion.toLowerCase().includes(q)) &&
      (!this.fElemento || h.elemento === this.fElemento) && (!this.fCategoria || h.categoria === this.fCategoria) &&
      (!this.fRango || h.rango === this.fRango) && (!this.fFuncion || h.funcion === this.fFuncion) &&
      (!this.fManaMax || h.manaCost <= this.fManaMax) && (!permitidas || permitidas.includes(h.id)),
    );
  }
  usuariosDe(h: Habilidad): string[] {
    return PERSONAJES.filter((p) => p.habilidades.includes(h.id)).map((p) => this.nombrePersonaje(p));
  }
  efectoTexto(e: EfectoDef): string {
    switch (e.t) {
      case 'dano': return `Daño ${e.escala === 'mag' ? 'mágico' : 'físico'} ×${e.mult ?? 1}${e.ignoraDefensa ? ' (ignora la defensa)' : ''}`;
      case 'curar': return `Cura el ${Math.round(e.pct * 100)} % de la vida máxima`;
      case 'escudo': return `Barrera ${e.clase === 'mag' ? 'mágica' : 'física'} (fuerza ${e.fuerza}, ${e.turnos} turnos)`;
      case 'estado': return `${e.sobreSi ? 'Sobre sí mismo' : 'Probabilidad ' + Math.round(e.prob * 100) + ' %'}: ${ESTADOS[e.id].nombre} (${e.turnos} turnos)`;
      case 'limpiar': return `Elimina: ${e.ids.map((i) => ESTADOS[i].nombre).join(', ')}`;
      case 'interrumpir': return 'Interrumpe el hechizo que el rival acaba de anunciar (solo como reacción)';
      case 'invocar': return `Invoca una criatura que ataca durante ${e.turnos} turnos`;
    }
  }
  icono(h: Habilidad): string {
    const m: Record<string, string> = { agua: '💧', hielo: '❄️', fuego: '🔥', viento: '🌪️', tierra: '🪨', rayo: '⚡', luz: '✨', fusion: '🌀', fisico: '⚔️', neutral: '🔮' };
    return m[h.elemento] ?? '🔮';
  }

  // ---------- Preparación ----------
  prepararCon(id: string): void { this.elegirA(id); this.ir('preparacion'); }
  elegirA(id: string): void {
    this.idA = id;
    this.equipadasA = [...PERSONAJES_POR_ID[id].equipadas];
    if (!PERSONAJES_POR_ID[id].puedeMK0) this.mk0 = false;
  }
  get defA(): DefPersonaje { return PERSONAJES_POR_ID[this.idA]; }
  get permitidasA(): Habilidad[] {
    return this.habilidadesDe(this.defA).filter((h) => h.jugable).sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));
  }
  alternarEquipo(h: Habilidad): void {
    const i = this.equipadasA.indexOf(h.id);
    if (i >= 0) this.equipadasA.splice(i, 1);
    else if (this.equipadasA.length < this.maxEquipadas) this.equipadasA.push(h.id);
  }
  restablecerEquipo(): void { this.equipadasA = [...this.defA.equipadas]; }

  iniciar(): void {
    const semilla = /^\d+$/.test(this.semillaTxt.trim()) ? Number(this.semillaTxt) : semillaDeTexto(this.semillaTxt);
    this.ultimaConfig = {
      semilla,
      equipoA: [{ personajeId: this.idA, controlador: this.modo === 'manual' ? 'jugador' : 'ia', equipadas: [...this.equipadasA], mk0: this.mk0 }],
      equipoB: [{ personajeId: this.idB, controlador: 'ia', ia: this.iaB || undefined }],
      reaccionManual: this.modo === 'manual',
    };
    this.empezar();
  }
  reiniciarCombate(): void { this.empezar(); }
  private empezar(): void {
    if (!this.ultimaConfig) return;
    this.limpiar();
    this.motor = new CombatEngine(this.ultimaConfig);
    this.pausado = false;
    this.vista = 'combate';
    this.continuar();
  }

  // ---------- Combate ----------
  get actor(): Combatiente | null { return this.motor && this.motor.fase !== 'terminado' ? this.motor.actor : null; }
  get acciones(): Disponible[] {
    const m = this.motor;
    return m && m.fase === 'accion' && m.actor.controlador === 'jugador' ? m.accionesDisponibles(m.actor) : [];
  }
  get registro() { return this.motor ? this.motor.eventos.slice().reverse() : []; }
  get esperaReaccion(): boolean { return !!this.motor && this.motor.fase === 'reaccion' && !!this.motor.pendiente; }

  estimado(d: Disponible): string {
    if (!this.motor || !d.usable) return '';
    const e = this.motor.estimar(this.motor.get(d.accion.actorId), d.accion);
    return e.danio >= 1 ? `≈ ${Math.round(e.danio)} de daño` : e.cura > 0 ? `≈ +${e.cura} de vida` : '';
  }
  estadosDe(c: Combatiente): { id: string; icono: string; nombre: string; turnos: number; pila: number; descripcion: string }[] {
    return c.estados.map((e) => ({ id: e.id, icono: ESTADOS[e.id].icono, nombre: ESTADOS[e.id].nombre, turnos: e.turnos, pila: e.pila, descripcion: ESTADOS[e.id].descripcion }));
  }
  pct(v: number, max: number): number { return Math.max(0, Math.min(100, (v / max) * 100)); }
  cooldown(c: Combatiente, id: string): number { return c.cooldowns[id] ?? 0; }

  usar(d: Disponible): void {
    if (!this.motor || !d.usable) return;
    this.motor.ejecutar(d.accion);
    this.continuar();
  }
  nombreHabilidad(id: string): string { return CATALOGO_POR_ID[id].nombre; }
  probReaccion(id: string): number {
    const m = this.motor!;
    const p = m.pendiente!;
    return Math.round(m.probInterrupcion(m.get(p.reaccionistaId), m.get(p.actorId), CATALOGO_POR_ID[p.habilidadId], CATALOGO_POR_ID[id]) * 100);
  }
  reaccionar(id: string | null): void {
    if (!this.motor) return;
    this.motor.reaccionar(id);
    this.continuar();
  }
  alternarPausa(): void {
    this.pausado = !this.pausado;
    if (!this.pausado) this.continuar();
  }

  /** Avanza solo los turnos de la IA; se detiene cuando le toca al jugador o hay una reacción pendiente. */
  private continuar(): void {
    const m = this.motor;
    if (!m) return;
    if (m.fase === 'terminado') { this.programar(() => this.ir('resultado'), 800); return; }
    if (m.fase === 'reaccion' || this.pausado) return;
    if (m.actor.controlador === 'ia') {
      this.programar(() => {
        if (this.pausado || !this.motor) return;
        this.motor.ejecutarTurnoIA();
        this.continuar();
      }, 450 / this.velocidad);
    }
  }

  get ganadorTexto(): string {
    const m = this.motor;
    if (!m || !m.ganador) return '';
    if (m.ganador === 'empate') return 'Empate';
    const equipo = m.ganador;
    for (const c of m.combatientes) if (c.equipo === equipo) return `Gana ${c.nombre}`;
    return '';
  }

  private programar(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(() => { fn(); this.cdr.markForCheck(); }, ms));
  }
  private limpiar(): void {
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
  }
}
