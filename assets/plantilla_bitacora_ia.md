# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz
* **Nombre del Estudiante:** [Nicol Oliveros Gaviria]
* **Usuario de GitHub:** [@nico25-code]
* **Herramientas de IA utilizadas:** [Gemini]

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[imagina que eres un profesor especializado en angular y me estas explicando como hacer este ejercicio paso a paso linea por linea en vs code "Ve a src/app/components/retos/caldero/caldero.component.ts. 
Implementa getPocionesFiltradas(): Pocion[]:
Filtra insensible a mayúsculas/minúsculas en nombre y descripcion según this.filtroTexto.
Filtra por tipoMagia si this.filtroTipoMagia !== 'TODAS'.
Filtra únicamente pociones con nivelPeligro > 7 si this.filtroSoloPeligrosas === true.
Ordena por nivelPeligro de menor a mayor (this.ordenAscendente === true) o de mayor a menor (false).
Implementa calcularEstabilidadCaldero():
Retorna 'CRÍTICO' si hay 2 o más pociones con peligro ≥ 8.
Retorna 'INESTABLE' si hay al menos 1 poción con peligro ≥ 5
 (y menos de 2 críticas).
Retorna 'SEGURO' en caso contrario. necesito implementar la lógica de filtrado y cálculo de estabilidad para el Reto 5 en mi componente caldero.component.ts. Necesito saber como se hace para que getPocionesFiltradas() filtre las pociones de forma insensible a mayúsculas/minúsculas tanto en el nombre como en la descripción según this.filtroTexto, filtre por el tipo de magia si es distinto de 'TODAS', aplique el filtro de pociones peligrosas si this.filtroSoloPeligrosas es verdadero, y finalmente las ordene de menor a mayor o de mayor a menor según this.ordenAscendente. Además, necesito la función calcularEstabilidadCaldero() que retorne 'CRÍTICO' si hay 2 o más pociones con nivel de peligro mayor o igual a 8, 'INESTABLE' si hay al menos 1 poción con nivel mayor o igual a 5, y 'SEGURO' en caso contrario.]
```

### 2. ¿Qué respuesta te entregó la IA?
*Describe brevemente la solución que te propuso:*
- [En principio me dio una respuesta clara com algunas explicaciones de algunas lineas de codigo me mostro una recomendacion de que deberia ir en el codigo y como se supone que deberia funcionar]

### 3. Ajustes y Correcciones Manuales
*¿La solución funcionó a la primera? ¿Qué tuviste que corregir o adaptar para que pasaran las pruebas del Tribunal?*
- [Tuve que darle un contexto de masomenos como era el codigo del tribunal y luego pedirle explicaciones mas a profundidad y de lineas de codigo mas especificas]

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[Profesor necesito implementar la lógica completa del Giratiempo y el control de historial inmutable para el Reto 6 en mi archivo `src/app/components/retos/caldero/caldero.component.ts Necesito que implementes los siguientes métodos y validaciones paso a paso:
guardarEstadoGiratiempo(): Debe verificar si el usuario ha realizado una acción previa de deshacer (Undo) y, de ser así, truncar los estados futuros utilizando `this.historialPasos.slice(0, this.indiceHistorial + 1). Luego, debe realizar una clonación profunda de this.pociones (garantizando que no existan referencias compartidas en memoria) para añadir este nuevo snapshot a this.historialPasos, y finalmente actualizar el puntero asignando this.indiceHistorial = this.historialPasos.length - 1.
puedeDeshacer() y puedeRehacer(): Implementa las funciones booleanas de validación. puedeDeshacer() debe retornar true únicamente si this.indiceHistorial > 0, y puedeRehacer() debe retornar true solo si this.indiceHistorial < this.historialPasos.length - 1.
giratiempoDeshacer() y giratiempoRehacer(): Diseña la lógica de navegación temporal que permita retroceder y avanzar entre los estados del historial, restaurando de forma limpia las copias profundas del snapshot correspondiente según la posición actual del índice.
Por favor, explícame la implementación limpia de cada uno de estos bloques asegurando la inmutabilidad de los datos en Angular.]
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
*Explica qué método te sugirió para clonar el arreglo de pociones sin mutar las referencias originales (ej. map con spread operator, structuredClone, etc.):*
- [la ia me sugirio que hiciera una clonacion profunda o una copia exacta de los datos pero idependiente usando javascript lo que me dijo la ia fue que esto me permitio como tomar una fot de las posicones que tenia para que al momento de usar los metodos deshacer o rehacer los estados que ya tenian antes no se modificaran o quitaran por acidente ]

### 3. Depuración de Errores con la IA
*Si una prueba de Jasmine falló, ¿cómo usaste la IA para encontrar el bug?*
- [Cuando me salia un error copiaba todo el error y le decia a la ia que me explicara que significaba y donde probablemente debia arreglar]

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** [Batalla Magica]
* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - [es una especie de simulador de batallas magicas interactivas por turnos donde el usuario puede personalizar el nombre de su mago elegir su clase tematica lanzar diferentes hechizos ofensivos defensivos o de sanacion gestionando sus puntos de energia y salud en tiempo real y enfrentarse a su rival ademas incluye mensajes emergentes de advertencia en modo peligro y un contador de rachas de vistorias]
* **¿Qué hooks de ciclo de vida implementaste?**
  - [tiene ngOnInit que se utilizo para que al inicio se cargara automaticamente la energia del componente y ngOnDestroy para limpiar y apagar al salirse del componente evitando que se consuma memoria en segundo plano ]
* **¿Qué directivas y enlaces utilizaste?**
  - [utilice @if para el control del flujo de las diferentes pantallas osea ocultar o mostar mensajes segun el estado del juego, @for para hacer automaticamente la lista de hechizos y el historial de turnos, [(ngModel)] para que el usuario pudiera cambiat y personalizar el nombre de su mago]

---

## 💡 Reflexión Crítica del Aprendiz
*¿En qué momentos sentiste que la IA te ahorró tiempo y en qué momentos una mala respuesta te retrasó?*
- [Siento que la ia me fue muy utli me ahorro mucho tiempo y resolvio dudas de forma mas inmediata incluso cuando ni yo misma me entendi que queria preguntar ella me ayudaba a encontrar la respuesta y siento que muchas veces me atraso porque ella me mandaba algo de codigo o de explicaciones que no tenian nada qye ver con el tema.]
