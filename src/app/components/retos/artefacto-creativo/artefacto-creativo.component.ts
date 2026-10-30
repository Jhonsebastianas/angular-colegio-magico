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
  
  claseSeleccionada: string = 'Reina Kuromi';
  clasesDisponibles: string[] = ['Reina Kuromi', 'Caballero de la Luz', 'Cazadora de Demonios', 'Hechicera de las Sombras'];

  victoriasConsecutivas: number = 0;

  mostrarAlertaVictoria: boolean = false;
  mostrarAlertaPeligro: boolean = true;

  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Estado general del duelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA'
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false;

  // Grimorio de hechizos disponibles para el aprendiz
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Rayo Loco Lila', tipo: 'Ataque', poder: 32, costoEnergia: 10, descripcion: 'Lanza un rayo de energía lila que impacta directamente.' },
    { id: 2, nombre: 'Escudo de Calaveras', tipo: 'Defensa', poder: 35, costoEnergia: 15, descripcion: 'Invoca una barrera de calaveras que protege del ataque.' },
    { id: 3, nombre: 'Elixir Oscuro', tipo: 'Sanacion', poder: 23, costoEnergia: 25, descripcion: 'Restaura vitalidad con un elixir mágico oscuro.' },
    { id: 4, nombre: 'Destello de Sombra', tipo: 'Ataque', poder: 35, costoEnergia: 23, descripcion: 'Desata una poderosa onda expansiva.' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private ambientMusicInterval: any = null;

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
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.mostrarAlertaVictoria = false;
    this.mostrarAlertaPeligro = true;
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
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.energiaMago < hechizo.costoEnergia) return;

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
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Cura mágica: Restaura ${hechizo.poder} puntos de vitalidad.`,
        tipo: 'heal'
      });
    } else {
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Escudo activo: ${hechizo.descripcion}`,
        tipo: 'shield'
      });
    }

    // Verificar si el rival cayó
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA'
      this.victoriasConsecutivas++;
      this.mostrarAlertaVictoria = true;
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: 'Sistema',
        hechizo: '!Victoria Épica!',
        efecto: `¡Victoria! Has derrotado a ${this.nombreRival} como ${this.claseSeleccionada}.`,
        tipo: 'damage'
      });
      return;
    }

    // Respuesta del Rival (IA Simulada)
    this.turnoRival();
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['Serpensortia', 'Tarantallegra', 'Rictusempra', 'Protego'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoRival = Math.floor(Math.random() * 20) + 10;

      this.saludMago = Math.max(0, this.saludMago - danoRival);
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `¡El rival contraataca con ${elegido}! Te causa ${danoRival} de daño.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  // 6. Alternar ambientación de la arena
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }
  // funcion para permitir al jugador retirarse del duelo, registrando la derrota en el historial
   huirDuelo(): void {
    this.estadoDuelo = 'DERROTA';
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: this.nombreMago,
      hechizo: 'Huir del Duelo',
      efecto: `¡Has decidido retirarte del duelo! ${this.nombreRival} se lleva la victoria.`,
      tipo: 'shield'
    });
  }
    cerrarAlertaVictoria(): void {
    this.mostrarAlertaVictoria = false;
  }


    cerrarAlertaPeligro(): void {
    this.mostrarAlertaPeligro = false;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    if (this.ambientMusicInterval) {
      clearInterval(this.ambientMusicInterval);
    }
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }
}
