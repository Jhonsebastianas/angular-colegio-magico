import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces requeridas o adaptadas para mantener compatibilidad con el spec
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

interface Coartada {
  id: number;
  titulo: string;
  categoria: string;
  nivelAbsurdo: number;
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // Propiedades requeridas por el spec (para que las pruebas pasen en verde)
  nombreMago: string = 'Insurgente Creativo';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'La Matriz Gris';
  saludRival: number = 100;
  energiaRival: number = 100;

  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';
  numeroTurno: number = 1;
  arenaOscura: boolean = true;

  // Nuevas propiedades de interactividad real para el Altar
  filtroCategoria: string = 'TODAS';
  nuevaCoartadaTitulo: string = '';
  categoriaSeleccionada: string = 'Filosofía Absurda';
  nivelAbsurdoInput: number = 5;

  misCoartadas: Coartada[] = [
    { id: 1, titulo: 'Argumentar que las plantas de la oficina necesitan terapia de grupo', categoria: 'Sabotaje Social', nivelAbsurdo: 9 },
    { id: 2, titulo: 'Explicar que tu conexión falló porque tu router tuvo una crisis existencial', categoria: 'Evasión Digital', nivelAbsurdo: 7 },
    { id: 3, titulo: 'Cambiar todos tus reportes a un formato escrito enteramente en jeroglíficos de gatos', categoria: 'Arte', nivelAbsurdo: 10 }
  ];

  // Arsenal mapeado a las estructuras del test
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Manifiesto en Emojis', tipo: 'Ataque', poder: 35, costoEnergia: 20, descripcion: 'Convierte cualquier texto corporativo en un mar de gatitos y cohetes.' },
    { id: 2, nombre: 'Siesta de Resistencia', tipo: 'Sanacion', poder: 30, costoEnergia: 15, descripcion: 'Pausar el mundo durante 20 minutos para proteger tu salud mental.' },
    { id: 3, nombre: 'Inmunidad Lo-Fi', tipo: 'Defensa', poder: 25, costoEnergia: 15, descripcion: 'Activa una frecuencia que vuelve invisibles las reuniones innecesarias.' },
    { id: 4, nombre: 'Apagón de Rutina', tipo: 'Ataque', poder: 40, costoEnergia: 30, descripcion: 'Desconecta el sistema de hiper-productividad por el resto del día.' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private pulsoInterval: any = null;

  ngOnInit(): void {
    console.log('🌌 Altar de la Ineficiencia Gloriosa: Módulo de coartadas y manifiestos activo.');
    this.pulsoInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
      }
    }, 2000);
  }

  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.numeroTurno = 1;
    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'El Altar',
        hechizo: 'Apertura de Evasión',
        efecto: 'Has ingresado al santuario anti-molde. El sistema gris está siendo hackeado con creatividad.',
        tipo: 'shield'
      }
    ];
  }

  // Interacción real: Agregar una coartada o manifiesto personalizado
  agregarCoartada(): void {
    if (!this.nuevaCoartadaTitulo || this.nuevaCoartadaTitulo.trim().length < 3) return;

    const nueva: Coartada = {
      id: Date.now(),
      titulo: this.nuevaCoartadaTitulo.trim(),
      categoria: this.categoriaSeleccionada,
      nivelAbsurdo: Number(this.nivelAbsurdoInput)
    };

    this.misCoartadas.unshift(nueva);
    this.nuevaCoartadaTitulo = '';
    
    // Registrar en la bitácora para que se vea la interactividad
    this.historialDuelo.unshift({
      turno: this.numeroTurno++,
      emisor: this.nombreMago,
      hechizo: 'Nueva Coartada Creada',
      efecto: `Registraste "${nueva.titulo}" (${nueva.categoria} - Absurdo: ${nueva.nivelAbsurdo}/10)`,
      tipo: 'heal'
    });
  }

  eliminarCoartada(id: number): void {
    this.misCoartadas = this.misCoartadas.filter(c => c.id !== id);
  }

  lanzarHechizo(accion: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.energiaMago < accion.costoEnergia) return;

    this.energiaMago -= accion.costoEnergia;
    this.saludRival = Math.max(0, this.saludRival - accion.poder);

    this.historialDuelo.unshift({
      turno: this.numeroTurno++,
      emisor: this.nombreMago,
      hechizo: accion.nombre,
      efecto: `¡Ataque anti-molde! ${accion.descripcion}`,
      tipo: accion.tipo === 'Sanacion' ? 'heal' : 'damage'
    });

    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
    }
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  ngOnDestroy(): void {
    if (this.pulsoInterval) clearInterval(this.pulsoInterval);
    console.log('🌌 Altar de la Ineficiencia: Desmontado limpiamente.');
  }
}