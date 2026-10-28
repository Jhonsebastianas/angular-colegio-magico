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
  tipo: 'damage' | 'shield' | 'heal' | 'critical';
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
  // 🎨 RETO 7: EL GRAN LIENZO CREATIVO (Versión Magistral & Inmersiva)
  // =========================================================================

  // 1. Estados Interactivos (Jugador vs Rival)
  nombreMago: string = 'Aprendiz Estelar';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'Inquisidor Oscuro';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Estados del duelo y mecánicas creativas añadidas
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';
  numeroTurno: number = 1;
  arenaOscura: boolean = false;
  
  // 🌟 Estado Creativo Extra: Modo Concentración Mágica (Duplica poder pero gasta más energía)
  modoConcentracion: boolean = false;

  // Grimorio de hechizos místicos
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Expelliarmus', tipo: 'Ataque', poder: 25, costoEnergia: 20, descripcion: 'Desarma al oponente con un rayo escarlata.' },
    { id: 2, nombre: 'Protego', tipo: 'Defensa', poder: 30, costoEnergia: 15, descripcion: 'Crea un escudo mágico protector.' },
    { id: 3, nombre: 'Episkey', tipo: 'Sanacion', poder: 25, costoEnergia: 25, descripcion: 'Restaura vitalidad y cura heridas.' },
    { id: 4, nombre: 'Stupefy', tipo: 'Ataque', poder: 40, costoEnergia: 35, descripcion: 'Onda expansiva de aturdimiento masivo.' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private ambientMusicInterval: any = null;

  // 2. Lifecycle Hook: ngOnInit
  ngOnInit(): void {
    console.log('🎨 Reto 7: Artefacto Creativo avanzado montado con éxito.');
    
    // Temporizador ambiental de regeneración de maná/energía
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        const regeneracion = this.modoConcentracion ? 4 : 2;
        this.energiaMago = Math.min(100, this.energiaMago + regeneracion);
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
    this.modoConcentracion = false;
    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Gran Maestro',
        hechizo: 'Inicio de Duelo',
        efecto: '¡Que comience el duelo de altares mágicos!',
        tipo: 'shield'
      }
    ];
  }

  // 🌟 Método Creativo Extra: Alternar Concentración Mágica
  toggleConcentracion(): void {
    this.modoConcentracion = !this.modoConcentracion;
  }

  // 4. Lanzar Hechizo del Jugador
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;

    // Si el modo concentración está activo, el coste de energía aumenta un 50%
    const costoReal = this.modoConcentracion ? Math.round(hechizo.costoEnergia * 1.5) : hechizo.costoEnergia;
    if (this.energiaMago < costoReal) return;

    this.energiaMago -= costoReal;

    // Si está en concentración, los hechizos de ataque hacen un 50% más de daño
    const multiplicadorPoder = this.modoConcentracion ? 1.5 : 1.0;
    const poderReal = Math.round(hechizo.poder * multiplicadorPoder);

    if (hechizo.tipo === 'Ataque') {
      this.saludRival = Math.max(0, this.saludRival - poderReal);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: `${hechizo.nombre} ${this.modoConcentracion ? '⚡(Potenciado)' : ''}`,
        efecto: `¡Ataque crítico! Causa ${poderReal} de daño a ${this.nombreRival}.`,
        tipo: this.modoConcentracion ? 'critical' : 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + poderReal);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Sanación arcana: Recupera ${poderReal} puntos de salud.`,
        tipo: 'heal'
      });
    } else {
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Escudo defensivo activado con éxito.`,
        tipo: 'shield'
      });
    }

    // Verificar si el rival fue vencido
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    // Turno de respuesta del rival
    this.turnoRival();
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['Rayo Oscuro', 'Fulgor Sombra', 'Maldición Silenciosa', 'Eco de Tinieblas'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoRival = Math.floor(Math.random() * 22) + 12;

      this.saludMago = Math.max(0, this.saludMago - danoRival);
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `Contraataque de ${this.nombreRival} con ${elegido}: -${danoRival} PS.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  // 6. Alternar diseño estético de la arena
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    if (this.ambientMusicInterval) {
      clearInterval(this.ambientMusicInterval);
    }
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos liberados correctamente.');
  }
}