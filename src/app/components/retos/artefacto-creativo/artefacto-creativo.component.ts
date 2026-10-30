import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ============================================================================
// API heredada del simulador de duelos (se conserva por compatibilidad con el
// Tribunal de Magia). El artefacto visible es ahora el Escarbato Mágico.
// ============================================================================
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

export type EstadoEscarbato =
  | 'madriguera'
  | 'cuidando'
  | 'evolucionado'
  | 'escapado';

export type FormaEvolucion = 'gloton' | 'cazatesoros' | 'nocturno';

export interface ComidaEscarbato {
  id: number;
  nombre: string;
  emoji: string;
  descripcion: string;
  hambre: number;
  felicidad: number;
  energia: number;
}

export interface TesoroEscarbato {
  id: number;
  nombre: string;
  emoji: string;
  rareza: 'Comun' | 'Brillante' | 'Legendario';
}

export interface RegistroCuidado {
  id: number;
  accion: string;
  detalle: string;
  emoji: string;
  hora: string;
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
  // Artefacto elegido: "El Escarbato Mágico", una mascota tipo Tamagotchi.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Compatibilidad con el simulador de duelos original (spec del Reto 7)
  // -------------------------------------------------------------------------
  nombreMago: string = 'Harry Potter';
  saludMago: number = 100;
  energiaMago: number = 100;
  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' =
    'PREPARACION';
  numeroTurno: number = 1;
  arenaOscura: boolean = false;
  hechizosDuelo: HechizoDuelo[] = [
    {
      id: 1,
      nombre: 'Expelliarmus',
      tipo: 'Ataque',
      poder: 25,
      costoEnergia: 20,
      descripcion: 'Desarma al oponente con un rayo rojo escarlata.'
    },
    {
      id: 2,
      nombre: 'Protego',
      tipo: 'Defensa',
      poder: 30,
      costoEnergia: 15,
      descripcion: 'Crea un escudo mágico que absorbe el siguiente impacto.'
    },
    {
      id: 3,
      nombre: 'Episkey',
      tipo: 'Sanacion',
      poder: 20,
      costoEnergia: 25,
      descripcion: 'Restaura vitalidad y cura heridas menores.'
    },
    {
      id: 4,
      nombre: 'Stupefy',
      tipo: 'Ataque',
      poder: 35,
      costoEnergia: 35,
      descripcion: 'Aturde al rival con una potente onda expansiva.'
    }
  ];
  historialDuelo: RegistroTurno[] = [];

  // -------------------------------------------------------------------------
  // Estado principal del Escarbato Mágico
  // -------------------------------------------------------------------------
  readonly metaCuidados: number = 8;

  nombreEscarbato: string = '';
  estadoEscarbato: EstadoEscarbato = 'madriguera';

  hambre: number = 80;
  felicidad: number = 80;
  energia: number = 80;

  comidaSeleccionadaId: number = 1;
  comidas: ComidaEscarbato[] = [
    {
      id: 1,
      nombre: 'Fresas lunares',
      emoji: '🍓',
      descripcion: 'Dulces bayas que brillan bajo la luna.',
      hambre: 26,
      felicidad: 5,
      energia: 2
    },
    {
      id: 2,
      nombre: 'Gusanos de gema',
      emoji: '🐛',
      descripcion: 'Crujientes y llenos de minerales brillantes.',
      hambre: 34,
      felicidad: 2,
      energia: 4
    },
    {
      id: 3,
      nombre: 'Setas chispeantes',
      emoji: '🍄',
      descripcion: 'Setas tibias que desprenden pequeñas chispas.',
      hambre: 20,
      felicidad: 8,
      energia: 6
    }
  ];

  tesoros: TesoroEscarbato[] = [];
  contadorTesoros: number = 0;
  historialCuidados: RegistroCuidado[] = [];

  formaEvolucion: FormaEvolucion | null = null;
  cuidadosCorrectos: number = 0;
  conteoAlimentar: number = 0;
  conteoJugar: number = 0;
  conteoDormir: number = 0;
  mensajeEscarbato: string =
    'Una cría de escarbato asoma el hocico entre la tierra húmeda...';

