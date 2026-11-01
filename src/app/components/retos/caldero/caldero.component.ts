import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pocion, TipoMagiaPocion } from '../../../models/pocion.model';

@Component({
  selector: 'app-caldero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caldero.component.html',
  styleUrl: './caldero.component.css'
})
export class CalderoComponent implements OnInit, OnDestroy {
  // =========================================================================
  // 🔮 RETO 1: EL INGREDIENTE BASE (Listado de Pociones & ngOnInit)
  // =========================================================================
  // El arreglo arranca vacío. Debes inicializarlo en ngOnInit()
  pociones: Pocion[] = [];

  // =========================================================================
  // 🪞 RETO 3: EL VÍNCULO CON EL CALDERO (Variables para [(ngModel)])
  // =========================================================================
  nuevoNombre: string = '';
  nuevaDescripcion: string = '';
  nuevoNivelPeligro: number = 1;
  nuevoTiempoCoccion: number = 10;
  nuevoTipoMagia: TipoMagiaPocion = 'Curacion';

  // =========================================================================
  // ⏳ RETO 4: EL FUEGO PURIFICADOR (Temporizador & ngOnDestroy)
  // =========================================================================
  segundosCoccion: number = 0;
  timerIntervalId: any = null;

  // =========================================================================
  // 🔍 RETO 5 (IA CHALLENGE): TRANSMUTADOR DE ESTADOS Y FILTROS DINÁMICOS
  // =========================================================================
  filtroTexto: string = '';
  filtroTipoMagia: string = 'TODAS';
  filtroSoloPeligrosas: boolean = false;
  ordenAscendente: boolean = true;

  // =========================================================================
  // ⏳ RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // =========================================================================
  historialPasos: Pocion[][] = [];
  indiceHistorial: number = -1;

  // -------------------------------------------------------------------------
  // IMPLEMENTACIÓN DEL CICLO DE VIDA (RETO 1)
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    // Inicia el fuego del caldero (utilizado en el Reto 4)
    this.iniciarFuegoCaldero();

