import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
}

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal';
}

export type LugarId = 'castillo' | 'quidditch' | 'hechizos' | 'duelo' | 'invernadero' | 'bosque';

export interface Lugar {
  id: LugarId;
  nombre: string;
  emoji: string;
  descripcion: string;
  x: number;
  y: number;
}

export interface Escoba {
  nombre: string;
  intervaloMs: number;
  puntosPorCaptura: number;
  bludgers: number;
}

export interface Bludger {
  id: number;
  x: number;
  y: number;
}

export interface RetoHechizo {
  pista: string;
  respuesta: string;
  dificultad: 1 | 2 | 3;
}

export interface Planta {
  id: number;
  nombre: string;
  emoji: string;
  crecimiento: number;
  agua: number;
  puntos: number;
}

export interface OpcionBosque {
  texto: string;
  probabilidad: number;
  puntosOk: number;
  puntosFallo: number;
  danoFallo: number;
  textoOk: string;
  textoFallo: string;
  objeto?: string;
}

export interface EscenaBosque {
  emoji: string;
  titulo: string;
  texto: string;
  opciones: OpcionBosque[];
}

export interface Logro {
  id: string;
  titulo: string;
  emoji: string;
  descripcion: string;
  cumple: () => boolean;
}

interface Estadisticas {
  mejorQuidditch: number;
  mejorRacha: number;
  cosechas: number;
  aventuras: number;
  duelosGanados: number;
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // =========================================================================
  // ⚔️ DUELO (se conserva con los mismos nombres del proyecto original)
  // =========================================================================
  nombreMago: string = 'Harry Potter';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;

  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false;

  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Expelliarmus', tipo: 'Ataque', poder: 25, costoEnergia: 20, descripcion: 'Desarma al oponente con un rayo rojo escarlata.' },
    { id: 2, nombre: 'Protego', tipo: 'Defensa', poder: 30, costoEnergia: 15, descripcion: 'Crea un escudo mágico que absorbe el siguiente impacto.' },
    { id: 3, nombre: 'Episkey', tipo: 'Sanacion', poder: 20, costoEnergia: 25, descripcion: 'Restaura vitalidad y cura heridas menores.' },
    { id: 4, nombre: 'Stupefy', tipo: 'Ataque', poder: 35, costoEnergia: 35, descripcion: 'Aturde al rival con una potente onda expansiva.' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private ambientMusicInterval: any = null;
  private timeoutRivalId: any = null;

  // =========================================================================
  // 🗺️ MAPA DE HOGWARTS
  // =========================================================================
  ubicacion: 'mapa' | LugarId = 'mapa';

  lugares: Lugar[] = [
    { id: 'castillo', nombre: 'Gran Castillo', emoji: '🏰', descripcion: 'Rango, logros y Copa de las Casas.', x: 50, y: 46 },
    { id: 'quidditch', nombre: 'Campo de Quidditch', emoji: '🧹', descripcion: 'Atrapa la snitch y esquiva las bludgers.', x: 16, y: 22 },
    { id: 'hechizos', nombre: 'Aula de Encantamientos', emoji: '🪄', descripcion: 'Demuestra cuántos hechizos conoces.', x: 84, y: 22 },
    { id: 'invernadero', nombre: 'Invernadero', emoji: '🌱', descripcion: 'Cuida y cosecha plantas mágicas.', x: 14, y: 70 },
    { id: 'duelo', nombre: 'Club de Duelo', emoji: '⚔️', descripcion: 'Enfréntate a Draco Malfoy.', x: 86, y: 70 },
    { id: 'bosque', nombre: 'Bosque Prohibido', emoji: '🌲', descripcion: 'Una aventura de decisiones.', x: 50, y: 88 }
  ];

  casa: string = 'Gryffindor';
  readonly casas: string[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
  private readonly coloresCasa: Record<string, string> = {
    Gryffindor: '#ef4444',
    Slytherin: '#22c55e',
    Ravenclaw: '#3b82f6',
    Hufflepuff: '#eab308'
  };
  private readonly puntosRivales: Record<string, number> = {
    Gryffindor: 120,
    Slytherin: 150,
    Ravenclaw: 100,
    Hufflepuff: 80
  };
  private readonly rangos = [
    { nombre: 'Aprendiz', min: 0 },
    { nombre: 'Mago', min: 50 },
    { nombre: 'Auror', min: 150 },
    { nombre: 'Archimago', min: 300 }
  ];

  puntosCasa: number = 0;
  lugaresVisitados: string[] = [];
  logrosDesbloqueados: string[] = [];
  stats: Estadisticas = { mejorQuidditch: 0, mejorRacha: 0, cosechas: 0, aventuras: 0, duelosGanados: 0 };
  mensajeToast: string = '';
  private toastTimer: any = null;
  private readonly CLAVE_PROGRESO = 'mapa-hogwarts-progreso-v2';

  readonly logros: Logro[] = [
    { id: 'explorador', titulo: 'Explorador', emoji: '🧭', descripcion: 'Visita los 5 lugares del mapa', cumple: () => this.lugaresVisitados.length >= 5 },
    { id: 'honor', titulo: 'Puntos de honor', emoji: '⭐', descripcion: 'Reúne 50 puntos', cumple: () => this.puntosCasa >= 50 },
    { id: 'centenario', titulo: 'Centenario', emoji: '💯', descripcion: 'Reúne 100 puntos', cumple: () => this.puntosCasa >= 100 },
    { id: 'buscador', titulo: 'Buscador estrella', emoji: '🏅', descripcion: 'Atrapa 5 snitch en una ronda', cumple: () => this.stats.mejorQuidditch >= 5 },
    { id: 'erudito', titulo: 'Erudito', emoji: '📚', descripcion: 'Logra una racha de 4 hechizos', cumple: () => this.stats.mejorRacha >= 4 },
    { id: 'herbologo', titulo: 'Herbólogo', emoji: '🌿', descripcion: 'Cosecha 3 plantas', cumple: () => this.stats.cosechas >= 3 },
    { id: 'aventurero', titulo: 'Aventurero', emoji: '🌲', descripcion: 'Completa 2 aventuras en el bosque', cumple: () => this.stats.aventuras >= 2 },
    { id: 'duelista', titulo: 'Duelista', emoji: '⚔️', descripcion: 'Gana un duelo', cumple: () => this.stats.duelosGanados >= 1 }
  ];

  // --- 🧹 Quidditch ---
  readonly escobas: Escoba[] = [
    { nombre: 'Nimbus 2000', intervaloMs: 1100, puntosPorCaptura: 8, bludgers: 2 },
    { nombre: 'Saeta de Fuego', intervaloMs: 700, puntosPorCaptura: 14, bludgers: 3 }
  ];
  escobaElegida: string = 'Nimbus 2000';
  estadoQuidditch: 'LISTA' | 'VOLANDO' | 'FIN' = 'LISTA';
  snitchX: number = 50;
  snitchY: number = 50;
  bludgers: Bludger[] = [];
  capturas: number = 0;
  combo: number = 0;
  puntosRonda: number = 0;
  nuevoRecord: boolean = false;
  tiempoQuidditch: number = 20;
  private snitchTimer: any = null;
  private bludgerTimer: any = null;
  private relojQuidditch: any = null;

  // --- 🪄 Aula de Encantamientos ---
  readonly tiempoMaxPregunta = 12;
  readonly corazones: number[] = [1, 2, 3];
  readonly retosHechizo: RetoHechizo[] = [
    { pista: 'Desarma al oponente con un rayo rojo', respuesta: 'Expelliarmus', dificultad: 2 },
    { pista: 'Hace levitar los objetos', respuesta: 'Wingardium Leviosa', dificultad: 3 },
    { pista: 'Enciende la punta de la varita', respuesta: 'Lumos', dificultad: 1 },
    { pista: 'Crea un escudo protector', respuesta: 'Protego', dificultad: 1 },
    { pista: 'Abre las cerraduras', respuesta: 'Alohomora', dificultad: 2 },
    { pista: 'Repara objetos rotos', respuesta: 'Reparo', dificultad: 1 },
    { pista: 'Aturde al rival con un rayo rojo intenso', respuesta: 'Stupefy', dificultad: 2 },
    { pista: 'Invoca a un guardián plateado', respuesta: 'Expecto Patronum', dificultad: 3 }
  ];
  estadoAula: 'ESPERA' | 'PRACTICANDO' | 'COMPLETADO' = 'ESPERA';
  preguntas: RetoHechizo[] = [];
  indiceReto: number = 0;
  respuestaHechizo: string = '';
  aciertosAula: number = 0;
  vidas: number = 3;
  racha: number = 0;
  puntosAula: number = 0;
  tiempoPregunta: number = 12;
  pistaUsada: boolean = false;
  feedbackAula: string = '';
  feedbackOk: boolean = true;
  private relojAula: any = null;

  // --- 🌱 Invernadero ---
  plantas: Planta[] = [
    { id: 1, nombre: 'Mandrágora', emoji: '🌿', crecimiento: 0, agua: 50, puntos: 15 },
    { id: 2, nombre: 'Hongo Luminoso', emoji: '🍄', crecimiento: 0, agua: 50, puntos: 12 },
    { id: 3, nombre: 'Rosa Encantada', emoji: '🌹', crecimiento: 0, agua: 50, puntos: 20 },
    { id: 4, nombre: 'Tentácula Venenosa', emoji: '🌵', crecimiento: 0, agua: 50, puntos: 25 }
  ];
  private tickInvernadero: any = null;

  // --- 🌲 Bosque Prohibido ---
  private readonly escenasBosqueBase: EscenaBosque[] = [
    {
      emoji: '🦄', titulo: 'El claro del unicornio',
      texto: 'Un unicornio plateado bebe de un arroyo. Nunca habías visto algo tan hermoso.',
      opciones: [
        { texto: 'Acercarte despacio con la mano extendida', probabilidad: 0.7, puntosOk: 20, puntosFallo: -5, danoFallo: 10, textoOk: 'El unicornio te deja tocar su crin.', textoFallo: 'Se asusta y te empuja al huir.', objeto: 'Pelo de unicornio' },
        { texto: 'Observarlo desde lejos', probabilidad: 0.95, puntosOk: 8, puntosFallo: 0, danoFallo: 0, textoOk: 'Lo admiras en silencio. Qué momento.', textoFallo: 'Se va antes de que lo notes.' }
      ]
    },
    {
      emoji: '🕷️', titulo: 'El nido de acromántulas',
      texto: 'Telarañas gigantes cubren los árboles. Algo se mueve entre las sombras.',
      opciones: [
        { texto: 'Huir en silencio', probabilidad: 0.6, puntosOk: 10, puntosFallo: -10, danoFallo: 25, textoOk: 'Sales sin que te vean.', textoFallo: 'Una araña te alcanza y te muerde.' },
        { texto: 'Lanzar Lumos para espantarlas', probabilidad: 0.4, puntosOk: 25, puntosFallo: -15, danoFallo: 35, textoOk: 'La luz las ahuyenta y recoges seda.', textoFallo: 'La luz las enfurece.', objeto: 'Seda de acromántula' }
      ]
    },
    {
      emoji: '🐴', titulo: 'El centauro',
      texto: 'Un centauro te observa con ojos serenos y señala las estrellas.',
      opciones: [
        { texto: 'Pedirle una profecía', probabilidad: 0.5, puntosOk: 25, puntosFallo: -10, danoFallo: 10, textoOk: 'Te cuenta algo importante sobre tu futuro.', textoFallo: 'Se ofende por tu atrevimiento.', objeto: 'Pluma de centauro' },
        { texto: 'Saludar con respeto y seguir', probabilidad: 0.9, puntosOk: 10, puntosFallo: -5, danoFallo: 5, textoOk: 'Asiente con aprobación.', textoFallo: 'Te ignora fríamente.' }
      ]
    },
    {
      emoji: '🌫️', titulo: 'La niebla azul',
      texto: 'Una niebla espesa te rodea y una luz azul parpadea a lo lejos.',
      opciones: [
        { texto: 'Seguir la luz azul', probabilidad: 0.6, puntosOk: 15, puntosFallo: -10, danoFallo: 20, textoOk: 'La luz te lleva a un hongo brillante.', textoFallo: 'Era un fuego fatuo. Te pierdes.', objeto: 'Hongo luminoso' },
        { texto: 'Esperar a que se disipe', probabilidad: 0.85, puntosOk: 5, puntosFallo: -5, danoFallo: 5, textoOk: 'La niebla se va y sigues tu camino.', textoFallo: 'Pasa mucho tiempo y tienes frío.' }
      ]
    },
    {
      emoji: '🐕', titulo: 'Fang, el perro de Hagrid',
      texto: 'Un perro enorme sale de entre los arbustos moviendo la cola.',
      opciones: [
        { texto: 'Darle una galleta', probabilidad: 0.9, puntosOk: 10, puntosFallo: -5, danoFallo: 5, textoOk: 'Fang te acompaña de vuelta al sendero.', textoFallo: 'Se come la galleta y la mano.' },
        { texto: 'Seguirlo sin dudar', probabilidad: 0.7, puntosOk: 15, puntosFallo: -5, danoFallo: 10, textoOk: 'Te lleva a la cabaña de Hagrid.', textoFallo: 'Te lleva a un barranco.' }
      ]
    },
    {
      emoji: '🪨', titulo: 'La cueva de las runas',
      texto: 'Una cueva con runas brillantes en las paredes. Hay un fragmento en el centro.',
      opciones: [
        { texto: 'Descifrar las runas', probabilidad: 0.5, puntosOk: 30, puntosFallo: -15, danoFallo: 30, textoOk: 'Las runas se abren y te entregan un fragmento.', textoFallo: 'Una runa te lanza un destello.', objeto: 'Fragmento rúnico' },
        { texto: 'Marcar el camino y regresar', probabilidad: 0.95, puntosOk: 5, puntosFallo: 0, danoFallo: 0, textoOk: 'Prudencia ante todo.', textoFallo: 'Te confundes un momento.' }
      ]
    }
  ];
  estadoBosque: 'ENTRADA' | 'ESCENA' | 'RESULTADO' | 'FIN' = 'ENTRADA';
  escenasBosque: EscenaBosque[] = [];
  pasoBosque: number = 0;
  vidaBosque: number = 100;
  puntosBosque: number = 0;
  inventario: string[] = [];
  bitacoraBosque: string[] = [];
  ultimoResultado: { exito: boolean; texto: string } = { exito: true, texto: '' };

  // =========================================================================
  // CICLO DE VIDA
  // =========================================================================
  ngOnInit(): void {
    console.log('🎨 Reto 7: Artefacto Creativo montado en el Gran Salón.');
    this.cargarProgreso();
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.ambientMusicInterval) clearInterval(this.ambientMusicInterval);
    this.detenerTodo();
    if (this.timeoutRivalId) clearTimeout(this.timeoutRivalId);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ubicacion !== 'mapa') this.volverAlMapa();
  }

