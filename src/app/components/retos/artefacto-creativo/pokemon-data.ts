import {
  CategoriaMovimiento,
  Movimiento,
  PokemonDatos,
  StatsBase,
  TipoPokemon
} from './pokemon.models';

export const TOTAL_POKEMON = 1025;

export const TIPOS: TipoPokemon[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const TIPO_INFO: Record<TipoPokemon, { nombre: string; color: string }> = {
  normal: { nombre: 'Normal', color: '#a8a77a' },
  fire: { nombre: 'Fuego', color: '#ee8130' },
  water: { nombre: 'Agua', color: '#6390f0' },
  electric: { nombre: 'Eléctrico', color: '#f7d02c' },
  grass: { nombre: 'Planta', color: '#7ac74c' },
  ice: { nombre: 'Hielo', color: '#96d9d6' },
  fighting: { nombre: 'Lucha', color: '#c22e28' },
  poison: { nombre: 'Veneno', color: '#a33ea1' },
  ground: { nombre: 'Tierra', color: '#e2bf65' },
  flying: { nombre: 'Volador', color: '#a98ff3' },
  psychic: { nombre: 'Psíquico', color: '#f95587' },
  bug: { nombre: 'Bicho', color: '#a6b91a' },
  rock: { nombre: 'Roca', color: '#b6a136' },
  ghost: { nombre: 'Fantasma', color: '#735797' },
  dragon: { nombre: 'Dragón', color: '#6f35fc' },
  dark: { nombre: 'Siniestro', color: '#705746' },
  steel: { nombre: 'Acero', color: '#b7b7ce' },
  fairy: { nombre: 'Hada', color: '#d685ad' }
};

export const GENERACIONES = [
  { n: 1, nombre: 'I · Kanto', desde: 1, hasta: 151 },
  { n: 2, nombre: 'II · Johto', desde: 152, hasta: 251 },
  { n: 3, nombre: 'III · Hoenn', desde: 252, hasta: 386 },
  { n: 4, nombre: 'IV · Sinnoh', desde: 387, hasta: 493 },
  { n: 5, nombre: 'V · Teselia', desde: 494, hasta: 649 },
  { n: 6, nombre: 'VI · Kalos', desde: 650, hasta: 721 },
  { n: 7, nombre: 'VII · Alola', desde: 722, hasta: 809 },
  { n: 8, nombre: 'VIII · Galar', desde: 810, hasta: 905 },
  { n: 9, nombre: 'IX · Paldea', desde: 906, hasta: 1025 }
];

// ---------------------------------------------------------------------------
// Tabla de tipos (Gen 6+). Se embebe para que la efectividad funcione offline.
// ---------------------------------------------------------------------------
const lista = (texto: string): TipoPokemon[] => texto.split(' ').filter(Boolean) as TipoPokemon[];
const fila = (x2: string, x05: string, x0 = '') => ({ x2: lista(x2), x05: lista(x05), x0: lista(x0) });

const TABLA_TIPOS: Record<TipoPokemon, { x2: TipoPokemon[]; x05: TipoPokemon[]; x0: TipoPokemon[] }> = {
  normal: fila('', 'rock steel', 'ghost'),
  fire: fila('grass ice bug steel', 'fire water rock dragon'),
  water: fila('fire ground rock', 'water grass dragon'),
  electric: fila('water flying', 'electric grass dragon', 'ground'),
  grass: fila('water ground rock', 'fire grass poison flying bug dragon steel'),
  ice: fila('grass ground flying dragon', 'fire water ice steel'),
  fighting: fila('normal ice rock dark steel', 'poison flying psychic bug fairy', 'ghost'),
  poison: fila('grass fairy', 'poison ground rock ghost', 'steel'),
  ground: fila('fire electric poison rock steel', 'grass bug', 'flying'),
  flying: fila('grass fighting bug', 'electric rock steel'),
  psychic: fila('fighting poison', 'psychic steel', 'dark'),
  bug: fila('grass psychic dark', 'fire fighting poison flying ghost steel fairy'),
  rock: fila('fire ice flying bug', 'fighting ground steel'),
  ghost: fila('psychic ghost', 'dark', 'normal'),
  dragon: fila('dragon', 'steel', 'fairy'),
  dark: fila('psychic ghost', 'fighting dark fairy'),
  steel: fila('ice rock fairy', 'fire water electric steel'),
  fairy: fila('fighting dragon dark', 'fire poison steel')
};

export function efectividad(ataque: TipoPokemon, defensor: TipoPokemon[]): number {
  const relacion = TABLA_TIPOS[ataque];
  return defensor.reduce((total, tipo) => {
    if (relacion.x0.includes(tipo)) return 0;
    if (relacion.x2.includes(tipo)) return total * 2;
    if (relacion.x05.includes(tipo)) return total * 0.5;
    return total;
  }, 1);
}

// ---------------------------------------------------------------------------
// Utilidades de datos
// ---------------------------------------------------------------------------
export const esTipo = (valor: string): valor is TipoPokemon => (TIPOS as string[]).includes(valor);

export const urlArte = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const urlSprite = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const POKEBOLA_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
  "<circle cx='50' cy='50' r='44' fill='#e2e8f0' stroke='#0f172a' stroke-width='6'/>" +
  "<path d='M6 50a44 44 0 0 1 88 0z' fill='#ef4444' stroke='#0f172a' stroke-width='6'/>" +
  "<circle cx='50' cy='50' r='12' fill='#fff' stroke='#0f172a' stroke-width='6'/></svg>";
export const POKEBOLA = 'data:image/svg+xml,' + encodeURIComponent(POKEBOLA_SVG);

export function formatearNombre(crudo: string): string {
  return crudo
    .replace(/-(normal|altered|incarnate|plant|standard|ordinary|average|land|male|shield|disguised|solo|midday|aria|zero|50)$/, '')
    .split('-')
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

/** Las curaciones son escasas para que no desequilibren el combate. */
export const PP_CURACION = 3;

export const escalarPp = (pp: number): number => Math.min(20, Math.max(5, Math.round(pp * 0.7)));

export const MOVIMIENTOS_SANACION: Record<string, { nombre: string; elemento: TipoPokemon }> = {
  'recover': { nombre: 'Recuperación', elemento: 'normal' },
  'roost': { nombre: 'Respiro', elemento: 'flying' },
  'soft-boiled': { nombre: 'Amortiguador', elemento: 'normal' },
  'slack-off': { nombre: 'Relajo', elemento: 'normal' },
  'milk-drink': { nombre: 'Batido', elemento: 'normal' },
  'synthesis': { nombre: 'Síntesis', elemento: 'grass' },
  'moonlight': { nombre: 'Luz Lunar', elemento: 'fairy' },
  'morning-sun': { nombre: 'Sol Matinal', elemento: 'normal' }
};

// Movimientos con mecánicas especiales (recarga, autodestrucción, fijos...) que no se soportan.
export const MOVIMIENTOS_PROHIBIDOS = new Set<string>([
  'self-destruct', 'explosion', 'misty-explosion', 'memento', 'final-gambit', 'mind-blown',
  'steel-beam', 'chloroblast', 'hyper-beam', 'giga-impact', 'blast-burn', 'hydro-cannon',
  'frenzy-plant', 'roar-of-time', 'rock-wrecker', 'prismatic-laser', 'eternabeam',
  'meteor-assault', 'solar-beam', 'solar-blade', 'sky-attack', 'skull-bash', 'razor-wind',
  'freeze-shock', 'ice-burn', 'focus-punch', 'dream-eater', 'last-resort', 'belch', 'fake-out',
  'first-impression', 'sucker-punch', 'shell-trap', 'beak-blast', 'bide', 'uproar', 'outrage',
  'thrash', 'petal-dance', 'struggle', 'future-sight', 'doom-desire', 'spit-up', 'synchronoise',
  'snore', 'steel-roller', 'fling', 'counter', 'mirror-coat', 'metal-burst'
]);

let contadorMovimientos = 0;
function mv(
  nombre: string,
  elemento: TipoPokemon,
  poder: number,
  categoria: CategoriaMovimiento,
  pp = 15,
  precision = 100
): Movimiento {
  const ppMax = escalarPp(pp);
  return { id: --contadorMovimientos, nombre, tipo: 'Ataque', elemento, categoria, poder, precision, ppMax, pp: ppMax };
}

function cura(nombre: string, elemento: TipoPokemon): Movimiento {
  const ppMax = PP_CURACION;
  return { id: --contadorMovimientos, nombre, tipo: 'Sanacion', elemento, categoria: 'special', poder: 0, precision: 100, ppMax, pp: ppMax };
}

export function crearCuracion(clave: string, id: number): Movimiento {
  const datos = MOVIMIENTOS_SANACION[clave];
  const ppMax = PP_CURACION;
  return { id, nombre: datos.nombre, tipo: 'Sanacion', elemento: datos.elemento, categoria: 'special', poder: 0, precision: 100, ppMax, pp: ppMax };
}

export function movimientoRelleno(elemento: TipoPokemon, indice: number): Movimiento {
  const plantillas: Movimiento[] = [
    { id: -101, nombre: 'Golpe Básico', tipo: 'Ataque', elemento: 'normal', categoria: 'physical', poder: 45, precision: 100, ppMax: 14, pp: 14 },
    { id: -102, nombre: 'Pulso Elemental', tipo: 'Ataque', elemento, categoria: 'special', poder: 55, precision: 100, ppMax: 12, pp: 12 },
    { id: -103, nombre: 'Embestida', tipo: 'Ataque', elemento: 'normal', categoria: 'physical', poder: 60, precision: 100, ppMax: 10, pp: 10 },
    { id: -104, nombre: 'Energía Pura', tipo: 'Ataque', elemento, categoria: 'special', poder: 50, precision: 100, ppMax: 12, pp: 12 }
  ];
  return { ...plantillas[indice % plantillas.length] };
}

function pk(
  id: number,
  nombre: string,
  tipos: TipoPokemon[],
  [hp, attack, defense, spAttack, spDefense, speed]: number[],
  movimientos: Movimiento[]
): PokemonDatos {
  const stats: StatsBase = { hp, attack, defense, spAttack, spDefense, speed };
  return { id, nombre, tipos, stats, imagen: urlArte(id), sprite: urlSprite(id), movimientos };
}

// Plantel de respaldo: permite jugar sin conexión y sirve de valores por defecto.
export const POKEMON_RESPALDO: PokemonDatos[] = [
  pk(25, 'Pikachu', ['electric'], [35, 55, 40, 50, 50, 90], [
    mv('Rayo', 'electric', 90, 'special'), mv('Cola Férrea', 'steel', 100, 'physical', 15, 75),
    mv('Surf', 'water', 90, 'special'), mv('Ataque Rápido', 'normal', 40, 'physical', 30)
  ]),
  pk(6, 'Charizard', ['fire', 'flying'], [78, 84, 78, 109, 85, 100], [
    mv('Lanzallamas', 'fire', 90, 'special'), mv('Pulso Dragón', 'dragon', 85, 'special'),
    mv('Tajo Aéreo', 'flying', 75, 'special', 15, 95), mv('Terremoto', 'ground', 100, 'physical', 10)
  ]),
  pk(9, 'Blastoise', ['water'], [79, 83, 100, 85, 105, 78], [
    mv('Surf', 'water', 90, 'special'), mv('Rayo Hielo', 'ice', 90, 'special'),
    mv('Foco Resplandor', 'steel', 80, 'special', 10), mv('Esfera Aural', 'fighting', 80, 'special', 20)
  ]),
  pk(3, 'Venusaur', ['grass', 'poison'], [80, 82, 83, 100, 100, 80], [
    mv('Energibola', 'grass', 90, 'special'), mv('Bomba Lodo', 'poison', 90, 'special'),
    mv('Terremoto', 'ground', 100, 'physical', 10), cura('Síntesis', 'grass')
  ]),
  pk(94, 'Gengar', ['ghost', 'poison'], [60, 65, 60, 130, 75, 110], [
    mv('Bola Sombra', 'ghost', 80, 'special', 15), mv('Bomba Lodo', 'poison', 90, 'special'),
    mv('Energibola', 'grass', 90, 'special'), mv('Psíquico', 'psychic', 90, 'special', 10)
  ]),
  pk(65, 'Alakazam', ['psychic'], [55, 50, 45, 135, 95, 120], [
    mv('Psíquico', 'psychic', 90, 'special', 10), mv('Bola Sombra', 'ghost', 80, 'special'),
    mv('Onda Certera', 'fighting', 120, 'special', 5, 70), cura('Recuperación', 'normal')
  ]),
  pk(68, 'Machamp', ['fighting'], [90, 130, 80, 65, 85, 55], [
    mv('A Bocajarro', 'fighting', 120, 'physical', 5), mv('Terremoto', 'ground', 100, 'physical', 10),
    mv('Roca Afilada', 'rock', 100, 'physical', 5, 80), mv('Puño Trueno', 'electric', 75, 'physical', 15)
  ]),
  pk(143, 'Snorlax', ['normal'], [160, 110, 65, 65, 110, 30], [
    mv('Golpe Cuerpo', 'normal', 85, 'physical'), mv('Terremoto', 'ground', 100, 'physical', 10),
    mv('Puño Fuego', 'fire', 75, 'physical'), cura('Descanso', 'psychic')
  ]),
  pk(130, 'Gyarados', ['water', 'flying'], [95, 125, 79, 60, 100, 81], [
    mv('Cascada', 'water', 80, 'physical'), mv('Triturar', 'dark', 80, 'physical'),
    mv('Terremoto', 'ground', 100, 'physical', 10), mv('Colmillo Rayo', 'electric', 65, 'physical', 15, 95)
  ]),
  pk(149, 'Dragonite', ['dragon', 'flying'], [91, 134, 95, 100, 100, 80], [
    mv('Garra Dragón', 'dragon', 80, 'physical'), mv('Vuelo', 'flying', 90, 'physical', 15, 95),
    mv('Terremoto', 'ground', 100, 'physical', 10), mv('Puño Trueno', 'electric', 75, 'physical', 15)
  ]),
  pk(448, 'Lucario', ['fighting', 'steel'], [70, 110, 70, 115, 70, 90], [
    mv('Esfera Aural', 'fighting', 80, 'special', 20), mv('Cabeza de Hierro', 'steel', 80, 'physical', 15, 100),
    mv('Pulso Dragón', 'dragon', 85, 'special'), mv('Roca Afilada', 'rock', 100, 'physical', 5, 80)
  ]),
  pk(282, 'Gardevoir', ['psychic', 'fairy'], [68, 65, 65, 125, 115, 80], [
    mv('Psíquico', 'psychic', 90, 'special', 10), mv('Fuerza Lunar', 'fairy', 95, 'special'),
    mv('Bola Sombra', 'ghost', 80, 'special'), cura('Luz Lunar', 'fairy')
  ])
];