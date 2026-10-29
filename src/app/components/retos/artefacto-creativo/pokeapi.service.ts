import { Injectable } from '@angular/core';
import {
  MOVIMIENTOS_PROHIBIDOS,
  MOVIMIENTOS_SANACION,
  POKEMON_RESPALDO,
  TOTAL_POKEMON,
  crearCuracion,
  escalarPp,
  esTipo,
  formatearNombre,
  movimientoRelleno,
  urlArte,
  urlSprite
} from './pokemon-data';
import { Movimiento, PokemonDatos, PokemonResumen, StatsBase, TipoPokemon } from './pokemon.models';

// Se usa fetch porque app.config.ts no provee HttpClient y no debe modificarse.
const API = 'https://pokeapi.co/api/v2';
const PREFIJO = 'colegio-pokemon-v1:';
const TIEMPO_MAXIMO_MS = 9000;
const CANDIDATOS_POR_NIVEL = 8;
const CANDIDATOS_ALEATORIOS = 8;

interface ApiListado {
  results: { name: string; url: string }[];
}

interface ApiTipo {
  pokemon: { pokemon: { url: string } }[];
}

interface ApiPokemon {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: {
    move: { name: string };
    version_group_details: { level_learned_at: number; move_learn_method: { name: string } }[];
  }[];
}

interface ApiMovimiento {
  id: number;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  type: { name: string };
  damage_class: { name: string };
  names: { name: string; language: { name: string } }[];
}

const idDesdeUrl = (url: string): number => Number(/\/(\d+)\/?$/.exec(url)?.[1] ?? 0);

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

@Injectable({ providedIn: 'root' })
export class PokeapiService {
  private readonly detalles = new Map<number, PokemonDatos>(POKEMON_RESPALDO.map((p) => [p.id, p] as const));
  private readonly movimientos = new Map<string, Movimiento | null>();
  private readonly idsPorTipo = new Map<TipoPokemon, Set<number>>();
  private readonly pendientes = new Map<string, Promise<unknown>>();
  private catalogo: PokemonResumen[] | null = null;

  /** Lista completa de la Pokédex. Si no hay red ni caché, devuelve el plantel de respaldo. */
  async obtenerCatalogo(): Promise<{ lista: PokemonResumen[]; completo: boolean }> {
    if (this.catalogo) return { lista: this.catalogo, completo: true };

    const guardado = this.leer<PokemonResumen[]>('catalogo');
    if (guardado && guardado.length > 0) {
      this.catalogo = guardado;
      return { lista: guardado, completo: true };
    }

    try {
      const crudo = await this.pedir<ApiListado>(`/pokemon?limit=${TOTAL_POKEMON}&offset=0`);
      const lista = crudo.results
        .map((r) => ({ id: idDesdeUrl(r.url), nombre: formatearNombre(r.name) }))
        .filter((p) => p.id > 0 && p.id <= TOTAL_POKEMON);
      this.catalogo = lista;
      this.guardar('catalogo', lista);
      return { lista, completo: true };
    } catch {
      return { lista: POKEMON_RESPALDO.map((p) => ({ id: p.id, nombre: p.nombre })), completo: false };
    }
  }

  /** Datos completos de un Pokémon (stats, tipos y 4 movimientos), cacheados en memoria y localStorage. */
  async obtenerPokemon(id: number): Promise<PokemonDatos> {
    const enMemoria = this.detalles.get(id);
    if (enMemoria) return enMemoria;

    const guardado = this.leer<PokemonDatos>(`p${id}`);
    if (guardado) {
      this.detalles.set(id, guardado);
      return guardado;
    }

    return this.compartir(`p${id}`, async () => {
      const crudo = await this.pedir<ApiPokemon>(`/pokemon/${id}`);
      const datos = await this.construirPokemon(crudo);
      this.detalles.set(id, datos);
      this.guardar(`p${id}`, datos);
      return datos;
    });
  }