  // =========================================================================
  // NAVEGACIÓN Y PROGRESO
  // =========================================================================
  irA(id: LugarId): void {
    this.ubicacion = id;
    if (id === 'invernadero') this.iniciarInvernadero();
    if (id !== 'castillo' && !this.lugaresVisitados.includes(id)) {
      this.lugaresVisitados = [...this.lugaresVisitados, id];
      this.guardarProgreso();
      this.revisarLogros();
    }
  }

  volverAlMapa(): void {
    this.detenerTodo();
    if (this.estadoQuidditch === 'VOLANDO') this.estadoQuidditch = 'LISTA';
    if (this.estadoAula === 'PRACTICANDO') this.estadoAula = 'ESPERA';
    this.ubicacion = 'mapa';
  }

  private detenerTodo(): void {
    this.detenerQuidditch();
    this.detenerRelojAula();
    this.detenerInvernadero();
  }

  get lugarActual(): Lugar | undefined {
    return this.lugares.find(l => l.id === this.ubicacion);
  }

  get colorCasa(): string {
    return this.coloresCasa[this.casa] ?? '#f59e0b';
  }

  private get indiceRango(): number {
    let idx = 0;
    this.rangos.forEach((r, i) => {
      if (this.puntosCasa >= r.min) idx = i;
    });
    return idx;
  }

