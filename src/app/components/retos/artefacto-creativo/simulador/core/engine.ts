import {
  Accion, Combatiente, ConfigCombate, EfectoDef, Escala, EstadoActivo, EstadoId, Estimacion, Evento, Habilidad, Observacion,
} from './models';
import { BALANCE, MK0 } from './balance.config';
import { CATALOGO_POR_ID } from './catalogo';
import { ESTADOS } from './status';
import { crearRng } from './rng';
import type { Rng } from './rng';
import { PERSONAJES_POR_ID } from '../data/characters.data';
import { decidirAccion, decidirReaccion } from './ai';

export interface Disponible { accion: Accion; etiqueta: string; usable: boolean; motivo?: string; habilidad?: Habilidad; }
export interface Pendiente { actorId: string; objetivoId: string; habilidadId: string; reaccionistaId: string; opciones: string[]; }

/**
 * Motor de combate independiente de Angular: no toca el DOM ni importa nada del framework.
 * Estado → acciones disponibles → ejecutar → eventos. Los efectos se resuelven con funciones reutilizables.
 */
export class CombatEngine {
  readonly eventos: Evento[] = [];
  combatientes: Combatiente[] = [];
  ronda = 1;
  orden: string[] = [];
  indice = 0;
  fase: 'accion' | 'reaccion' | 'terminado' = 'accion';
  ganador: 'A' | 'B' | 'empate' | null = null;
  pendiente: Pendiente | null = null;
  private rng: Rng;
  private n = 0;
  private ultimaAccionMagica = new Map<string, boolean>();
  private conteoMagia = new Map<string, { mag: number; total: number }>();

  readonly config: ConfigCombate;

  constructor(config: ConfigCombate) {
    this.config = config;
    this.rng = crearRng(config.semilla);
    config.equipoA.forEach((p, i) => this.combatientes.push(this.crear(p, 'A', i)));
    config.equipoB.forEach((p, i) => this.combatientes.push(this.crear(p, 'B', i)));
    this.log('inicio', 'El combate comienza.');
    this.nuevaRonda();
    this.iniciarTurno();
  }

  // ---------- Consultas ----------
  get(id: string): Combatiente {
    const c = this.combatientes.find((x) => x.id === id);
    if (!c) throw new Error(`Combatiente desconocido: ${id}`);
    return c;
  }
  get actor(): Combatiente { return this.get(this.orden[this.indice]); }
  vivos(equipo?: 'A' | 'B'): Combatiente[] { return this.combatientes.filter((c) => c.hp > 0 && (!equipo || c.equipo === equipo)); }
  enemigos(c: Combatiente): Combatiente[] { return this.vivos(c.equipo === 'A' ? 'B' : 'A'); }
  tiene(c: Combatiente, id: EstadoId): EstadoActivo | undefined { return c.estados.find((e) => e.id === id); }

  /** Valor efectivo de un atributo con los modificadores de estados. */
  valor(c: Combatiente, k: 'vel' | 'defFis' | 'resMag' | 'precision' | 'atkFis' | 'poderMag'): number {
    let v = c.attr[k];
    for (const e of c.estados) v *= ESTADOS[e.id].mods?.[k] ?? 1;
    return v;
  }
  evasion(c: Combatiente): number {
    if (c.estados.some((e) => ESTADOS[e.id].evasionCero)) return 0;
    return c.attr.evasion + c.estados.reduce((s, e) => s + (ESTADOS[e.id].evasionExtra ?? 0), 0);
  }

  /** Lo que un combatiente puede observar legítimamente del rival (nunca su lista de habilidades ni su cooldown). */
  observar(c: Combatiente): Observacion {
    const rival = this.enemigos(c)[0] ?? this.combatientes.find((x) => x.equipo !== c.equipo)!;
    const cont = this.conteoMagia.get(rival.id) ?? { mag: 0, total: 0 };
    return {
      hpPct: rival.hp / rival.attr.hpMax, manaPct: rival.mana / rival.attr.manaMax,
      estados: rival.estados.map((e) => e.id), usadas: [...rival.usadas],
      ultimaFueMagia: this.ultimaAccionMagica.get(rival.id) ?? null,
      proporcionMagia: cont.total ? cont.mag / cont.total : 0.5, enemigoId: rival.id,
    };
  }