  /** IDs de los Pokémon que tienen un tipo (en cualquiera de sus dos ranuras). */
  async obtenerIdsPorTipo(tipo: TipoPokemon): Promise<Set<number>> {
    const enMemoria = this.idsPorTipo.get(tipo);
    if (enMemoria) return enMemoria;

    const guardado = this.leer<number[]>(`t:${tipo}`);
    if (guardado) {
      const conjunto = new Set(guardado);
      this.idsPorTipo.set(tipo, conjunto);
      return conjunto;
    }

    try {
      const crudo = await this.pedir<ApiTipo>(`/type/${tipo}`);
      const ids = crudo.pokemon.map((p) => idDesdeUrl(p.pokemon.url)).filter((id) => id > 0 && id <= TOTAL_POKEMON);
      this.idsPorTipo.set(tipo, new Set(ids));
      this.guardar(`t:${tipo}`, ids);
      return new Set(ids);
    } catch {
      return new Set(POKEMON_RESPALDO.filter((p) => p.tipos.includes(tipo)).map((p) => p.id));
    }
  }

  // -------------------------------------------------------------------------
  // Construcción de datos
  // -------------------------------------------------------------------------
  private async construirPokemon(crudo: ApiPokemon): Promise<PokemonDatos> {
    const tipos = [...crudo.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name).filter(esTipo);
    const stat = (nombre: string): number => crudo.stats.find((s) => s.stat.name === nombre)?.base_stat ?? 50;
    const stats: StatsBase = {
      hp: stat('hp'),
      attack: stat('attack'),
      defense: stat('defense'),
      spAttack: stat('special-attack'),
      spDefense: stat('special-defense'),
      speed: stat('speed')
    };
    const tiposFinales: TipoPokemon[] = tipos.length > 0 ? tipos : ['normal'];

    return {
      id: crudo.id,
      nombre: formatearNombre(crudo.name),
      tipos: tiposFinales,
      stats,
      imagen: urlArte(crudo.id),
      sprite: urlSprite(crudo.id),
      movimientos: await this.elegirMovimientos(crudo, tiposFinales)
    };
  }

  /** Elige 4 movimientos: mejores STAB, cobertura de otros tipos y una curación si el Pokémon la aprende. */
  private async elegirMovimientos(crudo: ApiPokemon, tipos: TipoPokemon[]): Promise<Movimiento[]> {
    const aprendibles = crudo.moves
      .map((m) => ({
        nombre: m.move.name,
        metodos: m.version_group_details.map((d) => d.move_learn_method.name),
        nivel: Math.max(0, ...m.version_group_details.map((d) => d.level_learned_at))
      }))
      .filter((m) => !MOVIMIENTOS_PROHIBIDOS.has(m.nombre) && !(m.nombre in MOVIMIENTOS_SANACION))
      .filter((m) => m.metodos.includes('level-up') || m.metodos.includes('machine'));

    const porNivel = aprendibles
      .filter((m) => m.metodos.includes('level-up'))
      .sort((a, b) => b.nivel - a.nivel)
      .slice(0, CANDIDATOS_POR_NIVEL);
    const resto = barajar(aprendibles.filter((m) => !porNivel.includes(m))).slice(0, CANDIDATOS_ALEATORIOS);
    const nombres = [...porNivel, ...resto].map((m) => m.nombre);

    const resultados = await Promise.allSettled(nombres.map((n) => this.obtenerMovimiento(n)));
    const usables = resultados
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter((m): m is Movimiento => m !== null);
    const fallos = resultados.filter((r) => r.status === 'rejected').length;
    if (fallos > 0 && usables.length < 3) throw new Error('No se pudieron cargar los movimientos');

    const claveCura = crudo.moves.map((m) => m.move.name).find((n) => n in MOVIMIENTOS_SANACION);
    const sanacion = claveCura ? crearCuracion(claveCura, -200 - crudo.id) : null;

    return this.seleccionar(tipos, usables, sanacion);
  }

