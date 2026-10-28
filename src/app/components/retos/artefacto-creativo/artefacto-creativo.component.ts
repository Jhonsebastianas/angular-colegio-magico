import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MagiaVisualComponent } from './magia-visual/magia-visual.component';

// ============================================================================
// 🎨 RETO 7: "SPRINT CONTRA LA PROCRASTINACIÓN"
// ----------------------------------------------------------------------------
// Idea: escribes tu lista de tareas y empieza un sprint. Don Mañana (la
// procrastinación 🦥) corre detrás de ti y se acerca cada segundo. Para
// terminar tus tareas necesitas ESTAMINA; cuando se agota, haces ejercicios de
// recarga (pero la pereza gana terreno mientras los haces). Si completas toda
// la lista antes de que te alcance, ¡ganas!
//
// ⚠️ El Tribunal (archivo .spec.ts) busca estos nombres, así que se conservan,
// pero con el significado de este juego:
//   estadoDuelo   → fase del juego (PREPARACION, EN_CURSO, VICTORIA, DERROTA)
//   saludMago     → tu ESTAMINA (0 a 100)
//   saludRival    → FUERZA de la procrastinación (0 a 100)
//   hechizosDuelo → las TÉCNICAS (ejercicios, enfoque y escudos)
//   historialDuelo→ el DIARIO del sprint
//   iniciarDuelo()→ empezar el sprint
//   lanzarHechizo → usar una técnica
// ============================================================================

export type EstadoJuego = 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA';
export type EsfuerzoTarea = 'Rapida' | 'Media' | 'Pesada';
export type RitmoJuego = 'facilisimo' | 'Meh' | 'Intenso';

export interface Tarea {
  id: number;
  texto: string;
  esfuerzo: EsfuerzoTarea;
  hecha: boolean;
}

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
  emoji: string;
  enfriamiento: number; // segundos antes de poder repetirla
  costoTerreno?: number; // metros que gana la pereza mientras haces el ejercicio
}

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal' | 'task' | 'alert';
}