  evaluar(c: Combatiente, a: Accion): { usable: boolean; motivo?: string } {
    if (this.fase === 'terminado') return { usable: false, motivo: 'El combate ha terminado.' };
    if (a.tipo === 'defender' || a.tipo === 'meditar') return { usable: true };
    const obj = this.get(a.objetivoId);
    if (obj.hp <= 0) return { usable: false, motivo: 'El objetivo ya está derrotado.' };
    if (a.tipo === 'golpe') {
      return this.tiene(c, 'inmovilizacion') ? { usable: false, motivo: 'Está inmovilizado: no puede atacar físicamente.' } : { usable: true };
    }
    const h = CATALOGO_POR_ID[a.habilidadId];
    if (!h || !c.equipadas.includes(h.id)) return { usable: false, motivo: 'La habilidad no está equipada.' };
    if (h.soloReaccion) return { usable: false, motivo: 'Solo puede usarse como reacción al hechizo de un rival.' };
    const cd = c.cooldowns[h.id] ?? 0;
    if (cd > 0) return { usable: false, motivo: `En enfriamiento: ${cd} turno(s).` };
    if (c.mana < h.manaCost) return { usable: false, motivo: `Maná insuficiente: necesita ${h.manaCost} y tiene ${Math.floor(c.mana)}.` };
    if (h.esMagia && c.estados.some((e) => ESTADOS[e.id].bloqueaMagia)) return { usable: false, motivo: 'Está silenciado: no puede lanzar magia.' };
    if (!h.esMagia && c.estados.some((e) => ESTADOS[e.id].bloqueaFisico)) return { usable: false, motivo: 'Está inmovilizado: no puede atacar físicamente.' };
    return { usable: true };
  }

  accionesDisponibles(c: Combatiente): Disponible[] {
    const rival = this.enemigos(c)[0];
    const lista: Disponible[] = [];
    if (rival) {
      const g: Accion = { tipo: 'golpe', actorId: c.id, objetivoId: rival.id };
      lista.push({ accion: g, etiqueta: 'Golpe básico', ...this.evaluar(c, g) });
      for (const id of c.equipadas) {
        const h = CATALOGO_POR_ID[id];
        const a: Accion = { tipo: 'habilidad', actorId: c.id, habilidadId: id, objetivoId: h.objetivo === 'si_mismo' ? c.id : rival.id };
        lista.push({ accion: a, etiqueta: h.nombre, habilidad: h, ...this.evaluar(c, a) });
      }
    }
    const d: Accion = { tipo: 'defender', actorId: c.id };
    const m: Accion = { tipo: 'meditar', actorId: c.id };
    lista.push({ accion: d, etiqueta: 'Defender', usable: true }, { accion: m, etiqueta: 'Meditar', usable: true });
    return lista;
  }

