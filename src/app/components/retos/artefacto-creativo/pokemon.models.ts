export type TipoPokemon =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type Lado = 1 | 2;
export type ModoJuego = 'CPU' | 'PVP';
export type CategoriaMovimiento = 'physical' | 'special';
export type TipoMovimiento = 'Ataque' | 'Sanacion';

export interface StatsBase {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface Movimiento {
  id: number;
  nombre: string;
  tipo: TipoMovimiento;
  elemento: TipoPokemon;
  categoria: CategoriaMovimiento;
  poder: number;
  precision: number;
  ppMax: number;
  pp: number;
}

export interface PokemonResumen {
  id: number;
  nombre: string;
}

export interface PokemonDatos {
  id: number;
  nombre: string;
  tipos: TipoPokemon[];
  stats: StatsBase;
  imagen: string;
  sprite: string;
  movimientos: Movimiento[];
}

export interface Combatiente {
  datos: PokemonDatos;
  id: number;
  nombre: string;
  tipos: TipoPokemon[];
  imagen: string;
  hp: number;
  hpMax: number;
  ataque: number;
  defensa: number;
  ataqueEsp: number;
  defensaEsp: number;
  velocidad: number;
  movimientos: Movimiento[];
}

export interface ResultadoGolpe {
  danio: number;
  efectividad: number;
  critico: boolean;
  stab: boolean;
}

export type TipoRegistro = 'damage' | 'super' | 'weak' | 'heal' | 'ko' | 'info';

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: TipoRegistro;
}

export interface EfectoFlotante {
  id: number;
  lado: Lado;
  texto: string;
  nota: string;
  clase: 'dano' | 'cura' | 'critico' | 'inmune';
}

export interface Proyectil {
  de: Lado;
  color: string;
}