import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasaMagica } from '../../../models/mago.model';

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

export interface ProyectoMagico {
  id: number;
  nombre: string;
  categoria: 'IA & Asistente' | 'Web & Aerolínea' | 'Innovación' | 'Academia & GitHub';
  descripcion: string;
  tecnologias: string[];
  nivelPoder: number;
  icono: string;
}

export interface HabilidadArcana {
  nombre: string;
  rama: 'Tecnica' | 'Creativa' | 'Blanda';
  nivel: number;
}

export interface PortalRed {
  nombre: string;
  usuario: string;
  url: string;
  icono: string;
  colorClass: string;
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
  // 🎨 RETO 7: EL LIENZO CREATIVO (30% DE LA CALIFICACIÓN)
  // "El Santuario & Arena Arcana de Deodraus (Jeronimo Deossa Abad)"
  // =========================================================================

  // Datos biográficos y de identidad (DATOS.md)
  nombreReal: string = 'Jeronimo Deossa Abad';
  nombreArtistico: string = 'Deodraus';
  rolMago: string = 'Desarrollador de Software & Creador de Contenido';
  tituloAcademico: string = 'Técnico Laboral por Competencias como Asistente en Desarrollo de Software';
  ubicacionMago: string = 'Medellín, Antioquia, Colombia';
  correoMago: string = 'jeronimodeossaabad@gmail.com';
  telefonoMago: string = '+57 300 205 5624';

  // Modo de identidad interactiva: 'DEODRAUS' (Creador/VTuber) | 'JERONIMO' (Desarrollador)
  identidadActiva: 'DEODRAUS' | 'JERONIMO' = 'DEODRAUS';
  casaElegida: CasaMagica = 'Ravenclaw';
  seccionActiva: 'DUELO' | 'GRIMORIO' | 'FORJA' = 'DUELO';

  // 1. Estado Interactivo del Duelo (Jugador vs Rival - Compatible 100% con el Tribunal)
  nombreMago: string = 'Jeronimo "Deodraus" Deossa';
  saludMago: number = 100;
  energiaMago: number = 100;
  escudoActivo: number = 0;
  rachaVictorias: number = 0;

  nombreRival: string = 'Lord Bugdobeard (Malware Oscuro)';
  saludRival: number = 100;
  energiaRival: number = 100;

  rivalesDisponibles: { nombre: string; titulo: string; icono: string }[] = [
    { nombre: 'Lord Bugdobeard (Malware Oscuro)', titulo: 'Devorador de Memoria RAM', icono: '👾🐍' },
    { nombre: 'Draco Malfoy', titulo: 'Duelista de Slytherin', icono: '🧙🐍' },
    { nombre: 'Arquitecto del Caos Asíncrono', titulo: 'Señor de los Callbacks Infinitos', icono: '🌀💀' }
  ];

  // Estado general del duelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA'
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false;
  segundosSantuario: number = 0;

  // Grimorio de hechizos disponibles para el aprendiz
  hechizosDuelo: HechizoDuelo[] = [
    {
      id: 1,
      nombre: 'Expelliarmus: MiAsistente',
      tipo: 'Ataque',
      poder: 25,
      costoEnergia: 20,
      descripcion: 'Invoca al asistente de voz y calculadora de funciones para desarmar al rival con precisión lógica.'
    },
    {
      id: 2,
      nombre: 'Protego Avatar 3D',
      tipo: 'Defensa',
      poder: 30,
      costoEnergia: 15,
      descripcion: 'Despliega una barrera holográfica de modelaje 3D VTuber y arte anime que absorbe daño.'
    },
    {
      id: 3,
      nombre: 'Acorde Acústico Episkey',
      tipo: 'Sanacion',
      poder: 22,
      costoEnergia: 25,
      descripcion: 'Melodía de guitarra y charla reflexiva que restaura la vitalidad y calma el espíritu.'
    },
    {
      id: 4,
      nombre: 'Stupefy Fullstack Quipux',
      tipo: 'Ataque',
      poder: 35,
      costoEnergia: 35,
      descripcion: 'Impacto combinado de Backend II, Frontend II y Bases de Datos que aturde al enemigo.'
    }
  ];

  // Variables para la Forja de Hechizos con [(ngModel)]
  nuevoHechizoNombre: string = '';
  nuevoHechizoTipo: 'Ataque' | 'Defensa' | 'Sanacion' = 'Ataque';
  nuevoHechizoPoder: number = 25;
  nuevoHechizoCosto: number = 20;
  nuevoHechizoDesc: string = '';

  // Variables para el Grimorio de Proyectos, Habilidades y Hobbies con [(ngModel)]
  filtroGrimorio: string = '';
  filtroRamaHabilidad: 'TODAS' | 'Tecnica' | 'Creativa' | 'Blanda' = 'TODAS';

