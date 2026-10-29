import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
  icono: string;
}

export interface RegistroTurno {
  id: number;
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal' | 'energy' | 'lore';
  bando: 'TOM' | 'LECTOR' | 'DIARIO';
}

export interface RecuerdoDiario {
  id: number;
  anio: string;
  titulo: string;
  texto: string;
  pista: string;
  umbral: number;
  icono: string;
  revelado: boolean;
}

interface AtaqueDiario {
  nombre: string;
  efecto: string;
  danoMin: number;
  danoMax: number;
}

export type EstadoDuelo = 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA';
export type FaseDiario = 'PORTADA' | 'DIARIO' | 'FINAL';

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css',
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}

  readonly casas = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

  readonly sugerencias = [
    '¿Quién eres?',
    'No pienso tenerte miedo.',
    'Tom Marvolo Riddle',
  ];

  // Identidad del lector. El nombre se usa en los diálogos y en la portada.
  nombreLector: string = 'Harry Potter';
  casaLector: string = 'Gryffindor';

  faseDiario: FaseDiario = 'PORTADA';
  estadoDuelo: EstadoDuelo = 'PREPARACION';
  nombreRival: string = 'Tom Riddle';
  nombreRevelado: boolean = false;
  nombrePronunciado: boolean = false;

  // La "salud" representa la voluntad del lector y el dominio de Tom.
  saludMago: number = 100;
  energiaMago: number = 100;
  saludRival: number = 100;
  energiaRival: number = 100;

  turnoActual: 'MAGO' | 'RIVAL' = 'MAGO';
  numeroTurno: number = 1;
  escudoActivo: boolean = false;
  turnoRivalPendiente: boolean = false;
  hechizoRivalPendiente: string = '';
  mensajeCombate: string = '';
  mensajeFinal: string = '';
  recuerdosRestantes: number = 2;
  mensajeEscrito: string = '';
  respuestaTom: string = '';

  hechizosDuelo: HechizoDuelo[] = [
    {
      id: 1,
      nombre: 'Legilimens',
      tipo: 'Ataque',
      poder: 24,
      costoEnergia: 20,
      descripcion: 'Entras en la memoria del diario y obligas a Tom a retroceder.',
      icono: '🪶',
    },
    {
      id: 2,
      nombre: 'Protego',
      tipo: 'Defensa',
      poder: 30,
      costoEnergia: 15,
      descripcion: 'Una barrera de luz protege tu mente del siguiente susurro.',
      icono: '🛡️',
    },
    {
      id: 3,
      nombre: 'Expecto Patronum',
      tipo: 'Sanacion',
      poder: 22,
      costoEnergia: 25,
      descripcion: 'Un recuerdo feliz ilumina la página y restaura tu voluntad.',
      icono: '✨',
    },
    {
      id: 4,
      nombre: 'Obliviate',
      tipo: 'Ataque',
      poder: 36,
      costoEnergia: 35,
      descripcion: 'Arrancas una página entera de la memoria de Tom.',
      icono: '📖',
    },
  ];

  historialDuelo: RegistroTurno[] = [];
  recuerdos: RecuerdoDiario[] = [
    {
      id: 1,
      anio: '1943',
      titulo: 'La puerta del baño',
      texto:
        'Un pasillo inundado. Una niña de ojos grandes y una voz que sale de la pared. «Abre la puerta», le dijo Tom. Ella obedeció.',
      pista: 'El primer recuerdo está a 80% de su dominio.',
      umbral: 80,
      icono: '🚪',
      revelado: false,
    },
    {
      id: 2,
      anio: '1943',
      titulo: 'El nombre escondido',
      texto:
        'Las letras flotan y se reordenan: TOM MARVOLO RIDDLE. Debajo, con una caligrafía más oscura, aparece otra frase: I AM LORD VOLDEMORT.',
      pista: 'El nombre verdadero está a 55% de su dominio.',
      umbral: 55,
      icono: '🔤',
      revelado: false,
    },
    {
      id: 3,
      anio: '1943',
      titulo: 'La última página',
      texto:
        'Tom no es un recuerdo: es un trozo de alma guardado en el papel. Si alguien escribe su nombre, el diario aprende a moverse.',
      pista: 'La verdad final está a 30% de su dominio.',
      umbral: 30,
      icono: '🐍',
      revelado: false,
    },
  ];

  private siguienteIdRegistro: number = 1;
  private timeoutRival: ReturnType<typeof setTimeout> | null = null;

  private readonly ataquesRival: AtaqueDiario[] = [
    {
      nombre: 'Letra viva',
      efecto:
        'Las palabras se desprenden del papel y trepan por tu muñeca. Donde tocan la piel, la tinta deja un frío que no se va.',
      danoMin: 8,
      danoMax: 12,
    },
    {
      nombre: 'Tu nombre',
      efecto:
        'Tom escribe tu nombre despacio, como si lo probara. Cada letra te roba un poco de aire y deja un zumbido en los oídos.',
      danoMin: 9,
      danoMax: 13,
    },
    {
      nombre: 'Recuerdo prestado',
      efecto:
        'Una imagen que no es tuya se instala detrás de tus ojos: una puerta, un pasillo, un grito. Cuando vuelves a mirar, el diario tiene una página más.',
      danoMin: 7,
      danoMax: 11,
    },
    {
      nombre: 'Promesa',
      efecto:
        'Una voz cálida te ofrece todo lo que has deseado. Por un instante casi le crees; luego recuerdas que las promesas también pueden ahogar.',
      danoMin: 10,
      danoMax: 14,
    },
    {
      nombre: 'La página en blanco',
      efecto:
        'El diario te muestra una página vacía. Durante un segundo no recuerdas tu nombre, ni la casa a la que perteneces, ni por qué estás aquí.',
      danoMin: 12,
      danoMax: 16,
    },
  ];

  ngOnInit(): void {
    this.mensajeCombate = 'El diario está cerrado. Todavía puedes elegir no abrirlo.';
  }

  // ---------------------------------------------------------------------------
  // Datos que usa la plantilla
  // ---------------------------------------------------------------------------
  get casaClase(): string {
    return 'casa-' + this.casaLector.toLowerCase();
  }

  get casaEmoji(): string {
    const emojis: Record<string, string> = {
      Gryffindor: '🦁',
      Slytherin: '🐍',
      Ravenclaw: '🦅',
      Hufflepuff: '🦡',
    };

    return emojis[this.casaLector] ?? '🎓';
  }

  get nombreLectorVisible(): string {
    return this.nombreLector.trim() || 'intruso';
  }

  get puedeActuar(): boolean {
    return this.estadoDuelo === 'EN_CURSO' && this.turnoActual === 'MAGO' && !this.turnoRivalPendiente;
  }

  get hechizoMasBarato(): number {
    return Math.min(...this.hechizosDuelo.map((hechizo) => hechizo.costoEnergia));
  }

  get tintaBaja(): boolean {
    return this.energiaMago < this.hechizoMasBarato;
  }

  get voluntadBaja(): boolean {
    return this.saludMago <= 30;
  }

  get dominioBajo(): boolean {
    return this.saludRival <= 30;
  }

  get recuerdosRevelados(): number {
    return this.recuerdos.filter((recuerdo) => recuerdo.revelado).length;
  }

  get progresoRecuerdos(): number {
    return Math.round((this.recuerdosRevelados / this.recuerdos.length) * 100);
  }

  get tiempoContraataque(): number {
    return this.saludRival <= 40 ? 1500 : 1900;
  }

  get esVictoria(): boolean {
    return this.estadoDuelo === 'VICTORIA';
  }

  get tituloFinal(): string {
    return this.esVictoria ? 'Has cerrado el diario' : 'Tom ha escrito tu nombre';
  }

  // ---------------------------------------------------------------------------
  // Inicio y reinicio
  // ---------------------------------------------------------------------------
  iniciarDuelo(): void {
    this.cancelarTurnoRival();

    this.faseDiario = 'DIARIO';
    this.estadoDuelo = 'EN_CURSO';
    this.nombreRival = 'Tom Riddle';
    this.nombreRevelado = false;
    this.nombrePronunciado = false;
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.turnoActual = 'MAGO';
    this.escudoActivo = false;
    this.turnoRivalPendiente = false;
    this.hechizoRivalPendiente = '';
    this.mensajeCombate = '';
    this.mensajeFinal = '';
    this.recuerdosRestantes = 2;
    this.historialDuelo = [];
    this.siguienteIdRegistro = 1;
    this.mensajeEscrito = '';
    this.recuerdos.forEach((recuerdo) => (recuerdo.revelado = false));

    this.respuestaTom = `Hola, ${this.nombreLectorVisible}. Me alegra que hayas encontrado mi diario. Casi nadie se atreve a escribir en él.`;

    this.registrar(
      'Tom Riddle',
      'La primera página',
      'La tinta se ordena sola sobre el papel. Alguien te está mirando desde dentro.',
      'lore',
      'TOM',
    );
  }

  reiniciarDiario(): void {
    this.cancelarTurnoRival();

    this.faseDiario = 'PORTADA';
    this.estadoDuelo = 'PREPARACION';
    this.nombreRival = 'Tom Riddle';
    this.nombreRevelado = false;
    this.nombrePronunciado = false;
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.turnoActual = 'MAGO';
    this.escudoActivo = false;
    this.turnoRivalPendiente = false;
    this.hechizoRivalPendiente = '';
    this.mensajeCombate = 'El diario está cerrado. Todavía puedes elegir no abrirlo.';
    this.mensajeFinal = '';
    this.recuerdosRestantes = 2;
    this.historialDuelo = [];
    this.siguienteIdRegistro = 1;
    this.mensajeEscrito = '';
    this.respuestaTom = '';
    this.recuerdos.forEach((recuerdo) => (recuerdo.revelado = false));
  }

  // ---------------------------------------------------------------------------
  // Acciones del lector
  // ---------------------------------------------------------------------------
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turnoActual !== 'MAGO') return;

    if (this.turnoRivalPendiente) {
      this.mensajeCombate = 'Tom todavía está escribiendo. Espera a que termine su frase.';
      return;
    }

    if (this.energiaMago < hechizo.costoEnergia) {
      this.mensajeCombate =
        this.energiaMago === 0
          ? 'La página se ha quedado seca. Recupera tinta antes de intentarlo otra vez.'
          : 'No tienes tinta suficiente para ese hechizo.';
      return;
    }

    this.energiaMago -= hechizo.costoEnergia;
    this.mensajeCombate = '';

    if (hechizo.tipo === 'Ataque') {
      const dano = hechizo.poder + (this.nombreRevelado ? 4 : 0);
      this.saludRival = Math.max(0, this.saludRival - dano);

      this.registrar(
        this.nombreLectorVisible,
        hechizo.nombre,
        `La tinta retrocede ${dano} puntos. ${this.nombreRevelado ? 'El nombre completo pesa más de lo que Tom quiere admitir.' : 'El diario tiembla, pero no se cierra.'}`,
        'damage',
        'LECTOR',
      );

      this.revisarRecuerdos();
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);

      this.registrar(
        this.nombreLectorVisible,
        hechizo.nombre,
        `Un recuerdo luminoso te devuelve ${hechizo.poder} puntos de voluntad. Tom lo observa con curiosidad.`,
        'heal',
        'LECTOR',
      );
    } else {
      this.escudoActivo = true;

      this.registrar(
        this.nombreLectorVisible,
        hechizo.nombre,
        'Una barrera de luz queda suspendida entre tu mente y la página. El próximo susurro sonará más lejos.',
        'shield',
        'LECTOR',
      );
    }

    if (this.saludRival <= 0) {
      this.ganarDiario();
      return;
    }

    this.turnoRival();
  }

  enviarMensaje(): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;

    const texto = this.mensajeEscrito.trim();

    if (!texto) {
      this.mensajeCombate = 'Escribe algo. El diario no responde al silencio.';
      return;
    }

    this.registrar(
      this.nombreLectorVisible,
      'Escribir en el diario',
      `«${texto}»`,
      'lore',
      'LECTOR',
    );

    if (/tom\s+marvolo\s+riddle|tom\s+riddle|voldemort/i.test(texto) && !this.nombrePronunciado) {
      this.nombrePronunciado = true;
      this.saludRival = Math.max(0, this.saludRival - 10);
      this.respuestaTom =
        'La tinta se encoge como si la hubieras quemado. Mi nombre completo no debería estar en tu boca.';
      this.mensajeCombate = 'Pronunciar su nombre verdadero le ha hecho daño.';

      this.registrar(
        'Tom Riddle',
        'Su nombre verdadero',
        'El diario pierde 10 puntos de dominio. La caligrafía se vuelve más fina y menos segura.',
        'damage',
        'TOM',
      );

      this.revisarRecuerdos();
    } else if (/quién|quien|eres|nombre/i.test(texto)) {
      this.respuestaTom =
        'Soy un recuerdo que aprendió a escribir de vuelta. ¿Y tú, qué eres cuando nadie te mira?';
    } else if (/miedo|temo|asusta/i.test(texto)) {
      this.respuestaTom =
        'El miedo es solo tinta seca. Yo llevo años bebiéndolo, y nunca me ha sentado mal.';
    } else if (/ayuda|ayudar|solo/i.test(texto)) {
      this.respuestaTom =
        'Puedo ayudarte. Solo tienes que dejar que escriba tu nombre en la última página.';
    } else {
      this.respuestaTom =
        'Interesante. Tu letra tiembla menos de lo que esperaba. Eso hará que esto sea más divertido.';
    }

    this.mensajeEscrito = '';

    if (this.saludRival <= 0) {
      this.ganarDiario();
    }
  }

  usarSugerencia(texto: string): void {
    if (!this.puedeActuar) return;

    this.mensajeEscrito = texto;
    this.enviarMensaje();
  }

  usarRecuerdoFeliz(): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turnoActual !== 'MAGO') return;

    if (this.turnoRivalPendiente) {
      this.mensajeCombate = 'Espera a que Tom termine de escribir.';
      return;
    }

    if (this.recuerdosRestantes <= 0) {
      this.mensajeCombate = 'No te quedan recuerdos felices que ofrecerle al diario.';
      return;
    }

    if (this.saludMago >= 100) {
      this.mensajeCombate = 'Tu voluntad está entera. Guarda ese recuerdo para cuando lo necesites.';
      return;
    }

    this.recuerdosRestantes--;
    this.saludMago = Math.min(100, this.saludMago + 30);

    this.registrar(
      this.nombreLectorVisible,
      'Aferrarte a un recuerdo',
      'Cierras los ojos y recuerdas una risa, una mesa llena de gente, un verano. La página pierde fuerza.',
      'heal',
      'LECTOR',
    );

    this.mensajeCombate = 'El recuerdo te devuelve 30 puntos de voluntad.';
    this.turnoRival();
  }

  recuperarTinta(): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turnoActual !== 'MAGO') return;

    if (this.turnoRivalPendiente) {
      this.mensajeCombate = 'Tom está usando la tinta. No puedes recuperarla ahora mismo.';
      return;
    }

    if (this.energiaMago >= 100) {
      this.mensajeCombate = 'La tinta está al máximo. No necesitas recuperar nada.';
      return;
    }

    const recuperada = Math.min(35, 100 - this.energiaMago);
    this.energiaMago += recuperada;

    this.registrar(
      this.nombreLectorVisible,
      'Recuperar tinta',
      `Mojes la pluma y recuperas ${recuperada} puntos de tinta. El diario aprovecha el silencio para moverse.`,
      'energy',
      'LECTOR',
    );

    this.mensajeCombate = 'Recuperas tinta, pero cedes el turno.';
    this.turnoRival();
  }

  // ---------------------------------------------------------------------------
  // Turno de Tom
  // ---------------------------------------------------------------------------
  private turnoRival(): void {
    this.cancelarTurnoRival();
    this.turnoActual = 'RIVAL';
    this.turnoRivalPendiente = true;
    this.mensajeCombate = '';

    const costo = 22;

    if (this.energiaRival < costo) {
      this.hechizoRivalPendiente = 'Recuperar sombra';

      this.timeoutRival = setTimeout(() => {
        this.timeoutRival = null;

        if (this.estadoDuelo !== 'EN_CURSO') {
          this.turnoRivalPendiente = false;
          this.cdr.detectChanges();
          return;
        }

        const recuperada = Math.min(40, 100 - this.energiaRival);
        this.energiaRival += recuperada;
        this.numeroTurno++;
        this.turnoActual = 'MAGO';
        this.turnoRivalPendiente = false;
        this.hechizoRivalPendiente = '';
        this.mensajeCombate = 'Tom se queda sin sombra. Recuperas el turno.';

        this.registrar(
          this.nombreRival,
          'Recuperar sombra',
          `El diario se queda sin energía, pero absorbe ${recuperada} puntos de la habitación. Vuelve a mirarte.`,
          'energy',
          'TOM',
        );

        this.cdr.detectChanges();
      }, this.tiempoContraataque);
      return;
    }

    const elegido = this.ataquesRival[Math.floor(Math.random() * this.ataquesRival.length)];
    const danoBase = Math.floor(Math.random() * (elegido.danoMax - elegido.danoMin + 1)) + elegido.danoMin;
    const danoExtra = this.saludRival <= 40 ? 3 : 0;
    let dano = danoBase + danoExtra;

    this.hechizoRivalPendiente = elegido.nombre;

    this.timeoutRival = setTimeout(() => {
      this.timeoutRival = null;

      if (this.estadoDuelo !== 'EN_CURSO') {
        this.turnoRivalPendiente = false;
        this.cdr.detectChanges();
        return;
      }

      this.energiaRival = Math.max(0, this.energiaRival - costo);

      if (this.escudoActivo) {
        dano = Math.ceil(dano / 2);
        this.escudoActivo = false;

        this.registrar(
          this.nombreRival,
          elegido.nombre,
          `${elegido.efecto} Protego absorbe la mitad del golpe: recibes ${dano} de daño.`,
          'shield',
          'TOM',
        );
      } else {
        this.registrar(
          this.nombreRival,
          elegido.nombre,
          `${elegido.efecto} Pierdes ${dano} puntos de voluntad.`,
          'damage',
          'TOM',
        );
      }

      this.saludMago = Math.max(0, this.saludMago - dano);
      this.numeroTurno++;
      this.turnoRivalPendiente = false;
      this.hechizoRivalPendiente = '';

      if (this.saludMago <= 0) {
        this.perderDiario();
      } else {
        this.turnoActual = 'MAGO';
        this.energiaMago = Math.min(100, this.energiaMago + 4);
        this.mensajeCombate = this.tintaBaja
          ? 'Te queda poca tinta. Recupérala o usa un hechizo más barato.'
          : 'Tu turno. El diario espera tu siguiente palabra.';
      }

      this.cdr.detectChanges();
    }, this.tiempoContraataque);
  }

  private revisarRecuerdos(): void {
    const nuevos = this.recuerdos.filter(
      (recuerdo) => !recuerdo.revelado && this.saludRival <= recuerdo.umbral,
    );

    if (nuevos.length === 0) return;

    nuevos.forEach((recuerdo) => {
      recuerdo.revelado = true;
      this.registrar('El diario', recuerdo.titulo, recuerdo.texto, 'lore', 'DIARIO');
    });

    const ultimo = nuevos[nuevos.length - 1];
    this.respuestaTom = ultimo.texto;

    if (nuevos.some((recuerdo) => recuerdo.id === 2)) {
      this.nombreRival = 'Tom Marvolo Riddle';
      this.nombreRevelado = true;
    }

    if (this.saludRival > 0) {
      this.mensajeCombate = 'Una página nueva se revela entre la tinta.';
    }
  }

  private ganarDiario(): void {
    this.cancelarTurnoRival();
    this.estadoDuelo = 'VICTORIA';
    this.faseDiario = 'FINAL';
    this.turnoActual = 'MAGO';
    this.turnoRivalPendiente = false;
    this.hechizoRivalPendiente = '';
    this.escudoActivo = false;
    this.mensajeCombate = '';
    this.mensajeFinal =
      'La última página se queda en blanco. El diario pesa menos, como si hubieras sacado algo de dentro. Tom ya no puede escribir.';
  }

  private perderDiario(): void {
    this.cancelarTurnoRival();
    this.estadoDuelo = 'DERROTA';
    this.faseDiario = 'FINAL';
    this.turnoActual = 'MAGO';
    this.turnoRivalPendiente = false;
    this.hechizoRivalPendiente = '';
    this.escudoActivo = false;
    this.mensajeCombate = '';
    this.mensajeFinal = `Tom escribe tu nombre con una letra que no es la tuya. Cuando termina, el diario ya sabe cómo se siente tu mano.`;
  }

  private registrar(
    emisor: string,
    hechizo: string,
    efecto: string,
    tipo: RegistroTurno['tipo'],
    bando: RegistroTurno['bando'],
  ): void {
    this.historialDuelo.unshift({
      id: this.siguienteIdRegistro++,
      turno: this.numeroTurno,
      emisor,
      hechizo,
      efecto,
      tipo,
      bando,
    });

    if (this.historialDuelo.length > 28) {
      this.historialDuelo.pop();
    }
  }

  private cancelarTurnoRival(): void {
    if (this.timeoutRival) {
      clearTimeout(this.timeoutRival);
      this.timeoutRival = null;
    }

    this.turnoRivalPendiente = false;
    this.hechizoRivalPendiente = '';
  }

  ngOnDestroy(): void {
    this.cancelarTurnoRival();
  }
}
