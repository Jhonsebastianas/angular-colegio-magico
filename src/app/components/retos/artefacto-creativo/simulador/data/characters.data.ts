import { DefPersonaje, Habilidad } from '../core/models';
import { BALANCE } from '../core/balance.config';
import { CATALOGO } from '../core/catalogo';

const ids = (pred: (h: Habilidad) => boolean): string[] => CATALOGO.filter((h) => h.jugable && !h.restriccion && pred(h)).map((h) => h.id);
const rn = (h: Habilidad): number => BALANCE.rangoNum[h.rango];
const mag = (h: Habilidad): boolean => h.categoria !== 'Combate físico';

/**
 * Los atributos son valores de balance inventados para el simulador.
 * Qué habilidades puede usar cada personaje: «documento» si el documento lo respalda,
 * «interpretacion» cuando se deduce de la historia y «mixta» si hay de ambas.
 */
export const PERSONAJES: DefPersonaje[] = [
  {
    id: 'rudeus-adulto', nombre: 'Rudeus Greyrat', version: 'Adulto',
    descripcion: 'Mago de una versatilidad enorme: domina todos los elementos, combina hechizos y prepara el campo antes de golpear.',
    categoria: 'Mago de élite', estilo: 'Control del campo, magia fusionada y gestión del maná', ia: 'magico',
    imagen: { retrato: 'rudeus.jpg', mk0: 'rudeus-mk0.jpg' },
    atributos: { hpMax: 520, manaMax: 320, atkFis: 40, poderMag: 110, defFis: 35, resMag: 45, vel: 55, precision: 100, evasion: 8, resEstado: 0.15, regenMana: 10 },
    habilidades: ids((h) => mag(h) && !['puerta-del-dragon', 'magia-de-hipnosis', 'barrera-de-confinamiento'].includes(h.id)),
    equipadas: ['canon-de-piedra', 'quagmire', 'canon-de-agua', 'iluminacion', 'explosion-nuclear', 'perturbar-la-magia', 'escudo-magico', 'x-healing'],
    pasivas: ['Versatilidad: puede usar los cinco elementos (ya reflejada en su lista de hechizos).'],
    debilidades: ['Poca defensa física', 'Depende del maná', 'Sus hechizos mayores tienen enfriamiento largo'],
    habilidadesFuente: 'mixta', puedeMK0: true,
  },
  {
    id: 'rudeus-joven', nombre: 'Rudeus Greyrat', version: 'Joven',
    descripcion: 'Rudeus en sus primeros años de aprendizaje: hechizos elementales e intermedios y mucho talento.',
    categoria: 'Mago prometedor', estilo: 'Magia elemental sencilla y recuperación', ia: 'equilibrado',
    imagen: { retrato: '' },
    atributos: { hpMax: 300, manaMax: 180, atkFis: 25, poderMag: 70, defFis: 20, resMag: 25, vel: 50, precision: 100, evasion: 8, resEstado: 0.1, regenMana: 7 },
    habilidades: ids((h) => rn(h) <= 2 && !['Única', 'Invocación', 'Combate físico', 'Golpe divino'].includes(h.categoria)),
    equipadas: ['bala-de-roca', 'bola-de-agua', 'bola-de-fuego', 'rebanada-de-viento', 'escudo-magico', 'cicatrizacion'],
    pasivas: [], debilidades: ['Poca vida', 'Poco maná', 'Sin hechizos avanzados'],
    habilidadesFuente: 'interpretacion',
  },
  {
    id: 'orsted', nombre: 'Orsted', nombreAlterno: 'Dios Dragón',
    descripcion: 'Combatiente de élite: resiste, lee al rival y anula su magia en el momento justo; su espada responde cuando la magia no basta.',
    categoria: 'Élite', estilo: 'Contraataque táctico: interrumpe, absorbe y castiga', ia: 'adaptativo',
    imagen: { retrato: 'orsted.jpg' },
    atributos: { hpMax: 900, manaMax: 340, atkFis: 170, poderMag: 110, defFis: 65, resMag: 65, vel: 75, precision: 105, evasion: 18, resEstado: 0.45, regenMana: 10 },
    habilidades: ['perturbar-la-magia', 'puerta-del-dragon', 'invocacion-de-monstruo', 'magia-de-teletransportacion', 'magia-de-hipnosis', 'espadazo', 'tajo-veloz', 'embestida', 'aura-de-batalla', 'sobreexposicion', 'tornado', 'erizo-terrestre', 'cumulonimbo', 'llama-del-exodo'],
    equipadas: ['espadazo', 'aura-de-batalla', 'perturbar-la-magia', 'puerta-del-dragon', 'magia-de-hipnosis', 'magia-de-teletransportacion', 'sobreexposicion', 'tornado'],
    pasivas: ['Resistencia de élite: alta resistencia a estados (ya reflejada en sus atributos).'],
    debilidades: ['Perturbar la magia tiene enfriamiento', 'Sus hechizos mayores gastan mucho maná', 'Poco maná frente a un combate largo'],
    habilidadesFuente: 'mixta',
  },
  {
    id: 'roxy', nombre: 'Roxy Migurdia',
    descripcion: 'Maga de agua precisa y eficiente, con curación elemental y buen control del ritmo del combate.',
    categoria: 'Maga', estilo: 'Agua, hielo y control del ritmo', ia: 'tactico',
    imagen: { retrato: 'roxy.jpg' },
    atributos: { hpMax: 360, manaMax: 260, atkFis: 30, poderMag: 85, defFis: 25, resMag: 40, vel: 55, precision: 100, evasion: 8, resEstado: 0.1, regenMana: 9 },
    habilidades: ids((h) => (['Agua', 'Hielo'].includes(h.categoria) && rn(h) <= 3) || ['bola-de-fuego', 'rebanada-de-llama', 'bala-de-roca', 'rafaga-de-viento', 'cicatrizacion', 'x-healing', 'escudo-magico', 'escudo-fisico', 'muro-de-tierra'].includes(h.id)),
    equipadas: ['bola-de-agua', 'canon-de-agua', 'pilar-de-hielo', 'escudo-de-agua', 'descarga-por-inundacion', 'salpicadura-de-agua', 'rebanada-de-llama', 'cicatrizacion'],
    pasivas: [], debilidades: ['Poca vida', 'Vulnerable al daño físico'],
    habilidadesFuente: 'mixta',
  },
  {
    id: 'sylphiette', nombre: 'Sylphiette', nombreAlterno: 'Sylphy',
    descripcion: 'Maga veloz de viento con curación y la capacidad de interrumpir hechizos.',
    categoria: 'Maga', estilo: 'Velocidad, viento y apoyo', ia: 'tactico',
    imagen: { retrato: 'sylphy.jpg' },
    atributos: { hpMax: 340, manaMax: 240, atkFis: 28, poderMag: 88, defFis: 24, resMag: 38, vel: 70, precision: 100, evasion: 12, resEstado: 0.1, regenMana: 9 },
    habilidades: ids((h) => (h.categoria === 'Viento' && rn(h) <= 3) || ['perturbar-la-magia', 'cicatrizacion', 'x-healing', 'escudo-magico', 'bola-de-agua', 'flecha-de-agua', 'bala-de-roca'].includes(h.id)),
    equipadas: ['explosion-sonica', 'rebanada-de-viento', 'explosion-sonica-avanzada', 'impacto-del-tornado', 'enlace-de-viento', 'perturbar-la-magia', 'cicatrizacion', 'x-healing'],
    pasivas: [], debilidades: ['Poca vida', 'Depende de golpear primero'],
    habilidadesFuente: 'mixta',
  },
  {
    id: 'eris', nombre: 'Eris Boreas Greyrat', nombreAlterno: 'Eris',
    descripcion: 'Espadachina feroz: casi no usa magia, pero golpea muy fuerte, aguanta y se mueve rápido.',
    categoria: 'Guerrera', estilo: 'Combate físico agresivo', ia: 'fisico',
    imagen: { retrato: 'eris.jpg' },
    atributos: { hpMax: 480, manaMax: 110, atkFis: 105, poderMag: 10, defFis: 50, resMag: 15, vel: 80, precision: 100, evasion: 15, resEstado: 0.2, regenMana: 6 },
    habilidades: ['espadazo', 'tajo-veloz', 'embestida', 'aura-de-batalla'],
    equipadas: ['espadazo', 'tajo-veloz', 'embestida', 'aura-de-batalla'],
    pasivas: [], debilidades: ['Casi sin resistencia mágica', 'Sin hechizos de curación ni de escudo'],
    habilidadesFuente: 'interpretacion',
  },
];

export const PERSONAJES_POR_ID: Record<string, DefPersonaje> = Object.fromEntries(PERSONAJES.map((p) => [p.id, p]));