  private seleccionar(tipos: TipoPokemon[], candidatos: Movimiento[], sanacion: Movimiento | null): Movimiento[] {
    const valor = (m: Movimiento): number => m.poder * (m.precision / 100) * (tipos.includes(m.elemento) ? 1.5 : 1);
    const ataques = [...candidatos].sort((a, b) => valor(b) - valor(a));
    const cupo = sanacion ? 3 : 4;
    const elegidos: Movimiento[] = [];

    for (const tipo of tipos) {
      const stab = ataques.find((m) => m.elemento === tipo && !elegidos.includes(m));
      if (stab && elegidos.length < cupo) elegidos.push(stab);
    }
    for (const m of ataques) {
      if (elegidos.length >= cupo) break;
      if (!elegidos.some((e) => e.elemento === m.elemento)) elegidos.push(m);
    }
    for (const m of ataques) {
      if (elegidos.length >= cupo) break;
      if (!elegidos.includes(m)) elegidos.push(m);
    }

    let relleno = 0;
    while (elegidos.length < cupo) elegidos.push(movimientoRelleno(tipos[0], relleno++));
    if (sanacion) elegidos.push(sanacion);
    return elegidos.map((m) => ({ ...m, pp: m.ppMax }));
  }

  private async obtenerMovimiento(nombre: string): Promise<Movimiento | null> {
    if (this.movimientos.has(nombre)) return this.movimientos.get(nombre) ?? null;

    const guardado = this.leer<Movimiento | null>(`m:${nombre}`);
    if (guardado !== undefined) {
      this.movimientos.set(nombre, guardado);
      return guardado;
    }

    return this.compartir(`m:${nombre}`, async () => {
      const crudo = await this.pedir<ApiMovimiento>(`/move/${nombre}`);
      const movimiento = this.convertirMovimiento(nombre, crudo);
      this.movimientos.set(nombre, movimiento);
      this.guardar(`m:${nombre}`, movimiento);
      return movimiento;
    });
  }

  private convertirMovimiento(nombre: string, crudo: ApiMovimiento): Movimiento | null {
    const categoria = crudo.damage_class.name;
    const elemento = crudo.type.name;
    if ((categoria !== 'physical' && categoria !== 'special') || !esTipo(elemento)) return null;
    if (!crudo.power || !crudo.pp) return null;

    const ppMax = escalarPp(crudo.pp);
    const espanol = crudo.names.find((n) => n.language.name === 'es')?.name;
    return {
      id: crudo.id,
      nombre: espanol ?? formatearNombre(nombre),
      tipo: 'Ataque',
      elemento,
      categoria,
      poder: Math.min(crudo.power, 130),
      precision: crudo.accuracy ?? 100,
      ppMax,
      pp: ppMax
    };
  }

  // -------------------------------------------------------------------------
  // Red y caché
  // -------------------------------------------------------------------------
  private async pedir<T>(ruta: string): Promise<T> {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);
    try {
      const respuesta = await fetch(API + ruta, { signal: controlador.signal });
      if (!respuesta.ok) throw new Error(`PokeAPI respondió ${respuesta.status}`);
      return (await respuesta.json()) as T;
    } finally {
      clearTimeout(temporizador);
    }
  }

  /** Evita peticiones duplicadas mientras una misma consulta sigue en curso. */
  private compartir<T>(clave: string, fabrica: () => Promise<T>): Promise<T> {
    const existente = this.pendientes.get(clave) as Promise<T> | undefined;
    if (existente) return existente;
    const promesa = fabrica().finally(() => this.pendientes.delete(clave));
    this.pendientes.set(clave, promesa);
    return promesa;
  }

  private leer<T>(clave: string): T | undefined {
    try {
      const valor = localStorage.getItem(PREFIJO + clave);
      return valor === null ? undefined : (JSON.parse(valor) as T);
    } catch {
      return undefined;
    }
  }

  private guardar(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
      // Almacenamiento lleno o bloqueado: la caché en memoria sigue funcionando.
    }
  }
}