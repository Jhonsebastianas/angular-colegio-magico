# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz Graudao
* **Nombre del Estudiante:** Nicolas Montoya castro
* **Usuario de GitHub:** montoya-nmc
* **Herramientas de IA utilizadas:** [ ChatGPT-GPT6, GitHub Copilot]

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
Actua como un desarrollador experto en Angular, TypeScript y programacion orientada a componentes. Necesito que resuelvas el RETO 5: TRANSMUTADOR DE ESTADOS Y FILTROS DINAMICOS en el archivo caldero.component.ts de mi proyecto Angular.

Quiero que implementes completamente los dos metodos del Reto 5 que actualmente tienen codigo pendiente:

1) getPocionesFiltradas(): Pocion[]

Debe devolver una copia filtrada y ordenada de this.pociones, cumpliendo estas condiciones:
Búsqueda por texto: utilizar filtroTexto para buscar coincidencias en nombre o descripcion. La búsqueda debe ignorar las mayúsculas y minúsculas y eliminar los espacios sobrantes al principio y al final.
Filtro por tipo de magia: si filtroTipoMagia es diferente de 'TODAS', mostrar únicamente las pociones cuyo tipoMagia coincida con el filtro seleccionado.
Filtro de peligrosidad: si filtroSoloPeligrosas es true, mostrar únicamente las pociones con nivelPeligro > 7.
Ordenamiento: si ordenAscendente es true, ordenar por nivel de peligro de menor a mayor. Si es false, ordenar de mayor a menor.
Filtros combinados: todos los filtros deben funcionar simultaneamente

No modificar el arreglo original: no cambiar directamente el orden ni el contenido de this.pociones. Utilizar una copia para trabajar

2) calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO'

Quiero que trabajes unicamente en los dos metodos del Reto 5, no cambies el HTML, CSS, el modelo Pocion ni las importaciones, no modifiques los retos 1, 3, 4 o 6, no agregues librerias ni dependencias no inventes propiedades que no existan en el modelo usa TypeScript valido y compatible con Angular manten un codigo sencillo, claro y facil de entender para un estudiante de grado 11.
Conserva los nombres de los metodos y las variables existentes y explica brevemente como funciona cada uno, quiero que tengas mucho cuidado y modifiques nunca archivos *.spec.ts; por ningun motivo

```

### 2. ¿Qué respuesta te entregó la IA?
*Describe brevemente la solución que te propuso:*
- [La IA me propuso que en el primero implementara los filtros de busqueda por nombre y descripcion, tipo de magia y nivel de peligrosidad, ademas del ordenamiento ascendente y descendente, sin modificar el arreglo original. En el segundo agrego una logica para calcular la estabilidad del caldero segun la cantidad y el nivel de peligro de las pociones, devolviendo los estados SEGURO, INESTABLE o CRITICO.]

### 3. Ajustes y Correcciones Manuales
*¿La solución funcionó a la primera? ¿Qué tuviste que corregir o adaptar para que pasaran las pruebas del Tribunal?*
- [Funciono a la primera, no tuve que corregir nada para que pasaran los test aparte del npm run test:ci para ver si estaba bien]

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[Actua como un desarrollador experto en Angular, TypeScript y programacion orientada a componentes. Necesito que resuelvas el RETO 5: TRANSMUTADOR DE ESTADOS Y FILTROS DINAMICOS en el archivo caldero.component.ts de mi proyecto Angular.

Quiero que implementes un sistema que permita deshacer y rehacer las modificaciones realizadas en el listado de pociones.

Implementa los siguientes métodos:

guardarEstadoGiratiempo(): Si se hizo undo y se agrega una nueva acción, descarta los estados futuros. Clona profundamente this.pociones y guarda la copia en this.historialPasos. Actualiza this.indiceHistorial para que apunte al último estado.

puedeDeshacer(): Retorna true si this.indiceHistorial > 0; de lo contrario, retorna false.

puedeRehacer(): Retorna true si this.indiceHistorial < this.historialPasos.length - 1; de lo contrario, retorna false.

giratiempoDeshacer(): Si es posible deshacer, retrocede el índice y restaura una copia del estado correspondiente en this.pociones.

giratiempoRehacer(): Si es posible rehacer, avanza el índice y restaura una copia del estado correspondiente en this.pociones.

Quiero que trabajes unicamente en los dos metodos del Reto 5, no cambies el HTML, CSS, el modelo Pocion ni las importaciones, no modifiques los retos 1, 3, 4 o 6, no agregues librerias ni dependencias no inventes propiedades que no existan en el modelo usa TypeScript valido y compatible con Angular manten un codigo sencillo, claro y facil de entender para un estudiante de grado 11.
Conserva los nombres de los metodos y las variables existentes y explica brevemente como funciona cada uno, quiero que tengas mucho cuidado y modifiques nunca archivos *.spec.ts; por ningun motivo

]
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
*Explica qué método te sugirió para clonar el arreglo de pociones sin mutar las referencias originales (ej. map con spread operator, structuredClone, etc.):*
- [La IA me sugirio utilizar JSON.parse(JSON.stringify(...)) para crear una copia profunda del arreglo de pociones ya que esto permite que los cambios realizados no afectan los objetos originales ni los estados guardados en el historial]
    
### 3. Depuración de Errores con la IA
*Si una prueba de Jasmine falló, ¿cómo usaste la IA para encontrar el bug?*
- [Tu experiencia de depuración]

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** [REGEN]

* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - [REGEN es un simulador donde el usuario debe recuperar ecosistemas afectados por problemas ambientales. Puede iniciar diferentes misiones, analizar indicadores como la calidad del agua, la vegetación y la biodiversidad, administrar recursos y realizar acciones como reforestar, limpiar ríos y gestionar residuos. Cada decisión modifica el estado del ecosistema y afecta el resultado de la misión la cual se completa si el objetivo ambiental es alcanzado si pasa lo contrario tendra que hacer otra mision.]

* **¿Qué hooks de ciclo de vida implementaste?**
  - [Implementé ngOnInit para inicializar los datos y preparar la simulación, y ngOnDestroy para limpiar los temporizadores y evitar que sigan ejecutándose cuando se destruye el componente.]

* **¿Qué directivas y enlaces utilizaste?**
  - [Utilicé @if para mostrar diferentes estados de la misión, @for para recorrer los indicadores, acciones y registros, [(ngModel)] para enlazar datos con los controles y enlaces de eventos como (click) para ejecutar acciones del jugador. También utilicé enlaces de propiedades como [ngClass] para cambiar estilos según el estado del ecosistema.]

---

## 💡 Reflexión Crítica del Aprendiz
*¿En qué momentos sentiste que la IA te ahorró tiempo y en qué momentos una mala respuesta te retrasó?*
- [La IA me ahorró tiempo al ayudarme a organizar las ideas, proponer funcionalidades y encontrar soluciones funcionales que si me sirvieron para realizar los retos, aparte que me ayudo a aterrizar la idea que tenia sobre REGEN en el reto 7 ya que aunque sabia lo que queria no sabia muy bien por donde empezar, entonces me ayudo mucho como primeros pasos para ir aterrizando mejor la idea. pero tambien hubieron momentos que la IA me daba algunas respuestas que no se ajustaban completamente a lo que necesitaba o proponia soluciones demasiado complejas que no entendia, entonces me tocaba o volver a iniciar o volver a darle instrucciones. La verdad me sirvio para potenciar mis habilidades y conocimientos para hacer prompts.]
