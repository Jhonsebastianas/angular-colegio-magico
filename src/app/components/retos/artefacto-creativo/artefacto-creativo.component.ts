import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
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

export interface HabilidadUlti {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Sanacion';
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

type TipoEfecto = 'potencia' | 'barrera' | 'flujo' | 'vulnerabilidad' | 'debilidad' | 'maldicion';

interface EfectoCombate {
  tipo: TipoEfecto;
  categoria: 'buff' | 'debuff';
  nombre: string;
  descripcion: string;
  turnosRestantes: number;
}

interface EfectoFlotante {
  id: number;
  personaje: 'mago' | 'rival';
  texto: string;
  tipo: 'damage' | 'heal' | 'buff' | 'debuff' | 'shield';
}

@Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);

  // =========================================================================
  // 🎨 RETO 7: EL LIENZO CREATIVO (30% DE LA CALIFICACIÓN)
  // =========================================================================
  // EJEMPLO ILUSTRATIVO: "El Simulador de Duelos del Club de Duelo de Hogwarts"
  // Los estudiantes pueden personalizar este simulador o construir su propio
  // artefacto mágico interactivo (ej: Mapa del Merodeador, Tienda de Ollivander,
  // Herbario Mágico) cumpliendo la rúbrica de evaluación.

  // 1. Estado Interactivo (Jugador vs Rival)
  nombreMago: string = 'Harry Potter';
  saludMago: number = 100;
  energiaMago: number = 100;

  nombreRival: string = 'Draco Malfoy';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Estado general del duelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA'
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false;
  habilidadSecretaDesbloqueada: boolean = false;
  habilidadSecretaUsada: boolean = false;
  tipoDesbloqueoUlti: 'energia' | 'vida' | null = null;
  defensaReducidaSiguienteAtaque: boolean = false;
  escudoSiguienteAtaque: boolean = false;
  readonly recuperacionEnergia = 25;
  readonly accionesParaUltis = 6;
  contadorHabilidades = 0;
  readonly cooldownNormalTurnos = 2;
  cooldownHechizos: Record<number, number> = {};
  efectoActivo: EfectoCombate | null = null;
  efectosFlotantes: EfectoFlotante[] = [];
  private siguienteEfectoId = 0;
  private temporizadoresEfectos = new Map<number, ReturnType<typeof setTimeout>>();
  private temporizadorTurnoRival: ReturnType<typeof setTimeout> | null = null;
  turnoRivalPendiente = false;

  get ultisDesbloqueadas(): boolean {
    return this.contadorHabilidades >= this.accionesParaUltis;
  }

  get energiaMaxima(): number {
    return this.tipoDesbloqueoUlti === 'vida' ? 120 : 100;
  }

  // Grimorio de hechizos disponibles para el aprendiz
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Expelliarmus', tipo: 'Ataque', poder: 25, costoEnergia: 20, descripcion: 'Desarma al oponente con un rayo rojo escarlata.' },
    { id: 2, nombre: 'Protego', tipo: 'Defensa', poder: 30, costoEnergia: 15, descripcion: 'Crea un escudo mágico que absorbe el siguiente impacto.' },
    { id: 3, nombre: 'Episkey', tipo: 'Sanacion', poder: 20, costoEnergia: 25, descripcion: 'Restaura vitalidad y cura heridas menores.' },
    { id: 4, nombre: 'Stupefy', tipo: 'Ataque', poder: 35, costoEnergia: 35, descripcion: 'Aturde al rival con una potente onda expansiva.' }
  ];

  habilidadesUlti: HabilidadUlti[] = [
    { id: 1, nombre: 'Nova Arcana', tipo: 'Ataque', poder: 60, costoEnergia: 70, descripcion: 'Desata una explosión de energía arcana contra el rival.' },
    { id: 2, nombre: 'Renacer del Fénix', tipo: 'Sanacion', poder: 45, costoEnergia: 60, descripcion: 'Recupera una gran cantidad de vitalidad.' },
    { id: 3, nombre: 'Eclipse Mágico', tipo: 'Ataque', poder: 80, costoEnergia: 90, descripcion: 'Concentra toda la energía en un poderoso impacto.' }
  ];

  historialDuelo: RegistroTurno[] = [];

  // 2. Lifecycle Hook: ngOnInit
  ngOnInit(): void {
    this.prepararPartida();
    console.log('🎨 Reto 7: Artefacto Creativo montado en el Gran Salón.');
  }

  private prepararPartida(): void {
    this.cancelarTurnoRivalPendiente();
    this.limpiarEfectosVisuales();
    this.estadoDuelo = 'PREPARACION';
    this.numeroTurno = 1;
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.habilidadSecretaDesbloqueada = false;
    this.habilidadSecretaUsada = false;
    this.tipoDesbloqueoUlti = null;
    this.defensaReducidaSiguienteAtaque = false;
    this.escudoSiguienteAtaque = false;
    this.contadorHabilidades = 0;
    this.cooldownHechizos = {};
    this.efectoActivo = null;
    this.historialDuelo = [{
      turno: 0,
      emisor: 'Profesor Flitwick',
      hechizo: 'Grimorio preparado',
      efecto: 'Elige los nombres de los duelistas y pulsa «Iniciar partida».',
      tipo: 'shield'
    }];
  }

  // 3. Iniciar Duelo
  iniciarDuelo(): void {
    this.cancelarTurnoRivalPendiente();
    this.limpiarEfectosVisuales();
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.habilidadSecretaDesbloqueada = false;
    this.habilidadSecretaUsada = false;
    this.tipoDesbloqueoUlti = null;
    this.defensaReducidaSiguienteAtaque = false;
    this.escudoSiguienteAtaque = false;
    this.contadorHabilidades = 0;
    this.cooldownHechizos = {};
    this.efectoActivo = null;
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

  // 4. Lanzar Hechizo del Jugador
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO' || this.turnoRivalPendiente) return;
    if (this.energiaMago < hechizo.costoEnergia) return;
    if (this.getCooldownRestante(hechizo) > 0) return;

    this.aplicarBuffDeFlujo();
    this.contadorHabilidades++;
    this.energiaMago -= hechizo.costoEnergia;
    if (hechizo.tipo === 'Sanacion' || hechizo.tipo === 'Defensa') {
      this.cooldownHechizos[hechizo.id] = this.numeroTurno + this.cooldownNormalTurnos;
    }
    this.verificarDesbloqueoUltiPorEnergia();
    this.mostrarEfectoVisual('mago', hechizo.nombre, hechizo.tipo === 'Ataque' ? 'damage' : hechizo.tipo === 'Sanacion' ? 'heal' : 'shield');

    if (hechizo.tipo === 'Ataque') {
      const dano = this.calcularDanoJugador(hechizo.poder);
      this.saludRival = Math.max(0, this.saludRival - dano);
      this.mostrarEfectoVisual('rival', `-${dano} vida`, 'damage');
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `¡Impacto directo! Causa ${dano} puntos de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      this.mostrarEfectoVisual('mago', `+${hechizo.poder} vida`, 'heal');
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Cura mágica: Restaura ${hechizo.poder} puntos de vitalidad.`,
        tipo: 'heal'
      });
    } else {
      this.escudoSiguienteAtaque = true;
      this.mostrarEfectoVisual('mago', '¡Protego activo!', 'shield');
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: 'Protego bloquea por completo el siguiente ataque del rival.',
        tipo: 'shield'
      });
    }

    // Verificar si el rival cayó
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    // Respuesta del Rival (IA Simulada)
    this.turnoRival();
  }

  getCooldownRestante(hechizo: HechizoDuelo): number {
    return Math.max(0, (this.cooldownHechizos[hechizo.id] ?? 0) - this.numeroTurno);
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    if (this.turnoRivalPendiente || this.estadoDuelo !== 'EN_CURSO') return;
    this.turnoRivalPendiente = true;
    this.temporizadorTurnoRival = setTimeout(() => {
      this.temporizadorTurnoRival = null;
      this.turnoRivalPendiente = false;
      this.changeDetector.markForCheck();
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['Serpensortia', 'Tarantallegra', 'Rictusempra', 'Flipendo'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoBase = Math.floor(Math.random() * 20) + 10;
      const ataqueBloqueado = this.escudoSiguienteAtaque;
      let danoRival = ataqueBloqueado
        ? 0
        : this.defensaReducidaSiguienteAtaque
          ? Math.ceil(danoBase * 1.05)
          : danoBase;
      this.escudoSiguienteAtaque = false;
      this.defensaReducidaSiguienteAtaque = false;
      if (!ataqueBloqueado && this.efectoActivo?.tipo === 'barrera') {
        danoRival = Math.ceil(danoRival * 0.75);
      }
      if (!ataqueBloqueado && this.efectoActivo?.tipo === 'vulnerabilidad') {
        danoRival = Math.ceil(danoRival * 1.25);
      }

      this.energiaRival = Math.max(0, this.energiaRival - 15);
      this.saludMago = Math.max(0, this.saludMago - danoRival);
      this.numeroTurno++;
      this.mostrarEfectoVisual('rival', elegido, 'damage');
      this.mostrarEfectoVisual(
        'mago',
        ataqueBloqueado ? '¡Ataque bloqueado!' : `-${danoRival} vida`,
        ataqueBloqueado ? 'shield' : 'damage'
      );

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: ataqueBloqueado
          ? `¡Protego bloquea el ataque ${elegido}! No recibes daño.`
          : `¡El rival contraataca con ${elegido}! Te causa ${danoRival} de daño${danoRival > danoBase ? ' (incluye 5% extra por defensa reducida)' : ''}.`,
        tipo: ataqueBloqueado ? 'shield' : 'damage'
      });

      if (this.efectoActivo?.tipo === 'maldicion') {
        this.saludMago = Math.max(0, this.saludMago - 8);
        this.historialDuelo.unshift({
          turno: this.numeroTurno,
          emisor: 'Maldición arcana',
          hechizo: this.efectoActivo.nombre,
          efecto: 'La maldición te drena 8 puntos de vida.',
          tipo: 'damage'
        });
        this.mostrarEfectoVisual('mago', '-8 vida', 'debuff');
      }

      if (this.saludRival <= 0) {
        this.estadoDuelo = 'VICTORIA';
        return;
      }

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      } else if (this.saludMago <= 10 && this.tipoDesbloqueoUlti !== 'vida' && !this.habilidadSecretaUsada) {
        this.habilidadSecretaDesbloqueada = true;
        this.tipoDesbloqueoUlti = 'vida';
        this.energiaMago = 120;
        this.historialDuelo.unshift({
          turno: this.numeroTurno,
          emisor: this.nombreMago,
          hechizo: 'Despertar del Fénix',
          efecto: '¡Habilidad secreta desbloqueada! Tu energía llega al 120% y la ulti causa 60 puntos de daño.',
          tipo: 'heal'
        });
      }

      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(this.energiaMaxima, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 10);
        this.consumirTurnoEfecto();
      }
      this.changeDetector.markForCheck();
    }, 600);
  }

  // 6. Alternar ambientación de la arena
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    this.cancelarTurnoRivalPendiente();
    this.limpiarEfectosVisuales();
    console.log('🎨 Reto 7: Artefacto Creativo desmontado y recursos limpiados.');
  }

  lanzarHabilidadUlti(ulti: HabilidadUlti): void {
    if (
      this.estadoDuelo !== 'EN_CURSO' ||
      this.turnoRivalPendiente ||
      !this.ultisDesbloqueadas ||
      this.energiaMago < ulti.costoEnergia
    ) return;
    this.aplicarBuffDeFlujo();
    this.contadorHabilidades++;
    this.energiaMago -= ulti.costoEnergia;
    this.verificarDesbloqueoUltiPorEnergia();
    this.mostrarEfectoVisual('mago', ulti.nombre, ulti.tipo === 'Ataque' ? 'damage' : 'heal');

    if (ulti.tipo === 'Ataque') {
      const dano = this.calcularDanoJugador(ulti.poder);
      this.saludRival = Math.max(0, this.saludRival - dano);
      this.mostrarEfectoVisual('rival', `-${dano} vida`, 'damage');
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: ulti.nombre,
        efecto: `¡Habilidad definitiva! Causa ${dano} puntos de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else {
      this.saludMago = Math.min(100, this.saludMago + ulti.poder);
      this.mostrarEfectoVisual('mago', `+${ulti.poder} vida`, 'heal');
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: ulti.nombre,
        efecto: `¡Habilidad definitiva! Recuperas ${ulti.poder} puntos de vitalidad.`,
        tipo: 'heal'
      });
    }

    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    this.turnoRival();
  }

  activarUltiSecreta(): void {
    if (
      this.estadoDuelo !== 'EN_CURSO' ||
      this.turnoRivalPendiente ||
      !this.ultisDesbloqueadas ||
      !this.habilidadSecretaDesbloqueada ||
      this.habilidadSecretaUsada
    ) {
      return;
    }

    this.aplicarBuffDeFlujo();
    this.contadorHabilidades++;
    this.habilidadSecretaUsada = true;
    const poderBase = this.tipoDesbloqueoUlti === 'vida' ? 60 : 40;
    const poder = this.calcularDanoJugador(poderBase);
    this.saludRival = Math.max(0, this.saludRival - poder);
    this.mostrarEfectoVisual('mago', 'Despertar del Fénix', 'damage');
    this.mostrarEfectoVisual('rival', `-${poder} vida`, 'damage');
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: this.nombreMago,
      hechizo: 'Despertar del Fénix',
      efecto: `¡Ulti secreta! Causa ${poder} puntos de daño a ${this.nombreRival}.`,
      tipo: 'damage'
    });

    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    this.turnoRival();
  }

  private verificarDesbloqueoUltiPorEnergia(): void {
    const sinEnergiaParaHechizos = this.hechizosDuelo
      .every(habilidad => this.energiaMago < habilidad.costoEnergia);

    if (sinEnergiaParaHechizos && !this.habilidadSecretaDesbloqueada) {
      this.habilidadSecretaDesbloqueada = true;
      this.tipoDesbloqueoUlti = 'energia';
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: 'Despertar del Fénix',
        efecto: '¡Habilidad secreta desbloqueada por baja energía! La ulti causa 40 puntos de daño.',
        tipo: 'damage'
      });
    }
  }

  regenerarEnergia(): void {
    if (
      this.estadoDuelo !== 'EN_CURSO' ||
      this.turnoRivalPendiente ||
      this.energiaMago >= this.energiaMaxima
    ) return;

    this.aplicarBuffDeFlujo();
    this.contadorHabilidades++;
    const energiaRecuperada = Math.min(
      this.recuperacionEnergia,
      this.energiaMaxima - this.energiaMago
    );
    this.energiaMago += energiaRecuperada;
    this.defensaReducidaSiguienteAtaque = true;
    this.mostrarEfectoVisual('mago', `+${energiaRecuperada} energía`, 'heal');
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: this.nombreMago,
      hechizo: 'Canalización de energía',
      efecto: `Recuperas ${energiaRecuperada} de energía, pero tu defensa queda reducida un 5% hasta el siguiente ataque.`,
      tipo: 'heal'
    });

    this.turnoRival();
  }

  lanzarAzarArcano(): void {
    if (
      this.estadoDuelo !== 'EN_CURSO' ||
      this.turnoRivalPendiente ||
      this.efectoActivo !== null
    ) return;

    const efectos: Omit<EfectoCombate, 'turnosRestantes'>[] = [
      { tipo: 'potencia', categoria: 'buff', nombre: 'Potencia arcana', descripcion: 'Tus ataques hacen 25% más daño durante 2 turnos.' },
      { tipo: 'barrera', categoria: 'buff', nombre: 'Barrera etérea', descripcion: 'Recibes 25% menos daño durante 2 turnos.' },
      { tipo: 'flujo', categoria: 'buff', nombre: 'Flujo mágico', descripcion: 'Recuperas 10 de energía al actuar durante 2 turnos.' },
      { tipo: 'vulnerabilidad', categoria: 'debuff', nombre: 'Vulnerabilidad', descripcion: 'Recibes 25% más daño durante 2 turnos.' },
      { tipo: 'debilidad', categoria: 'debuff', nombre: 'Debilidad arcana', descripcion: 'Tus ataques hacen 25% menos daño durante 2 turnos.' },
      { tipo: 'maldicion', categoria: 'debuff', nombre: 'Maldición persistente', descripcion: 'Pierdes 8 puntos de vida al final de tus próximos 2 turnos.' }
    ];

    this.efectoActivo = {
      ...efectos[Math.floor(Math.random() * efectos.length)],
      turnosRestantes: 2
    };
    this.contadorHabilidades++;
    const esBuff = this.efectoActivo.categoria === 'buff';
    this.mostrarEfectoVisual('mago', this.efectoActivo.nombre, esBuff ? 'buff' : 'debuff');
    this.historialDuelo.unshift({
      turno: this.numeroTurno,
      emisor: this.nombreMago,
      hechizo: 'Azar arcano',
      efecto: `${esBuff ? 'Buff' : 'Debuff'}: ${this.efectoActivo.descripcion}`,
      tipo: esBuff ? 'shield' : 'damage'
    });

    this.turnoRival();
  }

  get efectosVisualesMago(): EfectoFlotante[] {
    return this.efectosFlotantes.filter(efecto => efecto.personaje === 'mago');
  }

  get efectosVisualesRival(): EfectoFlotante[] {
    return this.efectosFlotantes.filter(efecto => efecto.personaje === 'rival');
  }

  private mostrarEfectoVisual(
    personaje: EfectoFlotante['personaje'],
    texto: string,
    tipo: EfectoFlotante['tipo']
  ): void {
    const id = ++this.siguienteEfectoId;
    this.efectosFlotantes = [
      ...this.efectosFlotantes,
      { id, personaje, texto, tipo }
    ];
    const temporizador = setTimeout(() => {
      this.efectosFlotantes = this.efectosFlotantes.filter(efecto => efecto.id !== id);
      this.temporizadoresEfectos.delete(id);
      this.changeDetector.markForCheck();
    }, 1000);
    this.temporizadoresEfectos.set(id, temporizador);
  }

  private calcularDanoJugador(danoBase: number): number {
    let dano = danoBase;
    if (this.efectoActivo?.tipo === 'potencia') {
      dano = Math.ceil(dano * 1.25);
    }
    if (this.efectoActivo?.tipo === 'debilidad') {
      dano = Math.ceil(dano * 0.75);
    }
    return dano;
  }

  private aplicarBuffDeFlujo(): void {
    if (this.efectoActivo?.tipo !== 'flujo') return;

    const energiaRecuperada = Math.min(10, this.energiaMaxima - this.energiaMago);
    this.energiaMago += energiaRecuperada;
    this.mostrarEfectoVisual('mago', `+${energiaRecuperada} energía`, 'heal');
  }

  private consumirTurnoEfecto(): void {
    if (!this.efectoActivo) return;
    this.efectoActivo.turnosRestantes--;
    if (this.efectoActivo.turnosRestantes <= 0) this.efectoActivo = null;
  }

  private cancelarTurnoRivalPendiente(): void {
    if (this.temporizadorTurnoRival !== null) {
      clearTimeout(this.temporizadorTurnoRival);
      this.temporizadorTurnoRival = null;
    }
    this.turnoRivalPendiente = false;
  }

  private limpiarEfectosVisuales(): void {
    for (const temporizador of this.temporizadoresEfectos.values()) {
      clearTimeout(temporizador);
    }
    this.temporizadoresEfectos.clear();
    this.efectosFlotantes = [];
  }
}