  get rango(): string {
    return this.rangos[this.indiceRango].nombre;
  }

  get faltanParaRango(): number | null {
    const siguiente = this.rangos[this.indiceRango + 1];
    return siguiente ? siguiente.min - this.puntosCasa : null;
  }

  get progresoRango(): number {
    const actual = this.rangos[this.indiceRango];
    const siguiente = this.rangos[this.indiceRango + 1];
    if (!siguiente) return 100;
    return Math.round(((this.puntosCasa - actual.min) / (siguiente.min - actual.min)) * 100);
  }

  get progreso(): number {
    const visitables = this.lugares.length - 1;
    return Math.round((this.lugaresVisitados.length / visitables) * 100);
  }

  get ranking(): { nombre: string; puntos: number; esMia: boolean }[] {
    return this.casas
      .map(c => ({
        nombre: c,
        puntos: this.puntosRivales[c] + (c === this.casa ? this.puntosCasa : 0),
        esMia: c === this.casa
      }))
      .sort((a, b) => b.puntos - a.puntos);
  }

  get maxRanking(): number {
    return Math.max(...this.ranking.map(r => r.puntos), 1);
  }

  colorDe(casa: string): string {
    return this.coloresCasa[casa] ?? '#f59e0b';
  }

  cambiarCasa(): void {
    this.guardarProgreso();
    this.notificar(`Ahora representas a ${this.casa}`);
  }

