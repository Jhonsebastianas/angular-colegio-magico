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

    this.pociones = [
      {
        id: 1,
        nombre: "Poción Multijugos",
        descripcion: "Permite adoptar temporalmente la forma física de otra persona.",
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: "Transmutacion",
        ingredientes: ["Descurainia viridis", "Sanguijuelas", "Cuerno de bicornio pulverizado"],
        estable: false
      },
      {
        id: 2,
        nombre: "Felix Felicis",
        descripcion: "Suerte líquida que otorga éxito en todos los empeños.",
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: "Curacion",
        ingredientes: ["Acnito", "Jugos de crestas de gallo", "Huevo de Ashwinder"],
        estable: true
      },
      {
        id: 3,
        nombre: "Filtro de Muertos",
        descripcion: "Poción soporífera muy potente que induce un sueño profundo.",
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: "Prohibida",
        ingredientes: ["Infusión de ajenjo", "Raíz de valeriana", "Ssopórito"],
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
    const nombreValido = this.nuevoNombre.trim().length >= 3;
    const tiempoValido = Number(this.nuevoTiempoCoccion) > 0;
    const peligroValido = this.nuevoNivelPeligro >= 1 && this.nuevoNivelPeligro <= 10;

    return nombreValido && tiempoValido && peligroValido;
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
      ingredientes: [],
      estable: this.nuevoNivelPeligro < 7
    };

    this.pociones.push(nuevaPocion);
    this.guardarEstadoGiratiempo();

    // Limpiar inputs del formulario
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
    }
  }

  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  getPocionesFiltradas(): Pocion[] {
    return this.pociones.filter(pocion => {
      const textoCoincide = 
        pocion.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        pocion.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const tipoCoincide = 
        this.filtroTipoMagia === 'TODAS' || pocion.tipoMagia === this.filtroTipoMagia;

      const peligroCoincide = 
        !this.filtroSoloPeligrosas || pocion.nivelPeligro > 7;

      return textoCoincide && tipoCoincide && peligroCoincide;
    }).sort((a, b) => {
      return this.ordenAscendente 
        ? a.nivelPeligro - b.nivelPeligro 
        : b.nivelPeligro - a.nivelPeligro;
    });
  }

  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    const pocionesCriticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
    const pocionesInestables = this.pociones.filter(p => p.nivelPeligro >= 5).length;

    if (pocionesCriticas >= 2) {
      return 'CRÍTICO';
    }
    if (pocionesInestables >= 1) {
      return 'INESTABLE';
    }
    return 'SEGURO';
  }

  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
  guardarEstadoGiratiempo(): void {
    // Si estábamos en medio del historial y se realiza una nueva acción, descartamos el "futuro"
    if (this.indiceHistorial < this.historialPasos.length - 1) {
      this.historialPasos = this.historialPasos.slice(0, this.indiceHistorial + 1);
    }

    // Clonación profunda de las pociones para mantener inmutabilidad
    const estadoClonado: Pocion[] = JSON.parse(JSON.stringify(this.pociones));
    this.historialPasos.push(estadoClonado);
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
      // Restauramos profundamente el estado anterior
      this.pociones = JSON.parse(JSON.stringify(this.historialPasos[this.indiceHistorial]));
    }
  }

  giratiempoRehacer(): void {
    if (this.puedeRehacer()) {
      this.indiceHistorial++;
      // Restauramos profundamente el estado siguiente
      this.pociones = JSON.parse(JSON.stringify(this.historialPasos[this.indiceHistorial]));
    }
  }
}