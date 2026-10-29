// Tipos del simulador. No dependen de Angular.

export type Rango = 'Elemental' | 'Intermedio' | 'Avanzado' | 'Smo.' | 'Rey' | 'Imperial' | 'Divino' | 'Desconocido';
export type Categoria =
  | 'Agua' | 'Hielo' | 'Fuego' | 'Viento' | 'Tierra' | 'Fusionada' | 'Curativa'
  | 'Golpe divino' | 'Barrera' | 'Invocación' | 'Única' | 'Combate físico';
export type Elemento = 'agua' | 'hielo' | 'fuego' | 'viento' | 'tierra' | 'rayo' | 'luz' | 'fusion' | 'fisico' | 'neutral';
export type Funcion = 'ofensiva' | 'defensiva' | 'curativa' | 'control' | 'apoyo' | 'invocacion' | 'especial' | 'utilidad';
export type Objetivo = 'enemigo' | 'si_mismo';
export type Escala = 'mag' | 'fis';
export type EstadoId =
  | 'quemadura' | 'congelacion' | 'inmovilizacion' | 'aturdimiento' | 'mojado' | 'regeneracion' | 'defensa_baja'
  | 'ralentizado' | 'silencio' | 'cegado' | 'iluminado' | 'evasion_total' | 'invocacion' | 'dormido'
  | 'absorcion' | 'oculto' | 'aura_batalla' | 'defendiendo';
export type EstiloIA = 'agresivo' | 'defensivo' | 'equilibrado' | 'tactico' | 'magico' | 'fisico' | 'adaptativo';
export type Fuente = 'documento' | 'interpretacion' | 'balance';

export type EfectoDef =
  | { t: 'dano'; escala: Escala; mult?: number; ignoraDefensa?: boolean }
  | { t: 'curar'; pct: number }
  | { t: 'escudo'; clase: 'mag' | 'fis'; fuerza: number; turnos: number }
  | { t: 'estado'; id: EstadoId; turnos: number; prob: number; sobreSi?: boolean }
  | { t: 'limpiar'; ids: EstadoId[] }
  | { t: 'interrumpir' }
  | { t: 'invocar'; danio: number; turnos: number };

/** Lo que dice el catálogo: nombres/rangos/descripción vienen del documento; los números se calculan en balance.config.ts. */
export interface HabilidadBase {
  id: string;
  nombre: string;
  nombreJp?: string;
  descripcion: string;
  categoria: Categoria;
  elemento: Elemento;
  rango: Rango;
  rangoFuente: 'documento' | 'balance';
  funcion: Funcion;
  objetivo: Objetivo;
  pot?: number; // potencia relativa al rango
  costo?: number; // coste relativo al rango
  cd?: number;
  prec?: number;
  efectos: EfectoDef[];
  esMagia?: boolean;
  interrumpible?: boolean;
  soloReaccion?: boolean;
  usuariosDoc: string[];
  restriccion?: { personajes?: string[] };
  jugable?: boolean;
  motivoNoJugable?: string;
  nota?: string;
  fuenteEfectos: 'documento' | 'interpretacion';
  fuenteDescripcion?: 'documento' | 'interpretacion';
}

export interface Habilidad extends HabilidadBase {
  manaCost: number;
  cooldown: number;
  power: number;
  accuracy: number;
  esMagia: boolean;
  interrumpible: boolean;
  soloReaccion: boolean;
  jugable: boolean;
  imagen: string;
}

export interface Atributos {
  hpMax: number; manaMax: number; atkFis: number; poderMag: number; defFis: number; resMag: number;
  vel: number; precision: number; evasion: number; resEstado: number; regenMana: number;
}

export interface DefPersonaje {
  id: string;
  nombre: string;
  nombreAlterno?: string;
  version?: string;
  descripcion: string;
  categoria: string;
  estilo: string;
  ia: EstiloIA;
  imagen: { retrato: string; combate?: string; perfil?: string; mk0?: string };
  atributos: Atributos;
  habilidades: string[]; // ids permitidos
  equipadas: string[]; // ids equipados por defecto
  pasivas: string[];
  debilidades: string[];
  habilidadesFuente: Fuente | 'mixta';
  puedeMK0?: boolean;
}

// ---------- Estado del combate ----------
export interface EstadoActivo { id: EstadoId; turnos: number; pila: number; potencia: number; origen: string; }
export interface Escudo { clase: 'mag' | 'fis'; valor: number; turnos: number; }

export interface Combatiente {
  id: string;
  equipo: 'A' | 'B';
  def: DefPersonaje;
  nombre: string;
  attr: Atributos;
  hp: number;
  mana: number;
  equipadas: string[];
  cooldowns: Record<string, number>;
  estados: EstadoActivo[];
  escudos: Escudo[];
  ccInmune: number;
  controlador: 'jugador' | 'ia';
  ia: EstiloIA;
  usadas: string[]; // información pública: habilidades que ya mostró
  mk0: boolean;
  stats: { danioInfligido: number; danioRecibido: number; curacion: number; hechizos: number; interrupciones: number };
}

export type Accion =
  | { tipo: 'habilidad'; actorId: string; habilidadId: string; objetivoId: string }
  | { tipo: 'golpe'; actorId: string; objetivoId: string }
  | { tipo: 'defender'; actorId: string }
  | { tipo: 'meditar'; actorId: string };

export interface Evento {
  n: number;
  ronda: number;
  tipo:
    | 'inicio' | 'ronda' | 'prepara' | 'impacto' | 'falla' | 'dano' | 'curacion' | 'escudo' | 'escudo_absorbe'
    | 'estado' | 'resiste' | 'interrumpe' | 'interrumpida' | 'sin_mana' | 'defiende' | 'medita' | 'pierde_turno'
    | 'tick' | 'invocacion' | 'fin' | 'info';
  actorId?: string;
  objetivoId?: string;
  habilidadId?: string;
  valor?: number;
  msg: string;
}

export interface ParticipanteConfig {
  personajeId: string;
  controlador: 'jugador' | 'ia';
  equipadas?: string[];
  mk0?: boolean;
  ia?: EstiloIA;
}

export interface ConfigCombate {
  semilla: number;
  equipoA: ParticipanteConfig[];
  equipoB: ParticipanteConfig[];
  reaccionManual?: boolean; // si el jugador decide sus reacciones (Perturbar la magia)
  limiteRondas?: number;
}

export interface Estimacion {
  danio: number; // esperado, ya ponderado por la probabilidad de impacto
  prob: number;
  cura: number;
  mana: number;
  mata: boolean;
  estados: { id: EstadoId; prob: number }[];
  escudo: 'mag' | 'fis' | null;
}

/** Información que cualquier combatiente puede observar del rival (nada oculto). */
export interface Observacion {
  hpPct: number;
  manaPct: number;
  estados: EstadoId[];
  usadas: string[];
  ultimaFueMagia: boolean | null;
  proporcionMagia: number;
  enemigoId: string;
}