  esVisitado(id: string): boolean {
    return this.lugaresVisitados.includes(id);
  }

  tieneLogro(id: string): boolean {
    return this.logrosDesbloqueados.includes(id);
  }

  private revisarLogros(): void {
    for (const logro of this.logros) {
      if (!this.tieneLogro(logro.id) && logro.cumple()) {
        this.logrosDesbloqueados = [...this.logrosDesbloqueados, logro.id];
        this.notificar(`🏅 ¡Logro desbloqueado: ${logro.titulo}!`);
        this.guardarProgreso();
      }
    }
  }

  private sumarPuntos(cantidad: number, mensaje: string): void {
    this.puntosCasa = Math.max(0, this.puntosCasa + cantidad);
    const signo = cantidad >= 0 ? '+' : '';
    this.notificar(`${mensaje} (${signo}${cantidad} puntos)`);
    this.guardarProgreso();
    this.revisarLogros();
  }

  private notificar(texto: string): void {
    this.mensajeToast = texto;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.mensajeToast = ''), 3000);
  }

  reiniciarProgreso(): void {
    if (!confirm('¿Seguro que quieres borrar todo tu progreso?')) return;
    this.puntosCasa = 0;
    this.lugaresVisitados = [];
    this.logrosDesbloqueados = [];
    this.stats = { mejorQuidditch: 0, mejorRacha: 0, cosechas: 0, aventuras: 0, duelosGanados: 0 };
    try {
      localStorage.removeItem(this.CLAVE_PROGRESO);
    } catch {
      // ignorar
    }
    this.notificar('Progreso reiniciado');
  }

  private cargarProgreso(): void {
    try {
      const raw = localStorage.getItem(this.CLAVE_PROGRESO);
      if (!raw) return;
      const datos = JSON.parse(raw);
      this.puntosCasa = Number(datos.puntosCasa) || 0;
      if (typeof datos.casa === 'string' && this.casas.includes(datos.casa)) this.casa = datos.casa;
      if (Array.isArray(datos.lugaresVisitados)) this.lugaresVisitados = datos.lugaresVisitados;
      if (Array.isArray(datos.logrosDesbloqueados)) this.logrosDesbloqueados = datos.logrosDesbloqueados;
      if (datos.stats && typeof datos.stats === 'object') this.stats = { ...this.stats, ...datos.stats };
    } catch {
      // Si el navegador no permite localStorage, se ignora.
    }
  }

  private guardarProgreso(): void {
    try {
      localStorage.setItem(
        this.CLAVE_PROGRESO,
        JSON.stringify({
          puntosCasa: this.puntosCasa,
          casa: this.casa,
          lugaresVisitados: this.lugaresVisitados,
          logrosDesbloqueados: this.logrosDesbloqueados,
          stats: this.stats
        })
      );
    } catch {
      // Si el navegador no permite localStorage, se ignora.
    }
  }

  private barajar<T>(lista: T[]): T[] {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // =========================================================================
  // 🧹 QUIDDITCH
  // =========================================================================
  get escobaActual(): Escoba {
    return this.escobas.find(e => e.nombre === this.escobaElegida) ?? this.escobas[0];
  }

  get multiplicador(): number {
    return Math.min(5, 1 + Math.floor(this.combo / 2));
  }

  iniciarQuidditch(): void {
    this.detenerQuidditch();
    this.capturas = 0;
    this.combo = 0;
    this.puntosRonda = 0;
    this.nuevoRecord = false;
    this.tiempoQuidditch = 20;
    this.estadoQuidditch = 'VOLANDO';
    this.moverSnitch();
    this.bludgers = Array.from({ length: this.escobaActual.bludgers }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70
    }));
    this.snitchTimer = setInterval(() => this.moverSnitch(), this.escobaActual.intervaloMs);
    this.bludgerTimer = setInterval(() => {
      this.bludgers = this.bludgers.map(b => ({ ...b, x: 8 + Math.random() * 84, y: 12 + Math.random() * 76 }));
    }, 1100);
    this.relojQuidditch = setInterval(() => {
      this.tiempoQuidditch--;
      if (this.tiempoQuidditch <= 0) this.terminarQuidditch();
    }, 1000);
  }

  atraparSnitch(): void {
    if (this.estadoQuidditch !== 'VOLANDO') return;
    this.capturas++;
    this.combo++;
    this.puntosRonda += this.escobaActual.puntosPorCaptura * this.multiplicador;
    this.moverSnitch();
  }

  golpearBludger(): void {
    if (this.estadoQuidditch !== 'VOLANDO') return;
    this.combo = 0;
    this.tiempoQuidditch = Math.max(0, this.tiempoQuidditch - 3);
    this.notificar('💥 ¡Una bludger te golpeó! -3 segundos');
    if (this.tiempoQuidditch <= 0) this.terminarQuidditch();
  }

  fallarClick(): void {
    if (this.estadoQuidditch === 'VOLANDO') this.combo = 0;
  }

  private moverSnitch(): void {
    this.snitchX = 8 + Math.random() * 84;
    this.snitchY = 12 + Math.random() * 76;
  }

  private terminarQuidditch(): void {
    this.detenerQuidditch();
    this.estadoQuidditch = 'FIN';
    if (this.capturas > this.stats.mejorQuidditch) {
      this.stats = { ...this.stats, mejorQuidditch: this.capturas };
      this.nuevoRecord = true;
    }
    if (this.puntosRonda > 0) {
      this.sumarPuntos(this.puntosRonda, `Ronda de Quidditch (${this.capturas} snitch)`);
    } else {
      this.guardarProgreso();
      this.revisarLogros();
    }
  }

  private detenerQuidditch(): void {
    if (this.snitchTimer) clearInterval(this.snitchTimer);
    if (this.bludgerTimer) clearInterval(this.bludgerTimer);
    if (this.relojQuidditch) clearInterval(this.relojQuidditch);
    this.snitchTimer = null;
    this.bludgerTimer = null;
    this.relojQuidditch = null;
  }

  // =========================================================================
  // 🪄 AULA DE ENCANTAMIENTOS
  // =========================================================================
  get retoActual(): RetoHechizo {
    const lista = this.preguntas.length ? this.preguntas : this.retosHechizo;
    return lista[Math.min(this.indiceReto, lista.length - 1)];
  }

  get pistaTexto(): string {
    return this.retoActual.respuesta
      .split('')
      .map((c, i) => (c === ' ' ? ' ' : i === 0 ? c : '_'))
      .join(' ');
  }

  iniciarAula(): void {
    this.detenerRelojAula();
    this.preguntas = this.barajar(this.retosHechizo).slice(0, 6);
    this.estadoAula = 'PRACTICANDO';
    this.indiceReto = 0;
    this.aciertosAula = 0;
    this.vidas = 3;
    this.racha = 0;
    this.puntosAula = 0;
    this.respuestaHechizo = '';
    this.feedbackAula = '';
    this.pistaUsada = false;
    this.tiempoPregunta = this.tiempoMaxPregunta;
    this.relojAula = setInterval(() => {
      this.tiempoPregunta--;
      if (this.tiempoPregunta <= 0) {
        this.feedbackOk = false;
        this.feedbackAula = `⏰ Tiempo agotado. Era "${this.retoActual.respuesta}"`;
        this.vidas--;
        this.racha = 0;
        this.avanzarAula();
      }
    }, 1000);
  }

  usarPista(): void {
    this.pistaUsada = true;
  }

  comprobarHechizo(): void {
    if (this.estadoAula !== 'PRACTICANDO' || !this.respuestaHechizo.trim()) return;

    const reto = this.retoActual;
    const acierto = this.normalizar(this.respuestaHechizo) === this.normalizar(reto.respuesta);

    if (acierto) {
      let base = 10 * reto.dificultad;
      if (this.pistaUsada) base = Math.ceil(base / 2);
      this.racha++;
      const bonus = (this.racha - 1) * 2;
      this.puntosAula += base + bonus;
      this.aciertosAula++;
      this.feedbackOk = true;
      this.feedbackAula = `✨ ¡Correcto! +${base + bonus}${this.racha > 1 ? ` (racha x${this.racha})` : ''}`;
      if (this.racha > this.stats.mejorRacha) this.stats = { ...this.stats, mejorRacha: this.racha };
    } else {
      this.vidas--;
      this.racha = 0;
      this.feedbackOk = false;
      this.feedbackAula = `❌ Era "${reto.respuesta}"`;
    }
    this.avanzarAula();
  }

  private avanzarAula(): void {
    this.respuestaHechizo = '';
    this.pistaUsada = false;
    this.tiempoPregunta = this.tiempoMaxPregunta;
    this.indiceReto++;
    if (this.vidas <= 0 || this.indiceReto >= this.preguntas.length) this.terminarAula();
  }

  private terminarAula(): void {
    this.detenerRelojAula();
    this.estadoAula = 'COMPLETADO';
    if (this.puntosAula > 0) {
      this.sumarPuntos(this.puntosAula, `Clase terminada con ${this.aciertosAula} aciertos`);
    } else {
      this.revisarLogros();
    }
  }

  private detenerRelojAula(): void {
    if (this.relojAula) clearInterval(this.relojAula);
    this.relojAula = null;
  }

  private normalizar(texto: string): string {
    return texto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // =========================================================================
  // 🌱 INVERNADERO
  // =========================================================================
  private iniciarInvernadero(): void {
    if (this.tickInvernadero) return;
    this.tickInvernadero = setInterval(() => this.tickPlantas(), 1000);
  }

  private detenerInvernadero(): void {
    if (this.tickInvernadero) clearInterval(this.tickInvernadero);
    this.tickInvernadero = null;
  }

  private tickPlantas(): void {
    this.plantas = this.plantas.map(p => ({
      ...p,
      agua: Math.max(0, p.agua - 2),
      crecimiento: p.crecimiento < 100 && p.agua >= 20 ? Math.min(100, p.crecimiento + 3) : p.crecimiento
    }));
  }

  estadoPlanta(p: Planta): string {
    if (p.crecimiento >= 100) return 'Lista para cosechar';
    if (p.agua < 20) return 'Sedienta: no crece';
    return 'Creciendo';
  }

  regar(id: number): void {
    this.plantas = this.plantas.map(p => (p.id === id ? { ...p, agua: Math.min(100, p.agua + 40) } : p));
  }

  abonar(id: number): void {
    const planta = this.plantas.find(p => p.id === id);
    if (!planta || planta.crecimiento >= 100) return;
    if (this.puntosCasa < 5) {
      this.notificar('Necesitas 5 puntos para comprar abono');
      return;
    }
    this.sumarPuntos(-5, `Abono para ${planta.nombre}`);
    this.plantas = this.plantas.map(p => (p.id === id ? { ...p, crecimiento: Math.min(100, p.crecimiento + 20) } : p));
  }

  cosechar(id: number): void {
    const planta = this.plantas.find(p => p.id === id);
    if (!planta || planta.crecimiento < 100) return;
    this.plantas = this.plantas.map(p => (p.id === id ? { ...p, crecimiento: 0, agua: 30 } : p));
    this.stats = { ...this.stats, cosechas: this.stats.cosechas + 1 };
    this.sumarPuntos(planta.puntos, `Cosechaste ${planta.nombre}`);
  }

  // =========================================================================
  // 🌲 BOSQUE PROHIBIDO
  // =========================================================================
  get escenaActual(): EscenaBosque | undefined {
    return this.escenasBosque[this.pasoBosque];
  }

  entrarBosque(): void {
    this.escenasBosque = this.barajar(this.escenasBosqueBase).slice(0, 4);
    this.pasoBosque = 0;
    this.vidaBosque = 100;
    this.puntosBosque = 0;
    this.inventario = [];
    this.bitacoraBosque = [];
    this.estadoBosque = 'ESCENA';
  }

  elegirOpcion(op: OpcionBosque): void {
    if (this.estadoBosque !== 'ESCENA') return;
    const exito = Math.random() < op.probabilidad;
    if (exito) {
      this.puntosBosque += op.puntosOk;
      if (op.objeto && !this.inventario.includes(op.objeto)) this.inventario = [...this.inventario, op.objeto];
      this.ultimoResultado = { exito: true, texto: `${op.textoOk} (+${op.puntosOk})` };
    } else {
      this.puntosBosque += op.puntosFallo;
      this.vidaBosque = Math.max(0, this.vidaBosque - op.danoFallo);
      this.ultimoResultado = { exito: false, texto: `${op.textoFallo} (-${op.danoFallo} de vida)` };
    }
    this.bitacoraBosque = [this.ultimoResultado.texto, ...this.bitacoraBosque];
    this.estadoBosque = 'RESULTADO';
  }

  continuarBosque(): void {
    if (this.vidaBosque <= 0 || this.pasoBosque >= this.escenasBosque.length - 1) {
      this.finalizarBosque();
    } else {
      this.pasoBosque++;
      this.estadoBosque = 'ESCENA';
    }
  }

  private finalizarBosque(): void {
    this.estadoBosque = 'FIN';
    this.stats = { ...this.stats, aventuras: this.stats.aventuras + 1 };
    this.sumarPuntos(this.puntosBosque, 'Aventura en el Bosque Prohibido');
  }

  // =========================================================================
  // ⚔️ DUELO
  // =========================================================================
  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Profesor Flitwick',
        hechizo: 'Apertura de Duelo',
        efecto: '¡Varitas en alto! Hagan una reverencia y comiencen.',
        tipo: 'shield'
      }
    ];
  }

  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.energiaMago < hechizo.costoEnergia) return;

    this.energiaMago -= hechizo.costoEnergia;

    if (hechizo.tipo === 'Ataque') {
      this.saludRival = Math.max(0, this.saludRival - hechizo.poder);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `¡Impacto directo! Causa ${hechizo.poder} puntos de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Cura mágica: Restaura ${hechizo.poder} puntos de vitalidad.`,
        tipo: 'heal'
      });
    } else {
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Escudo activo: ${hechizo.descripcion}`,
        tipo: 'shield'
      });
    }

    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      this.stats = { ...this.stats, duelosGanados: this.stats.duelosGanados + 1 };
      this.sumarPuntos(50, `Derrotaste a ${this.nombreRival}`);
      return;
    }

    this.turnoRival();
  }

  private turnoRival(): void {
    this.timeoutRivalId = setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['Serpensortia', 'Tarantallegra', 'Rictusempra', 'Protego'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoRival = Math.floor(Math.random() * 20) + 10;

      this.saludMago = Math.max(0, this.saludMago - danoRival);
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `¡El rival contraataca con ${elegido}! Te causa ${danoRival} de daño.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }
}