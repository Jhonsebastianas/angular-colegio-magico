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

    // Reto 1: pociones ancestrales obligatorias del caldero.
    this.pociones = [
      {
        id: 1,
        nombre: 'Poción Multijugos',
        descripcion: 'Permite transformarse temporalmente en otra persona.',
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: 'Transmutacion',
        ingredientes: ['Crisopas', 'Sanguijuelas', 'Polvo de cuerno de bicornio'],
        estable: true
      },
      {
        id: 2,
        nombre: 'Felix Felicis',
        descripcion: 'La poción de la suerte líquida.',
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: 'Curacion',
        ingredientes: ['Cenizas de huevo de Ashwinder', 'Tentáculo de Murtlap'],
        estable: true
      },
      {
        id: 3,
        nombre: 'Filtro de Muertos',
        descripcion: 'Un somnífero tan poderoso que induce un sueño idéntico a la muerte.',
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: 'Prohibida',
        ingredientes: ['Ajenjo', 'Raíz de asfódelo'],
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
  // =========================================================================
  // TODO: Reto 3 - Validar que:
  // - nuevoNombre no esté vacío y tenga al menos 3 caracteres (sin espacios extra).
  // - nuevoTiempoCoccion sea un número estrictamente mayor a 0.
  // - nuevoNivelPeligro esté entre 1 y 10 inclusive.
  // =========================================================================
  esFormularioValido(): boolean {
    const nombreLimpio = this.nuevoNombre.trim();

    return (
      nombreLimpio.length >= 3 &&
      this.nuevoTiempoCoccion > 0 &&
      this.nuevoNivelPeligro >= 1 &&
      this.nuevoNivelPeligro <= 10
    );
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

    const nuevaPocion: Pocion = {
      id: Date.now(),
      nombre: this.nuevoNombre.trim(),
      descripcion: this.nuevaDescripcion.trim() || 'Poción recién elaborada.',
      nivelPeligro: Number(this.nuevoNivelPeligro),
      tiempoCoccionMinutos: Number(this.nuevoTiempoCoccion),
      tipoMagia: this.nuevoTipoMagia,
      ingredientes: ['Ingrediente secreto'],
      estable: Number(this.nuevoNivelPeligro) <= 7
    };

    this.pociones.push(nuevaPocion);
    this.guardarEstadoGiratiempo();

    // Dejamos el formulario listo para la siguiente poción.
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
  // =========================================================================
  // TODO: Reto 4 - En ngOnDestroy(), limpia el intervalo 'this.timerIntervalId'
  // usando clearInterval() para evitar fugas de memoria o maldiciones residuales.
  // =========================================================================
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
    let resultado = [...this.pociones];
    const texto = this.filtroTexto.trim().toLowerCase();

    if (texto) {
      resultado = resultado.filter(
        p =>
          p.nombre.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto)
      );
    }

    if (this.filtroTipoMagia !== 'TODAS') {
      resultado = resultado.filter(p => p.tipoMagia === this.filtroTipoMagia);
    }

    if (this.filtroSoloPeligrosas) {
      resultado = resultado.filter(p => p.nivelPeligro > 7);
    }

    resultado.sort((a, b) =>
      this.ordenAscendente
        ? a.nivelPeligro - b.nivelPeligro
        : b.nivelPeligro - a.nivelPeligro
    );

    return resultado;
  }

  // =========================================================================
  // TODO: Reto 5 - Calcular Estabilidad General del Caldero:
  // - Si hay 2 o más pociones con nivelPeligro >= 8 -> Retornar 'CRÍTICO'
  // - Si hay al menos 1 poción con nivelPeligro >= 5 (y menos de 2 críticas) -> Retornar 'INESTABLE'
  // - De lo contrario -> Retornar 'SEGURO'
  // =========================================================================
  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
    if (criticas >= 2) return 'CRÍTICO';

    const moderadas = this.pociones.filter(p => p.nivelPeligro >= 5).length;
    if (moderadas > 0) return 'INESTABLE';

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
    // Si venimos de un Undo, lo que estaba "adelante" ya no sirve.
    this.historialPasos = this.historialPasos.slice(0, this.indiceHistorial + 1);

    const copia = this.pociones.map(p => ({
      ...p,
      ingredientes: [...p.ingredientes]
    }));

    this.historialPasos.push(copia);
    this.indiceHistorial = this.historialPasos.length - 1;
  }

  puedeDeshacer(): boolean {
    return this.indiceHistorial > 0;
  }

  puedeRehacer(): boolean {
    return this.indiceHistorial < this.historialPasos.length - 1;
  }

  giratiempoDeshacer(): void {
    if (!this.puedeDeshacer()) return;

    this.indiceHistorial--;
    this.restaurarEstado(this.historialPasos[this.indiceHistorial]);
  }

  giratiempoRehacer(): void {
    if (!this.puedeRehacer()) return;

    this.indiceHistorial++;
    this.restaurarEstado(this.historialPasos[this.indiceHistorial]);
  }

  private restaurarEstado(estado: Pocion[]): void {
    this.pociones = estado.map(p => ({
      ...p,
      ingredientes: [...p.ingredientes]
    }));
  }
}