  // ---------- Estimación (la usa la IA; misma fórmula que el daño real, sin azar) ----------
  estimar(c: Combatiente, a: Accion): Estimacion {
    const est: Estimacion = { danio: 0, prob: 1, cura: 0, mana: 0, mata: false, estados: [], escudo: null };
    if (a.tipo === 'defender') return est;
    if (a.tipo === 'meditar') { est.mana = -Math.round(c.attr.manaMax * BALANCE.meditarManaPct); return est; }
    const obj = this.get(a.objetivoId);
    if (a.tipo === 'golpe') {
      est.prob = this.probImpacto(c, obj, BALANCE.golpeBasico.accuracy, false);
      est.danio = this.calcularDanio(c, obj, BALANCE.golpeBasico.power, { t: 'dano', escala: 'fis' }, 'fisico', false) * est.prob;
      est.mata = est.danio / est.prob >= obj.hp;
      return est;
    }
    const h = CATALOGO_POR_ID[a.habilidadId];
    est.mana = h.manaCost;
    const hostil = h.objetivo === 'enemigo';
    est.prob = hostil ? this.probImpacto(c, obj, h.accuracy, h.esMagia) : 1;
    for (const ef of h.efectos) {
      if (ef.t === 'dano') {
        const d = this.calcularDanio(c, obj, h.power, ef, h.elemento, false);
        est.danio += d * est.prob;
        if (d >= obj.hp) est.mata = true;
      } else if (ef.t === 'curar') est.cura += Math.min(Math.round(c.attr.hpMax * ef.pct), c.attr.hpMax - c.hp);
      else if (ef.t === 'estado') est.estados.push({ id: ef.id, prob: ef.sobreSi ? 1 : ef.prob * est.prob * (1 - (ef.sobreSi ? 0 : obj.attr.resEstado)) });
      else if (ef.t === 'escudo') est.escudo = ef.clase;
      else if (ef.t === 'invocar') est.danio += ef.danio * this.valor(c, 'poderMag') * 0.35 * ef.turnos * 0.5;
    }
    return est;
  }

  // ---------- Acciones ----------
  ejecutar(a: Accion): { ok: boolean; motivo?: string } {
    if (this.fase !== 'accion') return { ok: false, motivo: 'No es momento de actuar.' };
    const c = this.get(a.actorId);
    if (c.id !== this.actor.id) return { ok: false, motivo: 'No es su turno.' };
    const v = this.evaluar(c, a);
    if (!v.usable) {
      if (v.motivo?.startsWith('Maná')) this.log('sin_mana', `${c.nombre} no tiene maná suficiente.`, c.id);
      return { ok: false, motivo: v.motivo };
    }
    c.stats.hechizos += a.tipo === 'habilidad' ? 1 : 0;
    if (a.tipo === 'defender') {
      this.aplicarEstado(c, c, 'defendiendo', 1, 1, true);
      this.log('defiende', `${c.nombre} se pone en guardia.`, c.id);
      this.finTurno();
    } else if (a.tipo === 'meditar') {
      const m = Math.round(c.attr.manaMax * BALANCE.meditarManaPct);
      c.mana = Math.min(c.attr.manaMax, c.mana + m);
      this.log('medita', `${c.nombre} medita y recupera ${m} de maná.`, c.id, undefined, undefined, m);
      this.finTurno();
    } else if (a.tipo === 'golpe') {
      this.anotar(c, false);
      const obj = this.get(a.objetivoId);
      this.log('prepara', `${c.nombre} ataca con un golpe básico.`, c.id, obj.id);
      this.resolverGolpe(c, obj);
      this.finTurno();
    } else {
      this.lanzar(c, CATALOGO_POR_ID[a.habilidadId], this.get(a.objetivoId));
    }
    return { ok: true };
  }

  /** Reacción del jugador cuando el motor está esperando (fase 'reaccion'). */
  reaccionar(habilidadId: string | null): void {
    const p = this.pendiente;
    if (this.fase !== 'reaccion' || !p) return;
    this.pendiente = null;
    this.fase = 'accion';
    this.resolverReaccion(p, habilidadId);
  }

  ejecutarTurnoIA(): void {
    if (this.fase !== 'accion') return;
    const c = this.actor;
    const a = decidirAccion(this, c);
    const r = this.ejecutar(a);
    if (!r.ok) this.ejecutar({ tipo: 'defender', actorId: c.id }); // la IA nunca se queda bloqueada
  }

