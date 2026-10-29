// GENERADO a partir de «Hechizos mushoku tensei.docx». Nombres, rangos y descripciones: documento.
// Efectos y números: interpretación y balance (ver balance.config.ts), NO son datos oficiales.
import { HabilidadBase } from '../core/models';

export const HABILIDADES_BASE: HabilidadBase[] = [
 {
  "id": "bola-de-agua",
  "nombre": "Bola de agua",
  "descripcion": "Se materializa y lanza una masa de agua.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 3,
    "prob": 0.35
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水弾ウォーターボール"
 },
 {
  "id": "escudo-de-agua",
  "nombre": "Escudo de agua",
  "descripcion": "Crea un chorro de agua desde el suelo formando una pared defensiva.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "mag",
    "fuerza": 1.6,
    "turnos": 3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水盾ウォーターシールド",
  "cd": 1
 },
 {
  "id": "flecha-de-agua",
  "nombre": "Flecha de agua",
  "descripcion": "Lanza un chorro de agua, de unos veinte centímetros de largo, hacia un objetivo.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水矢ウォーターアロー",
  "pot": 0.75,
  "costo": 0.7
 },
 {
  "id": "golpe-de-hielo",
  "nombre": "Golpe de hielo",
  "descripcion": "Golpea a un oponente con un montón de hielo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 2,
    "prob": 0.2
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷撃アイススマッシュ",
  "pot": 1.05
 },
 {
  "id": "hoja-de-hielo",
  "nombre": "Hoja de hielo",
  "descripcion": "Crea una espada hecha de hielo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷刃アイスブレード"
 },
 {
  "id": "canon-de-agua",
  "nombre": "Cañón de agua",
  "descripcion": "Lanza una gran concentración de agua.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 3,
    "prob": 0.5
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水砲"
 },
 {
  "id": "pilar-de-hielo",
  "nombre": "Pilar de hielo",
  "descripcion": "Crea un chorro de hielo que surge del suelo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 2,
    "prob": 0.25
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷柱アイスピラー"
 },
 {
  "id": "cascada",
  "nombre": "Cascada",
  "descripcion": "Crea continuamente un flujo de agua como una cascada real.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "utilidad",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.4
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 4,
    "prob": 0.9
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水滝ウォーターフォール",
  "pot": 0.3,
  "costo": 0.8,
  "cd": 1
 },
 {
  "id": "salpicadura-de-agua",
  "nombre": "Salpicadura de agua",
  "descripcion": "Materializar una enorme cantidad de gotas de agua y bombardear el área que empapa a cualquiera que se encuentre en ella, haciéndolos vulnerables a la congelación.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.5
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 4,
    "prob": 0.95
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "水蒸ウォータースプラッシュ",
  "pot": 0.5,
  "cd": 1
 },
 {
  "id": "descarga-por-inundacion",
  "nombre": "Descarga por inundación",
  "descripcion": "Inundar el suelo con agua. En el Laberinto de Teletransportación, Roxy también usa Descarga de Inundación para evitar que la Hidra Manatita ataque a Paul y Elinalise y arrastrarlos fuera del alcance de la hidra.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.6
   },
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 3,
    "prob": 0.6
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "水流フロードフラッシュ",
  "pot": 0.6,
  "cd": 2
 },
 {
  "id": "campo-de-carambanos",
  "nombre": "Campo de carámbanos",
  "descripcion": "Congela todos los objetos en su área de efecto y es más eficaz contra objetivos mojados.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.8
   },
   {
    "t": "estado",
    "id": "congelacion",
    "turnos": 2,
    "prob": 0.35
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "氷結領域アイシクルフィールド",
  "pot": 0.8,
  "costo": 1.2,
  "cd": 2
 },
 {
  "id": "ruptura-de-carambanos",
  "nombre": "Ruptura de carámbanos",
  "descripcion": "Lanza una andanada de proyectiles de hielo hacia un objetivo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷霜撃アイシクルブレイク",
  "costo": 1.2,
  "cd": 1
 },
 {
  "id": "borde-de-carambanos",
  "nombre": "Borde de carámbanos",
  "descripcion": "Lanza una hoja de hielo en forma de media luna hacia el enemigo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷霜刃アイシクルエッジ",
  "costo": 1.1
 },
 {
  "id": "lanza-de-hielo",
  "nombre": "Lanza de hielo",
  "descripcion": "Hace brotar del suelo una estaca de hielo que empala al enemigo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷槍アイスランサー"
 },
 {
  "id": "tormenta-de-ventisca",
  "nombre": "Tormenta de ventisca",
  "descripcion": "Dispara fragmentos de hielo en todas direcciones.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.3
   },
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 2,
    "prob": 0.5
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "吹雪ブリザードストーム",
  "costo": 1.3,
  "cd": 2
 },
 {
  "id": "chubasco",
  "nombre": "Chubasco",
  "descripcion": "Manipular las nubes para provocar lluvia.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "utilidad",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 5,
    "prob": 1.0
   },
   {
    "t": "limpiar",
    "ids": [
     "quemadura"
    ]
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "大雨スコール",
  "pot": 0,
  "cd": 2
 },
 {
  "id": "cumulonimbo",
  "nombre": "Cumulonimbo",
  "descripcion": "Crea nubes de tormenta y provoca lluvias torrenciales en una amplia zona con ocasionales relámpagos.",
  "categoria": "Agua",
  "elemento": "agua",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 3,
    "prob": 0.9
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "豪雷積層雲キュムロニンバス",
  "cd": 2
 },
 {
  "id": "iluminacion",
  "nombre": "Iluminación",
  "descripcion": "Crea una nube de tormenta como un cumulonimbo y condensa toda la energía en un potente rayo para impactar el objetivo designado.",
  "categoria": "Agua",
  "elemento": "rayo",
  "rango": "Rey",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.25
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "雷光ライトニング",
  "cd": 3
 },
 {
  "id": "cero-absoluto",
  "nombre": "Cero absoluto",
  "descripcion": "Congela una zona muy amplia al instante.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Imperial",
  "rangoFuente": "documento",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "congelacion",
    "turnos": 3,
    "prob": 0.7
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "絶対零度アブソリュート・ゼロ",
  "cd": 4
 },
 {
  "id": "fortaleza-de-hielo",
  "nombre": "Fortaleza de Hielo",
  "descripcion": "Crea una pared de hielo.",
  "categoria": "Hielo",
  "elemento": "hielo",
  "rango": "Desconocido",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "fis",
    "fuerza": 1.8,
    "turnos": 3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "氷砦",
  "cd": 2
 },
 {
  "id": "bola-de-fuego",
  "nombre": "Bola de fuego",
  "descripcion": "Se materializa y lanza una esfera de fuego.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 3,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "火球弾ファイアボール"
 },
 {
  "id": "mano-caliente",
  "nombre": "Mano caliente",
  "descripcion": "Calienta la mano del usuario para crear un efecto de calor. / Rudeus puede usar Mano Caliente para calentarse lo suficiente como para derretir la nieve en su área inmediata y atravesar terrenos nevados, pero no lo suficiente como…",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Elemental",
  "rangoFuente": "balance",
  "funcion": "utilidad",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "limpiar",
    "ids": [
     "congelacion",
     "ralentizado"
    ]
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "灼熱手ヒートハンド",
  "pot": 0,
  "costo": 0.4,
  "cd": 1
 },
 {
  "id": "isla-de-calor",
  "nombre": "Isla de calor",
  "descripcion": "Calienta el entorno circundante",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "utilidad",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "limpiar",
    "ids": [
     "congelacion",
     "ralentizado",
     "mojado"
    ]
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "地熱ヒートアイランド",
  "pot": 0,
  "costo": 0.8,
  "cd": 2
 },
 {
  "id": "lugar-en-llamas",
  "nombre": "Lugar en llamas",
  "descripcion": "Crea una corona de fuego alrededor del usuario, haciendo que cualquiera que se encuentre cerca sea envuelto en llamas.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.8
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 3,
    "prob": 0.7
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "pot": 0.8,
  "cd": 2
 },
 {
  "id": "rebanada-de-llama",
  "nombre": "Rebanada de llama",
  "descripcion": "Dispara una hoja de fuego que abrasa y corta al enemigo.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "火断フレイムスライス"
 },
 {
  "id": "echador-de-llama",
  "nombre": "Echador de llama",
  "descripcion": "Ataques con chorro de llamas en una amplia zona.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 3,
    "prob": 0.5
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "火炎放射フレイムスロワー",
  "costo": 1.1,
  "cd": 1
 },
 {
  "id": "pilar-de-llamas",
  "nombre": "Pilar de llamas",
  "descripcion": "Materializa una columna de fuego.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.15
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 3,
    "prob": 0.4
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "火柱フフレイムピラー",
  "cd": 1
 },
 {
  "id": "explosion",
  "nombre": "Explosión",
  "descripcion": "Crea una explosión.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "爆発エクスプロージョン",
  "pot": 1.15,
  "costo": 1.1,
  "cd": 1
 },
 {
  "id": "ex-flame",
  "nombre": "Ex-Flame",
  "descripcion": "Lanza una gran bola de fuego de unos 2 metros de diámetro.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.15
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 2,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "大火球エクスフレイム",
  "pot": 1.1
 },
 {
  "id": "llama-del-exodo",
  "nombre": "Llama del Éxodo",
  "descripcion": "El hechicero reúne una gran ola de llamas y luego la libera, la cual explota al impactar. El inmenso calor de la Llama del Éxodo también puede causar quemaduras debido a la proximidad del hechicero a las llamas al canalizar.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 4,
    "prob": 0.75
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "獄炎火弾エクゾダスフレイム",
  "pot": 1.1,
  "costo": 1.2,
  "cd": 2
 },
 {
  "id": "sobreexposicion",
  "nombre": "Sobreexposición",
  "descripcion": "Propaga las llamas instantáneamente sobre una zona muy amplia.",
  "categoria": "Fuego",
  "elemento": "fuego",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.3
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 4,
    "prob": 0.8
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "閃光炎フラッシュオーバー",
  "costo": 1.3,
  "cd": 3
 },
 {
  "id": "explosion-sonica",
  "nombre": "Explosión sónica",
  "descripcion": "Lanza una cuchilla de viento cortante hacia adelante y arroja el objetivo lejos.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.12
   }
  ],
  "usuariosDoc": [
   "Sylphiette"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "真空波ソニックブーム"
 },
 {
  "id": "rebanada-de-viento",
  "nombre": "Rebanada de viento",
  "descripcion": "Lanza una ráfaga de viento cortante.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "風裂ウインドスライス",
  "costo": 0.9
 },
 {
  "id": "enlace-de-viento",
  "nombre": "Enlace de viento",
  "descripcion": "Libera un látigo de viento que inmoviliza a un enemigo.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.4
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 2,
    "prob": 0.8
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "nombreJp": "ウインドバインド",
  "pot": 0.4,
  "costo": 0.9,
  "cd": 1
 },
 {
  "id": "rafaga-de-viento",
  "nombre": "Ráfaga de viento",
  "descripcion": "Libera una ráfaga de viento fuerte. En el episodio El bosque en la oscuridad de la noche, Rudeus usa una ráfaga de viento para evitar ser golpeado por un ataque.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Elemental",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.6
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "強風ウインドブラスト",
  "pot": 0.6,
  "costo": 0.6
 },
 {
  "id": "explosion-sonica-avanzada",
  "nombre": "Explosión sónica avanzada",
  "descripcion": "Versión mejorada de Sonic Boom que lanza una onda expansiva potente y de amplio alcance.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.25
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.25
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "爆音衝撃波ソニックブーム",
  "costo": 1.2,
  "cd": 1
 },
 {
  "id": "impacto-del-tornado",
  "nombre": "Impacto del tornado",
  "descripcion": "Transforma el viento en un taladro que gira rápidamente y perfora el objetivo.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "costo": 1.1,
  "cd": 1
 },
 {
  "id": "tormenta-violenta",
  "nombre": "Tormenta violenta",
  "descripcion": "Desata una fuerte ráfaga de viento sobre una amplia zona.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "颶風バイオレントストーム",
  "costo": 1.2,
  "cd": 3
 },
 {
  "id": "tornado",
  "nombre": "Tornado",
  "descripcion": "Crea un tornado que puede alterar el clima moviendo las nubes y puede cancelar una tormenta de ventisca aunque alterar el clima no es aconsejable por los maestros de magia.",
  "categoria": "Viento",
  "elemento": "viento",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "竜巻トルネード",
  "costo": 1.2,
  "cd": 3
 },
 {
  "id": "bala-de-roca",
  "nombre": "Bala de roca",
  "descripcion": "Materializa una roca del tamaño de una bala para impactar un objetivo.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "石弾ロックブレット"
 },
 {
  "id": "nube-de-arena",
  "nombre": "Nube de arena",
  "descripcion": "Materializa una bala de tierra que viaja hacia un objetivo y explota, provocando que aparezca una nube de arena en su área que causa dificultad para respirar y reduce la visibilidad.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Elemental",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.6
   },
   {
    "t": "estado",
    "id": "cegado",
    "turnos": 3,
    "prob": 0.7
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "pot": 0.6,
  "costo": 0.8,
  "cd": 1
 },
 {
  "id": "canon-de-piedra",
  "nombre": "Cañón de piedra",
  "descripcion": "Materializa y lanza un trozo de roca con forma de bala a alta velocidad.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.15
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "岩砲弾ストーンキャノン",
  "pot": 1.05
 },
 {
  "id": "fortaleza-de-tierra",
  "nombre": "Fortaleza de Tierra",
  "descripcion": "Crea una fortaleza de tierra alrededor del usuario.. La Fortaleza de Tierra requiere Maná para mantenerse o se derrumbará, pero Rudeus modificó su Fortaleza de Tierra para que tuviera la forma de un iglú que se mantiene unido por…",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "fis",
    "fuerza": 2.2,
    "turnos": 4
   }
  ],
  "usuariosDoc": [
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "土砦アースフォートレス",
  "costo": 1.3,
  "cd": 3
 },
 {
  "id": "muro-de-tierra",
  "nombre": "Muro de tierra",
  "descripcion": "Crea un muro de tierra en un área objetivo",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "fis",
    "fuerza": 1.4,
    "turnos": 3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "土壁アースウォール",
  "costo": 0.9,
  "cd": 1
 },
 {
  "id": "pilar-de-tierra",
  "nombre": "Pilar de Tierra",
  "descripcion": "Invoca una roca sobre el objetivo para que caiga sobre él.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "土落弾アースピラー"
 },
 {
  "id": "lanza-de-tierra",
  "nombre": "Lanza de tierra",
  "descripcion": "Invoca una estaca de tierra que emerge del suelo. El usuario también puede invocar una versión plana para impulsarse hacia arriba o para usarla como ascensor. o como torre de vigilancia para explorar la zona enemiga.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.15
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "土槍アースランサー"
 },
 {
  "id": "erizo-terrestre",
  "nombre": "Erizo terrestre",
  "descripcion": "Invoca una gran cantidad de púas de tierra del suelo para empalar a los enemigos.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.25
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 1,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "土針鼠アースヘッジホグ",
  "pot": 1.1,
  "costo": 1.1,
  "cd": 1
 },
 {
  "id": "tormenta-de-polvo",
  "nombre": "tormenta de polvo",
  "descripcion": "Evoca una tormenta de polvo.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.4
   },
   {
    "t": "estado",
    "id": "cegado",
    "turnos": 3,
    "prob": 0.8
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "砂塵嵐ダストストーム",
  "pot": 0.4,
  "cd": 2
 },
 {
  "id": "tempestad-de-arena",
  "nombre": "Tempestad de arena",
  "descripcion": "Evoca un feroz torrente de arena y viento que cubre una amplia zona, o detiene una tormenta de arena existente.",
  "categoria": "Tierra",
  "elemento": "tierra",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   },
   {
    "t": "estado",
    "id": "cegado",
    "turnos": 3,
    "prob": 0.9
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "砂嵐サンドストーム",
  "costo": 1.2,
  "cd": 3
 },
 {
  "id": "niebla-profunda",
  "nombre": "Niebla profunda",
  "descripcion": "Genera niebla sobre un área para ocultar al usuario de los enemigos.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "apoyo",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "estado",
    "id": "oculto",
    "turnos": 3,
    "prob": 1.0,
    "sobreSi": true
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "濃霧ディープミスト",
  "pot": 0,
  "costo": 1.2,
  "cd": 3
 },
 {
  "id": "chorro-de-magma",
  "nombre": "Chorro de magma",
  "descripcion": "Crea un estallido espontáneo de lava.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.2
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 3,
    "prob": 0.6
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 1,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "溶岩マグマガッシュ",
  "costo": 1.2,
  "cd": 2
 },
 {
  "id": "quagmire",
  "nombre": "Quagmire",
  "descripcion": "Convierte el suelo en un lodazal que inmoviliza al enemigo. Debido a que Rudeus lo usaba principalmente en sus aventuras, se le conoció como \"Quagmire\".",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 0.4
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 3,
    "prob": 0.85
   },
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 3,
    "prob": 0.8
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "泥沼",
  "pot": 0.3,
  "costo": 1.1,
  "cd": 2
 },
 {
  "id": "bora-blast",
  "nombre": "Bora Blast",
  "descripcion": "Libera una fuerte ráfaga de viento helado para incapacitar al enemigo.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   },
   {
    "t": "estado",
    "id": "congelacion",
    "turnos": 1,
    "prob": 0.45
   },
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 2,
    "prob": 0.6
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "寒冷突風ボラブラスト",
  "costo": 1.2,
  "cd": 2
 },
 {
  "id": "frost-nova",
  "nombre": "Frost Nova",
  "descripcion": "Empapa a los enemigos con gotas de agua y los congela. Cuanto más maná se use, más se puede congelar a los afectados, incluso hasta lo más profundo de su ser.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 3,
    "prob": 0.9
   },
   {
    "t": "estado",
    "id": "congelacion",
    "turnos": 2,
    "prob": 0.6
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Roxy Migurdia"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "フロストノヴァ",
  "costo": 1.3,
  "cd": 3
 },
 {
  "id": "lluvia-de-barro",
  "nombre": "Lluvia de barro",
  "descripcion": "Crear lluvia que contenga lodo, lo que provoca que el suelo esté resbaladizo y suelto.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "estado",
    "id": "ralentizado",
    "turnos": 3,
    "prob": 0.8
   },
   {
    "t": "estado",
    "id": "mojado",
    "turnos": 3,
    "prob": 0.8
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "泥雨",
  "pot": 0,
  "costo": 1.1,
  "cd": 2
 },
 {
  "id": "explosion-de-viento-caliente",
  "nombre": "Explosión de viento caliente",
  "descripcion": "Al usar magia de fuego y viento simultáneamente, dispara una ráfaga de viento caliente.",
  "categoria": "Fusionada",
  "elemento": "fusion",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.25
   },
   {
    "t": "estado",
    "id": "quemadura",
    "turnos": 2,
    "prob": 0.4
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "突風ブラスト",
  "costo": 1.2,
  "cd": 1
 },
 {
  "id": "cicatrizacion",
  "nombre": "Cicatrización",
  "descripcion": "Magia curativa capaz de curar cortes menores.",
  "categoria": "Curativa",
  "elemento": "luz",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "curativa",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "curar",
    "pct": 0.12
   },
   {
    "t": "limpiar",
    "ids": [
     "quemadura"
    ]
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "pot": 0,
  "costo": 0.6
 },
 {
  "id": "x-healing",
  "nombre": "X-Healing",
  "descripcion": "Magia curativa que puede restaurar huesos rotos.",
  "categoria": "Curativa",
  "elemento": "luz",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "curativa",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "curar",
    "pct": 0.22
   },
   {
    "t": "limpiar",
    "ids": [
     "quemadura",
     "inmovilizacion"
    ]
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "documento",
  "pot": 0,
  "cd": 1
 },
 {
  "id": "sanacion-del-brillo",
  "nombre": "Sanación del brillo",
  "descripcion": "Magia curativa capaz de sanar heridas abiertas importantes y volver a unir extremidades recién amputadas, pero no puede restaurar partes del cuerpo perdidas.",
  "categoria": "Curativa",
  "elemento": "luz",
  "rango": "Avanzado",
  "rangoFuente": "documento",
  "funcion": "curativa",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "curar",
    "pct": 0.38
   },
   {
    "t": "limpiar",
    "ids": [
     "quemadura",
     "inmovilizacion",
     "ralentizado"
    ]
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "pot": 0,
  "costo": 1.2,
  "cd": 3
 },
 {
  "id": "luz-exorcista",
  "nombre": "Luz exorcista",
  "descripcion": "Crea un rayo de luz blanca que puede dañar a un espíritu.",
  "categoria": "Golpe divino",
  "elemento": "luz",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.1
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "エクソシストレート",
  "cd": 1
 },
 {
  "id": "escudo-magico",
  "nombre": "Escudo mágico",
  "descripcion": "Conjura una barrera semitransparente que bloquea los ataques mágicos. Tiene el poder de aislar las llamas o el frío y reducir su efecto. Como hechizo de nivel elemental, también puede lanzarse mediante encantamientos,",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Elemental",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "mag",
    "fuerza": 2.0,
    "turnos": 3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "nombreJp": "魔力障壁マジックシールド"
 },
 {
  "id": "escudo-fisico",
  "nombre": "Escudo físico",
  "descripcion": "Conjura una barrera que bloquea los ataques físicos e impide el paso por la zona donde se lanza.",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Intermedio",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "escudo",
    "clase": "fis",
    "fuerza": 2.0,
    "turnos": 3
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "物理障壁フィジカルシールド",
  "cd": 1
 },
 {
  "id": "barrera-de-sellado-de-espiritus",
  "nombre": "Barrera de sellado de espíritus",
  "descripcion": "La barrera que impide que los monstruos no muertos abandonen un espacio confinado. Puede que no sea capaz de confinar por completo a un espectro de alto nivel.",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Smo.",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "Requiere enemigos no muertos o espectros, que no existen en esta versión."
 },
 {
  "id": "barrera-de-confinamiento",
  "nombre": "Barrera de confinamiento",
  "descripcion": "La barrera que confina al individuo objetivo en su interior. La magia se vuelve inutilizable dentro de ella, y es altamente resistente a los ataques físicos y mágicos del exterior.",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Rey",
  "rangoFuente": "documento",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "estado",
    "id": "silencio",
    "turnos": 3,
    "prob": 0.8
   },
   {
    "t": "estado",
    "id": "inmovilizacion",
    "turnos": 2,
    "prob": 0.6
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "documento",
  "cd": 5
 },
 {
  "id": "barrera-de-sellado-de-badigadi",
  "nombre": "Barrera de sellado de Badigadi",
  "descripcion": "La barrera desarrollada por Perugius para sellar al Dios Demonio. Se alimenta del maná de Badigadi y se amplifica mediante la Espada del Rey Dragón Kajakut y la Armadura del Dios de la Lucha.",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Divino",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "Requiere al Dios Demonio Badigadi y la Espada del Rey Dragón Kalmat."
 },
 {
  "id": "barrera-de-ilusion",
  "nombre": "Barrera de ilusión",
  "descripcion": "La Barrera de Ilusión es utilizada por la Tribu Dragón para proteger las Ruinas del Círculo de Teletransportación en todo el Mundo Humano de los forasteros, ocultando su entrada con una ilusión que crea un escenario diferente y se…",
  "categoria": "Barrera",
  "elemento": "neutral",
  "rango": "Desconocido",
  "rangoFuente": "documento",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "Es una barrera pasiva de la Tribu Dragón; el documento no indica su rango."
 },
 {
  "id": "puerta-del-dragon",
  "nombre": "Puerta del Dragón",
  "descripcion": "Invoca una puerta grabada con una estatua de dragón ornamentada que es de color plata para absorber poder mágico o de color oro que absorbe Aura de Batalla.",
  "categoria": "Invocación",
  "elemento": "neutral",
  "rango": "Rey",
  "rangoFuente": "balance",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "estado",
    "id": "absorcion",
    "turnos": 3,
    "prob": 1.0,
    "sobreSi": true
   }
  ],
  "usuariosDoc": [
   "Orsted",
   "Perugius Dola"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "龍門",
  "cd": 4
 },
 {
  "id": "invocacion-de-monstruo",
  "nombre": "Invocación de monstruo",
  "descripcion": "Invoca a una criatura existente en el mundo mediante círculos mágicos. La magia está sujeta a un pacto fundacional que prohíbe la invocación de razas humanoides inteligentes.",
  "categoria": "Invocación",
  "elemento": "neutral",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "invocacion",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "invocar",
    "danio": 0.5,
    "turnos": 4
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Orsted",
   "Perugius Dola"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "魔獣召喚",
  "cd": 4
 },
 {
  "id": "invocacion-de-espiritu",
  "nombre": "Invocación de espíritu",
  "descripcion": "Crea un espíritu a partir del maná del usuario que funciona según su diseño, de forma similar a la programación informática.",
  "categoria": "Invocación",
  "elemento": "neutral",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "invocacion",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "invocar",
    "danio": 0.4,
    "turnos": 5
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Perugius Dola"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "精霊召喚",
  "cd": 4
 },
 {
  "id": "invocacion-de-otro-mundo",
  "nombre": "Invocación de otro mundo",
  "descripcion": "Invoca un objeto u organismo de otro mundo (en particular, de la Tierra). Solo se puede lograr mediante el uso de un círculo mágico de múltiples capas altamente complejo.",
  "categoria": "Invocación",
  "elemento": "neutral",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "invocacion",
  "objetivo": "si_mismo",
  "efectos": [],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "異世界召喚",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "Solo la usa Nanahoshi Shizuka, que no está en el roster."
 },
 {
  "id": "invocar-espiritus-de-luz-de-lampara",
  "nombre": "Invocar espíritus de luz de lámpara",
  "descripcion": "Invoca espíritus radiantes que vuelan y giran alrededor del lanzador para proporcionar luz en áreas oscuras.",
  "categoria": "Invocación",
  "elemento": "luz",
  "rango": "Elemental",
  "rangoFuente": "balance",
  "funcion": "apoyo",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "estado",
    "id": "iluminado",
    "turnos": 4,
    "prob": 1.0,
    "sobreSi": true
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Perugius Dola"
  ],
  "fuenteEfectos": "interpretacion",
  "pot": 0,
  "costo": 0.6,
  "cd": 2
 },
 {
  "id": "perturbar-la-magia",
  "nombre": "Perturbar la magia",
  "descripcion": "Perturbación Mágica cancela la magia de un oponente interrumpiéndola y haciendo que nunca tome forma y se disperse.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Smo.",
  "rangoFuente": "balance",
  "funcion": "especial",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "interrumpir"
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Orsted",
   "Sylphiette"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "乱魔ディスタブ・マジック",
  "pot": 0,
  "costo": 0.9,
  "cd": 3,
  "soloReaccion": true,
  "esMagia": false
 },
 {
  "id": "explosion-nuclear",
  "nombre": "Explosión nuclear",
  "descripcion": "Magia única creada por Rudeus, capaz de crear una explosión muy poderosa.",
  "categoria": "Única",
  "elemento": "fuego",
  "rango": "Imperial",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.35
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "核爆発",
  "cd": 5
 },
 {
  "id": "aullando",
  "nombre": "Aullando",
  "descripcion": "Magia única de la raza bestia que aturde al oponente con un aullido imbuido de magia. Otras razas también podrían usarla, pero sería mucho menos efectiva.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.6
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Orsted"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "声の魔術",
  "pot": 0,
  "costo": 0.8,
  "cd": 3,
  "restriccion": {
   "personajes": [
    "ghislaine"
   ]
  }
 },
 {
  "id": "magia-de-teletransportacion",
  "nombre": "Magia de Teletransportación",
  "descripcion": "Permite al usuario viajar a los sitios correspondientes casi instantáneamente mediante círculos mágicos. Existen tres tipos: círculos bidireccionales, unidireccionales y de teletransportación aleatoria.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "defensiva",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "estado",
    "id": "evasion_total",
    "turnos": 1,
    "prob": 1.0,
    "sobreSi": true
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat",
   "Orsted",
   "Perugius Dola"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "転移魔術",
  "pot": 0,
  "cd": 4
 },
 {
  "id": "electrico",
  "nombre": "Eléctrico",
  "descripcion": "Versión debilitada de Rayo donde Rudeus comprime y controla la nube a un tamaño más pequeño para debilitar la salida del rayo, pero aún lo suficientemente potente como para electrocutar y paralizar a un objetivo con electricidad e…",
  "categoria": "Única",
  "elemento": "rayo",
  "rango": "Avanzado",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "mag",
    "mult": 1.0,
    "ignoraDefensa": true
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.5
   }
  ],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "電撃エレクトリック",
  "cd": 1,
  "nota": "Según el documento, elude la defensa del Aura de Batalla."
 },
 {
  "id": "magia-del-viaje-en-el-tiempo",
  "nombre": "Magia del viaje en el tiempo",
  "descripcion": "Una magia especial derivada de la Magia de Teletransportación que permite al usuario viajar al pasado, utilizando un objeto específico como marcador.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Divino",
  "rangoFuente": "balance",
  "funcion": "especial",
  "objetivo": "si_mismo",
  "efectos": [],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "過去転移魔術",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "Solo la usa el Rudeus del futuro, versión no incluida."
 },
 {
  "id": "magia-de-gravedad",
  "nombre": "Magia de gravedad",
  "descripcion": "Magia que manipula la gravedad, permitiendo a los usuarios volar o levitar objetos.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Rey",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [],
  "usuariosDoc": [
   "Rudeus Greyrat"
  ],
  "fuenteEfectos": "interpretacion",
  "nombreJp": "重力魔術",
  "cd": 1,
  "jugable": false,
  "motivoNoJugable": "La usan el Rudeus del futuro y Kalman III, versiones no incluidas."
 },
 {
  "id": "magia-de-hipnosis",
  "nombre": "Magia de hipnosis",
  "descripcion": "Un hechizo de hipnosis transmitido entre la tribu Nuka que hacía dormir a una persona.",
  "categoria": "Única",
  "elemento": "neutral",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "estado",
    "id": "dormido",
    "turnos": 2,
    "prob": 0.7
   }
  ],
  "usuariosDoc": [
   "Orsted"
  ],
  "fuenteEfectos": "documento",
  "nombreJp": "催眠魔術",
  "pot": 0,
  "cd": 4
 },
 {
  "id": "espadazo",
  "nombre": "Espadazo",
  "descripcion": "Un golpe de espada directo y potente.",
  "categoria": "Combate físico",
  "elemento": "fisico",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "fis",
    "mult": 1.0
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "esMagia": false,
  "interrumpible": false,
  "fuenteDescripcion": "interpretacion",
  "costo": 0.6
 },
 {
  "id": "tajo-veloz",
  "nombre": "Tajo veloz",
  "descripcion": "Un corte rápido con alta precisión que castiga a rivales poco ágiles.",
  "categoria": "Combate físico",
  "elemento": "fisico",
  "rango": "Elemental",
  "rangoFuente": "balance",
  "funcion": "ofensiva",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "fis",
    "mult": 0.9
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "esMagia": false,
  "interrumpible": false,
  "fuenteDescripcion": "interpretacion",
  "pot": 0.85,
  "costo": 0.4
 },
 {
  "id": "embestida",
  "nombre": "Embestida",
  "descripcion": "Un golpe con todo el cuerpo que puede aturdir al rival.",
  "categoria": "Combate físico",
  "elemento": "fisico",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "control",
  "objetivo": "enemigo",
  "efectos": [
   {
    "t": "dano",
    "escala": "fis",
    "mult": 1.1
   },
   {
    "t": "estado",
    "id": "aturdimiento",
    "turnos": 1,
    "prob": 0.3
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "esMagia": false,
  "interrumpible": false,
  "fuenteDescripcion": "interpretacion",
  "costo": 0.7,
  "cd": 2
 },
 {
  "id": "aura-de-batalla",
  "nombre": "Aura de batalla",
  "descripcion": "Envuelve el cuerpo en aura: aumenta el ataque y la defensa físicos durante varios turnos.",
  "categoria": "Combate físico",
  "elemento": "neutral",
  "rango": "Intermedio",
  "rangoFuente": "balance",
  "funcion": "apoyo",
  "objetivo": "si_mismo",
  "efectos": [
   {
    "t": "estado",
    "id": "aura_batalla",
    "turnos": 4,
    "prob": 1.0,
    "sobreSi": true
   }
  ],
  "usuariosDoc": [],
  "fuenteEfectos": "interpretacion",
  "esMagia": false,
  "interrumpible": false,
  "fuenteDescripcion": "interpretacion",
  "pot": 0,
  "costo": 0.8,
  "cd": 4
 }
];
