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
    this.pociones = ["Poción Multijugos", "Felix Felicis", "Filtro de Muertos"].map((nombre, index) => ({
      id: Date.now() + index,
      nombre,
      descripcion: `Descripción de ${nombre}`,
      nivelPeligro: nombre === "Poción Multijugos" ? 8 : nombre === "Felix Felicis" ? 3 : 10,
      tiempoCoccionMinutos: nombre === "Poción Multijugos" ? 45 : nombre === "Felix Felicis" ? 120 : 90,
      tipoMagia: nombre === "Poción Multijugos" ? 'Transmutacion' : nombre === "Felix Felicis" ? 'Curacion' : 'Prohibida',
      ingredientes: [],
      estable: true
    }));
    // =======================================================================
    // TODO: Reto 1 - En ngOnInit(), inicializa 'this.pociones' con al menos 3 pociones:
    // 1. "Poción Multijugos" (peligro: 8, tiempo: 45, tipo: 'Transmutacion')
    // 2. "Felix Felicis" (peligro: 3, tiempo: 120, tipo: 'Curacion')
    // 3. "Filtro de Muertos" (peligro: 10, tiempo: 90, tipo: 'Prohibida')
    //
    // Pista: Construye objetos con la estructura de la interfaz 'Pocion'.
    // =======================================================================

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
  // =========================================================================
  // TODO: Reto 3 - Validar que:
  // - nuevoNombre no esté vacío y tenga al menos 3 caracteres (sin espacios extra).
  // - nuevoTiempoCoccion sea un número estrictamente mayor a 0.
  // - nuevoNivelPeligro esté entre 1 y 10 inclusive.
  // =========================================================================
  esFormularioValido(): boolean {
    // TODO: Reto 3 - Reemplaza 'return false' por tus validaciones
    if(this.nuevoNombre.trim().length < 3) return false;
    if(this.nuevoTiempoCoccion <= 0) return false;
    if(this.nuevoNivelPeligro < 1 || this.nuevoNivelPeligro > 10) return false;
    return true;
  }

  // =========================================================================
  // TODO: Reto 3 - Agregar la nueva poción al arreglo 'this.pociones'
  // - Debe validar que el formulario sea válido con this.esFormularioValido().
  // - Debe crear un objeto 'Pocion' con id único (ej. Date.now()).
  // - Debe agregarla a 'this.pociones'.
  // - Debe llamar a this.guardarEstadoGiratiempo() para registrar el paso.
  // - Debe limpiar los inputs del formulario (nuevoNombre = '', etc.).
  // =========================================================================
  prepararPocion(): void {
    if (!this.esFormularioValido()) return;
    this.pociones.push({
      id: Date.now(),
      nombre: this.nuevoNombre.trim(),
      descripcion: this.nuevaDescripcion.trim(),
      nivelPeligro: this.nuevoNivelPeligro,
      tiempoCoccionMinutos: this.nuevoTiempoCoccion,
      tipoMagia: this.nuevoTipoMagia,
      ingredientes: [],
      estable: true
    });
    this.guardarEstadoGiratiempo();
    this.nuevoNombre = '';
    this.nuevaDescripcion = '';
    this.nuevoNivelPeligro = 1;
    this.nuevoTiempoCoccion = 10;
    this.nuevoTipoMagia = 'Curacion';
    // TODO: Reto 3 - Construye el objeto Pocion, haz push a this.pociones y resetea las variables
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
      window.clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  // =========================================================================
  // TODO: Reto 5 - Motor de Búsqueda y Filtros Combinados (Apóyate en la IA)
  // Debe retornar una copia filtrada y ordenada de 'this.pociones':
  // 1. Filtro texto (filtroTexto): Insensible a mayúsculas, coincidencia en nombre o descripción.
  // 2. Filtro tipo de magia (filtroTipoMagia): Si es diferente de 'TODAS', filtrar por tipoMagia.
  // 3. Filtro peligro (filtroSoloPeligrosas): Si es true, solo incluir pociones con nivelPeligro > 7.
  // 4. Ordenamiento: Si ordenAscendente es true, menor a mayor peligro; si false, mayor a menor.
  // =========================================================================
  getPocionesFiltradas(): Pocion[] {
    // TODO: Reto 5 - Reemplaza este retorno simple por el algoritmo completo
    let resultado = [...this.pociones];
    // Filtro de texto
    if (this.filtroTexto.trim() !== '') {
      const texto = this.filtroTexto.trim().toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        p.descripcion.toLowerCase().includes(texto)
      );
    }
    // Filtro de tipo de magia
    if (this.filtroTipoMagia !== 'TODAS') {
      resultado = resultado.filter(p => p.tipoMagia === this.filtroTipoMagia);
    }
    // Filtro de peligrosas
    if (this.filtroSoloPeligrosas) {
      resultado = resultado.filter(p => p.nivelPeligro > 7);
    }
    // Ordenamiento
    resultado.sort((a, b) => this.ordenAscendente ? a.nivelPeligro - b.nivelPeligro : b.nivelPeligro - a.nivelPeligro);
    return resultado;

  }

  // =========================================================================
  // TODO: Reto 5 - Calcular Estabilidad General del Caldero:
  // - Si hay 2 o más pociones con nivelPeligro >= 8 -> Retornar 'CRÍTICO'
  // - Si hay al menos 1 poción con nivelPeligro >= 5 (y menos de 2 críticas) -> Retornar 'INESTABLE'
  // - De lo contrario -> Retornar 'SEGURO'
  // =========================================================================
  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    // TODO: Reto 5 - Reemplaza este retorno por tu lógica de cálculo
    const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
    if (criticas >= 2) return 'CRÍTICO';
    if (this.pociones.some(p => p.nivelPeligro >= 5)) return 'INESTABLE';
    return 'SEGURO';
  }

  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
  // =========================================================================
  // TODO: Reto 6 - El Giratiempo / Historial Inmutable (Apóyate en la IA)
  // Implementa un sistema de Undo/Redo con inmutabilidad profunda:
  // - guardarEstadoGiratiempo(): Si se hizo undo y se agrega una acción, descarta
  //   el futuro. Clona 'this.pociones' profundamente y añádelo a 'this.historialPasos'.
  // - puedeDeshacer(): Retorna true si indiceHistorial > 0.
  // - puedeRehacer(): Retorna true si indiceHistorial < historialPasos.length - 1.
  // - giratiempoDeshacer(): Retrocede el índice y restaura una copia de ese estado.
  // - giratiempoRehacer(): Avanza el índice y restaura una copia de ese estado.
  // =========================================================================
  guardarEstadoGiratiempo(): void {
    // TODO: Reto 6 - Implementar guardado inmutable en el historial
    // Si se hizo undo y se agrega una acción, descarta el futuro
    if (this.indiceHistorial < this.historialPasos.length - 1) {
      this.historialPasos = this.historialPasos.slice(0, this.indiceHistorial + 1);
    }
    // Clonar profundamente el estado actual de pociones
    const estadoClonado = this.pociones.map(p => ({ ...p, ingredientes: [...p.ingredientes] }));
    this.historialPasos.push(estadoClonado);
    this.indiceHistorial++;
    
  }

  puedeDeshacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible retroceder
    return this.indiceHistorial > 0;
  }

  puedeRehacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible avanzar
    return this.indiceHistorial < this.historialPasos.length - 1;
  }

  giratiempoDeshacer(): void {
    // TODO: Reto 6 - Revertir al estado anterior
    if (this.puedeDeshacer()) {
      this.indiceHistorial--;
      const estadoAnterior = this.historialPasos[this.indiceHistorial];
      this.pociones = estadoAnterior.map(p => ({ ...p, ingredientes: [...p.ingredientes] }));
    }
  }

  giratiempoRehacer(): void {
    // TODO: Reto 6 - Avanzar al estado siguiente
    if (this.puedeRehacer()) {
      this.indiceHistorial++;
      const estadoSiguiente = this.historialPasos[this.indiceHistorial];
      this.pociones = estadoSiguiente.map(p => ({ ...p, ingredientes: [...p.ingredientes] }));
    }
  }
}