  /** Para el modo automático y las pruebas: juega todo el combate con IA. */
  simular(maxPasos = 500): void {
    let pasos = 0;
    while (this.fase !== 'terminado' && pasos++ < maxPasos) {
      if (this.fase === 'reaccion') { this.reaccionar(null); continue; }
      this.ejecutarTurnoIA();
    }
  }

  // ---------- Resolución ----------
  private lanzar(c: Combatiente, h: Habilidad, obj: Combatiente): void {
    c.mana -= h.manaCost;
    c.cooldowns[h.id] = h.cooldown > 0 ? h.cooldown + 1 : 0;
    if (!c.usadas.includes(h.id)) c.usadas.push(h.id);
    this.anotar(c, h.esMagia);
    this.log('prepara', `${c.nombre} prepara ${h.nombre}.`, c.id, obj.id, h.id);
    if (h.esMagia && h.interrumpible && h.objetivo === 'enemigo') {
      const r = this.enemigos(c).find((e) => this.opcionesReaccion(e, c).length > 0);
      if (r) {
        const p: Pendiente = { actorId: c.id, objetivoId: obj.id, habilidadId: h.id, reaccionistaId: r.id, opciones: this.opcionesReaccion(r, c) };
        if (r.controlador === 'jugador' && this.config.reaccionManual) {
          this.pendiente = p;
          this.fase = 'reaccion';
          return;
        }
        this.resolverReaccion(p, decidirReaccion(this, r, h));
        return;
      }
    }
    this.aplicar(c, h, obj);
    this.finTurno();
  }

  opcionesReaccion(r: Combatiente, lanzador: Combatiente): string[] {
    if (r.estados.some((e) => ESTADOS[e.id].bloqueaMagia)) return [];
    return r.equipadas.filter((id) => {
      const h = CATALOGO_POR_ID[id];
      return h.efectos.some((e) => e.t === 'interrumpir') && (r.cooldowns[id] ?? 0) <= 0 && r.mana >= h.manaCost && lanzador.hp > 0;
    });
  }

  /** Probabilidad de que Perturbar la magia cancele un hechizo (regla provisional, ajustable en BALANCE). */
  probInterrupcion(r: Combatiente, lanzador: Combatiente, lanzada: Habilidad, interruptora: Habilidad): number {
    const I = BALANCE.interrupcion;
    const p = I.base + (this.valor(r, 'poderMag') - this.valor(lanzador, 'poderMag')) * I.porPoder
      - (BALANCE.rangoNum[lanzada.rango] - BALANCE.rangoNum[interruptora.rango]) * I.porRango;
    return Math.min(I.max, Math.max(I.min, p));
  }

  private resolverReaccion(p: Pendiente, habilidadId: string | null): void {
    const c = this.get(p.actorId);
    const r = this.get(p.reaccionistaId);
    const h = CATALOGO_POR_ID[p.habilidadId];
    const obj = this.get(p.objetivoId);
    if (habilidadId && p.opciones.includes(habilidadId)) {
      const hi = CATALOGO_POR_ID[habilidadId];
      r.mana -= hi.manaCost;
      r.cooldowns[hi.id] = hi.cooldown + 1;
      if (!r.usadas.includes(hi.id)) r.usadas.push(hi.id);
      this.log('interrumpe', `${r.nombre} usa ${hi.nombre} para interrumpir ${h.nombre}.`, r.id, c.id, hi.id);
      if (this.rng.next() < this.probInterrupcion(r, c, h, hi)) {
        r.stats.interrupciones++;
        this.log('interrumpida', `La acción mágica es interrumpida: ${h.nombre} se dispersa sin tomar forma.`, c.id, r.id, h.id);
        this.aplicarEstado(c, r, 'silencio', BALANCE.interrupcion.selloTurnos, 0.6, false); // sella la magia del lanzador (resistible)
        this.finTurno();
        return;
      }
      this.log('info', `${hi.nombre} no logra interrumpir el hechizo.`, r.id, c.id, hi.id);
    }
    this.aplicar(c, h, obj);
    this.finTurno();
  }

