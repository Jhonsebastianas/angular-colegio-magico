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
  this.pociones = [
    {
      id: 1,
      nombre: 'Poción Multijugos',
      descripcion: 'Transforma a quien la bebe en otra persona',
      nivelPeligro: 8,
      tiempoCoccionMinutos: 45,
      tipoMagia: 'Transmutacion',
      ingredientes: ['Pelo de la persona', 'Sanguijuelas', 'Crisopos'],
      estable: false
    },
    {
      id: 2,
      nombre: 'Felix Felicis',
      descripcion: 'Suerte líquida',
      nivelPeligro: 3,
      tiempoCoccionMinutos: 120,
      tipoMagia: 'Curacion',
      ingredientes: ['Tentáculos de Murtlap', 'Hojas de ajenjo'],
      estable: true
    },
    {
      id: 3,
      nombre: 'Filtro de Muertos',
      descripcion: 'Sueño profundo parecido a la muerte',
      nivelPeligro: 10,
      tiempoCoccionMinutos: 90,
      tipoMagia: 'Prohibida',
      ingredientes: ['Raíz de asfódelo', 'Infusión de ajenjo'],
      estable: false
    },
    {      
      id: 4,
      nombre: 'paraiso de los muertos',
      descripcion: 'Alcanza al objetivo con el fin de una muerte tranquila',
      nivelPeligro: 15,
      tiempoCoccionMinutos: 90,
      tipoMagia: 'Prohibida',
      ingredientes: ['Raíz de asfódelo', 'Infusión de ajenjo', 'Raíz de mandrágora'],
      estable: false
    }
  ];

  // Guardar estado inicial en el Giratiempo (se usa en el Reto 6)
    this.iniciarFuegoCaldero();

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
  const nombreValido = this.nuevoNombre.trim().length >= 3;
  const tiempoValido = this.nuevoTiempoCoccion > 0;
  const peligroValido = this.nuevoNivelPeligro >= 1 && this.nuevoNivelPeligro <= 10;
  return nombreValido && tiempoValido && peligroValido;
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
    descripcion: this.nuevaDescripcion.trim(),
    nivelPeligro: this.nuevoNivelPeligro,
    tiempoCoccionMinutos: this.nuevoTiempoCoccion,
    tipoMagia: this.nuevoTipoMagia,
    ingredientes: [],
    estable: true
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
  // =========================================================================
  // TODO: Reto 4 - En ngOnDestroy(), limpia el intervalo 'this.timerIntervalId'
  // usando clearInterval() para evitar fugas de memoria o maldiciones residuales.
  // =========================================================================
  ngOnDestroy(): void {
  window.clearInterval(this.timerIntervalId);
  this.timerIntervalId = null;
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
  const texto = this.filtroTexto.trim().toLowerCase();

  const resultado = this.pociones.filter(p => {
    const coincideTexto =
      texto === '' ||
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto);

    const coincideTipo =
      this.filtroTipoMagia === 'TODAS' || p.tipoMagia === this.filtroTipoMagia;

    const coincidePeligro =
      !this.filtroSoloPeligrosas || p.nivelPeligro > 7;

    return coincideTexto && coincideTipo && coincidePeligro;
  });

  return resultado.sort((a, b) =>
    this.ordenAscendente
      ? a.nivelPeligro - b.nivelPeligro
      : b.nivelPeligro - a.nivelPeligro
  );
}

calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
  const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;
  const hayPeligrosa = this.pociones.some(p => p.nivelPeligro >= 5);

  if (criticas >= 2) return 'CRÍTICO';
  if (hayPeligrosa) return 'INESTABLE';
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
