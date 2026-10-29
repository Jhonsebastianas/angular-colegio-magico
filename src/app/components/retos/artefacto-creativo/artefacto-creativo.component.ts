
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

export interface Ingrediente {
  id: number;
  nombre: string;
  emoji: string;
  descripcion: string;
}

export interface Pocion {
  id: number;
  nombre: string;
  emoji: string;
  ingredientes: string[];
  efecto: string;
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
  // 🧪 RETO 7: LABORATORIO DE POCIONES MÁGICAS
  // =========================================================================

  // Propiedades conservadas para mantener compatibilidad con el duelo original.
  nombreMago: string = 'Aprendiz de Pociones';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'Profesor de Pociones';
  saludRival: number = 100;
  energiaRival: number = 100;

  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' =
    'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false;

  hechizosDuelo: HechizoDuelo[] = [
    {
      id: 1,
      nombre: 'Expelliarmus',
      tipo: 'Ataque',
      poder: 25,
      costoEnergia: 20,
      descripcion: 'Desarma al oponente.'
    },
    {
      id: 2,
      nombre: 'Protego',
      tipo: 'Defensa',
      poder: 30,
      costoEnergia: 15,
      descripcion: 'Crea un escudo mágico.'
    },
    {
      id: 3,
      nombre: 'Episkey',
      tipo: 'Sanacion',
      poder: 20,
      costoEnergia: 25,
      descripcion: 'Restaura vitalidad.'
    },
    {
      id: 4,
      nombre: 'Stupefy',
      tipo: 'Ataque',
      poder: 35,
      costoEnergia: 35,
      descripcion: 'Aturde al rival.'
    }
  ];

  historialDuelo: RegistroTurno[] = [];

  private ambientMusicInterval: ReturnType<typeof setInterval> | null = null;
  private rivalTimeout: ReturnType<typeof setTimeout> | null = null;

  // =========================================================================
  // 🧪 LABORATORIO DE POCIONES
  // =========================================================================

  ingredientesDisponibles: Ingrediente[] = [
    {
      id: 1,
      nombre: 'Hierba lunar',
      emoji: '🌿',
      descripcion: 'Una hierba de brillo mágico.'
    },
    {
      id: 2,
      nombre: 'Escama de dragón',
      emoji: '🐉',
      descripcion: 'Aporta fuerza a las mezclas.'
    },
    {
      id: 3,
      nombre: 'Polvo de hada',
      emoji: '✨',
      descripcion: 'Añade energía mágica.'
    },
    {
      id: 4,
      nombre: 'Flor de fuego',
      emoji: '🌺',
      descripcion: 'Una flor con propiedades especiales.'
    },
    {
      id: 5,
      nombre: 'Gota de rocío',
      emoji: '💧',
      descripcion: 'Ayuda a equilibrar las mezclas.'
    },
    {
      id: 6,
      nombre: 'Raíz encantada',
      emoji: '🥕',
      descripcion: 'Se usa en pociones de recuperación.'
    }
  ];

  ingredientesSeleccionados: number[] = [];
  pocionesPreparadas: Pocion[] = [];
  mensajeLaboratorio: string =
    '¡Bienvenido al laboratorio! Selecciona tus ingredientes.';
  resultadoPocion: Pocion | null = null;
  preparandoPocion: boolean = false;

  // Recetas especiales del laboratorio.
  recetas: {
    [clave: string]: {
      nombre: string;
      emoji: string;
      efecto: string;
    };
  } = {
    '1,5': {
      nombre: 'Poción de Serenidad',
      emoji: '💙',
      efecto: 'Una mezcla tranquila que aporta calma.'
    },
    '2,4': {
      nombre: 'Poción de Fuego de Dragón',
      emoji: '🔥',
      efecto: 'Una mezcla poderosa llena de energía.'
    },
    '3,5': {
      nombre: 'Poción de Energía Mágica',
      emoji: '⚡',
      efecto: 'Una chispa mágica llena de vitalidad.'
    },
    '1,6': {
      nombre: 'Poción de Recuperación',
      emoji: '💚',
      efecto: 'Una mezcla creada para recuperar fuerzas.'
    }
  };

  // =========================================================================
  // 1. CICLO DE VIDA: INICIO
  // =========================================================================