  private aplicar(c: Combatiente, h: Habilidad, obj: Combatiente): void {
    const hostil = h.objetivo === 'enemigo';
    if (hostil && obj.hp > 0) {
      if (this.tiene(obj, 'evasion_total')) { this.log('falla', `${obj.nombre} esquiva ${h.nombre} gracias a su teletransporte.`, c.id, obj.id, h.id); return; }
      if (this.rng.next() * 100 >= this.probImpacto(c, obj, h.accuracy, h.esMagia) * 100) {
        this.log('falla', `${h.nombre} falla.`, c.id, obj.id, h.id);
        return;
      }
    }
    const objetivo = hostil ? obj : c;
    for (const ef of h.efectos) this.efecto(ef, c, objetivo, h);
  }

  private resolverGolpe(c: Combatiente, obj: Combatiente): void {
    if (this.tiene(obj, 'evasion_total') || this.rng.next() * 100 >= this.probImpacto(c, obj, BALANCE.golpeBasico.accuracy, false) * 100) {
      this.log('falla', 'El golpe falla.', c.id, obj.id);
      return;
    }
    this.daniar(c, obj, BALANCE.golpeBasico.power, { t: 'dano', escala: 'fis' }, 'fisico');
  }

  private efecto(ef: EfectoDef, c: Combatiente, obj: Combatiente, h: Habilidad): void {
    switch (ef.t) {
      case 'dano': this.daniar(c, obj, h.power, ef, h.elemento, h); break;
      case 'curar': {
        const cura = Math.min(Math.round(obj.attr.hpMax * ef.pct), obj.attr.hpMax - obj.hp);
        obj.hp += cura; obj.stats.curacion += cura;
        this.log('curacion', `${obj.nombre} recupera ${cura} de vida.`, c.id, obj.id, h.id, cura);
        break;
      }
      case 'escudo': {
        const valor = Math.round(ef.fuerza * this.valor(c, 'poderMag') * BALANCE.escudoEscala);
        const previo = obj.escudos.find((s) => s.clase === ef.clase);
        if (previo) { previo.valor = Math.max(previo.valor, valor); previo.turnos = Math.max(previo.turnos, ef.turnos); }
        else obj.escudos.push({ clase: ef.clase, valor, turnos: ef.turnos });
        this.log('escudo', `${obj.nombre} levanta una barrera ${ef.clase === 'mag' ? 'mágica' : 'física'} (${valor}).`, c.id, obj.id, h.id, valor);
        break;
      }
      case 'estado': this.aplicarEstado(ef.sobreSi ? c : obj, c, ef.id, ef.turnos, ef.prob, !!ef.sobreSi); break;
      case 'limpiar': {
        const antes = c.estados.length;
        c.estados = c.estados.filter((e) => !ef.ids.includes(e.id));
        if (c.estados.length < antes) this.log('info', `${c.nombre} se libera de estados negativos.`, c.id);
        break;
      }
      case 'invocar': {
        const pot = Math.round(ef.danio * this.valor(c, 'poderMag') * 0.35);
        const e = this.aplicarEstado(c, c, 'invocacion', ef.turnos, 1, true);
        if (e) e.potencia = pot;
        break;
      }
      case 'interrumpir': break; // solo funciona como reacción
    }
  }

