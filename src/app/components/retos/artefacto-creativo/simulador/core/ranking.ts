import { DefPersonaje } from './models';
import { BALANCE } from './balance.config';
import { CATALOGO_POR_ID } from './catalogo';

/** Puntuación de referencia para ordenar personajes. Valores de balance; NO decide el resultado de un combate. */
export function puntuacionPoder(p: DefPersonaje): number {
  const a = p.atributos;
  const hab = p.habilidades.map((id) => CATALOGO_POR_ID[id]).filter(Boolean);
  const ofensa = Math.max(a.atkFis, a.poderMag);
  const resistencia = (a.hpMax * (1 + (a.defFis + a.resMag) / 200)) / 10;
  const elementos = new Set(hab.map((h) => h.elemento).filter((e) => e !== 'neutral' && e !== 'fisico')).size;
  const control = hab.filter((h) => h.funcion === 'control' || h.funcion === 'especial').length;
  const pesos = BALANCE.puntuacion;
  return Math.round(ofensa * pesos.ofensa + resistencia * pesos.defensa + Math.min(elementos, 6) * pesos.versatilidad + Math.min(control, 6) * pesos.control + a.manaMax * pesos.recursos + a.evasion + a.resEstado * 60);
}

export function categoriaDePoder(puntos: number): string {
  if (puntos >= 330) return 'S+';
  if (puntos >= 270) return 'S';
  if (puntos >= 220) return 'A';
  return 'B';
}