  proyectosMagicos: ProyectoMagico[] = [
    {
      id: 1,
      nombre: 'MiAsistente',
      categoria: 'IA & Asistente',
      descripcion: 'Sistema interactivo que integra un Asistente de Voz / Mascota Virtual y una Calculadora de Funciones matemáticas.',
      tecnologias: ['Lógica de Programación', 'Interfaz Interactiva', 'Asistente de Voz', 'Funciones'],
      nivelPoder: 95,
      icono: '🤖✨'
    },
    {
      id: 2,
      nombre: 'VitLine',
      categoria: 'Web & Aerolínea',
      descripcion: 'Plataforma para agencia de viajes y aerolínea diseñada para gestionar rutas, reservas y experiencias de vuelo.',
      tecnologias: ['Frontend II', 'Diseño UI/UX', 'Gestión de Datos'],
      nivelPoder: 90,
      icono: '✈️🌍'
    },
    {
      id: 3,
      nombre: 'ProyectMDIA',
      categoria: 'Innovación',
      descripcion: 'Proyecto tecnológico enfocado en transformar ideas en soluciones funcionales mediante nuevas tecnologías.',
      tecnologias: ['Backend II', 'Nuevas Tecnologías', 'Metodologías Ágiles'],
      nivelPoder: 88,
      icono: '🔮💻'
    },
    {
      id: 4,
      nombre: 'Semilleros de Quipux',
      categoria: 'Academia & GitHub',
      descripcion: 'Formación intensiva en desarrollo de software, control de versiones en GitHub, arquitectura Angular y pruebas unitarias.',
      tecnologias: ['Angular', 'TypeScript', 'Git & GitHub', 'Bases de Datos'],
      nivelPoder: 98,
      icono: '🏛️🧙‍♂️'
    }
  ];

  habilidadesArcanas: HabilidadArcana[] = [
    { nombre: 'Frontend II & Angular', rama: 'Tecnica', nivel: 94 },
    { nombre: 'Backend II & Lógica de Programación', rama: 'Tecnica', nivel: 92 },
    { nombre: 'Gestión de Bases de Datos', rama: 'Tecnica', nivel: 88 },
    { nombre: 'Metodologías Ágiles & Nuevas Tecnologías', rama: 'Tecnica', nivel: 90 },
    { nombre: 'Modelaje 3D de Avatares VTubers', rama: 'Creativa', nivel: 95 },
    { nombre: 'Dibujo Técnico en Personajes Anime', rama: 'Creativa', nivel: 93 },
    { nombre: 'Edición de Fotos, Videos & Streaming', rama: 'Creativa', nivel: 96 },
    { nombre: 'Comunicación Asertiva & Expresividad', rama: 'Blanda', nivel: 97 },
    { nombre: 'Creatividad, Innovación & Pensamiento Crítico', rama: 'Blanda', nivel: 95 },
    { nombre: 'Trabajo en Equipo, Eficiencia & Transparencia', rama: 'Blanda', nivel: 96 }
  ];

  hobbiesMagicos: string[] = [
    '🎸 Tocar guitarra',
    '🎨 Dibujar estilo anime',
    '💻 Crear proyectos de programación que ayudan al mundo',
    '🎬 Grabar, editar y publicar videos en redes sociales',
    '🎙️ Hacer streams y charlas reflexivas para jóvenes',
    '🎮 Jugar videojuegos con la comunidad',
    '🍿 Ver series y películas',
    '📚 Estudiar programación y nuevas habilidades digitales'
  ];