  private daniar(c: Combatiente, obj: Combatiente, power: number, ef: Extract<EfectoDef, { t: 'dano' }>, elem: Habilidad['elemento'], h?: Habilidad): void {
    let d = this.calcularDanio(c, obj, power, ef, elem, true);
    const crit = this.rng.next() < BALANCE.critProb;
    if (crit) d *= BALANCE.critMult;
    d = Math.max(1, Math.round(d));
    // Puerta del Dragón: reduce el daño mágico y devuelve parte como maná
    if (ef.escala === 'mag' && this.tiene(obj, 'absorcion')) {
      const red = Math.round(d * BALANCE.absorcion.reduccion);
      d -= red;
      obj.mana = Math.min(obj.attr.manaMax, obj.mana + Math.round(red * BALANCE.absorcion.manaDevuelto));
      this.log('info', `La Puerta del Dragón de ${obj.nombre} absorbe ${red} de daño.`, c.id, obj.id);
    }
    // Barreras: absorben primero el daño de su clase
    const escudo = obj.escudos.find((s) => s.clase === ef.escala && s.valor > 0);
    if (escudo) {
      const abs = Math.min(escudo.valor, d);
      escudo.valor -= abs; d -= abs;
      this.log('escudo_absorbe', `La barrera de ${obj.nombre} reduce el daño recibido en ${abs}.`, c.id, obj.id, h?.id, abs);
    }
    obj.hp = Math.max(0, obj.hp - d);
    const drena = Math.min(Math.floor(obj.mana), Math.round(d * (ef.escala === 'mag' ? BALANCE.drenajeMana.mag : BALANCE.drenajeMana.fis)));
    obj.mana -= drena;
    c.stats.danioInfligido += d; obj.stats.danioRecibido += d;
    this.log('dano', `${obj.nombre} recibe ${d} de daño${crit ? ' (¡crítico!)' : ''}${drena > 0 ? ` y pierde ${drena} de maná` : ''}.`, c.id, obj.id, h?.id, d);
    if (d > 0 && elem === 'fuego' && this.tiene(obj, 'congelacion')) obj.estados = obj.estados.filter((e) => e.id !== 'congelacion');
    if (d > 0) obj.estados = obj.estados.filter((e) => !ESTADOS[e.id].seRompeConDanio);
    this.comprobarFin();
  }

  calcularDanio(c: Combatiente, obj: Combatiente, power: number, ef: Extract<EfectoDef, { t: 'dano' }>, elem: Habilidad['elemento'], azar: boolean): number {
    const esc: Escala = ef.escala;
    const atk = esc === 'mag' ? this.valor(c, 'poderMag') : this.valor(c, 'atkFis');
    let d = power * (ef.mult ?? 1) * (1 + atk / BALANCE.escalaAtaque);
    const def = ef.ignoraDefensa ? 0 : esc === 'mag' ? this.valor(obj, 'resMag') : this.valor(obj, 'defFis');
    d = (d * 100) / (100 + def * BALANCE.factorDefensa);
    const S = BALANCE.sinergias;
    if (this.tiene(obj, 'mojado')) { if (elem === 'hielo') d *= S.mojadoHielo; else if (elem === 'rayo') d *= S.mojadoRayo; }
    if (elem === 'fuego' && this.tiene(obj, 'congelacion')) d *= S.fuegoSobreCongelado;
    if (azar) d *= 1 + (this.rng.next() * 2 - 1) * BALANCE.variacion;
    return d;
  }

  probImpacto(c: Combatiente, obj: Combatiente, acc: number, magia: boolean): number {
    const ev = this.evasion(obj) * (magia ? 0.5 : 1);
    return Math.min(1, Math.max(0.1, (acc / 100) * (this.valor(c, 'precision') / 100) * (1 - ev / 100)));
  }

