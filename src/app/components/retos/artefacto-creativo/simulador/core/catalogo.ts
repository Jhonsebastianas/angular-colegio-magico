import { Habilidad, HabilidadBase } from './models';
import { BALANCE } from './balance.config';
import { HABILIDADES_BASE } from '../data/spells.data';

/** Convierte cada entrada del documento en una habilidad jugable aplicando los coeficientes de balance. */
export function construirHabilidad(b: HabilidadBase): Habilidad {
  const t = BALANCE.tabla[b.rango];
  return {
    ...b,
    manaCost: Math.round(t.mana * (b.costo ?? 1)),
    cooldown: b.cd ?? t.cd,
    power: Math.round(t.pow * (b.pot ?? 1)),
    accuracy: b.prec ?? 95,
    esMagia: b.esMagia ?? b.categoria !== 'Combate físico',
    interrumpible: b.interrumpible ?? b.categoria !== 'Combate físico',
    soloReaccion: b.soloReaccion ?? false,
    jugable: b.jugable ?? true,
    imagen: `hechizos/${b.id}.webp`,
  };
}

export const CATALOGO: Habilidad[] = HABILIDADES_BASE.map(construirHabilidad);
export const CATALOGO_POR_ID: Record<string, Habilidad> = Object.fromEntries(CATALOGO.map((h) => [h.id, h]));
