
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TransformacionDragonBall {
  name: string;
  image: string;
  ki?: string;
}

interface PersonajeDragonBall {
  id: number;
  name: string;
  image: string;
  race?: string;
  ki?: string;
  maxKi?: string;
  description?: string;
  transformations?: TransformacionDragonBall[];
}

interface RespuestaPersonajes {
  items?: PersonajeDragonBall[];
  meta?: {
    totalPages?: number;
    currentPage?: number;
  };
}

interface RegistroCombate {
  turno: number;
  emisor: string;
  tecnica: string;
  efecto: string;
  tipo: 'ataque' | 'defensa' | 'ki' | 'transformacion';
}

interface HechizoDuelo {
  nombre: string;
  tipo: 'Ataque' | 'Especial';
  dano: number;
  costo: number;
  descripcion: string;
}

type EstadoJuego = 'MENU' | 'SELECCION' | 'COMBATE' | 'VICTORIA' | 'DERROTA';

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}
  estadoJuego: EstadoJuego = 'MENU';
  estadoDuelo = 'PREPARACION';

  personajes: PersonajeDragonBall[] = [];
  personajeJugador: PersonajeDragonBall | null = null;
  personajeRival: PersonajeDragonBall | null = null;

  idJugador = '';
  idRival = '';

  saludJugador = 100;
  kiJugador = 100;
  saludRival = 100;
  kiRival = 100;

  get saludMago(): number {
  return this.saludJugador;
}

set saludMago(valor: number) {
  this.saludJugador = valor;
}