    this.pociones = [
  {
    id: 1,
    nombre: 'Poción Multijugos',
    descripcion: 'Permite cambiar temporalmente de apariencia.',
    nivelPeligro: 8,
    tiempoCoccionMinutos: 45,
    tipoMagia: 'Transmutacion',
    ingredientes: ['Sanguijuela', 'Descurainia sophia'],
    estable: false
  },
  {
    id: 2,
    nombre: 'Felix Felicis',
    descripcion: 'Otorga buena suerte durante un tiempo limitado.',
    nivelPeligro: 3,
    tiempoCoccionMinutos: 120,
    tipoMagia: 'Curacion',
    ingredientes: ['Ashwinder', 'Ruda'],
    estable: true
  },
  {
    id: 3,
    nombre: 'Filtro de Muertos',
    descripcion: 'Poción de magia prohibida extremadamente peligrosa.',
    nivelPeligro: 10,
    tiempoCoccionMinutos: 90,
    tipoMagia: 'Prohibida',
    ingredientes: ['Raíz de asfódelo', 'Ajenjo'],
    estable: false
  }
];
    this.guardarEstadoGiratiempo();
  }

  iniciarFuegoCaldero(): void {
    this.timerIntervalId = setInterval(() => {
      this.segundosCoccion++;
    }, 1000);
  }


  esFormularioValido(): boolean {
  const nombre = this.nuevoNombre.trim();

  return (
    nombre.length >= 3 &&
    this.nuevoTiempoCoccion > 0 &&
    this.nuevoNivelPeligro >= 1 &&
    this.nuevoNivelPeligro <= 10
  );
}

  prepararPocion(): void {
  if (!this.esFormularioValido()) return;

  const nuevaPocion: Pocion = {
    id: Date.now(),
    nombre: this.nuevoNombre.trim(),
    descripcion: this.nuevaDescripcion,
    nivelPeligro: this.nuevoNivelPeligro,
    tiempoCoccionMinutos: this.nuevoTiempoCoccion,
    tipoMagia: this.nuevoTipoMagia,
    ingredientes: [],
    estable: this.nuevoNivelPeligro < 8
  };

  this.pociones.push(nuevaPocion);

  this.guardarEstadoGiratiempo();

  this.nuevoNombre = '';
  this.nuevaDescripcion = '';
  this.nuevoNivelPeligro = 1;
  this.nuevoTiempoCoccion = 10;
  this.nuevoTipoMagia = 'Curacion';
}

  eliminarPocion(id: number): void {
    this.pociones = this.pociones.filter(p => p.id !== id);
    this.guardarEstadoGiratiempo();
  }

  // -------------------------------------------------------------------------
  // IMPLEMENTACIÓN DEL CICLO DE VIDA (RETO 4)
  // -------------------------------------------------------------------------
 
  ngOnDestroy(): void {
  if (this.timerIntervalId !== null) {
    clearInterval(this.timerIntervalId);
  }
}

  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  
  getPocionesFiltradas(): Pocion[] {
  let pocionesFiltradas = [...this.pociones];

  const texto = this.filtroTexto.toLowerCase().trim();

  if (texto !== '') {
    pocionesFiltradas = pocionesFiltradas.filter(pocion =>
      pocion.nombre.toLowerCase().includes(texto) ||
      pocion.descripcion.toLowerCase().includes(texto)
    );
  }

  if (this.filtroTipoMagia !== 'TODAS') {
    pocionesFiltradas = pocionesFiltradas.filter(pocion =>
      pocion.tipoMagia === this.filtroTipoMagia
    );
  }

  if (this.filtroSoloPeligrosas) {
    pocionesFiltradas = pocionesFiltradas.filter(pocion =>
      pocion.nivelPeligro > 7
    );
  }

  pocionesFiltradas.sort((a, b) => {
    if (this.ordenAscendente) {
      return a.nivelPeligro - b.nivelPeligro;
    } else {
      return b.nivelPeligro - a.nivelPeligro;
    }
  });

  return pocionesFiltradas;
}

  // =========================================================================
  // TODO: Reto 5 - Calcular Estabilidad General del Caldero:
  // - Si hay 2 o más pociones con nivelPeligro >= 8 -> Retornar 'CRÍTICO'
  // - Si hay al menos 1 poción con nivelPeligro >= 5 (y menos de 2 críticas) -> Retornar 'INESTABLE'
  // - De lo contrario -> Retornar 'SEGURO'
  // =========================================================================
 calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
  const pocionesCriticas = this.pociones.filter(
    pocion => pocion.nivelPeligro >= 8
  ).length;

  if (pocionesCriticas >= 2) {
    return 'CRÍTICO';
  }

  const pocionesPeligrosas = this.pociones.some(
    pocion => pocion.nivelPeligro >= 5
  );

  if (pocionesPeligrosas) {
    return 'INESTABLE';
  }

  return 'SEGURO';
}

  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
 
  guardarEstadoGiratiempo(): void {
  if (this.indiceHistorial < this.historialPasos.length - 1) {
    this.historialPasos = this.historialPasos.slice(
      0,
      this.indiceHistorial + 1
    );
  }

  const nuevoEstado = JSON.parse(JSON.stringify(this.pociones));

  this.historialPasos.push(nuevoEstado);

  this.indiceHistorial = this.historialPasos.length - 1;
}

  puedeDeshacer(): boolean {
  return this.indiceHistorial > 0;
}

  puedeRehacer(): boolean {
  return this.indiceHistorial < this.historialPasos.length - 1;
}

 giratiempoDeshacer(): void {
  if (this.puedeDeshacer()) {
    this.indiceHistorial--;

    this.pociones = JSON.parse(
      JSON.stringify(this.historialPasos[this.indiceHistorial])
    );
  }
}

  giratiempoRehacer(): void {
  if (this.puedeRehacer()) {
    this.indiceHistorial++;

    this.pociones = JSON.parse(
      JSON.stringify(this.historialPasos[this.indiceHistorial])
    );
  }
}
}
