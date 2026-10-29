import type { CombatEngine, Disponible } from './engine';
import type { Accion, Combatiente, EstadoId, EstiloIA, Habilidad } from './models';
import { CATALOGO_POR_ID } from './catalogo';

/**
 * IA por puntuación de acciones. Juega con las mismas reglas que el jugador y solo usa información pública
 * (salud, maná, estados y habilidades que el rival ya mostró), nunca su lista equipada ni sus enfriamientos.
 */
interface Pesos { ataque: number; defensa: number; control: number; curar: number; magia: number; fisico: number; ahorro: number; }

const PESOS: Record<EstiloIA, Pesos> = {
  agresivo: { ataque: 1.35, defensa: 0.6, control: 0.9, curar: 0.8, magia: 1, fisico: 1, ahorro: 0.6 },
  defensivo: { ataque: 0.85, defensa: 1.5, control: 1.1, curar: 1.3, magia: 1, fisico: 1, ahorro: 1.2 },
  equilibrado: { ataque: 1, defensa: 1, control: 1, curar: 1, magia: 1, fisico: 1, ahorro: 1 },
  tactico: { ataque: 1, defensa: 1.1, control: 1.5, curar: 1.1, magia: 1, fisico: 1, ahorro: 1.3 },
  magico: { ataque: 1.1, defensa: 1, control: 1.2, curar: 1, magia: 1.2, fisico: 0.8, ahorro: 1.1 },
  fisico: { ataque: 1.25, defensa: 0.9, control: 1, curar: 0.8, magia: 0.7, fisico: 1.3, ahorro: 0.8 },
  adaptativo: { ataque: 1, defensa: 1, control: 1.3, curar: 1.1, magia: 1, fisico: 1, ahorro: 1.2 },
};

const VALOR_ESTADO: Partial<Record<EstadoId, number>> = {
  congelacion: 14, aturdimiento: 12, dormido: 14, inmovilizacion: 6, silencio: 10, quemadura: 6, ralentizado: 5, cegado: 4, mojado: 3, defensa_baja: 5,
};
const VALOR_PROPIO: Partial<Record<EstadoId, number>> = { aura_batalla: 10, absorcion: 8, oculto: 4, iluminado: 2, evasion_total: 6, regeneracion: 5 };
const NEGATIVOS: EstadoId[] = ['congelacion', 'inmovilizacion', 'quemadura', 'ralentizado', 'mojado', 'cegado', 'silencio', 'defensa_baja'];

function pesosPara(c: Combatiente, motor: CombatEngine): Pesos {
  const w = { ...PESOS[c.ia] };
  if (c.ia === 'adaptativo') { // se adapta a lo que ha visto del rival
    const o = motor.observar(c);
    if (o.proporcionMagia > 0.65) { w.defensa *= 1.3; w.magia *= 0.9; }
    else if (o.proporcionMagia < 0.35) { w.fisico *= 1.1; w.defensa *= 1.2; }
  }
  return w;
}

