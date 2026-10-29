import { Rango } from './models';

/**
 * TODOS los números de este archivo son valores de balance inventados para el simulador.
 * No son datos oficiales de Mushoku Tensei. Se pueden ajustar sin tocar el motor.
 */
export const BALANCE = {
  escalaAtaque: 100, // dano = poder * (1 + ataque / escalaAtaque)
  factorDefensa: 1, // mitigación = 100 / (100 + defensa * factorDefensa)
  variacion: 0.08, // ±8 % de variación aleatoria del daño
  critProb: 0.06,
  critMult: 1.5,
  golpeBasico: { power: 30, accuracy: 95 },
  meditarManaPct: 0.18,
  /** Cada impacto drena maná al objetivo: fracción del daño recibido (mágico / físico). Hace que un rival golpeado se quede sin maná. */
  drenajeMana: { mag: 0.35, fis: 0.15 },
  ccInmunidad: 1, // turnos de inmunidad a aturdimiento/congelación/sueño tras perder un turno
  maxEquipadas: 8,
  limiteRondas: 40,
  escudoEscala: 0.5, // valor del escudo = fuerza * poderMag * escudoEscala
  dotPct: 0.03, // daño gradual por pila y turno (porcentaje de vida máxima)
  sinergias: { mojadoHielo: 1.3, mojadoRayo: 1.4, fuegoSobreCongelado: 1.25, mojadoCongelacion: 1.5 },
  absorcion: { reduccion: 0.5, manaDevuelto: 0.5 }, // Puerta del Dragón
  /** Perturbar la magia: solo interrumpe magia interrumpible y puede fallar. */
  interrupcion: { base: 0.55, porPoder: 0.004, porRango: 0.08, min: 0.1, max: 0.9, selloTurnos: 1 },
  rangoNum: { Elemental: 1, Intermedio: 2, Avanzado: 3, 'Smo.': 4, Rey: 5, Imperial: 6, Divino: 7, Desconocido: 3 } as Record<Rango, number>,
  tabla: {
    Elemental: { pow: 20, mana: 6, cd: 0 },
    Intermedio: { pow: 32, mana: 12, cd: 0 },
    Avanzado: { pow: 50, mana: 22, cd: 1 },
    'Smo.': { pow: 70, mana: 36, cd: 2 },
    Rey: { pow: 95, mana: 55, cd: 3 },
    Imperial: { pow: 130, mana: 80, cd: 4 },
    Divino: { pow: 160, mana: 100, cd: 5 },
    Desconocido: { pow: 50, mana: 22, cd: 1 },
  } as Record<Rango, { pow: number; mana: number; cd: number }>,
  puntuacion: { ofensa: 1.0, defensa: 0.8, versatilidad: 8, control: 10, recursos: 0.15 }, // versatilidad y control cuentan hasta 6
};

/** Armadura mágica MK0 (equipamiento de Rudeus). Valores de balance, no oficiales. */
export const MK0 = { hp: 1.06, mana: 1.1, poderMag: 1.03, atkFis: 1.03, defFis: 2, resMag: 2, vel: 1.05 };