  aplicarEstado(obj: Combatiente, origen: Combatiente, id: EstadoId, turnos: number, prob: number, propio: boolean): EstadoActivo | undefined {
    const def = ESTADOS[id];
    if (!propio) {
      if (def.impideActuar && obj.ccInmune > 0) { this.log('resiste', `${obj.nombre} es inmune a ${def.nombre} por ahora.`, origen.id, obj.id); return undefined; }
      let p = prob * (1 - obj.attr.resEstado);
      if (id === 'congelacion' && this.tiene(obj, 'mojado')) p *= BALANCE.sinergias.mojadoCongelacion;
      p = Math.min(0.95, Math.max(0.05, p));
      if (this.rng.next() >= p) { this.log('resiste', `${obj.nombre} resiste ${def.nombre}.`, origen.id, obj.id); return undefined; }
    }
    let e = this.tiene(obj, id);
    if (e) { e.turnos = Math.min(def.maxTurnos, Math.max(e.turnos, turnos)); e.pila = Math.min(def.maxPilas, e.pila + 1); }
    else { e = { id, turnos: Math.min(def.maxTurnos, turnos), pila: 1, potencia: 0, origen: origen.id }; obj.estados.push(e); }
    if (id === 'mojado') obj.estados = obj.estados.filter((x) => x.id !== 'quemadura');
    if (id === 'quemadura') obj.estados = obj.estados.filter((x) => x.id !== 'congelacion');
    this.log('estado', propio ? `${obj.nombre} activa ${def.nombre} (${e.turnos}).` : `${obj.nombre} queda ${def.nombre.toLowerCase()} (${e.turnos}).`, origen.id, obj.id);
    return e;
  }

  // ---------- Turnos ----------
  private finTurno(): void {
    const c = this.actor;
    for (const e of [...c.estados]) {
      const d = ESTADOS[e.id];
      if (d.dotPct && c.hp > 0) { const x = Math.max(1, Math.round(c.attr.hpMax * d.dotPct * e.pila)); c.hp = Math.max(0, c.hp - x); c.stats.danioRecibido += x; this.log('tick', `${c.nombre} sufre ${x} de daño por ${d.nombre.toLowerCase()}.`, e.origen, c.id, undefined, x); }
      if (d.hotPct && c.hp > 0) { const x = Math.min(Math.round(c.attr.hpMax * d.hotPct), c.attr.hpMax - c.hp); c.hp += x; this.log('tick', `${c.nombre} recupera ${x} de vida.`, c.id, c.id, undefined, x); }
      if (e.id === 'invocacion' && c.hp > 0) {
        const t = this.enemigos(c)[0];
        if (t) { const x = Math.max(1, Math.round((e.potencia * 100) / (100 + this.valor(t, 'defFis')))); t.hp = Math.max(0, t.hp - x); c.stats.danioInfligido += x; t.stats.danioRecibido += x; this.log('invocacion', `La criatura de ${c.nombre} ataca a ${t.nombre}: ${x} de daño.`, c.id, t.id, undefined, x); }
      }
      e.turnos--;
    }
    c.estados = c.estados.filter((e) => e.turnos > 0);
    for (const s of c.escudos) s.turnos--;
    c.escudos = c.escudos.filter((s) => s.turnos > 0 && s.valor > 0);
    for (const k of Object.keys(c.cooldowns)) if (c.cooldowns[k] > 0) c.cooldowns[k]--;
    if (c.ccInmune > 0) c.ccInmune--;
    if (c.hp > 0) c.mana = Math.min(c.attr.manaMax, c.mana + c.attr.regenMana);
    if (this.comprobarFin()) return;
    this.indice++;
    if (this.indice >= this.orden.length) { this.ronda++; this.nuevaRonda(); }
    this.iniciarTurno();
  }

  private nuevaRonda(): void {
    const lim = this.config.limiteRondas ?? BALANCE.limiteRondas;
    if (this.ronda > lim) { this.terminarPorLimite(); return; }
    this.orden = this.vivos()
      .map((c) => ({ id: c.id, v: this.valor(c, 'vel') + this.rng.next() * 3 }))
      .sort((a, b) => b.v - a.v).map((x) => x.id);
    this.indice = 0;
    this.log('ronda', `— Ronda ${this.ronda} —`);
  }

