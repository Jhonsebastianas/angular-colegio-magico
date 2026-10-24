// ============================================================================
// ⚠️ ARCHIVO SAGRADO DEL TRIBUNAL DE MAGIA (GITHUB ACTIONS)
// PROHIBIDO MODIFICAR ESTE ARCHIVO POR PARTE DEL ESTUDIANTE.
// Regla de Oro: Si este archivo es alterado, la calificación será 0.0 automática.
// ============================================================================


// UY ROMPI LA REGLA; ME VAN A PONER 0.0

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalderoComponent } from './caldero.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pocion } from '../../../models/pocion.model';

describe('🏛️ Tribunal de Magia - CalderoComponent (Retos 1 al 6)', () => {
  let component: CalderoComponent;
  let fixture: ComponentFixture<CalderoComponent>;

  // Datos mágicos de prueba independientes para aislar pruebas
  const MOCK_POCIONES: Pocion[] = [
    {
      id: 101,
      nombre: 'Poción Multijugos',
      descripcion: 'Permite adoptar la forma física de otra persona.',
      nivelPeligro: 8,
      tiempoCoccionMinutos: 45,
      tipoMagia: 'Transmutacion',
      ingredientes: ['Crisopas', 'Sanguijuelas'],
      estable: false
    },
    {
      id: 102,
      nombre: 'Felix Felicis',
      descripcion: 'Suerte líquida para el bebedor durante 12 horas.',
      nivelPeligro: 3,
      tiempoCoccionMinutos: 120,
      tipoMagia: 'Curacion',
      ingredientes: ['Cenizas de huevo de Ashwinder', 'Tentáculo de Murtlap'],
      estable: true
    },
    {
      id: 103,
      nombre: 'Filtro de Muertos',
      descripcion: 'Somnífero tan poderoso que induce un sueño idéntico a la muerte.',
      nivelPeligro: 10,
      tiempoCoccionMinutos: 90,
      tipoMagia: 'Prohibida',
      ingredientes: ['Ajenjo', 'Raíz de Asfódelo'],
      estable: false
    },
    {
      id: 104,
      nombre: 'Esencia de Díctamo',
      descripcion: 'Cura heridas cutáneas al instante.',
      nivelPeligro: 2,
      tiempoCoccionMinutos: 15,
      tipoMagia: 'Curacion',
      ingredientes: ['Díctamo'],
      estable: true
    },
    {
      id: 105,
      nombre: 'Poción de Ojos de Halcón',
      descripcion: 'Mejora la agudeza visual para percibir criaturas ocultas.',
      nivelPeligro: 6,
      tiempoCoccionMinutos: 25,
      tipoMagia: 'Luz',
      ingredientes: ['Ojos de escarabajo'],
      estable: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalderoComponent, CommonModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CalderoComponent);
    component = fixture.componentInstance;
  });

  // =========================================================================
  // 🔮 RETO 1: EL INGREDIENTE BASE (ngOnInit e Inicialización de Pociones)
  // =========================================================================
  describe('🔮 Reto 1: Ciclo de Vida ngOnInit & Inicialización de Pociones', () => {
    it('[1.1] El componente debe implementar el método del ciclo de vida ngOnInit', () => {
      expect(typeof component.ngOnInit).withContext('Debes implementar la interfaz OnInit y el método ngOnInit()').toBe('function');
    });

    it('[1.2] Debe inicializar el caldero con al menos 3 pociones ancestrales al llamar ngOnInit', () => {
      fixture.detectChanges(); // Ejecuta ngOnInit
      expect(component.pociones.length)
        .withContext('El arreglo "pociones" debe tener al menos 3 pociones tras ngOnInit()')
        .toBeGreaterThanOrEqual(3);
    });

    it('[1.3] Debe contener exactamente las 3 pociones canónicas ("Poción Multijugos", "Felix Felicis", "Filtro de Muertos")', () => {
      fixture.detectChanges();
      const nombres = component.pociones.map(p => p.nombre);
      expect(nombres).withContext('Falta "Poción Multijugos" en el caldero').toContain('Poción Multijugos');
      expect(nombres).withContext('Falta "Felix Felicis" en el caldero').toContain('Felix Felicis');
      expect(nombres).withContext('Falta "Filtro de Muertos" en el caldero').toContain('Filtro de Muertos');
    });

    it('[1.4] Las 3 pociones canónicas deben tener sus niveles de peligro y tipos de magia reglamentarios', () => {
      fixture.detectChanges();
      const multijugos = component.pociones.find(p => p.nombre === 'Poción Multijugos');
      const felix = component.pociones.find(p => p.nombre === 'Felix Felicis');
      const filtro = component.pociones.find(p => p.nombre === 'Filtro de Muertos');

      expect(multijugos).withContext('Poción Multijugos no encontrada').toBeDefined();
      if (multijugos) {
        expect(multijugos.nivelPeligro).withContext('Multijugos debe tener peligro 8').toBe(8);
        expect(multijugos.tipoMagia).withContext('Multijugos debe ser de tipo Transmutacion').toBe('Transmutacion');
      }

      expect(felix).withContext('Felix Felicis no encontrada').toBeDefined();
      if (felix) {
        expect(felix.nivelPeligro).withContext('Felix Felicis debe tener peligro 3').toBe(3);
        expect(felix.tipoMagia).withContext('Felix Felicis debe ser de tipo Curacion').toBe('Curacion');
      }

      expect(filtro).withContext('Filtro de Muertos no encontrado').toBeDefined();
      if (filtro) {
        expect(filtro.nivelPeligro).withContext('Filtro de Muertos debe tener peligro 10').toBe(10);
        expect(filtro.tipoMagia).withContext('Filtro de Muertos debe ser de tipo Prohibida').toBe('Prohibida');
      }
    });

    it('[1.5] Cada poción del caldero debe tener estructura completa (id, nombre, tiempoCoccionMinutos > 0, ingredientes)', () => {
      fixture.detectChanges();
      expect(component.pociones.length).toBeGreaterThan(0);
      component.pociones.forEach(p => {
        expect(p.id).withContext(`Poción ${p.nombre} debe tener un id definido`).toBeDefined();
        expect(p.nombre.trim().length).withContext('El nombre no debe estar vacío').toBeGreaterThan(0);
        expect(p.tiempoCoccionMinutos).withContext(`${p.nombre} debe tener tiempo de cocción positivo`).toBeGreaterThan(0);
        expect(Array.isArray(p.ingredientes)).withContext(`${p.nombre} debe tener un arreglo de ingredientes`).toBeTrue();
      });
    });
  });

  // =========================================================================
  // 🪄 RETO 2: LOS ENCANTAMIENTOS DE VISTA (@if, @for, [ngClass])
  // =========================================================================
  describe('🪄 Reto 2: Renderizado Dinámico en el DOM (@for, @if, [ngClass])', () => {
    it('[2.1] Debe renderizar tantas tarjetas (.pocion-card) en el DOM como existan en la lista', async () => {
      fixture.detectChanges(); // Ejecuta ngOnInit primero
      component.pociones = [...MOCK_POCIONES];
      fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();

      const cards = fixture.nativeElement.querySelectorAll('.pocion-card');
      expect(cards.length)
        .withContext('El número de tarjetas .pocion-card debe coincidir con component.pociones.length')
        .toBe(MOCK_POCIONES.length);
    });

    it('[2.2] Debe mostrar la alerta de toxicidad (.toxic-warning) únicamente para pociones con peligro > 7', () => {
      fixture.detectChanges();
      component.pociones = [...MOCK_POCIONES];
      fixture.detectChanges();

      const cards: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.pocion-card'));
      expect(cards.length).toBeGreaterThan(0);

      cards.forEach((card: HTMLElement) => {
        const nombre = card.querySelector('.pocion-nombre')?.textContent?.trim();
        const pocion = component.pociones.find(p => p.nombre === nombre);
        const warning = card.querySelector('.toxic-warning');

        if (pocion && pocion.nivelPeligro > 7) {
          expect(warning)
            .withContext(`La poción "${nombre}" (peligro ${pocion.nivelPeligro}) DEBE mostrar .toxic-warning`)
            .not.toBeNull();
        } else if (pocion) {
          expect(warning)
            .withContext(`La poción "${nombre}" (peligro ${pocion.nivelPeligro}) NO debe mostrar .toxic-warning`)
            .toBeNull();
        }
      });
    });

    it('[2.3] Debe aplicar la clase de estilo dinámico [ngClass] con el tipo de magia correspondiente', () => {
      fixture.detectChanges();
      component.pociones = [MOCK_POCIONES[0], MOCK_POCIONES[1]]; // Transmutacion y Curacion
      fixture.detectChanges();

      const badges: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.badge-magic'));
      const clases = badges.map(b => b.className);

      expect(clases.some(c => c.includes('badge-transmutacion')))
        .withContext('Debe existir una clase .badge-transmutacion')
        .toBeTrue();
      expect(clases.some(c => c.includes('badge-curacion')))
        .withContext('Debe existir una clase .badge-curacion')
        .toBeTrue();
    });

    it('[2.4] Debe mostrar el bloque de caldero vacío (.empty-caldero) cuando no hay pociones', async () => {
      fixture.detectChanges();
      component.pociones = [];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const emptyBox = fixture.nativeElement.querySelector('.empty-caldero');
      expect(emptyBox).withContext('Cuando pociones está vacío debe renderizarse .empty-caldero').not.toBeNull();
    });
  });

  // =========================================================================
  // 🪞 RETO 3: EL VÍNCULO CON EL CALDERO ([(ngModel)], [disabled] y Preparar)
  // =========================================================================
  describe('🪞 Reto 3: Two-Way Data Binding, Validaciones y Preparación', () => {
    beforeEach(() => {
      component.nuevoNombre = '';
      component.nuevaDescripcion = '';
      component.nuevoTiempoCoccion = 10;
      component.nuevoNivelPeligro = 1;
      component.nuevoTipoMagia = 'Curacion';
    });

    it('[3.1] esFormularioValido: debe retornar false si el nombre está vacío o tiene menos de 3 letras', () => {
      component.nuevoNombre = '';
      expect(component.esFormularioValido()).withContext('Nombre vacío debe ser inválido').toBeFalse();

      component.nuevoNombre = '  ab  ';
      expect(component.esFormularioValido()).withContext('Nombre con menos de 3 caracteres reales debe ser inválido').toBeFalse();
    });

    it('[3.2] esFormularioValido: debe retornar false si el tiempo de cocción es 0 o negativo', () => {
      component.nuevoNombre = 'Poción de Agilidad';
      component.nuevoTiempoCoccion = 0;
      expect(component.esFormularioValido()).withContext('Tiempo 0 debe ser inválido').toBeFalse();

      component.nuevoTiempoCoccion = -10;
      expect(component.esFormularioValido()).withContext('Tiempo negativo debe ser inválido').toBeFalse();
    });

    it('[3.3] esFormularioValido: debe retornar false si el nivel de peligro está fuera del rango [1, 10]', () => {
      component.nuevoNombre = 'Poción de Fuego';
      component.nuevoTiempoCoccion = 20;

      component.nuevoNivelPeligro = 0;
      expect(component.esFormularioValido()).withContext('Peligro 0 debe ser inválido').toBeFalse();

      component.nuevoNivelPeligro = 11;
      expect(component.esFormularioValido()).withContext('Peligro 11 debe ser inválido').toBeFalse();
    });

    it('[3.4] esFormularioValido: debe retornar true cuando todos los campos cumplen las condiciones mágicas', () => {
      component.nuevoNombre = 'Elixir de la Sabiduría';
      component.nuevaDescripcion = 'Aclara la mente de quien lo toma.';
      component.nuevoTiempoCoccion = 30;
      component.nuevoNivelPeligro = 4;
      component.nuevoTipoMagia = 'Luz';

      expect(component.esFormularioValido()).withContext('Formulario con datos válidos debe retornar true').toBeTrue();
    });

    it('[3.5] El botón de preparación en el DOM debe tener el atributo [disabled] si el formulario no es válido', () => {
      component.nuevoNombre = '';
      fixture.detectChanges();

      const botonPreparar = fixture.nativeElement.querySelector('.btn-preparar');
      expect(botonPreparar.disabled)
        .withContext('El botón de preparar debe estar [disabled] mientras el formulario sea inválido')
        .toBeTrue();
    });

    it('[3.6] prepararPocion: no debe añadir nada si el formulario es inválido', () => {
      component.pociones = [...MOCK_POCIONES];
      const iniciales = component.pociones.length;

      component.nuevoNombre = ''; // Inválido
      component.prepararPocion();

      expect(component.pociones.length).withContext('No debe alterar la lista con datos inválidos').toBe(iniciales);
    });

    it('[3.7] prepararPocion: debe agregar la nueva poción a la lista y reiniciar los campos del formulario', () => {
      component.pociones = [...MOCK_POCIONES];
      const cantidadInicial = component.pociones.length;

      component.nuevoNombre = 'Elixir de la Vida';
      component.nuevaDescripcion = 'Otorga inmortalidad al bebedor.';
      component.nuevoNivelPeligro = 5;
      component.nuevoTiempoCoccion = 60;
      component.nuevoTipoMagia = 'Curacion';

      component.prepararPocion();

      expect(component.pociones.length).withContext('Debe haber 1 poción más en el caldero').toBe(cantidadInicial + 1);

      const agregada = component.pociones.find(p => p.nombre === 'Elixir de la Vida');
      expect(agregada).withContext('La poción agregada debe existir en la lista').toBeDefined();
      if (agregada) {
        expect(agregada.nivelPeligro).toBe(5);
        expect(agregada.tipoMagia).toBe('Curacion');
        expect(agregada.id).toBeDefined();
      }

      // Debe resetear el nombre
      expect(component.nuevoNombre).withContext('El campo nuevoNombre debe quedar limpio').toBe('');
    });

    it('[3.8] eliminarPocion: debe remover la poción indicada por su id del caldero', () => {
      component.pociones = [...MOCK_POCIONES];
      const cantidadInicial = component.pociones.length;
      const idAEliminar = MOCK_POCIONES[0].id;

      component.eliminarPocion(idAEliminar);

      expect(component.pociones.length).withContext('Debe reducirse la cantidad en 1').toBe(cantidadInicial - 1);
      expect(component.pociones.find(p => p.id === idAEliminar)).withContext('La poción eliminada no debe existir').toBeUndefined();
    });
  });

  // =========================================================================
  // ⏳ RETO 4: EL FUEGO PURIFICADOR (ngOnDestroy y Limpieza de Recursos)
  // =========================================================================
  describe('⏳ Reto 4: Ciclo de Vida ngOnDestroy y Fugas de Memoria', () => {
    it('[4.1] El componente debe implementar el método del ciclo de vida ngOnDestroy', () => {
      expect(typeof component.ngOnDestroy)
        .withContext('Debes implementar la interfaz OnDestroy y el método ngOnDestroy()')
        .toBe('function');
    });

    it('[4.2] Debe inicializar el temporizador en timerIntervalId durante ngOnInit', () => {
      fixture.detectChanges();
      expect(component.timerIntervalId).withContext('timerIntervalId debe tener un ID de intervalo activo').not.toBeNull();
    });

    it('[4.3] Debe invocar window.clearInterval con timerIntervalId al destruirse el componente', () => {
      spyOn(window, 'clearInterval').and.callThrough();
      fixture.detectChanges();

      const timerId = component.timerIntervalId;
      expect(timerId).not.toBeNull();

      component.ngOnDestroy();
      expect(window.clearInterval)
        .withContext('ngOnDestroy() debe llamar a clearInterval con el ID del temporizador para evitar fugas')
        .toHaveBeenCalledWith(timerId);
    });
  });

  // =========================================================================
  // 🔍 RETO 5: TRANSMUTADOR DE ESTADOS Y FILTROS (IA CHALLENGE)
  // =========================================================================
  describe('🔍 Reto 5: Motor de Búsqueda, Filtros Combinados y Estabilidad (IA Challenge)', () => {
    beforeEach(() => {
      component.pociones = [...MOCK_POCIONES];
      component.filtroTexto = '';
      component.filtroTipoMagia = 'TODAS';
      component.filtroSoloPeligrosas = false;
      component.ordenAscendente = true;
    });

    it('[5.1] getPocionesFiltradas: debe filtrar insensible a mayúsculas por nombre', () => {
      component.filtroTexto = 'felix';
      const filtradas = component.getPocionesFiltradas();
      expect(filtradas.length).withContext('Debe encontrar 1 poción llamada Felix Felicis').toBe(1);
      if (filtradas.length > 0) {
        expect(filtradas[0].nombre).toBe('Felix Felicis');
      }
    });

    it('[5.2] getPocionesFiltradas: debe filtrar insensible a mayúsculas por descripción', () => {
      component.filtroTexto = 'sueño';
      const filtradas = component.getPocionesFiltradas();
      expect(filtradas.length).withContext('Debe encontrar la poción que menciona "sueño" en su descripción').toBe(1);
      if (filtradas.length > 0) {
        expect(filtradas[0].nombre).toBe('Filtro de Muertos');
      }
    });

    it('[5.3] getPocionesFiltradas: debe filtrar con precisión por tipo de magia cuando es diferente de TODAS', () => {
      component.filtroTipoMagia = 'Curacion';
      const filtradas = component.getPocionesFiltradas();
      expect(filtradas.length).withContext('Debe encontrar las 2 pociones de Curacion en el dataset').toBe(2);
      filtradas.forEach(p => {
        expect(p.tipoMagia).withContext('Cada poción retornada debe ser de tipo Curacion').toBe('Curacion');
      });
    });

    it('[5.4] getPocionesFiltradas: debe aislar únicamente pociones con peligro > 7 cuando filtroSoloPeligrosas es true', () => {
      component.filtroSoloPeligrosas = true;
      const filtradas = component.getPocionesFiltradas();
      expect(filtradas.length).withContext('Deben existir 2 pociones con peligro > 7 (Multijugos: 8, Filtro: 10)').toBe(2);
      filtradas.forEach(p => {
        expect(p.nivelPeligro).withContext('Solo deben incluirse pociones con peligro estrictamente mayor a 7').toBeGreaterThan(7);
      });
    });

    it('[5.5] getPocionesFiltradas: debe combinar filtros de texto, tipo y peligro simultáneamente', () => {
      component.filtroTexto = 'poc';
      component.filtroTipoMagia = 'Transmutacion';
      component.filtroSoloPeligrosas = true;

      const filtradas = component.getPocionesFiltradas();
      expect(filtradas.length).withContext('Solo Poción Multijugos cumple todos los criterios a la vez').toBe(1);
      if (filtradas.length > 0) {
        expect(filtradas[0].nombre).toBe('Poción Multijugos');
      }
    });

    it('[5.6] getPocionesFiltradas: debe ordenar por nivel de peligro de menor a mayor si ordenAscendente es true', () => {
      component.ordenAscendente = true;
      const filtradas = component.getPocionesFiltradas();
      for (let i = 0; i < filtradas.length - 1; i++) {
        expect(filtradas[i].nivelPeligro)
          .withContext('El orden ascendente exige que cada poción tenga menor o igual peligro que la siguiente')
          .toBeLessThanOrEqual(filtradas[i + 1].nivelPeligro);
      }
    });

    it('[5.7] getPocionesFiltradas: debe ordenar por nivel de peligro de mayor a menor si ordenAscendente es false', () => {
      component.ordenAscendente = false;
      const filtradas = component.getPocionesFiltradas();
      for (let i = 0; i < filtradas.length - 1; i++) {
        expect(filtradas[i].nivelPeligro)
          .withContext('El orden descendente exige que cada poción tenga mayor o igual peligro que la siguiente')
          .toBeGreaterThanOrEqual(filtradas[i + 1].nivelPeligro);
      }
    });

    it('[5.8] calcularEstabilidadCaldero: debe retornar "CRÍTICO" si hay 2 o más pociones con peligro >= 8', () => {
      component.pociones = [
        { id: 1, nombre: 'P1', descripcion: '', nivelPeligro: 8, tiempoCoccionMinutos: 10, tipoMagia: 'Prohibida', ingredientes: [], estable: false },
        { id: 2, nombre: 'P2', descripcion: '', nivelPeligro: 9, tiempoCoccionMinutos: 10, tipoMagia: 'Prohibida', ingredientes: [], estable: false }
      ];
      expect(component.calcularEstabilidadCaldero())
        .withContext('Con 2 pociones de peligro >= 8, el caldero debe estar en estado CRÍTICO')
        .toBe('CRÍTICO');
    });

    it('[5.9] calcularEstabilidadCaldero: debe retornar "INESTABLE" si hay al menos 1 poción con peligro >= 5 (y menos de 2 críticas)', () => {
      component.pociones = [
        { id: 1, nombre: 'P1', descripcion: '', nivelPeligro: 6, tiempoCoccionMinutos: 10, tipoMagia: 'Luz', ingredientes: [], estable: true },
        { id: 2, nombre: 'P2', descripcion: '', nivelPeligro: 2, tiempoCoccionMinutos: 10, tipoMagia: 'Curacion', ingredientes: [], estable: true }
      ];
      expect(component.calcularEstabilidadCaldero())
        .withContext('Con peligro >= 5 y sin 2 críticas, el caldero debe estar en estado INESTABLE')
        .toBe('INESTABLE');
    });

    it('[5.10] calcularEstabilidadCaldero: debe retornar "SEGURO" cuando todas las pociones tienen peligro < 5', () => {
      component.pociones = [
        { id: 1, nombre: 'P1', descripcion: '', nivelPeligro: 2, tiempoCoccionMinutos: 10, tipoMagia: 'Curacion', ingredientes: [], estable: true },
        { id: 2, nombre: 'P2', descripcion: '', nivelPeligro: 3, tiempoCoccionMinutos: 10, tipoMagia: 'Luz', ingredientes: [], estable: true }
      ];
      expect(component.calcularEstabilidadCaldero())
        .withContext('Con pociones de bajo peligro, el caldero debe estar en estado SEGURO')
        .toBe('SEGURO');
    });
  });

  // =========================================================================
  // ⌛ RETO 6: EL GIRATIEMPO (IA CHALLENGE)
  // =========================================================================
  describe('⌛ Reto 6: El Giratiempo / Undo-Redo Inmutable (IA Challenge)', () => {
    beforeEach(() => {
      component.pociones = [MOCK_POCIONES[0], MOCK_POCIONES[1]];
      component.historialPasos = [];
      component.indiceHistorial = -1;
      component.guardarEstadoGiratiempo(); // Paso inicial (índice 0)
    });

    it('[6.1] guardarEstadoGiratiempo: debe guardar clones profundos sin compartir referencias de memoria', () => {
      expect(component.historialPasos.length).toBe(1);

      // Mutamos directamente el array component.pociones
      component.pociones.push(MOCK_POCIONES[2]);

      // El snapshot guardado en el historial no debe verse afectado por mutaciones directas
      expect(component.historialPasos[0].length)
        .withContext('El historial del Giratiempo debe ser inmutable y no verse afectado por mutaciones externas')
        .toBe(2);
    });

    it('[6.2] puedeDeshacer y puedeRehacer: deben reflejar con precisión si es posible retroceder o avanzar', () => {
      // Estado inicial (paso 0) -> no se puede deshacer ni rehacer
      expect(component.puedeDeshacer()).withContext('En el estado inicial no se puede deshacer').toBeFalse();
      expect(component.puedeRehacer()).withContext('En el estado inicial no se puede rehacer').toBeFalse();

      // Agregamos una poción y guardamos
      component.pociones = [...component.pociones, MOCK_POCIONES[2]];
      component.guardarEstadoGiratiempo();

      expect(component.puedeDeshacer()).withContext('Tras una acción debe poderse deshacer').toBeTrue();
      expect(component.puedeRehacer()).withContext('No se puede rehacer si estamos en el paso más reciente').toBeFalse();
    });

    it('[6.3] giratiempoDeshacer: debe restaurar el estado anterior exacto de las pociones', () => {
      const cantidadInicial = component.pociones.length;

      // Agregamos una poción
      component.pociones = [...component.pociones, MOCK_POCIONES[2]];
      component.guardarEstadoGiratiempo();
      expect(component.pociones.length).toBe(cantidadInicial + 1);

      // Deshacer
      component.giratiempoDeshacer();
      expect(component.pociones.length).withContext('Deshacer debe restaurar la cantidad anterior de pociones').toBe(cantidadInicial);
      expect(component.pociones.find(p => p.id === MOCK_POCIONES[2].id)).toBeUndefined();
    });

    it('[6.4] giratiempoRehacer: debe avanzar en el tiempo y restaurar la acción revertida', () => {
      const cantidadInicial = component.pociones.length;

      // Agregamos poción
      component.pociones = [...component.pociones, MOCK_POCIONES[2]];
      component.guardarEstadoGiratiempo();

      // Deshacer y luego Rehacer
      component.giratiempoDeshacer();
      expect(component.pociones.length).toBe(cantidadInicial);

      expect(component.puedeRehacer()).toBeTrue();
      component.giratiempoRehacer();
      expect(component.pociones.length).withContext('Rehacer debe restaurar la poción agregada').toBe(cantidadInicial + 1);
    });

    it('[6.5] Bifurcación temporal: si se deshace y se realiza una nueva acción, debe descartar los futuros anteriores', () => {
      // Paso 0: 2 pociones
      // Paso 1: agregamos P3
      component.pociones = [...component.pociones, MOCK_POCIONES[2]];
      component.guardarEstadoGiratiempo();

      // Deshacemos al paso 0
      component.giratiempoDeshacer();
      expect(component.indiceHistorial).toBe(0);

      // En el paso 0 realizamos una nueva acción (Paso alternativo 1: agregamos P4)
      component.pociones = [...component.pociones, MOCK_POCIONES[3]];
      component.guardarEstadoGiratiempo();

      // El historial total debe ser 2 (Paso 0 y el nuevo Paso 1), no 3
      expect(component.historialPasos.length)
        .withContext('Al realizar una nueva acción tras un Undo, el futuro previo debe ser descartado (truncamiento)')
        .toBe(2);
      expect(component.puedeRehacer()).toBeFalse();
    });
  });
});
