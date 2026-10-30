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

    // =======================================================================
    // RETO 1 - Inicialización de las 3 pociones obligatorias
    // =======================================================================
    this.pociones = [
      {
        id: 1,
        nombre: 'Poción Multijugos',
        descripcion: 'Permite adoptar la forma física de otra persona.',
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: 'Transmutacion',
        ingredientes: ['Descurainia sophia', 'Sanguinaria', 'Cuerno de bicornio pulverizado'],
        estable: false
      },
      {
        id: 2,
        nombre: 'Felix Felicis',
        descripcion: 'Otorga buena suerte extraordinaria a quien la bebe.',
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: 'Curacion',
        ingredientes: ['Ashiftura', 'Huevo de Occamy', 'Tintura de timo'],
        estable: true
      },
      {
        id: 3,
        nombre: 'Filtro de Muertos',
        descripcion: 'Poción para inducir un sueño extremadamente profundo.',
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: 'Prohibida',
        ingredientes: ['Infusión de ajenjo', 'Polvo de raíz de asfódelo', 'Jugo de soporífera'],
        estable: false
      }
    ];

    // Guardar estado inicial en el Giratiempo (se usa en el Reto 6)
    this.guardarEstadoGiratiempo();
  }

  iniciarFuegoCaldero(): void {
    this.timerIntervalId = setInterval(() => {
      this.segundosCoccion++;
    }, 1000);
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DEL RETO 3: PREPARAR NUEVA POCIÓN (DATA BINDING)
  // -------------------------------------------------------------------------
  esFormularioValido(): boolean {
    const nombreValido = this.nuevoNombre && this.nuevoNombre.trim().length >= 3;
    const tiempoValido = Number(this.nuevoTiempoCoccion) > 0;
    const peligroValido = Number(this.nuevoNivelPeligro) >= 1 && Number(this.nuevoNivelPeligro) <= 10;
    
    return Boolean(nombreValido && tiempoValido && peligroValido);
  }

  prepararPocion(): void {
    if (!this.esFormularioValido()) return;

    const nuevaPocion: Pocion = {
      id: Date.now(),
      nombre: this.nuevoNombre.trim(),
      descripcion: this.nuevaDescripcion.trim() || 'Sin descripción detallada.',
      nivelPeligro: Number(this.nuevoNivelPeligro),
      tiempoCoccionMinutos: Number(this.nuevoTiempoCoccion),
      tipoMagia: this.nuevoTipoMagia,
      ingredientes: ['Ingrediente mágico base'],
      estable: Number(this.nuevoNivelPeligro) < 8
    };

    // Agregar la poción al arreglo
    this.pociones.unshift(nuevaPocion);

    // Registrar estado en el Giratiempo (necesario para el Reto 6)
    this.guardarEstadoGiratiempo();

    // Limpiar los campos del formulario
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
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  getPocionesFiltradas(): Pocion[] {
    let resultado = [...this.pociones];

    // 1. Filtrar por texto (nombre o descripción, case-insensitive)
    if (this.filtroTexto && this.filtroTexto.trim() !== '') {
      const texto = this.filtroTexto.toLowerCase().trim();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        p.descripcion.toLowerCase().includes(texto)
      );
    }

    // 2. Filtrar por tipo de magia
    if (this.filtroTipoMagia && this.filtroTipoMagia !== 'TODAS') {
      resultado = resultado.filter(p => p.tipoMagia === this.filtroTipoMagia);
    }

    // 3. Filtrar por nivel de peligro (> 7) si filtroSoloPeligrosas es true
    if (this.filtroSoloPeligrosas) {
      resultado = resultado.filter(p => p.nivelPeligro > 7);
    }

    // 4. Ordenar por nivel de peligro (ascendente o descendente)
    resultado.sort((a, b) => {
      if (this.ordenAscendente) {
        return a.nivelPeligro - b.nivelPeligro;
      } else {
        return b.nivelPeligro - a.nivelPeligro;
      }
    });

    return resultado;
  }

  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
    const inestables = this.pociones.filter(p => p.nivelPeligro >= 5).length;

    if (criticas >= 2) {
      return 'CRÍTICO';
    }
    if (inestables >= 1) {
      return 'INESTABLE';
    }
    return 'SEGURO';
  }

  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
  guardarEstadoGiratiempo(): void {
    // TODO: Reto 6 - Implementar guardado inmutable en el historial
  }

  puedeDeshacer(): boolean {
    return false;
  }

  puedeRehacer(): boolean {
    return false;
  }

  giratiempoDeshacer(): void {
    // TODO: Reto 6 - Revertir al estado anterior
  }

  giratiempoRehacer(): void {
    // TODO: Reto 6 - Avanzar al estado siguiente
  }
}