  private iniciarTurno(): void {
    if (this.fase === 'terminado') return;
    const c = this.actor;
    if (c.hp <= 0) { this.indice++; if (this.indice >= this.orden.length) { this.ronda++; this.nuevaRonda(); } if (!this.haTerminado()) this.iniciarTurno(); return; }
    c.estados = c.estados.filter((e) => !ESTADOS[e.id].expiraAlInicio);
    const bloqueo = c.estados.find((e) => ESTADOS[e.id].impideActuar);
    if (bloqueo) {
      this.log('pierde_turno', `${c.nombre} pierde el turno (${ESTADOS[bloqueo.id].nombre.toLowerCase()}).`, c.id);
      c.ccInmune = BALANCE.ccInmunidad + 1;
      this.finTurno();
    }
  }

  private haTerminado(): boolean { return this.fase === 'terminado'; }

  private comprobarFin(): boolean {
    if (this.fase === 'terminado') return true;
    const a = this.vivos('A').length, b = this.vivos('B').length;
    if (a > 0 && b > 0) return false;
    this.ganador = a > 0 ? 'A' : b > 0 ? 'B' : 'empate';
    this.fase = 'terminado';
    this.log('fin', this.ganador === 'empate' ? 'Ambos caen: el combate termina en empate.' : `El combate ha terminado: gana el equipo ${this.ganador}.`);
    return true;
  }

  private terminarPorLimite(): void {
    const pct = (e: 'A' | 'B') => this.combatientes.filter((c) => c.equipo === e).reduce((s, c) => s + c.hp / c.attr.hpMax, 0);
    const a = pct('A'), b = pct('B');
    this.ganador = Math.abs(a - b) < 0.01 ? 'empate' : a > b ? 'A' : 'B';
    this.fase = 'terminado';
    this.log('fin', 'Se alcanzó el límite de rondas: gana quien conserva más vida.');
  }

  // ---------- Utilidades ----------
  private anotar(c: Combatiente, magia: boolean): void {
    this.ultimaAccionMagica.set(c.id, magia);
    const k = this.conteoMagia.get(c.id) ?? { mag: 0, total: 0 };
    k.total++; if (magia) k.mag++;
    this.conteoMagia.set(c.id, k);
  }

  private crear(p: ConfigCombate['equipoA'][number], equipo: 'A' | 'B', i: number): Combatiente {
    const def = PERSONAJES_POR_ID[p.personajeId];
    if (!def) throw new Error(`Personaje desconocido: ${p.personajeId}`);
    const mk0 = !!p.mk0 && !!def.puedeMK0;
    const a = { ...def.atributos };
    if (mk0) { a.hpMax = Math.round(a.hpMax * MK0.hp); a.manaMax = Math.round(a.manaMax * MK0.mana); a.poderMag = Math.round(a.poderMag * MK0.poderMag); a.atkFis = Math.round(a.atkFis * MK0.atkFis); a.defFis += MK0.defFis; a.resMag += MK0.resMag; a.vel = Math.round(a.vel * MK0.vel); }
    const equipadas = (p.equipadas ?? def.equipadas).filter((id) => def.habilidades.includes(id)).slice(0, BALANCE.maxEquipadas);
    return {
      id: `${equipo}${i}`, equipo, def, nombre: def.nombre + (def.version ? ` (${def.version})` : ''), attr: a, hp: a.hpMax, mana: a.manaMax, equipadas,
      cooldowns: {}, estados: [], escudos: [], ccInmune: 0, controlador: p.controlador, ia: p.ia ?? def.ia, usadas: [], mk0,
      stats: { danioInfligido: 0, danioRecibido: 0, curacion: 0, hechizos: 0, interrupciones: 0 },
    };
  }

  private log(tipo: Evento['tipo'], msg: string, actorId?: string, objetivoId?: string, habilidadId?: string, valor?: number): void {
    this.eventos.push({ n: ++this.n, ronda: this.ronda, tipo, actorId, objetivoId, habilidadId, valor, msg });
  }

  /** Número aleatorio de la partida (lo usa la IA para desempatar sin romper la reproducibilidad). */
  azar(): number { return this.rng.next(); }
}
