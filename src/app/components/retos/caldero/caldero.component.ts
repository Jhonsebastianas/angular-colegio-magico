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
  // Variables del componente
  pociones: Pocion[] = [];
  segundosCoccion: number = 0;
  timerIntervalId: any = null;
  
  // Variables de formulario
  nuevoNombre: string = '';
  nuevaDescripcion: string = '';
  nuevoNivelPeligro: number = 1;
  nuevoTiempoCoccion: number = 10;
  nuevoTipoMagia: TipoMagiaPocion = 'Curacion';

  // Variables de filtrado
  filtroTexto: string = '';
  filtroTipoMagia: string = 'TODAS';
  filtroSoloPeligrosas: boolean = false;
  ordenAscendente: boolean = true;

  // Historial (Giratiempo)
  historialPasos: Pocion[][] = [];
  indiceHistorial: number = -1;

  ngOnInit(): void {
    // Reto 1: Inicialización
    this.pociones = [
      {
        id: 1,
        nombre: 'Poción Multijugos',
        descripcion: 'Permite adoptar la apariencia de otra persona.',
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: 'Transmutacion',
        ingredientes: ['Ruda', 'Sanguijuela', 'Cuerno de bicornio'],
        estable: true
      },
      {
        id: 2,
        nombre: 'Felix Felicis',
        descripcion: 'Otorga suerte extraordinaria durante un tiempo limitado.',
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: 'Curacion',
        ingredientes: ['Vainas de asfódelo', 'Miel', 'Polvo lunar'],
        estable: true
      },
      {
        id: 3,
        nombre: 'Filtro de Muertos',
        descripcion: 'Preparación prohibida asociada a artes oscuras.',
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: 'Prohibida',
        ingredientes: ['Veneno de basilisco', 'Raíz seca', 'Escama negra'],
        estable: false
      }
    ];

    this.iniciarFuegoCaldero();
    this.guardarEstadoGiratiempo();
  }

  ngOnDestroy(): void {
    // Reto 4: Limpieza de intervalo
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
  }

  iniciarFuegoCaldero(): void {
    this.timerIntervalId = setInterval(() => {
      this.segundosCoccion++;
    }, 1000);
  }

  esFormularioValido(): boolean {
    // Reto 3: Validación:
    const nombreValido = this.nuevoNombre.trim().length >= 3;
    const tiempoValido = this.nuevoTiempoCoccion > 0;
    const peligroValido = this.nuevoNivelPeligro >= 1 && this.nuevoNivelPeligro <= 10;
    return nombreValido && tiempoValido && peligroValido;
  }

  prepararPocion(): void {
    // Reto 3: Agregar poción
    if (!this.esFormularioValido()) return;

    const nuevaPocion: Pocion = {
      id: Date.now(),
      nombre: this.nuevoNombre,
      descripcion: this.nuevaDescripcion,
      nivelPeligro: this.nuevoNivelPeligro,
      tiempoCoccionMinutos: this.nuevoTiempoCoccion,
      tipoMagia: this.nuevoTipoMagia,
      ingredientes: [],
      estable: this.nuevoNivelPeligro <= 5
    };

    this.pociones.push(nuevaPocion);
    this.guardarEstadoGiratiempo();

    // Resetear formulario
    this.nuevoNombre = '';
    this.nuevaDescripcion = '';
    this.nuevoNivelPeligro = 1;
    this.nuevoTiempoCoccion = 10;
  }

  eliminarPocion(id: number): void {
    this.pociones = this.pociones.filter(p => p.id !== id);
    this.guardarEstadoGiratiempo();
  }

  getPocionesFiltradas(): Pocion[] {
    // Reto 5: Filtros combinados
    return this.pociones
      .filter(p => 
        (p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) || 
         p.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase())) &&
        (this.filtroTipoMagia === 'TODAS' || p.tipoMagia === this.filtroTipoMagia) &&
        (!this.filtroSoloPeligrosas || p.nivelPeligro > 7)
      )
      .sort((a, b) => this.ordenAscendente ? a.nivelPeligro - b.nivelPeligro : b.nivelPeligro - a.nivelPeligro);
  }

  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
    const inestables = this.pociones.filter(p => p.nivelPeligro >= 5).length;
    
    if (criticas >= 2) return 'CRÍTICO';
    if (inestables >= 1) return 'INESTABLE';
    return 'SEGURO';
  }

  // Reto 6: Giratiempo: (Undo/Redo)
  guardarEstadoGiratiempo(): void {
    if (this.indiceHistorial < this.historialPasos.length - 1) {
      this.historialPasos = this.historialPasos.slice(0, this.indiceHistorial + 1);
    }
    this.historialPasos.push(JSON.parse(JSON.stringify(this.pociones)));
    this.indiceHistorial++;
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
      this.pociones = JSON.parse(JSON.stringify(this.historialPasos[this.indiceHistorial]));
    }
  }

  giratiempoRehacer(): void {
    if (this.puedeRehacer()) {
      this.indiceHistorial++;
      this.pociones = JSON.parse(JSON.stringify(this.historialPasos[this.indiceHistorial]));
    }
  }
}