  portalesRedes: PortalRed[] = [
    { nombre: 'GitHub', usuario: '@Deodraus', url: 'https://github.com/Deodraus', icono: '🐙', colorClass: 'portal-github' },
    { nombre: 'Twitch', usuario: 'deodraus', url: 'https://twitch.tv/deodraus', icono: '🟣', colorClass: 'portal-twitch' },
    { nombre: 'Kick', usuario: 'deodraus', url: 'https://kick.com/deodraus', icono: '🟢', colorClass: 'portal-kick' },
    { nombre: 'TikTok', usuario: '@deodraus', url: 'https://tiktok.com/@deodraus?_r=1&_t=ZS-9AGVI9rYYcv', icono: '🎵', colorClass: 'portal-tiktok' },
    { nombre: 'Instagram', usuario: '@deodraus', url: 'https://instagram.com/deodraus?igsh=MWV2czJub3JwNDVtdg==', icono: '📸', colorClass: 'portal-instagram' },
    { nombre: 'X (Twitter)', usuario: '@deodraus', url: 'https://x.com/deodraus', icono: '✖️', colorClass: 'portal-x' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private ambientMusicInterval: any = null;

  // 2. Lifecycle Hook: ngOnInit
  ngOnInit(): void {
    console.log('🎨 Reto 7: Santuario Arcano de Deodraus (Jeronimo Deossa Abad) montado en el Gran Salón.');
    // Temporizador ambiental de recarga de maná y tiempo en el santuario
    this.ambientMusicInterval = setInterval(() => {
      this.segundosSantuario++;
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 2000);
  }

  // Cambiar entre identidad Jeronimo Deossa y Deodraus
  alternarIdentidad(modo: 'DEODRAUS' | 'JERONIMO'): void {
    this.identidadActiva = modo;
    if (modo === 'DEODRAUS') {
      this.nombreMago = 'Deodraus (Jeronimo Deossa)';
    } else {
      this.nombreMago = 'Jeronimo Deossa Abad';
    }
  }

  // Cambiar sección visible del artefacto
  cambiarSeccion(seccion: 'DUELO' | 'GRIMORIO' | 'FORJA'): void {
    this.seccionActiva = seccion;
  }

  // 3. Iniciar Duelo
  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.escudoActivo = 0;
    this.numeroTurno = 1;
    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Tribunal de Quipux',
        hechizo: 'Apertura de Duelo Arcano',
        efecto: `¡${this.nombreMago} alza su varita desde ${this.ubicacionMago} contra ${this.nombreRival}!`,
        tipo: 'shield'
      }
    ];
  }

  // 4. Lanzar Hechizo del Jugador
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
      this.escudoActivo = Math.min(50, this.escudoActivo + Math.floor(hechizo.poder / 2));
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Escudo activo (+${Math.floor(hechizo.poder / 2)} defensa): ${hechizo.descripcion}`,
        tipo: 'shield'
      });
    }

    // Verificar si el rival cayó
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      this.rachaVictorias++;
      return;
    }

    // Respuesta del Rival (IA Simulada)
    this.turnoRival();
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['NullPointerException', 'Serpensortia', 'Lag Spike Oscuro', 'Rictusempra'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoBruto = Math.floor(Math.random() * 18) + 10;
      const absorbido = Math.min(this.escudoActivo, danoBruto);
      const danoFinal = Math.max(0, danoBruto - absorbido);
      this.escudoActivo = Math.max(0, this.escudoActivo - absorbido);

      this.saludMago = Math.max(0, this.saludMago - danoFinal);
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: absorbido > 0
          ? `¡Contraataque con ${elegido}! Causa ${danoFinal} de daño (${absorbido} absorbido por tu escudo).`
          : `¡El rival contraataca con ${elegido}! Te causa ${danoFinal} de daño.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  // Forjar un nuevo hechizo personalizado
  esHechizoValido(): boolean {
    return (
      this.nuevoHechizoNombre.trim().length >= 3 &&
      this.nuevoHechizoPoder >= 5 &&
      this.nuevoHechizoPoder <= 60 &&
      this.nuevoHechizoCosto >= 5 &&
      this.nuevoHechizoCosto <= 60
    );
  }

  forjarHechizo(): void {
    if (!this.esHechizoValido()) return;

    const nuevo: HechizoDuelo = {
      id: Date.now(),
      nombre: this.nuevoHechizoNombre.trim(),
      tipo: this.nuevoHechizoTipo,
      poder: Number(this.nuevoHechizoPoder),
      costoEnergia: Number(this.nuevoHechizoCosto),
      descripcion: this.nuevoHechizoDesc.trim() || 'Hechizo personalizado forjado en el taller de Deodraus.'
    };

    this.hechizosDuelo.push(nuevo);
    this.nuevoHechizoNombre = '';
    this.nuevoHechizoDesc = '';
    this.nuevoHechizoPoder = 25;
    this.nuevoHechizoCosto = 20;
    this.seccionActiva = 'DUELO';
  }

  // Filtros dinámicos del Grimorio de Proyectos y Habilidades
  getProyectosFiltrados(): ProyectoMagico[] {
    const q = this.filtroGrimorio.trim().toLowerCase();
    if (!q) return this.proyectosMagicos;
    return this.proyectosMagicos.filter(
      p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.tecnologias.some(t => t.toLowerCase().includes(q))
    );
  }

  getHabilidadesFiltradas(): HabilidadArcana[] {
    let lista = [...this.habilidadesArcanas];
    if (this.filtroRamaHabilidad !== 'TODAS') {
      lista = lista.filter(h => h.rama === this.filtroRamaHabilidad);
    }
    const q = this.filtroGrimorio.trim().toLowerCase();
    if (q) {
      lista = lista.filter(h => h.nombre.toLowerCase().includes(q));
    }
    return lista;
  }

  // 6. Alternar ambientación de la arena
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    if (this.ambientMusicInterval) {
      clearInterval(this.ambientMusicInterval);
    }
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }
}