  ngOnInit(): void {
    console.log('🧪 Laboratorio de Pociones iniciado.');

    // Recuperación gradual de energía mientras el duelo está activo.
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 2000);
  }

  // =========================================================================
  // 2. SELECCIONAR INGREDIENTES
  // =========================================================================

  seleccionarIngrediente(id: number): void {
    if (this.preparandoPocion) {
      return;
    }

    if (this.ingredientesSeleccionados.includes(id)) {
      this.ingredientesSeleccionados =
        this.ingredientesSeleccionados.filter(
          ingredienteId => ingredienteId !== id
        );
    } else {
      this.ingredientesSeleccionados = [
        ...this.ingredientesSeleccionados,
        id
      ];
    }

    this.resultadoPocion = null;

    this.mensajeLaboratorio =
      `Ingredientes seleccionados: ${this.ingredientesSeleccionados.length}`;
  }

  // =========================================================================
  // 3. PREPARAR UNA POCIÓN
  // =========================================================================

  prepararPocion(): void {
    if (this.preparandoPocion) {
      return;
    }

    if (this.ingredientesSeleccionados.length < 2) {
      this.mensajeLaboratorio =
        'Necesitas seleccionar al menos 2 ingredientes.';
      return;
    }

    const seleccionados = this.ingredientesDisponibles.filter(
      ingrediente =>
        this.ingredientesSeleccionados.includes(ingrediente.id)
    );

    const nombres = seleccionados.map(
      ingrediente => ingrediente.nombre
    );

    const idsOrdenados = this.ingredientesSeleccionados
      .slice()
      .sort((a, b) => a - b);

    const claveReceta = idsOrdenados.join(',');

    const receta = this.recetas[claveReceta] ?? {
      nombre: 'Poción Misteriosa',
      emoji: '🧪',
      efecto: '¡Una mezcla inesperada! Sigue experimentando.'
    };

    const nuevaPocion: Pocion = {
      id: Date.now(),
      nombre: receta.nombre,
      emoji: receta.emoji,
      ingredientes: nombres,
      efecto: receta.efecto
    };

    this.resultadoPocion = nuevaPocion;

    this.pocionesPreparadas = [
      nuevaPocion,
      ...this.pocionesPreparadas
    ];

    this.mensajeLaboratorio = '¡Poción preparada con éxito!';
    this.ingredientesSeleccionados = [];
  }

  // =========================================================================
  // 4. LIMPIAR EL LABORATORIO
  // =========================================================================

  limpiarLaboratorio(): void {
    this.ingredientesSeleccionados = [];
    this.resultadoPocion = null;
    this.mensajeLaboratorio =
      'Laboratorio limpio. ¡Puedes crear otra poción!';
    this.preparandoPocion = false;
  }

  // =========================================================================
  // 5. MÉTODOS DEL DUELO ORIGINAL, CONSERVADOS
  // =========================================================================

  iniciarDuelo(): void {
    this.cancelarTurnoRival();

    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;

    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Profesor',
        hechizo: 'Inicio de la actividad',
        efecto: '¡Comienza la actividad mágica!',
        tipo: 'shield'
      }
    ];
  }

  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') {
      return;
    }

    if (this.energiaMago < hechizo.costoEnergia) {
      return;
    }

    this.energiaMago -= hechizo.costoEnergia;

    if (hechizo.tipo === 'Ataque') {
      this.saludRival = Math.max(
        0,
        this.saludRival - hechizo.poder
      );

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto:
          `Causa ${hechizo.poder} puntos de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(
        100,
        this.saludMago + hechizo.poder
      );

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto:
          `Recuperas ${hechizo.poder} puntos de salud.`,
        tipo: 'heal'
      });
    } else {
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: hechizo.descripcion,
        tipo: 'shield'
      });
    }

    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    this.turnoRival();
  }

  private turnoRival(): void {
    this.cancelarTurnoRival();

    this.rivalTimeout = setTimeout(() => {
      this.rivalTimeout = null;

      if (this.estadoDuelo !== 'EN_CURSO') {
        return;
      }

      const opcionesRival = [
        'Serpensortia',
        'Tarantallegra',
        'Rictusempra',
        'Protego'
      ];

      const elegido = opcionesRival[
        Math.floor(Math.random() * opcionesRival.length)
      ];

      const danoRival = Math.floor(Math.random() * 20) + 10;

      this.saludMago = Math.max(
        0,
        this.saludMago - danoRival
      );

      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `El rival causa ${danoRival} puntos de daño.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // Cancela el temporizador del rival si hay uno pendiente.
  private cancelarTurnoRival(): void {
    if (this.rivalTimeout !== null) {
      clearTimeout(this.rivalTimeout);
      this.rivalTimeout = null;
    }
  }

  // =========================================================================
  // 6. CICLO DE VIDA: FINALIZACIÓN
  // =========================================================================

  ngOnDestroy(): void {
    if (this.ambientMusicInterval !== null) {
      clearInterval(this.ambientMusicInterval);
      this.ambientMusicInterval = null;
    }

    this.cancelarTurnoRival();

    console.log('🧪 Laboratorio de Pociones cerrado. Recursos limpiados.');
  }
}