get historialDuelo(): RegistroCombate[] {
  return this.historial;
}

  turno = 1;
  cargando = false;
  errorApi = '';
  mensaje = 'Elige a tus guerreros y prepárate para el torneo.';

  historial: RegistroCombate[] = [];

  hechizosDuelo: HechizoDuelo[] = [
    {
      nombre: 'Golpe de energía',
      tipo: 'Ataque',
      dano: 20,
      costo: 15,
      descripcion: 'Un ataque básico de energía.'
    },
    {
      nombre: 'Ataque especial',
      tipo: 'Especial',
      dano: 35,
      costo: 35,
      descripcion: 'Una poderosa técnica especial.'
    }
  ];

  transformacionesJugador: TransformacionDragonBall[] = [];
  transformacionActual: TransformacionDragonBall | null = null;
  escudoActivo = false;
  arenaOscura = false;

  private regeneracionInterval: ReturnType<typeof setInterval> | null = null;
  private respuestaRivalTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.estadoDuelo = 'PREPARACION';
    this.cargarPersonajes();

    this.regeneracionInterval = setInterval(() => {
      if (this.estadoJuego === 'COMBATE') {
        this.kiJugador = Math.min(100, this.kiJugador + 2);
        this.kiRival = Math.min(100, this.kiRival + 2);
      }
    }, 2000);
  }

  async cargarPersonajes(): Promise<void> {
    this.cargando = true;
    this.errorApi = '';

    try {
      const respuesta = await fetch('https://dragonball-api.com/api/characters?limit=100');

      if (!respuesta.ok) {
        throw new Error('La API no respondió correctamente.');
      }

      const datos = await respuesta.json() as RespuestaPersonajes;
      this.personajes = datos.items ?? [];

      if (this.personajes.length < 2) {
        throw new Error('No se encontraron suficientes personajes para el torneo.');
      }

      this.idJugador = String(this.personajes[0].id);
      this.idRival = String(this.personajes[1].id);
    } catch {
      this.errorApi = 'No fue posible cargar los personajes. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
  this.cargando = false;
  this.cdr.detectChanges();
}
  }

  abrirSeleccion(): void {
    this.estadoJuego = 'SELECCION';
  }

  volverMenu(): void {
    this.estadoJuego = 'MENU';
    this.estadoDuelo = 'PREPARACION';
  }

  obtenerPersonaje(id: string): PersonajeDragonBall | null {
    return this.personajes.find(personaje => String(personaje.id) === id) ?? null;
  }

  async comenzarCombate(): Promise<void> {
    const jugador = this.obtenerPersonaje(this.idJugador);
    const rival = this.obtenerPersonaje(this.idRival);

    if (!jugador || !rival || jugador.id === rival.id) {
      this.errorApi = 'Selecciona dos personajes diferentes para comenzar.';
      return;
    }

    this.personajeJugador = await this.obtenerDetalle(jugador);
    this.personajeRival = await this.obtenerDetalle(rival);

    this.iniciarDuelo();
  }

  iniciarDuelo(): void {
    this.saludJugador = 100;
    this.kiJugador = 100;
    this.saludRival = 100;
    this.kiRival = 100;
    this.turno = 1;
    this.escudoActivo = false;
    this.transformacionActual = null;

    this.transformacionesJugador = this.personajeJugador?.transformations ?? [];

    this.historial = [{
      turno: 1,
      emisor: 'TORNEO',
      tecnica: '¡COMIENZA EL COMBATE!',
      efecto: 'El combate de Dragon Ball ha comenzado.',
      tipo: 'transformacion'
    }];

    this.estadoDuelo = 'EN_CURSO';
    this.estadoJuego = 'COMBATE';
    this.mensaje = '¡Que comience el combate!';
    this.errorApi = '';
  }

  private async obtenerDetalle(personaje: PersonajeDragonBall): Promise<PersonajeDragonBall> {
    try {
      const respuesta = await fetch(`https://dragonball-api.com/api/characters/${personaje.id}`);

      if (respuesta.ok) {
        return await respuesta.json() as PersonajeDragonBall;
      }
    } catch {
      return personaje;
    }

    return personaje;
  }

  lanzarAtaque(): void {
    this.realizarAccion('Ataque', 20, 15);
  }

  lanzarEspecial(): void {
    this.realizarAccion('Técnica especial', 35, 35);
  }

  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.kiJugador < hechizo.costo) return;

    this.kiJugador -= hechizo.costo;
    this.saludRival = Math.max(0, this.saludRival - hechizo.dano);

    this.historial.unshift({
      turno: this.turno,
      emisor: this.personajeJugador?.name ?? 'Jugador',
      tecnica: hechizo.nombre,
      efecto: `El rival pierde ${hechizo.dano} puntos de salud.`,
      tipo: 'ataque'
    });

    if (this.saludRival <= 0) {
      this.estadoJuego = 'VICTORIA';
      this.estadoDuelo = 'FINALIZADO';
      this.mensaje = '¡Has ganado el combate!';
      return;
    }

    this.respuestaRival();
  }

  defender(): void {
    if (this.estadoJuego !== 'COMBATE' || this.kiJugador < 10) return;

    this.kiJugador -= 10;
    this.escudoActivo = true;

    this.historial.unshift({
      turno: this.turno,
      emisor: this.personajeJugador?.name ?? 'Jugador',
      tecnica: 'DEFENSA',
      efecto: 'Adoptaste una postura defensiva. El próximo ataque rival tendrá menos efecto.',
      tipo: 'defensa'
    });

    this.respuestaRival();
  }

  cargarKi(): void {
    if (this.estadoJuego !== 'COMBATE') return;

    this.kiJugador = Math.min(100, this.kiJugador + 25);

    this.historial.unshift({
      turno: this.turno,
      emisor: this.personajeJugador?.name ?? 'Jugador',
      tecnica: 'CARGAR KI',
      efecto: 'Concentras tu energía y recuperas 25 puntos de Ki.',
      tipo: 'ki'
    });

    this.respuestaRival();
  }

  private realizarAccion(nombre: string, dano: number, costo: number): void {
    if (this.estadoJuego !== 'COMBATE' || this.kiJugador < costo) return;

    this.kiJugador -= costo;
    this.saludRival = Math.max(0, this.saludRival - dano);

    this.historial.unshift({
      turno: this.turno,
      emisor: this.personajeJugador?.name ?? 'Jugador',
      tecnica: nombre,
      efecto: `${this.personajeRival?.name ?? 'Rival'} pierde ${dano} puntos de salud.`,
      tipo: 'ataque'
    });

    if (this.saludRival <= 0) {
      this.estadoJuego = 'VICTORIA';
      this.estadoDuelo = 'FINALIZADO';
      this.mensaje = `¡${this.personajeJugador?.name ?? 'Jugador'} gana el combate!`;
      return;
    }

    this.respuestaRival();
  }

  private respuestaRival(): void {
    if (this.respuestaRivalTimeout) {
      clearTimeout(this.respuestaRivalTimeout);
    }

    this.respuestaRivalTimeout = setTimeout(() => {
      if (this.estadoJuego !== 'COMBATE') return;

      const danoBase = Math.floor(Math.random() * 11) + 10;
      const dano = this.escudoActivo ? Math.ceil(danoBase / 2) : danoBase;

      this.escudoActivo = false;
      this.saludJugador = Math.max(0, this.saludJugador - dano);
      this.kiRival = Math.max(0, this.kiRival - 10);

      this.historial.unshift({
        turno: this.turno,
        emisor: this.personajeRival?.name ?? 'Rival',
        tecnica: 'CONTRAATAQUE',
        efecto: `${this.personajeRival?.name ?? 'Rival'} responde. Pierdes ${dano} puntos de salud.`,
        tipo: 'ataque'
      });

      this.turno++;

      if (this.saludJugador <= 0) {
        this.estadoJuego = 'DERROTA';
        this.estadoDuelo = 'FINALIZADO';
        this.mensaje = `${this.personajeRival?.name ?? 'Rival'} gana el combate.`;
      }
    }, 700);
  }

  transformar(): void {
    if (this.estadoJuego !== 'COMBATE') return;
    if (this.kiJugador < 40 || this.transformacionesJugador.length === 0) return;

    const siguiente = this.transformacionesJugador.find(
      transformacion => transformacion.name !== this.transformacionActual?.name
    );

    if (!siguiente) {
      this.mensaje = 'Ya utilizaste las transformaciones disponibles.';
      return;
    }

    this.kiJugador -= 40;
    this.transformacionActual = siguiente;

    this.historial.unshift({
      turno: this.turno,
      emisor: this.personajeJugador?.name ?? 'Jugador',
      tecnica: siguiente.name,
      efecto: `¡Nueva transformación! ${this.personajeJugador?.name ?? 'Jugador'} aumenta su poder.`,
      tipo: 'transformacion'
    });

    this.mensaje = `¡${this.personajeJugador?.name ?? 'Jugador'} se transforma en ${siguiente.name}!`;

    this.respuestaRival();
  }

  reiniciarCombate(): void {
    if (this.respuestaRivalTimeout) {
      clearTimeout(this.respuestaRivalTimeout);
    }

    this.estadoJuego = 'SELECCION';
    this.estadoDuelo = 'PREPARACION';
    this.historial = [];
    this.mensaje = 'Elige nuevamente a los participantes.';
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  ngOnDestroy(): void {
    if (this.regeneracionInterval) {
      clearInterval(this.regeneracionInterval);
    }

    if (this.respuestaRivalTimeout) {
      clearTimeout(this.respuestaRivalTimeout);
    }
  }
}