  private intervaloCuidado: any = null;
  private siguienteIdCuidado: number = 1;
  private siguienteIdTesoro: number = 1;

  private readonly bolsaDeTesoros: Omit<TesoroEscarbato, 'id'>[] = [
    { nombre: 'Moneda de oro antiguo', emoji: '🪙', rareza: 'Comun' },
    { nombre: 'Anillo de plata élfica', emoji: '💍', rareza: 'Brillante' },
    { nombre: 'Gema de luna', emoji: '💎', rareza: 'Brillante' },
    { nombre: 'Copa dorada diminuta', emoji: '🏆', rareza: 'Comun' },
    { nombre: 'Ámbar con luciérnaga', emoji: '🟡', rareza: 'Brillante' },
    { nombre: 'Corona de cristal', emoji: '👑', rareza: 'Legendario' },
    { nombre: 'Llave de oro voladora', emoji: '🗝️', rareza: 'Legendario' },
    { nombre: 'Botón de nácar encantado', emoji: '🔘', rareza: 'Comun' },
    { nombre: 'Esquirla de estrella', emoji: '⭐', rareza: 'Legendario' },
    { nombre: 'Cuenta de ámbar mágico', emoji: '🟠', rareza: 'Comun' }
  ];

  // -------------------------------------------------------------------------
  // Ciclo de vida
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    console.log('🎨 Reto 7: Artefacto Creativo montado en el Gran Salón.');
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    if (this.intervaloCuidado) {
      clearInterval(this.intervaloCuidado);
      this.intervaloCuidado = null;
    }
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }

  // -------------------------------------------------------------------------
  // Getters para la plantilla
  // -------------------------------------------------------------------------
  get comidaSeleccionada(): ComidaEscarbato {
    return (
      this.comidas.find(c => c.id === this.comidaSeleccionadaId) ??
      this.comidas[0]
    );
  }

  get animoEscarbato(): 'feliz' | 'hambriento' | 'cansado' {
    if (this.energia <= 25) return 'cansado';
    if (this.hambre <= 30) return 'hambriento';
    return 'feliz';
  }

  get emojiEscarbato(): string {
    if (this.estadoEscarbato === 'evolucionado') {
      if (this.formaEvolucion === 'gloton') return '🍖';
      if (this.formaEvolucion === 'cazatesoros') return '💎';
      if (this.formaEvolucion === 'nocturno') return '🌙';
    }
    if (this.animoEscarbato === 'hambriento') return '🍽️';
    if (this.animoEscarbato === 'cansado') return '😴';
    return '💛';
  }

  get progresoCuidados(): number {
    return Math.min(
      100,
      Math.round((this.cuidadosCorrectos / this.metaCuidados) * 100)
    );
  }

  get tituloFormaEvolucion(): string {
    if (this.formaEvolucion === 'gloton') return 'Escarbato Glotón';
    if (this.formaEvolucion === 'cazatesoros') return 'Escarbato Cazatesoros';
    if (this.formaEvolucion === 'nocturno') return 'Escarbato Nocturno';
    return 'Escarbato Mágico';
  }

  get descripcionFormaEvolucion(): string {
    if (this.formaEvolucion === 'gloton') {
      return 'Su olfato distingue cada baya madura a un kilómetro. La despensa del colegio ahora tiene un guardián muy peludo.';
    }
    if (this.formaEvolucion === 'cazatesoros') {
      return 'Sus garras brillan como brújulas: ningún destello se le escapa. La bolsa de tesoros crece cada noche.';
    }
    if (this.formaEvolucion === 'nocturno') {
      return 'Duerme de día y vigila las estrellas de noche. Su pelaje guarda un suave resplandor lunar.';
    }
    return '';
  }

  // -------------------------------------------------------------------------
  // Acciones de la mascota
  // -------------------------------------------------------------------------
  adoptarEscarbato(): void {
    const nombre = this.nombreEscarbato.trim();
    if (nombre.length < 2) return;

    this.nombreEscarbato = nombre;
    this.reiniciarEstadisticas();
    this.estadoEscarbato = 'cuidando';
    this.mensajeEscarbato = `¡${nombre} salió de la madriguera y te mira con curiosidad!`;
    this.registrarCuidado(
      'Adopción',
      `Encontraste a ${nombre} en una madriguera y decidiste cuidarlo.`,
      '🕳️'
    );
  }

  alimentar(): void {
    if (!this.puedeCuidar()) return;

    const comida = this.comidaSeleccionada;
    this.hambre = this.limitar(this.hambre + comida.hambre);
    this.felicidad = this.limitar(this.felicidad + comida.felicidad);
    this.energia = this.limitar(this.energia + comida.energia);
    this.conteoAlimentar++;

    this.mensajeEscarbato = `${this.nombreEscarbato} devoró ${comida.emoji} ${comida.nombre} y soltó un chillido de felicidad.`;
    this.registrarCuidado(
      'Alimentar',
      `${this.nombreEscarbato} comió ${comida.emoji} ${comida.nombre}.`,
      comida.emoji
    );
    this.registrarCuidadoCorrecto();
  }

  jugar(): void {
    if (!this.puedeCuidar()) return;

    this.energia = this.limitar(this.energia - 15);
    this.hambre = this.limitar(this.hambre - 10);
    this.felicidad = this.limitar(this.felicidad + 20);
    this.conteoJugar++;

    if (Math.random() < 0.65) {
      const base =
        this.bolsaDeTesoros[
          Math.floor(Math.random() * this.bolsaDeTesoros.length)
        ];
      const tesoro: TesoroEscarbato = {
        id: this.siguienteIdTesoro++,
        nombre: base.nombre,
        emoji: base.emoji,
        rareza: base.rareza
      };

      this.tesoros.unshift(tesoro);
      this.contadorTesoros++;
      this.mensajeEscarbato = `✨ ¡${this.nombreEscarbato} encontró ${tesoro.emoji} ${tesoro.nombre}! Lo guardó en su bolsa brillante.`;
      this.registrarCuidado(
        'Jugar',
        `${this.nombreEscarbato} excavó y encontró ${tesoro.emoji} ${tesoro.nombre} (${tesoro.rareza}).`,
        '💎'
      );
    } else {
      this.mensajeEscarbato = `${this.nombreEscarbato} excavó con entusiasmo, pero volvió con las patas llenas de tierra y ningún tesoro.`;
      this.registrarCuidado(
        'Jugar',
        `${this.nombreEscarbato} buscó destellos bajo la luna, pero no encontró nada esta vez.`,
        '🕳️'
      );
    }

    this.registrarCuidadoCorrecto();
  }

  dormir(): void {
    if (!this.puedeCuidar()) return;

    this.energia = this.limitar(this.energia + 35);
    this.felicidad = this.limitar(this.felicidad + 8);
    this.hambre = this.limitar(this.hambre - 6);
    this.conteoDormir++;

    this.mensajeEscarbato = `${this.nombreEscarbato} se acurrucó junto a una raíz y soñó con montañas de monedas.`;
    this.registrarCuidado(
      'Dormir',
      `${this.nombreEscarbato} descansó profundamente y recuperó energía.`,
      '🌙'
    );
    this.registrarCuidadoCorrecto();
  }

  llamarEscarbato(): void {
    if (this.estadoEscarbato !== 'escapado') return;

    this.reiniciarEstadisticas();
    this.estadoEscarbato = 'cuidando';
    this.mensajeEscarbato = `¡${this.nombreEscarbato} volvió a casa! Trae las patas sucias y muchas ganas de quedarse.`;
    this.registrarCuidado(
      'Reencuentro',
      `Llamaste a ${this.nombreEscarbato} y regresó a la madriguera con las estadísticas reiniciadas.`,
      '🔔'
    );
  }

  reiniciarAventura(): void {
    this.estadoEscarbato = 'madriguera';
    this.nombreEscarbato = '';
    this.formaEvolucion = null;
    this.reiniciarEstadisticas();
    this.tesoros = [];
    this.contadorTesoros = 0;
    this.historialCuidados = [];
    this.cuidadosCorrectos = 0;
    this.conteoAlimentar = 0;
    this.conteoJugar = 0;
    this.conteoDormir = 0;
    this.siguienteIdCuidado = 1;
    this.siguienteIdTesoro = 1;
    this.mensajeEscarbato =
      'Una nueva cría de escarbato asoma el hocico entre la tierra húmeda...';
  }

  // -------------------------------------------------------------------------
  // Temporizador y evolución
  // -------------------------------------------------------------------------
  private iniciarTemporizador(): void {
    this.intervaloCuidado = setInterval(() => this.avanzarTiempo(), 3000);
  }

  private avanzarTiempo(): void {
    if (this.estadoEscarbato !== 'cuidando') return;

    this.hambre = this.limitar(this.hambre - 4);
    this.felicidad = this.limitar(this.felicidad - 3);
    this.energia = this.limitar(this.energia - 3);

    if (this.hambre <= 8 || this.felicidad <= 8) {
      this.escapar();
    }
  }

  private escapar(): void {
    if (this.estadoEscarbato !== 'cuidando') return;

    this.estadoEscarbato = 'escapado';
    this.mensajeEscarbato = `${this.nombreEscarbato} vio un destello dorado entre los árboles y salió corriendo tras él.`;
    this.registrarCuidado(
      'Huida',
      `${this.nombreEscarbato} se escapó persiguiendo algo brillante por descuido.`,
      '💨'
    );
  }

  private registrarCuidadoCorrecto(): void {
    this.cuidadosCorrectos++;

    if (
      this.cuidadosCorrectos >= this.metaCuidados &&
      this.estadoEscarbato === 'cuidando'
    ) {
      this.evolucionar();
    }
  }

  private evolucionar(): void {
    if (this.conteoAlimentar >= this.conteoJugar && this.conteoAlimentar >= this.conteoDormir) {
      this.formaEvolucion = 'gloton';
    } else if (this.conteoJugar >= this.conteoDormir) {
      this.formaEvolucion = 'cazatesoros';
    } else {
      this.formaEvolucion = 'nocturno';
    }

    this.estadoEscarbato = 'evolucionado';
    this.mensajeEscarbato = `✨ ¡${this.nombreEscarbato} evolucionó a ${this.tituloFormaEvolucion}! ✨`;
    this.registrarCuidado(
      'Evolución',
      `${this.nombreEscarbato} se transformó en ${this.tituloFormaEvolucion}.`,
      '🌟'
    );
  }

  // -------------------------------------------------------------------------
  // Utilidades
  // -------------------------------------------------------------------------
  private puedeCuidar(): boolean {
    return this.estadoEscarbato === 'cuidando';
  }

  private reiniciarEstadisticas(): void {
    this.hambre = 80;
    this.felicidad = 80;
    this.energia = 80;
  }

  private limitar(valor: number): number {
    return Math.max(0, Math.min(100, Math.round(valor)));
  }

  private registrarCuidado(accion: string, detalle: string, emoji: string): void {
    this.historialCuidados.unshift({
      id: this.siguienteIdCuidado++,
      accion,
      detalle,
      emoji,
      hora: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    if (this.historialCuidados.length > 8) {
      this.historialCuidados = this.historialCuidados.slice(0, 8);
    }
  }

  // -------------------------------------------------------------------------
  // Mecánica de duelo conservada para la suite del Reto 7
  // -------------------------------------------------------------------------
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
      return;
    }

    this.turnoRival();
  }

  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  private turnoRival(): void {
    setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = [
        'Serpensortia',
        'Tarantallegra',
        'Rictusempra',
        'Protego'
      ];
      const elegido =
        opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
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
}
