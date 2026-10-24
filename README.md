# 🧙‍♂️ Colegio Mágico - Academia Frontend con Angular


# ESTO ES UN CAMBIO CUALQUIERA

¡Bienvenido al nivel avanzado de tu formación mágica! El Ministerio de Magia ha ordenado digitalizar la **Interfaz del Colegio y el Gran Caldero de Pociones**. Como aprendiz de hechicería, deberás dominar el arte de construir aplicaciones web reactivas utilizando **Angular**, siguiendo los sagrados principios de componentes, directivas y ciclo de vida.

---

## ☠️ REGLAS DE ORO INQUEBRANTABLES (CALIFICACIÓN: 0.0 AUTOMÁTICA)

> ### 🛑 1. La Maldición del Manipulador de Pruebas
> Los archivos terminados en `*.spec.ts` ubicados en `src/app/` son **sagrados e intocables**.
> Si alteras, comentas, renombras o borras una sola línea de estos archivos para forzar el aprobado de una prueba, **tu calificación será de 0.0 automáticamente**, sin derecho a revisión humana ni reclamos, sin importar qué tanto código hayas escrito en el resto del proyecto. El Tribunal de GitHub Actions detectará cualquier cambio en estos archivos.

> ### 🚪 2. El Sello del Pull Request (PR Obligatorio)
> En el mundo del software y en el Colegio Mágico, **código que no llega en un Pull Request (PR) es código que no existe**.
> Si completas la actividad pero no abres tu Pull Request formal hacia la rama principal del repositorio antes de la fecha límite, **tu calificación será de 0.0**.

---

## ⚖️ Ponderación Oficial de la Calificación (0.0 a 5.0)

> ⚠️ **Aclaración vital:** Que el Tribunal de GitHub Actions marque tu código en verde (aprobando el 100% de los tests) **NO garantiza un 5.0 automático**. Es un requisito técnico indispensable, pero la nota definitiva requiere criterio y auditoría técnica humana.

| Porcentaje | Componente Evaluado | Descripción |
| :---: | :--- | :--- |
| **50%** | **Retos Técnicos (1 al 6)** | Pruebas unitarias del Tribunal aprobadas en `caldero.component.ts`, arquitectura limpia y buenas prácticas de Angular. |
| **20%** | **Bitácora de IA en el PR** | Documento obligatorio pegado en la descripción del PR explicando para qué y cómo se usó la IA en los Retos 5 y 6. **¡Este reporte debe ser redactado con criterio humano, sin usar IA para generarlo!** |
| **30%** | **El Lienzo Creativo (Reto 7)** | Originalidad, interactividad, estética visual y dominio de Angular en el artefacto libre (`artefacto-creativo.component.ts`). |

---

## 🤖 Dinámica de Evaluación Automática con GitHub Issues

A medida que avances en tu formación, el **Tribunal Mágico (GitHub Actions)** interactuará contigo a través de la pestaña de **Issues** de tu repositorio:

1. **Reto por Reto:** El Tribunal abrirá automáticamente el Issue del **Reto 1**. Con cada `git push`, el bot evaluará tus pruebas unitarias.
2. **Penalización por Intentos Fallidos:** Cada reto arranca con **10 puntos** de puntuación base. Cada vez que hagas `git push` y fallen las pruebas de ese reto, se descontarán **2 puntos** (con una nota mínima garantizada de 2/10 al resolverlo).
3. **💡 Luz del Oráculo (Pistas al 3er fallo):** Si fallas **3 o más veces** en un mismo reto, el bot del Tribunal te responderá en el Issue con una **pista técnica y conceptual** para que tengas una luz y puedas desatascarte.
4. **Desbloqueo Secuencial:** Apenas completes un reto, el Tribunal publicará tu calificación obtenida en ese Issue, lo cerrará y abrirá el siguiente reto con sus requerimientos.
5. **🏆 Calificación Técnica Final:** Al superar el Reto 6, el Tribunal consolidará tu puntuación técnica total (Retos 1 al 6) y abrirá el **Reto 7 (Lienzo Creativo y Pull Request Final)** con tu nota técnica consolidada.

---

## 📜 Instrucciones para Empezar

1. **Haz un Fork** de este repositorio hacia tu cuenta personal de GitHub.
2. Clónalo en tu entorno local o ábrelo en un **Codespace** de GitHub.
3. Instala los ingredientes mágicos con npm:
   ```bash
   npm install
   ```
