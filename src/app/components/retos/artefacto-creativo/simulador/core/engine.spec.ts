import { CombatEngine } from './engine';
import { decidirAccion } from './ai';
import { CATALOGO } from './catalogo';
import { PERSONAJES } from '../data/characters.data';
import { Combatiente } from './models';

/** Crea un duelo 1 contra 1 con los dos controlados "a mano" y devuelve el motor. */
function duelo(a: string, b: string, semilla = 1, opts: { equipadasA?: string[]; equipadasB?: string[]; manual?: boolean } = {}): CombatEngine {
  return new CombatEngine({
    semilla,
    equipoA: [{ personajeId: a, controlador: 'jugador', equipadas: opts.equipadasA }],
    equipoB: [{ personajeId: b, controlador: 'jugador', equipadas: opts.equipadasB }],
    reaccionManual: opts.manual,
  });
}

/** Pasa turnos defendiendo hasta que le toque al combatiente indicado. */
function turnoDe(m: CombatEngine, id: string): Combatiente {
  let guardia = 0;
  while (m.actor.id !== id && m.fase === 'accion' && guardia++ < 10) m.ejecutar({ tipo: 'defender', actorId: m.actor.id });
  return m.get(id);
}

describe('Motor de combate (Mushoku Tensei)', () => {
  it('una habilidad consume el maná que indica su coste', () => {
    const m = duelo('rudeus-adulto', 'eris', 1, { equipadasA: ['bala-de-roca'] });
    const c = turnoDe(m, 'A0');
    c.mana = 100;
    const h = CATALOGO.find((x) => x.id === 'bala-de-roca')!;
    const r = m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: h.id, objetivoId: 'B0' });
    expect(r.ok).toBeTrue();
    // al final del turno recupera su regeneración de maná
    expect(c.mana).toBe(100 - h.manaCost + c.attr.regenMana);
  });

  it('no se puede lanzar una habilidad sin maná suficiente', () => {
    const m = duelo('rudeus-adulto', 'eris', 1, { equipadasA: ['explosion-nuclear'] });
    const c = turnoDe(m, 'A0');
    c.mana = 1;
    const r = m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: 'explosion-nuclear', objetivoId: 'B0' });
    expect(r.ok).toBeFalse();
    expect(r.motivo).toContain('Maná insuficiente');
    expect(c.mana).toBe(1);
  });

  it('respeta el enfriamiento de una habilidad', () => {
    const m = duelo('rudeus-adulto', 'eris', 1, { equipadasA: ['explosion-nuclear'] });
    turnoDe(m, 'A0');
    expect(m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: 'explosion-nuclear', objetivoId: 'B0' }).ok).toBeTrue();
    const c = turnoDe(m, 'A0');
    const v = m.evaluar(c, { tipo: 'habilidad', actorId: 'A0', habilidadId: 'explosion-nuclear', objetivoId: 'B0' });
    expect(v.usable).toBeFalse();
    expect(v.motivo).toContain('enfriamiento');
  });

  it('una barrera absorbe el daño según su clase', () => {
    const m = duelo('rudeus-adulto', 'eris', 7, { equipadasA: ['escudo-fisico'] });
    const rudeus = turnoDe(m, 'A0');
    m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: 'escudo-fisico', objetivoId: 'A0' });
    expect(rudeus.escudos.some((s) => s.clase === 'fis' && s.valor > 0)).toBeTrue();
    const antes = rudeus.hp;
    let intentos = 0;
    while (!m.eventos.some((e) => e.tipo === 'escudo_absorbe') && intentos++ < 6) {
      turnoDe(m, 'B0');
      m.ejecutar({ tipo: 'golpe', actorId: 'B0', objetivoId: 'A0' });
    }
    expect(m.eventos.some((e) => e.tipo === 'escudo_absorbe')).toBeTrue();
    expect(rudeus.hp).toBe(antes); // el golpe básico no atraviesa una barrera de ese tamaño
  });

  it('un impacto drena maná al objetivo', () => {
    const m = duelo('rudeus-adulto', 'eris', 5, { equipadasA: ['canon-de-piedra'] });
    turnoDe(m, 'A0');
    const rival = m.get('B0');
    const manaAntes = rival.mana;
    let intentos = 0;
    while (rival.mana === manaAntes && intentos++ < 6) {
      turnoDe(m, 'A0');
      m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: 'canon-de-piedra', objetivoId: 'B0' });
    }
    expect(rival.mana).toBeLessThan(manaAntes);
    expect(m.eventos.some((e) => e.tipo === 'dano' && e.msg.includes('pierde'))).toBeTrue();
  });

  it('una curación no supera la salud máxima', () => {
    const m = duelo('rudeus-adulto', 'eris', 1, { equipadasA: ['x-healing'] });
    const c = turnoDe(m, 'A0');
    c.hp = c.attr.hpMax - 5;
    m.ejecutar({ tipo: 'habilidad', actorId: 'A0', habilidadId: 'x-healing', objetivoId: 'A0' });
    expect(c.hp).toBe(c.attr.hpMax);
  });

  it('Perturbar la magia interrumpe magia, a veces falla y no afecta a los golpes físicos', () => {
    let interrumpidas = 0;
    let falladas = 0;
    for (let semilla = 1; semilla <= 60; semilla++) {
      const m = duelo('sylphiette', 'rudeus-adulto', semilla, { equipadasA: ['perturbar-la-magia'], equipadasB: ['canon-de-piedra'], manual: true });
      const sylphy = m.get('A0');
      const lanzador = turnoDe(m, 'B0');
      const vidaAntes = sylphy.hp;
      m.ejecutar({ tipo: 'habilidad', actorId: lanzador.id, habilidadId: 'canon-de-piedra', objetivoId: 'A0' });
      expect(m.fase).toBe('reaccion');
      m.reaccionar('perturbar-la-magia');
      if (m.eventos.some((e) => e.tipo === 'interrumpida')) {
        interrumpidas++;
        expect(sylphy.hp).toBe(vidaAntes); // el hechizo no llegó a producir daño
      } else falladas++;
    }
    expect(interrumpidas).toBeGreaterThan(0);
    expect(falladas).toBeGreaterThan(0);

    const m2 = duelo('sylphiette', 'eris', 3, { equipadasA: ['perturbar-la-magia'], manual: true });
    turnoDe(m2, 'B0');
    m2.ejecutar({ tipo: 'golpe', actorId: 'B0', objetivoId: 'A0' });
    expect(m2.fase).not.toBe('reaccion');
    const v = m2.evaluar(m2.get('A0'), { tipo: 'habilidad', actorId: 'A0', habilidadId: 'perturbar-la-magia', objetivoId: 'B0' });
    expect(v.usable).toBeFalse(); // solo sirve como reacción
  });

  it('el combate termina cuando un bando se queda sin vida', () => {
    const m = duelo('eris', 'roxy', 4);
    m.get('B0').hp = 1;
    let guardia = 0;
    while (m.fase !== 'terminado' && guardia++ < 20) {
      const actor = m.actor;
      if (actor.id === 'A0') m.ejecutar({ tipo: 'golpe', actorId: 'A0', objetivoId: 'B0' });
      else m.ejecutar({ tipo: 'defender', actorId: 'B0' });
    }
    expect(m.fase).toBe('terminado');
    expect(m.ganador).toBe('A');
    expect(m.get('B0').hp).toBe(0);
  });

  it('un estado de control hace perder el turno y da inmunidad temporal', () => {
    const m = duelo('eris', 'roxy', 2);
    const objetivo = m.get(m.orden[1]);
    const otro = m.actor;
    m.aplicarEstado(objetivo, otro, 'aturdimiento', 1, 1, true);
    m.ejecutar({ tipo: 'defender', actorId: otro.id });
    expect(m.eventos.some((e) => e.tipo === 'pierde_turno' && e.actorId === objetivo.id)).toBeTrue();
    expect(objetivo.ccInmune).toBeGreaterThan(0);
    expect(m.aplicarEstado(objetivo, otro, 'aturdimiento', 1, 1, false)).toBeUndefined();
  });

  it('la IA solo elige acciones válidas y habilidades de su personaje', () => {
    for (const a of PERSONAJES) {
      for (const b of PERSONAJES) {
        if (a.id === b.id) continue;
        const m = new CombatEngine({ semilla: 11, equipoA: [{ personajeId: a.id, controlador: 'ia' }], equipoB: [{ personajeId: b.id, controlador: 'ia' }] });
        let pasos = 0;
        while (m.fase !== 'terminado' && pasos++ < 200) {
          if (m.fase === 'reaccion') { m.reaccionar(null); continue; }
          const actor = m.actor;
          const acc = decidirAccion(m, actor);
          expect(m.evaluar(actor, acc).usable).toBeTrue();
          if (acc.tipo === 'habilidad') {
            expect(actor.equipadas).toContain(acc.habilidadId);
            expect(actor.def.habilidades).toContain(acc.habilidadId);
          }
          m.ejecutar(acc);
        }
        expect(m.fase).toBe('terminado');
      }
    }
  });

  it('con la misma semilla y configuración el combate es idéntico', () => {
    const crear = () => new CombatEngine({ semilla: 4242, equipoA: [{ personajeId: 'rudeus-adulto', controlador: 'ia' }], equipoB: [{ personajeId: 'orsted', controlador: 'ia' }] });
    const a = crear(); const b = crear();
    a.simular(); b.simular();
    expect(a.eventos.map((e) => e.msg)).toEqual(b.eventos.map((e) => e.msg));
    expect(a.ganador).toBe(b.ganador);
  });

  it('todas las habilidades jugables del catálogo tienen un efecto real', () => {
    for (const h of CATALOGO.filter((x) => x.jugable)) expect(h.efectos.length).toBeGreaterThan(0);
    expect(CATALOGO.filter((x) => x.categoria !== 'Combate físico').length).toBe(79);
  });
});
