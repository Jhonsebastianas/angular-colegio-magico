import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type EstadoSimulacion = 'INICIO' | 'EN_CURSO' | 'PAUSADO' | 'VICTORIA' | 'DERROTA';
type TipoRegistro = 'inicio' | 'accion' | 'evento' | 'avance' | 'resultado' | 'alerta';
type CategoriaAccion = 'Restauración' | 'Agua' | 'Residuos' | 'Energía' | 'Fauna';

interface Indicador {
  id: string;
  nombre: string;
  icono: string;
  valor: number;
  descripcion: string;
}

interface Recursos {
  agua: number;
  energia: number;
  presupuesto: number;
  materiales: number;
}

interface Costos {
  agua?: number;
  energia?: number;
  presupuesto?: number;
  materiales?: number;
}

interface AccionAmbiental {
  id: string;
  nombre: string;
  icono: string;
  categoria: CategoriaAccion;
  descripcion: string;
  efecto: string;
  costos: Costos;
  instantaneos: Partial<Record<string, number>>;
  progresivos: Partial<Record<string, number>>;
}

interface EventoAmbiental {
  nombre: string;
  icono: string;
  tipo: string;
  descripcion: string;
  impacto: string;
  cambios: Partial<Record<string, number>>;
  recursos: Partial<Recursos>;
}

interface EfectoPendiente {
  accion: string;
  mesAplicacion: number;
  cambios: Partial<Record<string, number>>;
}

interface RegistroActividad {
  mes: number;
  tipo: TipoRegistro;
  titulo: string;
  descripcion: string;
}

interface PuntoHistorico {
  mes: number;
  salud: number;
  agua: number;
  vegetacion: number;
  biodiversidad: number;
  contaminacion: number;
}

interface Notificacion {
  id: number;
  tipo: 'success' | 'warning' | 'danger' | 'info';
  titulo: string;
  mensaje: string;
}

interface MisionAmbiental {
  nombre: string;
  descripcion: string;
  problemas: string[];
  objetivo: string;
  dificultad: 'Controlada' | 'Exigente' | 'Intensa';
  valores: Record<string, number>;
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  estado: EstadoSimulacion = 'INICIO';
  mesActual = 1;
  readonly totalMeses = 12;
  mision: MisionAmbiental = this.generarMision();
  mostrarAyuda = true;

  indicadores: Indicador[] = [];
  recursos: Recursos = this.recursosIniciales();
  acciones: AccionAmbiental[] = [
    {
      id: 'reforestacion', nombre: 'Reforestación', icono: '🌱', categoria: 'Restauración',
      descripcion: 'Planta especies nativas en las zonas más erosionadas.',
      efecto: '+8 vegetación ahora, +5 vegetación y +3 biodiversidad durante 2 meses.',
      costos: { presupuesto: 150, agua: 20, materiales: 10 },
      instantaneos: { vegetacion: 4, aire: 2 },
      progresivos: { vegetacion: 5, biodiversidad: 3 }
    },
    {
      id: 'rios', nombre: 'Limpieza de ríos', icono: '💧', categoria: 'Agua',
      descripcion: 'Retira residuos y recupera los cauces contaminados.',
      efecto: '+10 calidad del agua y reduce la presión contaminante.',
      costos: { presupuesto: 120, energia: 15, materiales: 10 },
      instantaneos: { aguaCalidad: 10, residuos: 3 },
      progresivos: { aguaCalidad: 2 }
    },
    {
      id: 'residuos', nombre: 'Gestión de residuos', icono: '♻️', categoria: 'Residuos',
      descripcion: 'Activa separación, reciclaje y recolección responsable.',
      efecto: '+12 gestión de residuos y mejora gradual del aire.',
      costos: { presupuesto: 100, energia: 20 },
      instantaneos: { residuos: 12, aire: 2 },
      progresivos: { aire: 2 }
    },
    {
      id: 'renovable', nombre: 'Energía renovable', icono: '☀️', categoria: 'Energía',
      descripcion: 'Instala paneles solares para reducir emisiones del territorio.',
      efecto: '+8 calidad del aire y +4 gestión de residuos.',
      costos: { presupuesto: 250, materiales: 25 },
      instantaneos: { aire: 8, residuos: 4 },
      progresivos: { aire: 3 }
    },
    {
      id: 'suelo', nombre: 'Recuperación del suelo', icono: '🪨', categoria: 'Restauración',
      descripcion: 'Regenera terrenos degradados con compost y especies protectoras.',
      efecto: '+11 suelo y +5 vegetación en los próximos meses.',
      costos: { presupuesto: 180, agua: 15, materiales: 20 },
      instantaneos: { suelo: 11 },
      progresivos: { vegetacion: 5, suelo: 2 }
    },
    {
      id: 'fauna', nombre: 'Protección de fauna', icono: '🦌', categoria: 'Fauna',
      descripcion: 'Crea refugios y corredores para especies nativas.',
      efecto: '+10 biodiversidad y recuperación gradual del hábitat.',
      costos: { presupuesto: 200, energia: 10, materiales: 15 },
      instantaneos: { biodiversidad: 7 },
      progresivos: { biodiversidad: 4, vegetacion: 1 }
    }
  ];

