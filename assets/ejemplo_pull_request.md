# 🧙‍♀️ Ejemplo Real de un Pull Request de Entrega

Este documento es una **muestra completa de cómo debe verse tu Pull Request oficial** en GitHub. Puedes usarlo como referencia para saber qué escribir y cómo presentar tu trabajo para aspirar al máximo puntaje.

---

## 📌 Datos de la Configuración en GitHub

* **Base repository:** `Jhonsebastianas/angular-colegio-magico`
* **Base branch:** `main`
* **Head repository:** `hermione-granger/angular-colegio-magico`
* **Compare branch:** `feature/entrega-caldero`

---

## 🏷️ Título del Pull Request

```text
Entrega Angular: Hermione Granger - Retos del Caldero y Artefacto Creativo
```

---

## 📝 Descripción del Pull Request (Bitácora de IA Diligenciada)

*(A continuación se muestra el texto exacto que debes pegar y completar en el cuerpo del PR en GitHub):*

```markdown
# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz
* **Nombre del Estudiante:** Hermione Granger
* **Usuario de GitHub:** @hermione-granger
* **Herramientas de IA utilizadas:** Claude 3.5 Sonnet y GitHub Copilot

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Prompt exacto proporcionado a la IA:*
```text
Actúa como un desarrollador senior de Angular 19 y TypeScript.
Tengo un modelo de Pocion con { id, nombre, descripcion, tipoMagia: TipoMagia, peligro: number }.
Necesito implementar la función `getPocionesFiltradas()` en mi componente que aplique 3 filtros combinados:
1. `criterioBusqueda`: Si tiene texto, buscar insensible a mayúsculas/minúsculas en el nombre O en la descripción.
2. `filtroTipo`: Si es distinto de 'TODAS', filtrar únicamente las pociones que coincidan exactamente con el tipo de magia.
3. `filtroPeligroMax`: Mostrar únicamente pociones cuyo peligro sea menor o igual al valor del slider.

Además, necesito un getter `estabilidadCaldero` que calcule:
- 'SEGURO': Si el promedio de peligro de todas las pociones es <= 4.
- 'INESTABLE': Si el promedio está entre 4.1 y 7.
- 'CRÍTICO': Si el promedio supera 7 o si hay alguna poción con peligro igual a 10.
Dame la solución usando programación funcional inmutable (filter, reduce).
```

### 2. ¿Qué respuesta te entregó la IA?
La IA me entregó una solución usando `this.pociones.filter(...)` combinando los tres predicados con el operador lógico `&&`, y para la estabilidad utilizó un `reduce` para sumar los peligros y calcular la media.

### 3. Ajustes y Correcciones Manuales
La solución inicial falló 1 prueba en el Tribunal:
- **Error:** Cuando el arreglo de pociones estaba vacío (`this.pociones.length === 0`), el cálculo del promedio producía `0 / 0 = NaN`, lo cual rompía las comparaciones numéricas y retornaba `'INESTABLE'` en vez de `'SEGURO'`.
- **Ajuste manual:** Agregué una cláusula de guarda al inicio del getter:
  ```typescript
  if (!this.pociones || this.pociones.length === 0) return 'SEGURO';
  ```
  Con este ajuste manual, todas las pruebas del Reto 5 pasaron al 100%.

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Prompt exacto proporcionado a la IA:*
```text
Estoy implementando un sistema de historial tipo Deshacer/Rehacer (Undo/Redo) para un arreglo de objetos en Angular.
Cada vez que el usuario altera una poción, debo guardar una instantánea en `historialPociones: Pocion[][]`.
¿Cómo puedo guardar copias profundas sin que las mutaciones posteriores sobre el arreglo actual modifiquen las copias ya guardadas en el historial? Explica la diferencia entre asignación por referencia vs inmutabilidad con structuredClone.
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
La IA me explicó que hacer `this.historial.push(this.pociones)` solo copia el puntero en memoria, lo que provocaba que al modificar una poción, se modificaran mágicamente todos los estados pasados en el historial. 
Me propuso utilizar `structuredClone(this.pociones)` o `this.pociones.map(p => ({ ...p, ingredientes: [...p.ingredientes] }))`. Opté por `structuredClone` ya que es nativo de los navegadores modernos y garantiza un clonado profundo de objetos e ingredientes anidados sin dependencias externas.

### 3. Depuración de Errores con la IA
Al probar el botón de "Rehacer" (Redo), la pila no avanzaba si después de un Deshacer se agregaba una nueva poción. Le pegué el fragmento de código a la IA y me explicó el concepto de *árbol de historia*: cada nueva acción destructiva debe vaciar la pila de `redoStack` para evitar estados inconsistentes. Apliqué `this.redoStack = [];` y el test de Jasmine pasó inmediatamente.

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** *El Mapa del Merodeador Interactivo y Registro de Hechizos*
* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - Permite a los estudiantes explorar las aulas de Hogwarts en tiempo real. 
  - Cuenta con un radar mágico con filtros de casas, un buscador de personajes con autocomplete y una zona de práctica para conjurar hechizos con barra de energía reactiva.
* **¿Qué hooks de ciclo de vida implementaste?**
  - `ngOnInit`: Carga la lista inicial de huellas mágicas y pasadizos secretos desde un dataset local.
  - `ngOnDestroy`: Destruye el `setInterval` del radar que simula el movimiento de los personajes cada 2 segundos, evitando fugas de memoria (Memory Leaks).
* **¿Qué directivas y enlaces utilizaste?**
  - `@if` / `@else`: Alterna entre el modo "Mapa Revelado" y "Travesura Realizada (Capa invisible)".
  - `@for (persona of huellas; track persona.id)`: Renderiza las huellas con coordenadas dinámicas en el mapa.
  - `[ngClass]`: Aplica auras doradas, verdes, azules o rojas dependiendo de la casa del mago.
  - `[(ngModel)]`: Permite renombrar las salas o buscar magos en el buscador reactivo.

---

## 💡 Reflexión Crítica del Aprendiz
El uso de la IA fue muy productivo para boilerplate y estructuración matemática de los filtros combinados (ahorrándome al menos 40 minutos de pruebas manuales). Sin embargo, en el manejo del ciclo de vida y casos de borde (como arreglos vacíos o `NaN`), las sugerencias de la IA tendían a ignorar el contexto de ejecución de Angular. Entender los fundamentos me permitió no depender ciegamente de la IA y corregir los errores en minutos.
```

---

## 🔍 Cómo Verificar que tu PR fue Exitoso en GitHub

Al abrir el PR, verás una sección al final llamada **Checks**:

```text
All checks have passed
1 successful check
[ ✓ ] El Gran Tribunal de Magia / tribunal_veredicto (pull_request) Successful in 42s
```

Si ves el check verde y tu bitácora pegada en la descripción, **¡tu entrega está completa y consagrada!** 🎉
