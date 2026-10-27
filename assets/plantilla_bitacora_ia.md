# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz
* **Nombre del Estudiante:** [Fernando Carmona Chica]
* **Usuario de GitHub:** [@fcarmonachica-ux]
* **Herramientas de IA utilizadas:** [ChatGPT-6, Claude]

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[listo, en este reto que sigue necesito que me ayudes en todo, pero explicame bien como funciona cada cosa porfa. te envio lo que se debe de cumplir en el reto 5 
### 🔍 Reto 5: El Transmutador de Estados (IA Challenge - Dificultad Alta)
* **Archivo:** `components/retos/caldero/caldero.component.ts`
* **Misión:** Implementa el motor de búsqueda multi-criterio (`getPocionesFiltradas()`) y el cálculo reactivo de estabilidad general del caldero (`'SEGURO' | 'INESTABLE' | 'CRÍTICO'`).
tambien te envio lo que se debe de completar: 
// =========================================================================
  // 🔍 RETO 5 (IA CHALLENGE): TRANSMUTADOR DE ESTADOS Y FILTROS DINÁMICOS
  // =========================================================================
  filtroTexto: string = '';
  filtroTipoMagia: string = 'TODAS';
  filtroSoloPeligrosas: boolean = false;
  ordenAscendente: boolean = true;
  // -------------------------------------------------------------------------
  // RETO 5 (IA CHALLENGE): MOTOR DE FILTRADO Y ESTABILIDAD
  // -------------------------------------------------------------------------
  // =========================================================================
  // TODO: Reto 5 - Motor de Búsqueda y Filtros Combinados (Apóyate en la IA)
  // Debe retornar una copia filtrada y ordenada de 'this.pociones':
  // 1. Filtro texto (filtroTexto): Insensible a mayúsculas, coincidencia en nombre o descripción.
  // 2. Filtro tipo de magia (filtroTipoMagia): Si es diferente de 'TODAS', filtrar por tipoMagia.
  // 3. Filtro peligro (filtroSoloPeligrosas): Si es true, solo incluir pociones con nivelPeligro > 7.
  // 4. Ordenamiento: Si ordenAscendente es true, menor a mayor peligro; si false, mayor a menor.
  // =========================================================================
  getPocionesFiltradas(): Pocion[] {
    // TODO: Reto 5 - Reemplaza este retorno simple por el algoritmo completo
    return this.pociones;
  }
]
```

### 2. ¿Qué respuesta te entregó la IA?
*Describe brevemente la solución que te propuso:*
- [Claro ferrr, hagamos el reto 5. Vamos paso a paso, y yo te voy guiando para que sepas exactamente qué hacer en tu proyecto de Angular y entiendas cómo funciona cada cosa. No vamos a cambiar todo de una vez; primero revisamos, después implementamos y al final comprobamos que funcione. 🧙‍♂️
Reto 5: El Transmutador de Estados
El reto consiste en hacer dos cosas:
- Crear un sistema que filtre y ordene las pociones según el texto, el tipo de magia y el nivel de peligro.
- Calcular si el caldero está 'SEGURO', 'INESTABLE' o 'CRÍTICO'.
Paso 1. Abrir el archivo correcto
Primero, abre tu proyecto Colegio Mágico en Visual Studio Code.

En el explorador de archivos de la izquierda, busca esta ruta:

src/app/components/retos/caldero/caldero.component.ts

Abre el archivo y busca esta parte:
getPocionesFiltradas(): Pocion[] {
  return this.pociones;
}


Ese es el método que tenemos que completar. Por ahora, simplemente devuelve todas las pociones sin aplicar ningún filtro.
Paso 2. Entender los filtros que vamos a utilizar
Antes de escribir el código, identifica estas cuatro propiedades que ya aparecen en las instrucciones:
filtroTexto: string = '';
filtroTipoMagia: string = 'TODAS';
filtroSoloPeligrosas: boolean = false;
ordenAscendente: boolean = true;


¿Qué significa cada una?
Propiedad	¿Para qué sirve?
filtroTexto	Guarda lo que escribes en el buscador.
filtroTipoMagia	Guarda el tipo de magia seleccionado.
filtroSoloPeligrosas	Indica si quieres mostrar solo las pociones peligrosas.
ordenAscendente	Decide si ordenamos del menor peligro al mayor o al contrario.

No tienes que crear estas propiedades otra vez si ya están en tu archivo.
Paso 3. Reemplazar el método de filtrado
Ahora busca el método getPocionesFiltradas() y reemplaza su contenido por este código:

getPocionesFiltradas(): Pocion[] {
  const texto = this.filtroTexto.trim().toLowerCase();

  const resultado = this.pociones.filter(p => {
    const coincideTexto =
      texto === '' ||
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto);

    const coincideTipo =
      this.filtroTipoMagia === 'TODAS' || p.tipoMagia === this.filtroTipoMagia;

    const coincidePeligro = !this.filtroSoloPeligrosas || p.nivelPeligro > 7;

    return coincideTexto && coincideTipo && coincidePeligro;
  });

  return resultado.sort((a, b) =>
    this.ordenAscendente
      ? a.nivelPeligro - b.nivelPeligro
      : b.nivelPeligro - a.nivelPeligro
  );
}



Guarda el archivo con Ctrl + S.
¿Qué acabamos de hacer?
1. Convertimos el texto de búsqueda a minúsculas y eliminamos los espacios sobrantes.
2. Revisamos cada poción y comprobamos si coincide con el texto.
3. Comprobamos si coincide con el tipo de magia seleccionado.
4. Si se activó el filtro de peligrosas, dejamos pasar solo las que tengan un nivel de peligro superior a 7.
5. Ordenamos las pociones según el valor de ordenAscendente.
La clave es esta línea:
return coincideTexto && coincideTipo && coincidePeligro;


El símbolo && significa “y”. Para que una poción aparezca, debe cumplir las tres condiciones.

Por ejemplo, si buscas "dragón" y seleccionas magia oscura, una poción que contenga esa palabra pero sea de fuego no aparecerá.
Paso 4. Agregar el cálculo de estabilidad
Ahora, dentro de la misma clase del componente, agrega este método debajo de getPocionesFiltradas(). No lo coloques dentro de otra función.

calcularEstabilidadCaldero(): 'SEGURO' | 'INESTABLE' | 'CRÍTICO' {
  const criticas = this.pociones.filter(p => p.nivelPeligro >= 8).length;

  if (criticas >= 2) return 'CRÍTICO';
  if (this.pociones.some(p => p.nivelPeligro >= 5)) return 'INESTABLE';

  return 'SEGURO';
}



Guarda nuevamente con Ctrl + S.
¿Cómo funciona?
- filter(...) selecciona las pociones cuyo peligro sea 8 o superior.
- .length cuenta cuántas pociones cumplen esa condición.
- if (criticas >= 2) establece el estado crítico cuando hay al menos dos pociones de peligro alto.
- .some(...) comprueba si existe al menos una poción con peligro igual o superior a 5.
- Si no se cumple ninguna de esas condiciones, devuelve 'SEGURO'.
La prioridad queda así:
Condición	Estado
Dos o más pociones con peligro ≥ 8	CRÍTICO
No es crítico, pero hay alguna con peligro ≥ 5	INESTABLE
Ninguna poción tiene peligro ≥ 5	SEGURO

Paso 5. Comprobar que no haya errores
Ahora vamos a revisar si el código quedó bien.
1. Guarda los cambios.
2. Abre la terminal de Visual Studio Code.
3. Ejecuta el comando:
ng test


Si tu proyecto utiliza una configuración de pruebas que requiere ejecutar el comando de otra manera, utiliza la misma que has empleado en los retos anteriores.

Revisa si aparecen errores de compilación o pruebas fallidas. Si algo falla, no modifiques los archivos .spec.ts para forzar que pase; revisamos el mensaje y corregimos el código del componente.
Paso 6. Verificar que los filtros funcionen
Cuando las pruebas pasen, comprueba en la aplicación:
- Buscar una palabra del nombre de una poción.
- Buscar una palabra de la descripción.
- Elegir un tipo de magia específico.
- Activar y desactivar el filtro de peligrosas.
- Cambiar el orden de peligro ascendente y descendente.
Hay un detalle importante: estas funciones calculan resultados, pero para confirmar que se actualizan en pantalla necesitamos revisar cómo están conectadas con el HTML de tu proyecto.]

### 3. Ajustes y Correcciones Manuales
*¿La solución funcionó a la primera? ¿Qué tuviste que corregir o adaptar para que pasaran las pruebas del Tribunal?*
- [Sí funciono a la primera. Nada, no tuve que adaptar nada.] 

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[listo, los cambios quedaron bien subidos necesito que me ayudes ahora con el reto 6 igual que el anterior ayudame con todo pero explicame 
// =========================================================================
  // ⏳ RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // =========================================================================
  historialPasos: Pocion[][] = [];
  indiceHistorial: number = -1;
  // -------------------------------------------------------------------------
  // RETO 6 (IA CHALLENGE): EL GIRATIEMPO (Historial Undo / Redo)
  // -------------------------------------------------------------------------
  // =========================================================================
  // TODO: Reto 6 - El Giratiempo / Historial Inmutable (Apóyate en la IA)
  // Implementa un sistema de Undo/Redo con inmutabilidad profunda:
  // - guardarEstadoGiratiempo(): Si se hizo undo y se agrega una acción, descarta
  //   el futuro. Clona 'this.pociones' profundamente y añádelo a 'this.historialPasos'.
  // - puedeDeshacer(): Retorna true si indiceHistorial > 0.
  // - puedeRehacer(): Retorna true si indiceHistorial < historialPasos.length - 1.
  // - giratiempoDeshacer(): Retrocede el índice y restaura una copia de ese estado.
  // - giratiempoRehacer(): Avanza el índice y restaura una copia de ese estado.
  // =========================================================================
  guardarEstadoGiratiempo(): void {
    // TODO: Reto 6 - Implementar guardado inmutable en el historial
  }

  puedeDeshacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible retroceder
    return false;
  }

  puedeRehacer(): boolean {
    // TODO: Reto 6 - Retornar si es posible avanzar
    return false;
  }

  giratiempoDeshacer(): void {
    // TODO: Reto 6 - Revertir al estado anterior
  }

  giratiempoRehacer(): void {
    // TODO: Reto 6 - Avanzar al estado siguiente
  }
}]
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
*Explica qué método te sugirió para clonar el arreglo de pociones sin mutar las referencias originales (ej. map con spread operator, structuredClone, etc.):*
- [La IA me ayudo a hacer una copia de las pociones usando map() y el operador spread para que los cambios no afectaran directamente las originales, tambien hizo una copia de los ingredientes porque esos también podian cambiar.]

### 3. Depuración de Errores con la IA
*Si una prueba de Jasmine falló, ¿cómo usaste la IA para encontrar el bug?*
- [Si cuando hacia las pruebas (en todos los retos) algo fallaba la IA me ayudaba de varias maneras: revisaba el código y me daba posibles causas del error.
Una fue al inicio: en el reto 1 cuando estaba creando las pociones les puse todo, pero poner ingredientes se me habia olvidado, busque el error un rato pero definitivamente no fui capaz de encontrarlo pero apenas se lo envie a la IA me dijo directamente cual era el error.]

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** [El Mapa de Hogwarts.]
* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - [Mi artefacto permite explorar diferentes lugares de hogwarts y jugar minijuegos: quidditch, encantamientos, cuidar plantas en el invernadero, explorar el bosque prohibido y luchar en duelos, también se pueden ganar para la casa, desbloquear logros, elegir casa y cambiar el nombre del mago.]
* **¿Qué hooks de ciclo de vida implementaste?**
  - [Utilice ngOnInit() para cargar el progreso guardado y empezar un temporizador que recupera energía durante los duelos, también use ngOnDestroy() para detener los temporizadores y evitar que sigan funcionando cuando se cierra el componente.]
* **¿Qué directivas y enlaces utilizaste?**
  - [Utilice @if para mostrar diferentes cosas segun el estado del juego y @for para recorrer las listas de lugares, hechizos, plantas y logros. tambien use (ngModel) para conectar los campos con los datos, (click) para que funcionen los botones, y [class] y [ngClass] para cambiar los estilos dependiendo de lo que pase en el minijuego.]

---

## 💡 Reflexión Crítica del Aprendiz
*¿En qué momentos sentiste que la IA te ahorró tiempo y en qué momentos una mala respuesta te retrasó?*
- [La IA me ahorro tiempo en toda la tarea en general: Especialmente en los retos 5, 6, 7 (artefacto creativo) hoy en día la IA hace parte de todo: nos facilita mucho las cosas. Cuando la IA falla en ocasiones podria decir que es culpa de nostros: no le damos toda la información que necesita, no le especificamos bien lo que queremos, etc... Pero la IA tambien se puede equivocar y como estamos acostumbrados a que nos de todo rápido sin errores, que se equivoque puede ser muy frustrante. En esta ocasión la IA me retraso mucho con el reto 7: le decia mucho que no me gustaba el css que me estaba haciendo pero no me entendia, al final tuve que cambiar de IA y esta si me entendio.] 