  eventosDisponibles: EventoAmbiental[] = [
    { nombre: 'Sequía estacional', icono: '☀️', tipo: 'Riesgo climático', descripcion: 'Las reservas hídricas descienden y el suelo pierde humedad.', impacto: '-120 agua, -4 suelo y -3 vegetación.', cambios: { suelo: -4, vegetacion: -3 }, recursos: { agua: -120 } },
    { nombre: 'Incendio forestal', icono: '🔥', tipo: 'Emergencia', descripcion: 'Un foco de incendio afecta una zona de bosque vulnerable.', impacto: '-7 vegetación, -5 biodiversidad y -5 aire.', cambios: { vegetacion: -7, biodiversidad: -5, aire: -5 }, recursos: {} },
    { nombre: 'Inundación', icono: '🌊', tipo: 'Fenómeno natural', descripcion: 'Las lluvias intensas desbordan una ribera restaurada.', impacto: '-5 suelo y -2 calidad del agua.', cambios: { suelo: -5, aguaCalidad: -2 }, recursos: { agua: 100 } },
    { nombre: 'Contaminación industrial', icono: '🏭', tipo: 'Alerta ambiental', descripcion: 'Un vertido inesperado llega al valle desde la zona industrial.', impacto: '-6 agua, -5 aire y -6 residuos.', cambios: { aguaCalidad: -6, aire: -5, residuos: -6 }, recursos: {} },
    { nombre: 'Temporada de lluvias', icono: '🌧️', tipo: 'Oportunidad', descripcion: 'Las lluvias recuperan los acuíferos y refrescan la vegetación.', impacto: '+160 agua, +4 suelo y +3 vegetación.', cambios: { suelo: 4, vegetacion: 3 }, recursos: { agua: 160 } },
    { nombre: 'Recuperación natural', icono: '🌿', tipo: 'Señal positiva', descripcion: 'La resiliencia del ecosistema empieza a hacerse visible.', impacto: '+3 vegetación, +3 biodiversidad y +2 agua.', cambios: { vegetacion: 3, biodiversidad: 3, aguaCalidad: 2 }, recursos: {} }
  ];

