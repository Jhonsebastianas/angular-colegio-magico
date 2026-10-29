import { EstadoId } from './models';

export interface DefEstado {
  id: EstadoId;
  nombre: string;
  icono: string;
  descripcion: string;
  maxTurnos: number; // tope de duración: refrescar nunca lo supera
  maxPilas: number; // 1 = no se acumula (solo se refresca)
  impideActuar?: boolean; // pierde el turno (activa la inmunidad a control duro)
  bloqueaMagia?: boolean;
  bloqueaFisico?: boolean;
  dotPct?: number; // daño gradual por pila (fracción de la vida máxima)
  hotPct?: number;
  mods?: Partial<Record<'vel' | 'defFis' | 'resMag' | 'precision' | 'atkFis' | 'poderMag', number>>; // multiplicadores
  evasionExtra?: number; // suma a la evasión
  evasionCero?: boolean;
  expiraAlInicio?: boolean; // desaparece al empezar el siguiente turno del portador
  seRompeConDanio?: boolean;
  esquivaTodo?: boolean;
}

/**
 * Reglas explícitas:
 *  - Refrescar un estado fija su duración en max(actual, nueva), limitada por maxTurnos.
 *  - Solo quemadura se acumula (hasta maxPilas); el resto no.
 *  - La duración baja 1 al final del turno del portador.
 *  - Aturdimiento, congelación y sueño hacen perder el turno y dan ccInmunidad turnos de inmunidad a ellos.
 *  - Cada estado se aplica con probabilidad prob * (1 - resistencia del objetivo), con mínimo 5 %.
 */
export const ESTADOS: Record<EstadoId, DefEstado> = {
  quemadura: { id: 'quemadura', nombre: 'Quemadura', icono: '🔥', descripcion: 'Daño gradual; se acumula hasta 3 veces.', maxTurnos: 5, maxPilas: 3, dotPct: 0.03 },
  congelacion: { id: 'congelacion', nombre: 'Congelación', icono: '🧊', descripcion: 'Pierde el turno. El fuego la rompe.', maxTurnos: 3, maxPilas: 1, impideActuar: true },
  inmovilizacion: { id: 'inmovilizacion', nombre: 'Inmovilización', icono: '⛓️', descripcion: 'No puede atacar físicamente y no esquiva.', maxTurnos: 3, maxPilas: 1, bloqueaFisico: true, evasionCero: true },
  aturdimiento: { id: 'aturdimiento', nombre: 'Aturdimiento', icono: '💫', descripcion: 'Pierde el turno.', maxTurnos: 2, maxPilas: 1, impideActuar: true },
  mojado: { id: 'mojado', nombre: 'Mojado', icono: '💧', descripcion: 'Más vulnerable al hielo y al rayo.', maxTurnos: 5, maxPilas: 1 },
  regeneracion: { id: 'regeneracion', nombre: 'Regeneración', icono: '💚', descripcion: 'Recupera vida cada turno.', maxTurnos: 5, maxPilas: 1, hotPct: 0.05 },
  defensa_baja: { id: 'defensa_baja', nombre: 'Defensa reducida', icono: '🛡️', descripcion: 'Defensas al 80 %.', maxTurnos: 4, maxPilas: 1, mods: { defFis: 0.8, resMag: 0.8 } },
  ralentizado: { id: 'ralentizado', nombre: 'Ralentizado', icono: '🐌', descripcion: 'Velocidad al 60 %.', maxTurnos: 4, maxPilas: 1, mods: { vel: 0.6 } },
  silencio: { id: 'silencio', nombre: 'Silenciado', icono: '🔇', descripcion: 'No puede lanzar magia.', maxTurnos: 3, maxPilas: 1, bloqueaMagia: true },
  cegado: { id: 'cegado', nombre: 'Cegado', icono: '🌫️', descripcion: 'Precisión al 60 %.', maxTurnos: 4, maxPilas: 1, mods: { precision: 0.6 } },
  iluminado: { id: 'iluminado', nombre: 'Iluminado', icono: '✨', descripcion: 'Precisión +25 %.', maxTurnos: 4, maxPilas: 1, mods: { precision: 1.25 } },
  evasion_total: { id: 'evasion_total', nombre: 'Teletransportado', icono: '🌀', descripcion: 'Esquiva todo ataque hasta su próximo turno.', maxTurnos: 1, maxPilas: 1, expiraAlInicio: true, esquivaTodo: true },
  invocacion: { id: 'invocacion', nombre: 'Invocación activa', icono: '🐺', descripcion: 'Una criatura ataca al rival cada turno.', maxTurnos: 6, maxPilas: 1 },
  dormido: { id: 'dormido', nombre: 'Dormido', icono: '😴', descripcion: 'Pierde el turno; el daño lo despierta.', maxTurnos: 3, maxPilas: 1, impideActuar: true, seRompeConDanio: true },
  absorcion: { id: 'absorcion', nombre: 'Puerta del Dragón', icono: '🐉', descripcion: 'Reduce el daño mágico a la mitad y devuelve parte como maná.', maxTurnos: 4, maxPilas: 1 },
  oculto: { id: 'oculto', nombre: 'Oculto', icono: '🌫️', descripcion: 'Evasión +35.', maxTurnos: 3, maxPilas: 1, evasionExtra: 35 },
  aura_batalla: { id: 'aura_batalla', nombre: 'Aura de batalla', icono: '⚔️', descripcion: 'Ataque físico +30 %, defensa física +25 %.', maxTurnos: 4, maxPilas: 1, mods: { atkFis: 1.3, defFis: 1.25 } },
  defendiendo: { id: 'defendiendo', nombre: 'En guardia', icono: '🛡️', descripcion: 'Defensas +60 % hasta su próximo turno.', maxTurnos: 1, maxPilas: 1, expiraAlInicio: true, mods: { defFis: 1.6, resMag: 1.6 } },
};
