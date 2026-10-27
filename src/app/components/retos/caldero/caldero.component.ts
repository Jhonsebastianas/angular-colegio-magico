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
  pociones: Pocion[] = []

  
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
    // TODO: Reto 1 - En ngOnInit(), inicializa 'this.pociones' con al menos 3 pociones:
    // 1. "Poción Multijugos" (peligro: 8, tiempo: 45, tipo: 'Transmutacion')
    // 2. "Felix Felicis" (peligro: 3, tiempo: 120, tipo: 'Curacion')
    // 3. "Filtro de Muertos" (peligro: 10, tiempo: 90, tipo: 'Prohibida')
    //
    // Pista: Construye objetos con la estructura de la interfaz 'Pocion'.
    this.pociones = [
      {
        id: 1, 
        nombre: 'Poción Multijugos',
        descripcion: 'Hace que te combiertas en las persona que quieras',
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: 'Transmutacion',
        ingredientes: ['Pelo de la persona', 'Sanguijuelas', 'Crisopos'],
        estable: false
      },
      {
        id: 2, 
        nombre: 'Felix Felicis',
        descripcion: 'Si la bebes vas a tener buena suerte',
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: 'Curacion',
        ingredientes: ['Tentáculo de Murtlap', 'Ruda', 'Raíz de jengibre'],
        estable: true
      },
      {
        id: 3,
        nombre: 'Filtro de Muertos',
        descripcion: 'Sumerge a quien la bebe en un sueño profundo.',
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: 'Prohibida',
        ingredientes: ['Raíz de asfódelo', 'Infusión de ajenjo'],
        estable: false
      },
      {
        id: 4,
        nombre: 'Crecehuesos',
        descripcion: 'Hace crecer de nuevo los huesos rotos o perdidos',
        nivelPeligro: 2,
        tiempoCoccionMinutos: 60,
        tipoMagia: 'Curacion',
        ingredientes: ['Polvo de hueso', 'Agua de manantial'],
        estable: true
      },
      {
        id: 5,
        nombre: 'Elixir de Luz Lunar',
        descripcion: 'Ilumina los lugares oscuros con un resplandor plateado',
        nivelPeligro: 4,
        tiempoCoccionMinutos: 30,
        tipoMagia: 'Luz',
        ingredientes: ['Rocío de luna', 'Pétalos de lirio'],
        estable: true
      }
    ];
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
    return false;
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

    // TODO: Reto 3 - Construye el objeto Pocion, haz push a this.pociones y resetea las variables
  }

  eliminarPocion(id: number): void {
    this.pociones = this.pociones.filter(p => p.id !== id);
    this.guardarEstadoGiratiempo();
  }

  // -------------------------------------------------------------------------
  // IMPLEMENTACIÓN DEL CICLO DE VIDA (RETO 4)
  // -------------------------------------------------------------------------
  // =========================================================================
  // TODO: Reto 4 - En ngOnDestroy(), limpia el intervalo 'this.timerIntervalId'
  // usando clearInterval() para evitar fugas de memoria o maldiciones residuales.
  // =========================================================================
  ngOnDestroy(): void {
    // TODO: Reto 4 - Escribe aquí tu clearInterval
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
    return this.pociones;
  }

  // =========================================================================
  // TODO: Reto 5 - Calcular Estabilidad General del Caldero:
  // - Si hay 2 o más pociones con nivelPeligro >= 8 -> Retornar 'CRÍTICO'
  // - Si hay al menos 1 poción con nivelPeligro >= 5 (y menos de 2 críticas) -> Retornar 'INESTABLE'
  // - De lo contrario -> Retornar 'SEGURO'
  // =========================================================================
  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    // TODO: Reto 5 - Reemplaza este retorno por tu lógica de cálculo
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
  }

  puedeDeshacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible retroceder
    return false;
  }

  puedeRehacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible avanzar
    return false;
  }

  giratiempoDeshacer(): void {
    // TODO: Reto 6 - Revertir al estado anterior
  }

  giratiempoRehacer(): void {
    // TODO: Reto 6 - Avanzar al estado siguiente
  }
}