  historial: RegistroActividad[] = [];
  historialSalud: PuntoHistorico[] = [];
  efectosPendientes: EfectoPendiente[] = [];
  notificaciones: Notificacion[] = [];
  accionesRealizadas = 0;
  eventosEnfrentados = 0;
  private nextNotificationId = 1;
  private notificationTimers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    this.reiniciarSimulacion(false);
  }

  get saludGeneral(): number {
    if (!this.indicadores.length) return 0;
    return Math.round(this.indicadores.reduce((total, indicador) => total + indicador.valor, 0) / this.indicadores.length);
  }

  get mesesRestantes(): number {
    return Math.max(0, this.totalMeses - this.mesActual + 1);
  }

  get progresoMision(): number {
    return Math.min(100, Math.round(((this.mesActual - 1) / this.totalMeses) * 100));
  }

  get contaminacion(): number {
    const aire = this.valorIndicador('aire');
    const residuos = this.valorIndicador('residuos');
    return Math.round(100 - (aire + residuos) / 2);
  }

  get escenarioClase(): string {
    if (this.saludGeneral >= 76) return 'escenario-saludable';
    if (this.saludGeneral >= 51) return 'escenario-recuperacion';
    return 'escenario-deteriorado';
  }

  get faunaVisible(): number {
    return Math.max(1, Math.ceil(this.valorIndicador('biodiversidad') / 25));
  }

  iniciarMision(): void {
    this.reiniciarSimulacion(true, false);
  }

  prepararNuevaMision(): void {
    this.reiniciarSimulacion(false, true);
  }

  alternarAyuda(): void {
    this.mostrarAyuda = !this.mostrarAyuda;
  }

  reiniciarSimulacion(iniciar: boolean, generarNueva = true): void {
    if (generarNueva) this.mision = this.generarMision();
    this.mesActual = 1;
    this.recursos = this.recursosIniciales();
    this.indicadores = [
      { id: 'aguaCalidad', nombre: 'Calidad del agua', icono: '💧', valor: this.mision.valores['aguaCalidad'], descripcion: 'Pureza de ríos y reservas' },
      { id: 'vegetacion', nombre: 'Cobertura vegetal', icono: '🌲', valor: this.mision.valores['vegetacion'], descripcion: 'Bosques y áreas verdes' },
      { id: 'biodiversidad', nombre: 'Biodiversidad', icono: '🦋', valor: this.mision.valores['biodiversidad'], descripcion: 'Variedad y estabilidad de especies' },
      { id: 'suelo', nombre: 'Calidad del suelo', icono: '🌾', valor: this.mision.valores['suelo'], descripcion: 'Fertilidad y resiliencia del terreno' },
      { id: 'residuos', nombre: 'Gestión de residuos', icono: '♻️', valor: this.mision.valores['residuos'], descripcion: 'Eficiencia del manejo de residuos' },
      { id: 'aire', nombre: 'Calidad del aire', icono: '🌬️', valor: this.mision.valores['aire'], descripcion: 'Pureza atmosférica del valle' }
    ];
    this.historial = [];
    this.historialSalud = [{ mes: 0, salud: this.saludGeneral, agua: this.valorIndicador('aguaCalidad'), vegetacion: this.valorIndicador('vegetacion'), biodiversidad: this.valorIndicador('biodiversidad'), contaminacion: this.contaminacion }];
    this.efectosPendientes = [];
    this.accionesRealizadas = 0;
    this.eventosEnfrentados = 0;
    this.notificaciones = [];
    this.estado = iniciar ? 'EN_CURSO' : 'INICIO';
    if (iniciar) {
      this.mostrarAyuda = false;
      this.registrar('inicio', 'Misión iniciada', `El equipo REGEN llega al Valle Esmeralda. Objetivo: ${this.mision.objetivo}`);
      this.mostrarNotificacion('success', 'Misión activa', `Comienza ${this.mision.nombre}. ${this.mision.objetivo}`);
    }
  }

  ejecutarAccion(accion: AccionAmbiental): void {
    if (this.estado !== 'EN_CURSO') {
      this.mostrarNotificacion('warning', 'Simulación no disponible', 'Reanuda la misión para ejecutar acciones ambientales.');
      return;
    }
    const faltante = this.recursoFaltante(accion.costos);
    if (faltante) {
      this.mostrarNotificacion('warning', 'Recursos insuficientes', `Necesitas ${faltante} para ejecutar ${accion.nombre}.`);
      this.registrar('alerta', 'Acción bloqueada', `${accion.nombre} no se ejecutó por falta de ${faltante}.`);
      return;
    }
    this.descontarRecursos(accion.costos);
    this.aplicarCambios(accion.instantaneos);
    Object.entries(accion.progresivos).forEach(([indicador, valor]) => {
      this.efectosPendientes.push({ accion: accion.nombre, mesAplicacion: this.mesActual + 1, cambios: { [indicador]: valor } });
      this.efectosPendientes.push({ accion: accion.nombre, mesAplicacion: this.mesActual + 2, cambios: { [indicador]: valor } });
    });
    this.accionesRealizadas++;
    this.registrar('accion', accion.nombre, `${accion.descripcion} Efectos aplicados: ${accion.efecto}`);
    this.mostrarNotificacion('success', `${accion.icono} ${accion.nombre} completada`, accion.efecto);
    this.comprobarResultado();
  }

  avanzarMes(): void {
    if (this.estado !== 'EN_CURSO') return;
    const mesProcesado = this.mesActual;
    this.aplicarEfectosPendientes(mesProcesado + 1);
    this.aplicarRegeneracionNatural();
    this.aplicarEventoAleatorio();
    this.mesActual++;
    this.historialSalud.push({ mes: this.mesActual, salud: this.saludGeneral, agua: this.valorIndicador('aguaCalidad'), vegetacion: this.valorIndicador('vegetacion'), biodiversidad: this.valorIndicador('biodiversidad'), contaminacion: this.contaminacion });
    this.registrar('avance', `Mes ${this.mesActual} alcanzado`, `La salud del ecosistema se sitúa en ${this.saludGeneral}/100. Se revisan recursos y efectos de recuperación.`);
    this.comprobarResultado();
  }

  alternarPausa(): void {
    if (this.estado === 'EN_CURSO') {
      this.estado = 'PAUSADO';
      this.registrar('avance', 'Simulación pausada', 'El territorio queda en observación hasta reanudar la misión.');
    } else if (this.estado === 'PAUSADO') {
      this.estado = 'EN_CURSO';
      this.mostrarNotificacion('info', 'Simulación reanudada', 'El siguiente avance aplicará las consecuencias del mes.');
    }
  }

  cerrarNotificacion(id: number): void {
    this.notificaciones = this.notificaciones.filter(notificacion => notificacion.id !== id);
  }

  claseIndicador(valor: number): string {
    if (valor <= 30) return 'critico';
    if (valor <= 50) return 'preocupante';
    if (valor <= 75) return 'estable';
    return 'saludable';
  }

  etiquetaIndicador(valor: number): string {
    if (valor <= 30) return 'Crítico';
    if (valor <= 50) return 'Preocupante';
    if (valor <= 75) return 'Estable';
    return 'Saludable';
  }

  valorIndicador(id: string): number {
    return this.indicadores.find(indicador => indicador.id === id)?.valor ?? 0;
  }

  maximoHistorial(propiedad: keyof PuntoHistorico): number {
    return Math.max(1, ...this.historialSalud.map(punto => Number(punto[propiedad])));
  }

  ngOnDestroy(): void {
    this.notificationTimers.forEach(timer => clearTimeout(timer));
    this.notificationTimers = [];
  }

  private recursosIniciales(): Recursos {
    return { agua: 800, energia: 600, presupuesto: 5000, materiales: 100 };
  }

  private generarMision(): MisionAmbiental {
    const aleatorio = (minimo: number, maximo: number): number => Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
    const perfiles: Array<Omit<MisionAmbiental, 'valores'>> = [
      { nombre: 'Bosque en peligro', descripcion: 'El bosque perdió sus corredores naturales y varias especies migraron del valle.', problemas: ['Vegetación baja', 'Biodiversidad fragmentada', 'Suelo erosionado'], objetivo: 'Elevar vegetación a 70 y biodiversidad a 65.', dificultad: 'Exigente' },
      { nombre: 'Río contaminado', descripcion: 'Los residuos acumulados alteraron el cauce principal y amenazan la vida acuática.', problemas: ['Agua muy baja', 'Residuos elevados', 'Fauna acuática afectada'], objetivo: 'Llevar agua a 70 y residuos a 60.', dificultad: 'Controlada' },
      { nombre: 'Ecosistema industrial', descripcion: 'Las emisiones de la zona industrial cubren el valle y frenan su regeneración.', problemas: ['Aire deteriorado', 'Residuos elevados', 'Vegetación reducida'], objetivo: 'Alcanzar aire 70 y salud general 72.', dificultad: 'Exigente' },
      { nombre: 'Sequía extrema', descripcion: 'Una temporada seca redujo las reservas y dejó el terreno sin humedad.', problemas: ['Poca disponibilidad de agua', 'Vegetación deteriorada', 'Suelo seco'], objetivo: 'Mantener agua disponible sobre 250 y suelo en 65.', dificultad: 'Intensa' },
      { nombre: 'Ecosistema degradado', descripcion: 'Múltiples presiones ambientales exigen una estrategia equilibrada desde el primer mes.', problemas: ['Varios indicadores críticos', 'Contaminación persistente', 'Baja resiliencia'], objetivo: 'Superar salud 75 y mantener los seis indicadores sobre 55.', dificultad: 'Intensa' }
    ];
    const perfil = perfiles[Math.floor(Math.random() * perfiles.length)];
    const valoresPorPerfil: Record<string, Record<string, [number, number]>> = {
      'Bosque en peligro': { aguaCalidad: [42, 58], vegetacion: [22, 34], biodiversidad: [25, 38], suelo: [34, 48], residuos: [38, 52], aire: [52, 68] },
      'Río contaminado': { aguaCalidad: [18, 30], vegetacion: [48, 65], biodiversidad: [28, 42], suelo: [52, 68], residuos: [16, 29], aire: [42, 58] },
      'Ecosistema industrial': { aguaCalidad: [35, 52], vegetacion: [25, 40], biodiversidad: [34, 48], suelo: [42, 58], residuos: [18, 32], aire: [20, 35] },
      'Sequía extrema': { aguaCalidad: [28, 43], vegetacion: [20, 35], biodiversidad: [32, 46], suelo: [24, 39], residuos: [42, 58], aire: [56, 70] },
      'Ecosistema degradado': { aguaCalidad: [25, 40], vegetacion: [25, 40], biodiversidad: [24, 39], suelo: [28, 43], residuos: [22, 38], aire: [30, 46] }
    };
    const rangos = valoresPorPerfil[perfil.nombre];
    const valores: Record<string, number> = {};
    Object.entries(rangos).forEach(([indicador, rango]) => valores[indicador] = aleatorio(rango[0], rango[1]));
    return { ...perfil, valores };
  }

  private registrar(tipo: TipoRegistro, titulo: string, descripcion: string): void {
    this.historial.unshift({ mes: this.mesActual, tipo, titulo, descripcion });
  }

  private mostrarNotificacion(tipo: Notificacion['tipo'], titulo: string, mensaje: string): void {
    const id = this.nextNotificationId++;
    this.notificaciones = [...this.notificaciones.slice(-3), { id, tipo, titulo, mensaje }];
    const timer = setTimeout(() => this.cerrarNotificacion(id), 6500);
    this.notificationTimers.push(timer);
  }

  private recursoFaltante(costos: Costos): string | null {
    const nombres: Record<keyof Recursos, string> = { agua: 'agua', energia: 'energía', presupuesto: 'presupuesto', materiales: 'materiales' };
    for (const recurso of Object.keys(costos) as (keyof Recursos)[]) {
      if ((this.recursos[recurso] ?? 0) < (costos[recurso] ?? 0)) {
        return `${costos[recurso]} unidades de ${nombres[recurso]}`;
      }
    }
    return null;
  }

  private descontarRecursos(costos: Costos): void {
    (Object.keys(costos) as (keyof Recursos)[]).forEach(recurso => {
      this.recursos[recurso] = Math.max(0, this.recursos[recurso] - (costos[recurso] ?? 0));
    });
  }

  private aplicarCambios(cambios: Partial<Record<string, number>>): void {
    Object.entries(cambios).forEach(([id, cambio]) => {
      const indicador = this.indicadores.find(item => item.id === id);
      if (indicador && cambio !== undefined) indicador.valor = Math.max(0, Math.min(100, indicador.valor + cambio));
    });
  }

  private aplicarEfectosPendientes(mes: number): void {
    const aplicables = this.efectosPendientes.filter(efecto => efecto.mesAplicacion <= mes);
    aplicables.forEach(efecto => {
      this.aplicarCambios(efecto.cambios);
      this.registrar('avance', 'Efecto de recuperación', `${efecto.accion} mejora el ecosistema de forma progresiva.`);
    });
    this.efectosPendientes = this.efectosPendientes.filter(efecto => efecto.mesAplicacion > mes);
  }

  private aplicarRegeneracionNatural(): void {
    const suelo = this.valorIndicador('suelo');
    const cambio = suelo >= 55 ? 1 : 0;
    this.aplicarCambios({ suelo: cambio, vegetacion: suelo >= 60 ? 1 : 0, aguaCalidad: this.valorIndicador('aguaCalidad') < 35 ? 0 : 1 });
    this.recursos.agua = Math.min(1000, this.recursos.agua + 25);
    this.recursos.energia = Math.min(800, this.recursos.energia + 20);
  }

  private aplicarEventoAleatorio(): void {
    if (Math.random() > 0.48) return;
    const evento = this.eventosDisponibles[Math.floor(Math.random() * this.eventosDisponibles.length)];
    this.aplicarCambios(evento.cambios);
    (Object.keys(evento.recursos) as (keyof Recursos)[]).forEach(recurso => {
      this.recursos[recurso] = Math.max(0, this.recursos[recurso] + (evento.recursos[recurso] ?? 0));
    });
    this.eventosEnfrentados++;
    this.registrar('evento', `${evento.icono} ${evento.nombre}`, `${evento.descripcion} ${evento.impacto}`);
    this.mostrarNotificacion(evento.nombre === 'Recuperación natural' || evento.nombre === 'Temporada de lluvias' ? 'success' : 'danger', `${evento.icono} ${evento.nombre}`, evento.impacto);
  }

  private comprobarResultado(): void {
    const objetivos = this.saludGeneral >= 75 && this.valorIndicador('aguaCalidad') >= 65 && this.valorIndicador('vegetacion') >= 65 && this.valorIndicador('biodiversidad') >= 60;
    if (objetivos) {
      this.estado = 'VICTORIA';
      this.registrar('resultado', 'Misión completada', 'El Valle Esmeralda recuperó su equilibrio antes del límite de 12 meses.');
      this.mostrarNotificacion('success', '¡Victoria ambiental!', 'Has cumplido todos los objetivos de recuperación.');
    } else if (this.saludGeneral <= 18 || (this.mesActual > this.totalMeses)) {
      this.estado = 'DERROTA';
      this.registrar('resultado', 'Misión fallida', this.saludGeneral <= 18 ? 'La salud del ecosistema llegó a un nivel crítico.' : 'Se agotó el tiempo sin cumplir los objetivos ambientales.');
      this.mostrarNotificacion('danger', 'Misión finalizada', 'El ecosistema necesita una estrategia de recuperación más sólida.');
    }
  }
}