interface PiezaConfeti {
  id: number;
  x: number;
  color: string;
  retraso: number;
  giro: number;
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule, MagiaVisualComponent],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // =========================================================================
  // 1. ESTADO DEL JUEGO
  // =========================================================================
  estadoDuelo: EstadoJuego = 'PREPARACION';

  // Jugador
  nombreMago: string = 'Aprendiz'; // se edita con [(ngModel)]
  saludMago: number = 100; // estamina

  // Procrastinación
  nombreRival: string = 'Don Mañana';
  saludRival: number = 100; // fuerza
  distanciaPereza: number = 100; // 100 = muy lejos, 0 = te alcanzó
  escudoSegundos: number = 0; // segundos que la pereza queda congelada

  numeroTurno: number = 1;
  segundosJugados: number = 0;

  // Lista de tareas del jugador
  tareas: Tarea[] = [];
  nuevaTarea: string = ''; // [(ngModel)]
  nuevoEsfuerzo: EsfuerzoTarea = 'Media'; // [(ngModel)]
  ritmo: RitmoJuego = 'Meh'; // [(ngModel)]

  readonly esfuerzos: { valor: EsfuerzoTarea; etiqueta: string; costo: number }[] = [
    { valor: 'Rapida', etiqueta: 'Rápida · 15⚡', costo: 15 },
    { valor: 'Media', etiqueta: 'Media · 30⚡', costo: 30 },
    { valor: 'Pesada', etiqueta: 'Pesada · 45⚡', costo: 45 }
  ];

  readonly ritmos: { valor: RitmoJuego; factor: number }[] = [
    { valor: 'facilisimo', factor: 0.7 },
    { valor: 'Meh', factor: 1 },
    { valor: 'Intenso', factor: 1.5 }
  ];

  // Técnicas disponibles (ejercicios, enfoque y escudos)
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Respirar hondo', tipo: 'Sanacion', poder: 12, costoEnergia: 0, enfriamiento: 5, costoTerreno: 4, emoji: '🌬️', descripcion: 'Tres respiraciones lentas para despejar la mente.' },
    { id: 2, nombre: 'Tomar agua', tipo: 'Sanacion', poder: 10, costoEnergia: 0, enfriamiento: 4, costoTerreno: 3, emoji: '💧', descripcion: 'Un vaso de agua fría y vuelves a la carga.' },
    { id: 3, nombre: 'Estirar el cuerpo', tipo: 'Sanacion', poder: 18, costoEnergia: 0, enfriamiento: 10, costoTerreno: 8, emoji: '🤸', descripcion: 'Cuello, hombros y espalda: se acabó el sillón.' },
    { id: 4, nombre: 'Caminar 5 minutos', tipo: 'Sanacion', poder: 30, costoEnergia: 0, enfriamiento: 18, costoTerreno: 15, emoji: '🚶', descripcion: 'Aire fresco: la mejor recarga, pero te cuesta tiempo.' },
    { id: 5, nombre: 'Regla de 2 minutos', tipo: 'Ataque', poder: 20, costoEnergia: 15, enfriamiento: 5, emoji: '⏱️', descripcion: 'Empieza solo 2 minutos y la pereza pierde fuerza.' },
    { id: 6, nombre: 'Pomodoro', tipo: 'Ataque', poder: 35, costoEnergia: 30, enfriamiento: 12, emoji: '🍅', descripcion: '25 minutos de foco total contra Don Mañana.' },
    { id: 7, nombre: 'Modo enfoque', tipo: 'Defensa', poder: 5, costoEnergia: 15, enfriamiento: 10, emoji: '🎧', descripcion: 'Audífonos puestos: la pereza se congela unos segundos.' },
    { id: 8, nombre: 'Celular en silencio', tipo: 'Defensa', poder: 8, costoEnergia: 25, enfriamiento: 18, emoji: '🔕', descripcion: 'Sin notificaciones, sin tentaciones.' }
  ];

  // Para dibujar las técnicas agrupadas en la vista
  readonly grupos: { tipo: HechizoDuelo['tipo']; titulo: string; nota: string }[] = [
    { tipo: 'Sanacion', titulo: 'Ejercicios de recarga', nota: 'Suben tu estamina, pero la pereza avanza mientras los haces.' },
    { tipo: 'Ataque', titulo: 'Técnicas de enfoque', nota: 'Le quitan fuerza a la procrastinación.' },
    { tipo: 'Defensa', titulo: 'Escudos de concentración', nota: 'Congelan su avance unos segundos.' }
  ];

  enfriamientos: Record<number, number> = {};
  historialDuelo: RegistroTurno[] = [];

  // Efectos visuales (la vista los traduce en animaciones CSS)
  efectoHeroe: '' | 'salto' | 'brillo' | 'golpe' = '';
  efectoPereza: '' | 'retroceso' | 'golpe' = '';
  confeti: PiezaConfeti[] = [];

  private readonly frasesPereza: string[] = [
    '"Solo un video más…"',
    '"Mañana empiezo, de verdad."',
    '"Primero revisemos el celular."',
    '"Esa tarea no es tan urgente."',
    '"Descansa un ratito… largo."'
  ];

  // Este proyecto NO usa zone.js: Angular solo redibuja tras clics y eventos.
  // Como el reloj (setInterval) y los setTimeout no son eventos, hay que
  // avisarle a Angular con markForCheck() para que actualice la pantalla.
  private readonly cdr = inject(ChangeDetectorRef);

  private relojInterval: ReturnType<typeof setInterval> | null = null;
  private temporizadores = new Set<ReturnType<typeof setTimeout>>();
  private contadorTareas = 0;
  private contadorConfeti = 0;

  // =========================================================================
  // 2. CICLO DE VIDA
  // =========================================================================
  // Hook #1: ngOnInit → prepara el estado y arranca el reloj del juego
  ngOnInit(): void {
    console.log('🎨 Reto 7: Sprint contra la Procrastinación montado.');
    this.reiniciarEnfriamientos();
    this.relojInterval = setInterval(() => {
      this.tick();
      this.cdr.markForCheck();
    }, 1000);
  }

  // Hook #2: ngOnDestroy → limpia el reloj y cualquier temporizador pendiente
  ngOnDestroy(): void {
    if (this.relojInterval) {
      clearInterval(this.relojInterval);
      this.relojInterval = null;
    }
    this.temporizadores.forEach(id => clearTimeout(id));
    this.temporizadores.clear();
    console.log('🎨 Reto 7: Sprint desmontado y recursos limpiados.');
  }

  // =========================================================================
  // 3. LISTA DE TAREAS (fase de preparación)
  // =========================================================================
  get puedeAgregar(): boolean {
    return this.nuevaTarea.trim().length >= 3 && this.tareas.length < 8;
  }

  get puedeIniciar(): boolean {
    return this.tareas.length > 0;
  }

  agregarTarea(): void {
    if (!this.puedeAgregar || this.estadoDuelo !== 'PREPARACION') return;
    this.tareas.push({
      id: ++this.contadorTareas,
      texto: this.nuevaTarea.trim(),
      esfuerzo: this.nuevoEsfuerzo,
      hecha: false
    });
    this.nuevaTarea = '';
  }

  eliminarTarea(id: number): void {
    if (this.estadoDuelo !== 'PREPARACION') return;
    this.tareas = this.tareas.filter(t => t.id !== id);
  }

  cargarEjemplo(): void {
    const ejemplos: [string, EsfuerzoTarea][] = [
      ['Hacer el reto de Angular', 'Pesada'],
      ['Repasar inglés 15 minutos', 'Media'],
      ['Responder mensajes pendientes', 'Rapida'],
      ['Ordenar mi escritorio', 'Rapida']
    ];
    this.tareas = ejemplos.map(([texto, esfuerzo]) => ({
      id: ++this.contadorTareas,
      texto,
      esfuerzo,
      hecha: false
    }));
  }

  costoDe(t: Tarea): number {
    return this.esfuerzos.find(e => e.valor === t.esfuerzo)?.costo ?? 20;
  }

  puedeCompletar(t: Tarea): boolean {
    return this.estadoDuelo === 'EN_CURSO' && !t.hecha && this.saludMago >= this.costoDe(t);
  }

  // =========================================================================
  // 4. EL SPRINT
  // =========================================================================
  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.saludRival = 100;
    this.distanciaPereza = 100;
    this.escudoSegundos = 0;
    this.numeroTurno = 1;
    this.segundosJugados = 0;
    this.confeti = [];
    this.tareas.forEach(t => (t.hecha = false));
    this.reiniciarEnfriamientos();
    this.historialDuelo = [
      {
        turno: 1,
        emisor: this.nombreRival,
        hechizo: 'Bostezo inicial',
        efecto: '¡Empieza el sprint! Don Mañana despierta y viene por ti.',
        tipo: 'alert'
      }
    ];
  }

  volverAPreparar(): void {
    this.estadoDuelo = 'PREPARACION';
    this.tareas.forEach(t => (t.hecha = false));
    this.historialDuelo = [];
    this.saludMago = 100;
    this.saludRival = 100;
    this.distanciaPereza = 100;
    this.escudoSegundos = 0;
    this.confeti = [];
  }

  // Completar una tarea: gasta estamina, aleja a la pereza y la debilita
  completarTarea(t: Tarea): void {
    if (!this.puedeCompletar(t)) {
      if (this.estadoDuelo === 'EN_CURSO' && !t.hecha) {
        this.efectoHeroe = 'golpe';
        this.programar(() => (this.efectoHeroe = ''), 500);
        this.registrar('Sistema', 'Sin estamina', 'Necesitas recargar con un ejercicio antes de esa tarea.', 'alert');
      }
      return;
    }

    this.saludMago -= this.costoDe(t);
    t.hecha = true;
    this.numeroTurno++;
    this.distanciaPereza = Math.min(100, this.distanciaPereza + 8);
    this.debilitarRival(Math.ceil(100 / this.tareas.length));

    this.registrar(this.nombreMago || 'Aprendiz', 'Tarea completada', `"${t.texto}" lista. Don Mañana retrocede.`, 'task');
    this.animar('salto', 'retroceso');
    this.lanzarConfeti();

    if (this.tareas.every(x => x.hecha)) {
      this.estadoDuelo = 'VICTORIA';
      this.registrar(this.nombreMago || 'Aprendiz', '¡Lista terminada!', 'Completaste todo antes de que te alcanzara.', 'task');
      this.lanzarConfeti();
    }
  }

  // Usar una técnica (ejercicio, enfoque o escudo)
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.saludMago < hechizo.costoEnergia) return;
    if ((this.enfriamientos[hechizo.id] ?? 0) > 0) return;

    this.saludMago -= hechizo.costoEnergia;
    this.enfriamientos[hechizo.id] = hechizo.enfriamiento;
    this.numeroTurno++;
    const quien = this.nombreMago || 'Aprendiz';

    if (hechizo.tipo === 'Ataque') {
      this.debilitarRival(hechizo.poder);
      this.distanciaPereza = Math.min(100, this.distanciaPereza + hechizo.poder * 0.1);
      this.registrar(quien, hechizo.nombre, `Don Mañana pierde ${hechizo.poder} de fuerza.`, 'damage');
      this.animar('brillo', 'golpe');
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      const terreno = hechizo.costoTerreno ?? 0;
      this.distanciaPereza = Math.max(0, this.distanciaPereza - terreno);
      this.registrar(quien, hechizo.nombre, `+${hechizo.poder}⚡ de estamina (la pereza avanza ${terreno} m).`, 'heal');
      this.animar('brillo', '');
      this.comprobarDerrota();
    } else {
      this.escudoSegundos = Math.min(15, this.escudoSegundos + hechizo.poder);
      this.registrar(quien, hechizo.nombre, `Don Mañana queda congelado ${hechizo.poder} segundos.`, 'shield');
      this.animar('brillo', '');
    }
  }

  // =========================================================================
  // 5. RELOJ DEL JUEGO (corre cada segundo)
  // =========================================================================
  private tick(): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;

    this.segundosJugados++;

    // Los enfriamientos bajan 1 segundo
    for (const id of Object.keys(this.enfriamientos)) {
      const n = Number(id);
      if (this.enfriamientos[n] > 0) this.enfriamientos[n]--;
    }

    // Recuperas 1 de estamina solo cada 2 segundos (muy poco: hay que hacer ejercicios)
    if (this.segundosJugados % 2 === 0) {
      this.saludMago = Math.min(100, this.saludMago + 1);
    }

    if (this.escudoSegundos > 0) {
      this.escudoSegundos--; // la pereza está congelada: no avanza
      return;
    }

    this.distanciaPereza = Math.max(0, this.distanciaPereza - this.velocidadPereza);

    // Cada 6 segundos, Don Mañana te tienta y te quita estamina
    if (this.segundosJugados % 6 === 0 && this.saludRival > 0) {
      const frase = this.frasesPereza[Math.floor(Math.random() * this.frasesPereza.length)];
      this.saludMago = Math.max(0, this.saludMago - 6);
      this.registrar(this.nombreRival, 'Tentación', `${frase} (−6⚡)`, 'alert');
      this.efectoHeroe = 'golpe';
      this.programar(() => (this.efectoHeroe = ''), 500);
    }

    this.comprobarDerrota();
  }

  // Qué tan rápido se acerca la pereza (metros por segundo)
  get velocidadPereza(): number {
    if (this.saludRival <= 0) return 0;
    const factor = this.ritmos.find(r => r.valor === this.ritmo)?.factor ?? 1;
    let v = 2 + (this.saludRival / 100) * 2.5; // más fuerte = más rápido (2 a 4.5 m/s)
    if (this.saludMago < 25) v += 1.5; // si estás agotado, te alcanza más rápido
    v += this.segundosJugados * 0.03; // y cada segundo que pasa corre un poco más
    return v * factor;
  }

  private comprobarDerrota(): void {
    if (this.distanciaPereza <= 0 && this.estadoDuelo === 'EN_CURSO') {
      this.distanciaPereza = 0;
      this.estadoDuelo = 'DERROTA';
      this.registrar(this.nombreRival, '¡Te alcanzó!', 'La procrastinación ganó esta vez. Inténtalo otra vez.', 'alert');
    }
  }

  private debilitarRival(cantidad: number): void {
    const antes = this.saludRival;
    this.saludRival = Math.max(0, this.saludRival - cantidad);
    if (antes > 0 && this.saludRival === 0) {
      this.registrar(this.nombreRival, 'Sin fuerzas', 'Don Mañana quedó agotado y ya no avanza. ¡Aprovecha!', 'damage');
    }
  }

  // =========================================================================
  // 6. DATOS PARA LA VISTA
  // =========================================================================
  get completadas(): number {
    return this.tareas.filter(t => t.hecha).length;
  }

  get progreso(): number {
    return this.tareas.length ? Math.round((this.completadas / this.tareas.length) * 100) : 0;
  }

  get peligro(): boolean {
    return this.estadoDuelo === 'EN_CURSO' && this.distanciaPereza < 30;
  }

  get estaminaBaja(): boolean {
    return this.saludMago < 25;
  }

  // Posición de Don Mañana en la pista (porcentaje desde la izquierda)
  get posicionPereza(): number {
    return (100 - this.distanciaPereza) * 0.78;
  }

  get etiquetaEstamina(): string {
    if (this.saludMago >= 60) return 'Con energía';
    if (this.saludMago >= 25) return 'Aguantando';
    return 'Agotado';
  }

  get mensajePista(): string {
    if (this.saludRival <= 0) return 'Don Mañana está agotado';
    if (this.distanciaPereza > 60) return 'Vas con ventaja';
    if (this.distanciaPereza > 30) return 'Te está alcanzando';
    return '¡Casi te atrapa!';
  }

  get emojiHeroe(): string {
    if (this.estadoDuelo === 'VICTORIA') return '🎉';
    if (this.estadoDuelo === 'DERROTA') return '😵';
    if (this.estadoDuelo === 'EN_CURSO') return this.estaminaBaja ? '🥵' : '🏃';
    return '🧍';
  }

  get tiempoFormateado(): string {
    const m = Math.floor(this.segundosJugados / 60);
    const s = this.segundosJugados % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  tecnicasDe(tipo: HechizoDuelo['tipo']): HechizoDuelo[] {
    return this.hechizosDuelo.filter(h => h.tipo === tipo);
  }

  puedeUsar(h: HechizoDuelo): boolean {
    return this.estadoDuelo === 'EN_CURSO' && this.saludMago >= h.costoEnergia && (this.enfriamientos[h.id] ?? 0) <= 0;
  }

  resumenEfecto(h: HechizoDuelo): string {
    if (h.tipo === 'Sanacion') return `+${h.poder}⚡ · pereza +${h.costoTerreno ?? 0} m`;
    if (h.tipo === 'Ataque') return `−${h.poder} fuerza · cuesta ${h.costoEnergia}⚡`;
    return `${h.poder} s de pausa · cuesta ${h.costoEnergia}⚡`;
  }

  // =========================================================================
  // 7. UTILIDADES PRIVADAS
  // =========================================================================
  private reiniciarEnfriamientos(): void {
    this.enfriamientos = {};
    this.hechizosDuelo.forEach(h => (this.enfriamientos[h.id] = 0));
  }

  private registrar(emisor: string, hechizo: string, efecto: string, tipo: RegistroTurno['tipo']): void {
    this.historialDuelo.unshift({ turno: this.numeroTurno, emisor, hechizo, efecto, tipo });
    if (this.historialDuelo.length > 40) this.historialDuelo.pop();
  }

  private animar(heroe: ArtefactoCreativoComponent['efectoHeroe'], pereza: ArtefactoCreativoComponent['efectoPereza']): void {
    this.efectoHeroe = heroe;
    this.efectoPereza = pereza;
    this.programar(() => {
      this.efectoHeroe = '';
      this.efectoPereza = '';
    }, 650);
  }

  private lanzarConfeti(): void {
    const colores = ['#ffb110', '#f64932', '#62aef0', '#097fe8', '#f6d5b8'];
    this.confeti = Array.from({ length: 22 }, (_, i) => ({
      id: ++this.contadorConfeti,
      x: 5 + Math.random() * 90,
      color: colores[i % colores.length],
      retraso: Math.random() * 0.25,
      giro: Math.random() * 360 - 180
    }));
    this.programar(() => (this.confeti = []), 1800);
  }

  // setTimeout "con registro": así ngOnDestroy puede cancelarlos todos
  private programar(accion: () => void, ms: number): void {
    const id = setTimeout(() => {
      this.temporizadores.delete(id);
      accion();
      this.cdr.markForCheck();
    }, ms);
    this.temporizadores.add(id);
  }
}
