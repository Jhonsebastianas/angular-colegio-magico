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

    // =======================================================================
    // Reto 1 - Pociones ancestrales iniciales del caldero
    // =======================================================================
    this.pociones = [
      {
        id: 1,
        nombre: 'Poción Multijugos',
        descripcion: 'Permite adoptar temporalmente la apariencia física de otra persona.',
        nivelPeligro: 8,
        tiempoCoccionMinutos: 45,
        tipoMagia: 'Transmutacion',
        ingredientes: ['Crisopas', 'Sanguijuelas', 'Pelo de la persona a imitar'],
        estable: false
      },
      {
        id: 2,
        nombre: 'Felix Felicis',
        descripcion: 'Suerte líquida: otorga al bebedor una racha de fortuna durante un tiempo limitado.',
        nivelPeligro: 3,
        tiempoCoccionMinutos: 120,
        tipoMagia: 'Curacion',
        ingredientes: ['Cenizas de huevo de Ashwinder', 'Tentáculo de Murtlap'],
        estable: true
      },
      {
        id: 3,
        nombre: 'Filtro de Muertos',
        descripcion: 'Somnífero tan poderoso que induce un sueño idéntico a la muerte.',
        nivelPeligro: 10,
        tiempoCoccionMinutos: 90,
        tipoMagia: 'Prohibida',
        ingredientes: ['Ajenjo', 'Raíz de Asfódelo'],
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
    // El nombre se valida sin espacios accidentales al inicio o al final.
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
      nivelPeligro: this.nuevoNivelPeligro,
      tiempoCoccionMinutos: this.nuevoTiempoCoccion,
      tipoMagia: this.nuevoTipoMagia,
      ingredientes: ['Ingrediente secreto'],
      estable: this.nuevoNivelPeligro <= 7
    };

    this.pociones.push(nuevaPocion);

    // Registra el nuevo estado para que el Giratiempo pueda deshacerlo (Reto 6).
    this.guardarEstadoGiratiempo();

    // Deja el formulario listo para preparar otra poción.
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
  // Al destruir el componente se apaga el fuego del caldero para evitar
  // que el intervalo siga ejecutándose en segundo plano (fuga de memoria).
  ngOnDestroy(): void {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  getPocionesFiltradas(): Pocion[] {
    // Partimos de una copia para no modificar el arreglo original del caldero.
    let resultado = [...this.pociones];

    // 1. Búsqueda por texto en el nombre o en la descripción, sin distinguir
    //    mayúsculas de minúsculas.
    const textoBuscado = this.filtroTexto.trim().toLowerCase();
    if (textoBuscado) {
      resultado = resultado.filter(
        pocion =>
          pocion.nombre.toLowerCase().includes(textoBuscado) ||
          pocion.descripcion.toLowerCase().includes(textoBuscado)
      );
    }

    // 2. Filtro por tipo de magia. 'TODAS' significa que no se filtra.
    if (this.filtroTipoMagia !== 'TODAS') {
      resultado = resultado.filter(
        pocion => pocion.tipoMagia === this.filtroTipoMagia
      );
    }

    // 3. Si se pide, dejamos solo las pociones con peligro mayor a 7.
    if (this.filtroSoloPeligrosas) {
      resultado = resultado.filter(pocion => pocion.nivelPeligro > 7);
    }

    // 4. Ordenamos por nivel de peligro. Usamos una copia, así que el arreglo
    //    original conserva su orden.
    resultado.sort((a, b) =>
      this.ordenAscendente
        ? a.nivelPeligro - b.nivelPeligro
        : b.nivelPeligro - a.nivelPeligro
    );

    return resultado;
  }

  calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
    // Primero contamos las pociones críticas (peligro 8 o más).
    const pocionesCriticas = this.pociones.filter(
      pocion => pocion.nivelPeligro >= 8
    ).length;

    if (pocionesCriticas >= 2) {
      return 'CRÍTICO';
    }

    // Si no es crítico, basta con una poción de peligro medio (5 o más).
    const pocionesModeradas = this.pociones.filter(
      pocion => pocion.nivelPeligro >= 5
    ).length;

    if (pocionesModeradas >= 1) {
      return 'INESTABLE';
    }

    return 'SEGURO';
  }

  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
  // Crea una copia profunda de una lista de pociones. El spread de cada
  // poción copia sus datos y el spread de ingredientes evita que dos estados
  // del historial compartan la misma referencia en memoria.
  private clonarPociones(pociones: Pocion[]): Pocion[] {
    return pociones.map(pocion => ({
      ...pocion,
      ingredientes: [...pocion.ingredientes]
    }));
  }

  guardarEstadoGiratiempo(): void {
    // Si el usuario retrocedió y ahora hace una acción nueva, los estados
    // que estaban "en el futuro" se descartan para abrir una nueva línea.
    this.historialPasos = this.historialPasos.slice(
      0,
      this.indiceHistorial + 1
    );

    // Guardamos una copia independiente del estado actual del caldero.
    this.historialPasos.push(this.clonarPociones(this.pociones));
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
    this.pociones = this.clonarPociones(
      this.historialPasos[this.indiceHistorial]
    );
  }

  giratiempoRehacer(): void {
    if (!this.puedeRehacer()) return;

    this.indiceHistorial++;
    this.pociones = this.clonarPociones(
      this.historialPasos[this.indiceHistorial]
    );
  }
}