function puntuar(motor: CombatEngine, c: Combatiente, rival: Combatiente, d: Disponible, w: Pesos): number {
  const a = d.accion;
  const hpPropio = c.hp / c.attr.hpMax;
  const manaPct = c.mana / c.attr.manaMax;
  const o = motor.observar(c);
  const est = motor.estimar(c, a);
  const h = d.habilidad;
  let s = 0;

  if (a.tipo === 'defender') {
    const presion = 1 - hpPropio + (o.ultimaFueMagia === null ? 0 : 0.3);
    return 3 * w.defensa * presion;
  }
  if (a.tipo === 'meditar') return manaPct < 0.45 ? (1 - manaPct) * 26 * w.ahorro : 0;

  // daño esperado (en % de la vida máxima del rival) y remate
  s += (est.danio / rival.attr.hpMax) * 100 * w.ataque;
  if (est.mata) s += 70 * est.prob;
  if (a.tipo === 'golpe') s += (manaPct < 0.25 ? 6 : 0) + 2 * w.fisico;

  if (h) {
    // coste: no gastar mucho maná en poco efecto
    // coste en proporción a la reserva: pesa más cuanto menos maná queda
    if (h.manaCost > 0) s -= (h.manaCost / c.attr.manaMax) * 100 * 0.35 * w.ahorro * (1.2 - manaPct);
    if (c.mana - h.manaCost < c.attr.manaMax * 0.1) s -= 6 * w.ahorro;
    s *= h.esMagia ? w.magia : w.fisico;
    // si el rival ya mostró que interrumpe, los hechizos caros son riesgosos
    const rivalInterrumpe = o.usadas.some((id) => CATALOGO_POR_ID[id]?.efectos.some((e) => e.t === 'interrumpir'));
    if (rivalInterrumpe && h.esMagia && h.objetivo === 'enemigo') s -= h.manaCost * 0.08;
    if (h.funcion === 'ofensiva' && est.danio / rival.attr.hpMax < 0.04 && !est.estados.length) s -= 6;
  }

  // estados sobre el rival (control) y propios (apoyo)
  for (const e of est.estados) {
    if (h?.objetivo === 'si_mismo') { if (!motor.tiene(c, e.id)) s += (VALOR_PROPIO[e.id] ?? 6) * w.defensa * (e.id === 'aura_batalla' ? w.fisico : 1); }
    else if (!motor.tiene(rival, e.id)) s += e.prob * (VALOR_ESTADO[e.id] ?? 6) * w.control;
  }

  // curación: más valiosa cuanto menos vida queda
  if (est.cura > 0) s += (est.cura / c.attr.hpMax) * 100 * w.curar * Math.max(0, 0.65 - hpPropio) * 3;

  // escudos: útiles contra el tipo de daño que el rival ha usado
  if (est.escudo && !c.escudos.some((x) => x.clase === est.escudo)) {
    const acierta = (est.escudo === 'mag') === (o.ultimaFueMagia ?? o.proporcionMagia >= 0.5);
    s += (acierta ? 11 : 3) * w.defensa;
  }

  // liberar estados negativos
  if (h) for (const e of h.efectos) if (e.t === 'limpiar') s += c.estados.filter((x) => e.ids.includes(x.id) && NEGATIVOS.includes(x.id)).length * 11;

  // no desperdiciar efectos que no sirven: curar con la vida llena, invocar dos veces
  if (h?.efectos.some((e) => e.t === 'curar') && est.cura <= 0) s -= 30;
  if (h?.efectos.some((e) => e.t === 'curar') && hpPropio > 0.65) s -= 12;
  if (h?.efectos.some((e) => e.t === 'invocar') && motor.tiene(c, 'invocacion')) s -= 30;
  return s;
}

export function decidirAccion(motor: CombatEngine, c: Combatiente): Accion {
  const rival = motor.enemigos(c)[0];
  const w = pesosPara(c, motor);
  const opciones = motor.accionesDisponibles(c).filter((d) => d.usable);
  let mejor: Disponible | null = null;
  let mejorPuntos = -Infinity;
  for (const d of opciones) {
    const p = puntuar(motor, c, rival, d, w) + motor.azar() * 0.6; // desempate con el azar de la partida
    if (p > mejorPuntos) { mejorPuntos = p; mejor = d; }
  }
  return mejor ? mejor.accion : { tipo: 'defender', actorId: c.id };
}

/** ¿Usar Perturbar la magia contra el hechizo que acaba de anunciar el rival? Devuelve el id de la habilidad o null. */
export function decidirReaccion(motor: CombatEngine, r: Combatiente, lanzada: Habilidad): string | null {
  const lanzador = motor.actor;
  const opciones = motor.opcionesReaccion(r, lanzador);
  if (!opciones.length) return null;
  const est = motor.estimar(lanzador, { tipo: 'habilidad', actorId: lanzador.id, habilidadId: lanzada.id, objetivoId: r.id });
  const amenaza = (est.danio / r.attr.hpMax) * 100 + est.estados.reduce((s, e) => s + e.prob * (VALOR_ESTADO[e.id] ?? 0), 0) * 0.5;
  let mejor: string | null = null;
  let mejorValor = 0;
  for (const id of opciones) {
    const hi = CATALOGO_POR_ID[id];
    const prob = motor.probInterrupcion(r, lanzador, lanzada, hi);
    const reserva = r.attr.manaMax * 0.1;
    if (r.mana - hi.manaCost < reserva) continue; // no gasta el maná que necesita para sí
    const umbral = r.ia === 'adaptativo' || r.ia === 'tactico' ? 6 : 10;
    const valor = prob * amenaza - hi.manaCost * 0.1;
    if (valor >= umbral && valor > mejorValor) { mejorValor = valor; mejor = id; }
  }
  return mejor;
}
