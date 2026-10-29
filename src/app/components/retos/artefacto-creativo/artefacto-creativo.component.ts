import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
}

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal';
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // =========================================================================
  // 🎨 RETO 7: EL LIENZO CREATIVO (30% DE LA CALIFICACIÓN)
  // =========================================================================
  // EJEMPLO ILUSTRATIVO: "El Simulador de Duelos del Club de Duelo de Hogwarts"
  // Los estudiantes pueden personalizar este simulador o construir su propio
  // artefacto mágico interactivo (ej: Mapa del Merodeador, Tienda de Ollivander,
  // Herbario Mágico) cumpliendo la rúbrica de evaluación.

  // 1. Estado Interactivo (Jugador vs Rival)
  nombreMago: string = 'Harry Potter';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Estado general del duelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA'
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = true;

  // Protección mágica para reducir el siguiente ataque recibido
  escudoActivo: boolean = false;

  // Mensaje visible para informar las acciones del jugador
  mensajeArena: string = 'Prepara tu varita y comienza el duelo.';

  // Grimorio de hechizos disponibles para el aprendiz
  hechizosDuelo: HechizoDuelo[] = [
    {
      id: 1,
      nombre: 'Expelliarmus',
      tipo: 'Ataque',
      poder: 25,
      costoEnergia: 20,
      descripcion: 'Desarma al oponente con un rayo mágico.'
    },
    {
      id: 2,
      nombre: 'Protego',
      tipo: 'Defensa',
      poder: 30,
      costoEnergia: 15,
      descripcion: 'Activa un escudo que reduce el próximo ataque.'
    },
    {
      id: 3,
      nombre: 'Episkey',
      tipo: 'Sanacion',
      poder: 20,
      costoEnergia: 25,
      descripcion: 'Restaura parte de la vitalidad del mago.'
    },
    {
      id: 4,
      nombre: 'Stupefy',
      tipo: 'Ataque',
      poder: 35,
      costoEnergia: 35,
      descripcion: 'Lanza una poderosa onda de energía.'
    }
  ];

  historialDuelo: RegistroTurno[] = [];

  private ambientMusicInterval: ReturnType<typeof setInterval> | null = null;
  private rivalTimeout: ReturnType<typeof setTimeout> | null = null;

  // 2. Lifecycle Hook: ngOnInit
  ngOnInit(): void {
    console.log('🎨 Reto 7: Artefacto Creativo montado en el Gran Salón.');

    // Temporizador ambiental sutil de recarga de energía
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 2000);
  }

  // 3. Iniciar Duelo
  iniciarDuelo(): void {
    // Evita que queden acciones pendientes de un duelo anterior
    if (this.rivalTimeout !== null) {
      clearTimeout(this.rivalTimeout);
      this.rivalTimeout = null;
    }

    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.escudoActivo = false;
    this.mensajeArena = '¡El duelo ha comenzado! Elige tu primer hechizo.';

    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Profesor Flitwick',
        hechizo: 'Apertura de Duelo',
        efecto: '¡Varitas en alto! Hagan una reverencia y comiencen.',
        tipo: 'shield'
      }
    ];
  }

  // 4. Lanzar Hechizo del Jugador
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') {
      this.mensajeArena = 'Primero debes iniciar el duelo.';
      return;
    }

    if (this.energiaMago < hechizo.costoEnergia) {
      this.mensajeArena = 'No tienes suficiente energía para lanzar ese hechizo.';
      return;
    }

    this.energiaMago -= hechizo.costoEnergia;

    if (hechizo.tipo === 'Ataque') {
      this.saludRival = Math.max(0, this.saludRival - hechizo.poder);

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `¡Impacto directo! Causa ${hechizo.poder} puntos de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });

      this.mensajeArena = `¡${hechizo.nombre} ha golpeado a ${this.nombreRival}!`;
    } else if (hechizo.tipo === 'Sanacion') {
      const saludAnterior = this.saludMago;
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      const saludRecuperada = this.saludMago - saludAnterior;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Curación mágica: recuperas ${saludRecuperada} puntos de salud.`,
        tipo: 'heal'
      });

      this.mensajeArena = `¡Has recuperado ${saludRecuperada} puntos de salud!`;
    } else {
      this.escudoActivo = true;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: 'Escudo activado: el próximo ataque enemigo será reducido.',
        tipo: 'shield'
      });

      this.mensajeArena = '¡Protego activado! Tu escudo está listo.';
    }

    // Verificar si el rival cayó
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      this.mensajeArena = '¡Victoria! Has ganado el duelo mágico.';

      if (this.rivalTimeout !== null) {
        clearTimeout(this.rivalTimeout);
        this.rivalTimeout = null;
      }

      return;
    }

    // Respuesta del Rival (IA Simulada)
    this.turnoRival();
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    if (this.rivalTimeout !== null) {
      clearTimeout(this.rivalTimeout);
    }

    this.rivalTimeout = setTimeout(() => {
      this.rivalTimeout = null;

      if (this.estadoDuelo !== 'EN_CURSO') {
        return;
      }

      const opcionesRival = [
        'Serpensortia',
        'Tarantallegra',
        'Rictusempra',
        'Stupefy'
      ];

      const elegido =
        opcionesRival[Math.floor(Math.random() * opcionesRival.length)];

      const danoBase = Math.floor(Math.random() * 20) + 10;
      const danoFinal = this.escudoActivo
        ? Math.ceil(danoBase / 2)
        : danoBase;

      this.saludMago = Math.max(0, this.saludMago - danoFinal);
      this.escudoActivo = false;
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `¡El rival contraataca! Te causa ${danoFinal} puntos de daño.`,
        tipo: 'damage'
      });

      this.mensajeArena = `El rival ha lanzado ${elegido}.`;

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
        this.mensajeArena = 'Has perdido el duelo. ¡Puedes intentarlo de nuevo!';
      }
    }, 600);
  }

  // 6. Alternar ambientación de la arena
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    if (this.ambientMusicInterval !== null) {
      clearInterval(this.ambientMusicInterval);
      this.ambientMusicInterval = null;
    }

    if (this.rivalTimeout !== null) {
      clearTimeout(this.rivalTimeout);
      this.rivalTimeout = null;
    }

    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }
}