4. Levanta el servidor local para ver la magia en vivo:
   ```bash
   npm start
   ```
   Abre tu navegador en [http://localhost:4200](http://localhost:4200).
5. Ejecuta las pruebas del Tribunal en cualquier momento:
   ```bash
   npm test
   # O en modo desatendido idéntico a GitHub Actions:
   npm run test:ci
   ```
6. Consulta las guías de apoyo en la carpeta `assets/`:
   * [Anatomía de Prompts e Inteligencia Artificial](./assets/guia_ia_prompts.md)
   * [Plantilla de la Bitácora de IA para el PR](./assets/plantilla_bitacora_ia.md)
   * [Evolución de la Sintaxis de Directivas en Angular](./assets/evolucion_sintaxis_angular.md)
   * [Comandos Básicos de la Varita Git](./assets/varita_git.md)
   * [Guía Paso a Paso para Crear el Pull Request](./assets/guia_pull_request.md)

---

## 🗺️ Mapa de los Retos Mágicos

Las puertas de acceso a los retos se encuentran en `src/app/components/`:

### 🎓 Reto 0: La Masterclass del Profesor (`components/clase/reto0-sombrero/`)
**Misión:** Asiste a la clase en vivo. El profesor explicará la estructura de `package.json`, ciclos de vida y directivas, y construirá el componente del `Sombrero Seleccionador`. Presta atención porque este ejemplo contiene todos los fundamentos que necesitarás.

### 🔮 Reto 1: El Ingrediente Base (Capa Models & `ngOnInit`)
* **Archivo:** `components/retos/caldero/caldero.component.ts`
* **Misión:** Implementa la interfaz `OnInit` y carga en `ngOnInit()` al menos 3 pociones ancestrales obligatorias (*Poción Multijugos*, *Felix Felicis*, *Filtro de Muertos*).

### 🪄 Reto 2: Los Encantamientos de Vista (`@if`, `@for`, `[ngClass]`)
* **Archivo:** `components/retos/caldero/caldero.component.html`
* **Misión:** Renderiza la lista con `@for`, muestra una alerta de toxicidad con `@if` únicamente cuando el peligro sea superior a 7, y aplica bordes con `[ngClass]` según el tipo de magia.

### 🪞 Reto 3: El Vínculo con el Caldero (Data Binding & `[(ngModel)]`)
* **Archivo:** `components/retos/caldero/caldero.component.ts` y `.html`
* **Misión:** Conecta el formulario con Two-Way Data Binding (`[(ngModel)]`). Valida que el botón de preparación quede deshabilitado con `[disabled]` si el nombre tiene menos de 3 letras o el tiempo de cocción es menor o igual a 0.

### ⏳ Reto 4: El Fuego Purificador (`ngOnDestroy` & Limpieza de Memoria)
* **Archivo:** `components/retos/caldero/caldero.component.ts`
* **Misión:** El caldero tiene un temporizador regresivo. Implementa `OnDestroy` y en `ngOnDestroy()` destruye el intervalo (`clearInterval()`) para evitar fugas de memoria.

### 🔍 Reto 5: El Transmutador de Estados (IA Challenge - Dificultad Alta)
* **Archivo:** `components/retos/caldero/caldero.component.ts`
* **Misión:** Implementa el motor de búsqueda multi-criterio (`getPocionesFiltradas()`) y el cálculo reactivo de estabilidad general del caldero (`'SEGURO' | 'INESTABLE' | 'CRÍTICO'`).
* **Nota IA:** Apóyate en herramientas de IA formulando prompts técnicos precisos. Documenta este proceso en tu bitácora.

### ⏳ Reto 6: El Giratiempo / Historial Mágico (IA Challenge - Dificultad Alta)
* **Archivo:** `components/retos/caldero/caldero.component.ts`
* **Misión:** Implementa el sistema de *Undo/Redo* inmutable (`giratiempoDeshacer()` y `giratiempoRehacer()`), asegurando que cualquier acción altere el historial respetando la inmutabilidad de arreglos y objetos.
* **Nota IA:** Diseña con la IA un clonador inmutable de estados. Documenta el prompt y las correcciones en tu bitácora.

### 🎨 Reto 7: El Gran Lienzo Creativo - 30% de la Nota (`components/retos/artefacto-creativo/`)
* **Archivo:** `components/retos/artefacto-creativo/`
* **Misión:** Tienes total libertad para personalizar el *Simulador de Duelos* provisto o construir tu propio artefacto mágico interactivo (un Mapa del Merodeador, Generador de Varitas, etc.).
* **Rúbrica Obligatoria:**
  1. Al menos 3 estados interactivos visibles.
  2. Uso de directivas `@if` y `@for`.
  3. Uso de Two-Way Binding (`[(ngModel)]`).
  4. Implementación de al menos dos hooks de ciclo de vida (`ngOnInit` y otro).
  5. Diseño estético inmersivo (animaciones, estilos mágicos y buena UX).

---

## ⚡ Entrega Oficial de Hechizos

1. Haz commits descriptivos usando la convención mágica:
   ```bash
   git add .
   git commit -m "feat: completar reto 1 y reto 2 del caldero"
   git push origin tu-rama
   ```
2. Ve a GitHub y abre un **Pull Request (PR)** hacia la rama principal del repositorio original.
3. Copia y llena la [Plantilla de Bitácora de IA](./assets/plantilla_bitacora_ia.md) en la descripción del PR.
4. Espera a que el **Tribunal de GitHub Actions** ejecute los tests y emita su veredicto.
