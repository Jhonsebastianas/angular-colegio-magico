import { efectividad } from './pokemon-data';
import { Combatiente, Movimiento, PokemonDatos, ResultadoGolpe, StatsBase } from './pokemon.models';

export const NIVEL = 50;
/** Ajusta la duración de los combates (≈5-7 rondas por combate). */
export const ESCALA_DANIO = 0.62;
/** Ningún golpe puede quitar más de este porcentaje de los PS máximos: evita one-shots. */
export const LIMITE_GOLPE = 0.35;
export const PORCENTAJE_CURA = 0.15;
export const PORCENTAJE_RETROCESO = 0.12;
export const ID_FORCEJEO = 0;

/** Se usa cuando no quedan ataques utilizables (PP agotados o inmunidad total). */
export const FORCEJEO: Movimiento = {
  id: ID_FORCEJEO,
  nombre: 'Forcejeo',
  tipo: 'Ataque',
  elemento: 'normal',
  categoria: 'physical',
  poder: 45,
  precision: 100,
  ppMax: 1,
  pp: 1
};

/** Comprime los stats base (5-255) con una raíz cuadrada para que ningún Pokémon domine por completo. */
export const normalizarStat = (base: number): number => Math.round(70 + 6 * Math.sqrt(base));

export const statsTotal = (s: StatsBase): number =>
  s.hp + s.attack + s.defense + s.spAttack + s.spDefense + s.speed;

export function crearCombatiente(datos: PokemonDatos): Combatiente {
  const s = datos.stats;
  const hpMax = Math.round(normalizarStat(s.hp) * 1.4 + 70);
  return {
    datos,
    id: datos.id,
    nombre: datos.nombre,
    tipos: datos.tipos,
    imagen: datos.imagen,
    hp: hpMax,
    hpMax,
    ataque: normalizarStat(s.attack),
    defensa: normalizarStat(s.defense),
    ataqueEsp: normalizarStat(s.spAttack),
    defensaEsp: normalizarStat(s.spDefense),
    velocidad: normalizarStat(s.speed),
    movimientos: datos.movimientos.map((m) => ({ ...m, pp: m.ppMax }))
  };
}

export const cantidadCura = (c: Combatiente): number => Math.round(c.hpMax * PORCENTAJE_CURA);

/** La velocidad solo influye en la probabilidad de golpe crítico (4 % - 10 %). */
const probabilidadCritico = (c: Combatiente): number => 0.04 + (c.velocidad / 183) * 0.06;

export function calcularGolpe(
  atacante: Combatiente,
  defensor: Combatiente,
  mov: Movimiento,
  azar: boolean
): ResultadoGolpe {
  const esForcejeo = mov.id === ID_FORCEJEO;
  const ef = esForcejeo ? 1 : efectividad(mov.elemento, defensor.tipos);
  if (ef === 0) return { danio: 0, efectividad: 0, critico: false, stab: false };

  const fisico = mov.categoria === 'physical';
  const ataque = fisico ? atacante.ataque : atacante.ataqueEsp;
  const defensa = fisico ? defensor.defensa : defensor.defensaEsp;
  const poder = mov.poder * (0.75 + 0.25 * (mov.precision / 100));
  const stab = !esForcejeo && atacante.tipos.includes(mov.elemento);
  const critico = azar && Math.random() < probabilidadCritico(atacante);
  const variacion = azar ? 0.88 + Math.random() * 0.12 : 0.94;

  const base = (((2 * NIVEL) / 5 + 2) * poder * (ataque / defensa)) / 50 + 2;
  const bruto = base * ESCALA_DANIO * ef * (stab ? 1.5 : 1) * (critico ? 1.5 : 1) * variacion;
  const limitado = Math.min(bruto, defensor.hpMax * LIMITE_GOLPE);

  return { danio: Math.max(1, Math.round(limitado)), efectividad: ef, critico, stab };
}

/** Movimientos que se muestran en el turno (incluye Forcejeo si no hay ataques útiles). */
export function opcionesTurno(c: Combatiente, rival: Combatiente | null): Movimiento[] {
  const ataques = c.movimientos.filter((m) => m.tipo === 'Ataque' && m.pp > 0);
  const sinUtilidad =
    ataques.length === 0 || (rival !== null && ataques.every((m) => efectividad(m.elemento, rival.tipos) === 0));
  return sinUtilidad ? [...c.movimientos, FORCEJEO] : c.movimientos;
}

const esUsable = (m: Movimiento): boolean => m.pp > 0 || m.id === ID_FORCEJEO;

/**
 * IA de la CPU:
 * 1. Remata si algún ataque deja al rival sin PS.
 * 2. Se cura cuando va mal y el rival no puede liquidarla igualmente.
 * 3. Si no, ataca con el mayor daño esperado (con un 20 % de variar al segundo mejor).
 */
export function elegirMovimientoCpu(
  cpu: Combatiente,
  rival: Combatiente,
  azar: () => number = Math.random
): Movimiento {
  const opciones = opcionesTurno(cpu, rival).filter(esUsable);
  const ataques = opciones
    .filter((m) => m.tipo === 'Ataque')
    .map((mov) => ({ mov, danio: calcularGolpe(cpu, rival, mov, false).danio }))
    .sort((a, b) => b.danio - a.danio);
  const sanacion = opciones.find((m) => m.tipo === 'Sanacion');

  const remate = ataques.find((a) => a.danio >= rival.hp);
  if (remate) return remate.mov;

  if (sanacion && cpu.hp < cpu.hpMax) {
    const amenaza = Math.max(
      0,
      ...opcionesTurno(rival, cpu)
        .filter((m) => esUsable(m) && m.tipo === 'Ataque')
        .map((m) => calcularGolpe(rival, cpu, m, false).danio)
    );
    const vida = cpu.hp / cpu.hpMax;
    if (vida < 0.45 && amenaza < cpu.hp + cantidadCura(cpu) && azar() < 0.75) return sanacion;
  }

  if (ataques.length === 0) return sanacion ?? FORCEJEO;
  const [mejor, segundo] = ataques;
  if (mejor.danio === 0) return FORCEJEO;
  if (segundo && segundo.danio >= mejor.danio * 0.65 && azar() < 0.2) return segundo.mov;
  return mejor.mov;
}