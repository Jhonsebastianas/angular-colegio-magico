# 🚪 Guía Oficial: Cómo Crear y Enviar tu Pull Request (PR) Paso a Paso

> ⚠️ **RECORDATORIO VITAL — REGLA DE ORO #2 (CALIFICACIÓN 0.0 AUTOMÁTICA):**
> **"En el mundo del software y en el Colegio Mágico, código que no llega en un Pull Request formal es código que no existe."**
> Aunque completes el 100% de los retos técnicos y tu código funcione a la perfección en tu máquina, si **no abres tu Pull Request formal hacia la rama principal del repositorio oficial antes de la fecha límite, tu calificación será de 0.0**.

---

## 🗺️ Mapa Visual del Flujo de Entrega

Para entender qué hace un Pull Request, observa el recorrido que viaja tu código:

```mermaid
flowchart LR
    A["1. Repositorio Oficial<br/>(Jhonsebastianas/angular-colegio-magico)"] -->|Fork| B["2. Tu Fork Personal<br/>(github.com/tu-usuario/...)"]
    B -->|git clone| C["3. Tu Computador / Codespace<br/>(Rama local: feature/entrega-magica)"]
    C -->|git commit & push| B
    B -->|4. PULL REQUEST (Entrega Formal)| A
```

---

## 📋 Lista de Chequeo Previa (Antes de Abrir el PR)

Antes de tocar GitHub, valida estos 3 puntos en tu terminal:

1. **🛡️ Integridad Sagrada:** ¿Modificaste algún archivo `*.spec.ts`?
   ```bash
   git diff origin/main -- 'src/**/*.spec.ts'
   ```
   *(Si no sale nada, ¡perfecto! Si sale texto con cambios, reviértelos inmediatamente con `git checkout -- src/app/**/*.spec.ts` para no incurrir en la Maldición del 0.0).*

2. **🧪 Pruebas Unitarias:** ¿Tus pruebas pasan localmente?
   ```bash
   npm run test:ci
   ```

3. **🎨 Reto Creativo Listo:** ¿Implementaste tu componente en `src/app/components/retos/artefacto-creativo/`?

---

## 👣 Paso a Paso Detallado: De la Terminal a la Entrega Oficial

### Paso 1: Crea tu rama de entrega
Nunca trabajes ni entregues directamente en una rama desordenada. Crea una rama descriptiva para tu entrega:
```bash
# Crear y cambiarse a la rama de entrega
git checkout -b feature/entrega-caldero
```

---

### Paso 2: Guarda todos tus cambios (Commit)
Revisa qué archivos has modificado y conságralos en el historial:
```bash
git status
```
*Salida esperada:*
```text
Changes not staged for commit:
  modified:   src/app/components/retos/caldero/caldero.component.ts
  modified:   src/app/components/retos/caldero/caldero.component.html
  modified:   src/app/components/retos/artefacto-creativo/artefacto-creativo.component.ts
```

Ahora consagra tus hechizos con un commit explicativo usando prefijos mágicos:
```bash
git add .
git commit -m "feat: completar retos del caldero y artefacto creativo"
```

---

### Paso 3: Sube tu rama a tu repositorio de GitHub (Push)
Envía la rama a tu fork en la nube:
```bash
git push -u origin feature/entrega-caldero
```

*(Si Git te pide credenciales o token personal, ingrésalo según tu configuración de GitHub).*

---

### Paso 4: Ve a GitHub y abre el Pull Request

1. Abre tu navegador e ingresa a **tu repositorio forkeado**:
   `https://github.com/TU-USUARIO/angular-colegio-magico`
2. En la parte superior verás una barra amarilla con el botón verde **Compare & pull request**:
   ![Botón Compare and PR](https://docs.github.com/assets/cb-32402/mw-1440/images/help/pull_requests/pull-request-compare-at-fork.webp)
   *Si no ves la barra amarilla, ve a la pestaña **Pull requests** y haz clic en **New pull request**.*

---

### Paso 5: ¡Cuidado con la Trampa del Espejo de Oesed! (Configurar la Dirección Correcta)

Este es el **error más frecuente de los aprendices de magia**: abrir el PR contra su propio fork en lugar de enviarlo al repositorio oficial del profesor.

Verifica minuciosamente las cuatro cajas de selección de ramas en GitHub:

| Campo en GitHub | Valor Correcto que debes seleccionar | Explicación |
| :--- | :--- | :--- |
| **base repository** | `Jhonsebastianas/angular-colegio-magico` | **Repositorio oficial del curso** |
| **base** | `main` | Rama principal del profesor |
| **head repository** | `TU-USUARIO/angular-colegio-magico` | **Tu fork personal** |
| **compare** | `feature/entrega-caldero` | La rama donde hiciste tus cambios |

```text
Configuración visual en GitHub:
[ base repository: Jhonsebastianas/angular-colegio-magico ]  [ base: main ]
                                 ▲
                          recibe cambios de
                                 │
[ head repository: TU-USUARIO/angular-colegio-magico ]      [ compare: feature/entrega-caldero ]
```

> 🛑 **Si ambas cajas dicen tu usuario:** Tu PR quedará cerrado en tu propio repositorio y el profesor **NUNCA lo verá**. ¡Asegúrate de que `base repository` sea `Jhonsebastianas/angular-colegio-magico`!

---

### Paso 6: Título y la Bitácora Obligatoria de IA (20% de la Nota)

1. **Título reglamentario:**
   ```text
   Entrega Angular: [Tu Nombre Completo]
   ```
   *Ejemplo:* `Entrega Angular: Hermione Granger`

2. **Descripción del PR:**
   Abre el archivo [plantilla_bitacora_ia.md](./plantilla_bitacora_ia.md), copia todo su contenido y pégalo en la caja de descripción. Completa cada campo con tus prompts, capturas conceptuales y la explicación de tu artefacto creativo.

   *(Para ver un ejemplo completo y realista de una bitácora bien llenada, consulta [assets/ejemplo_pull_request.md](./ejemplo_pull_request.md)).*

3. Haz clic en el botón verde **Create pull request**.

---

### Paso 7: Esperar el Veredicto del Tribunal de Magia (GitHub Actions)

Una vez abierto el PR, el workflow **"El Gran Tribunal de Magia"** comenzará a juzgar tus hechizos automáticamente:

* ✅ **Check verde (All checks have passed):**
  ¡Felicidades! Todos tus retos técnicos pasaron la auditoría del Tribunal.
* ❌ **Cruz roja (Some checks were not successful):**
  No te asustes ni abras un nuevo PR.
  1. Haz clic en **Details** al lado de la cruz roja.
  2. Lee qué prueba falló.
  3. Abre tu editor de código, corrige el problema localmente y ejecuta `npm test`.
  4. Vuelve a hacer `git commit` y `git push origin feature/entrega-caldero`.
  5. **¡El PR se actualiza automáticamente con tus nuevos commits sin necesidad de crear otro!**

---

## 🤖 ¿Tienes Antigravity IDE? ¡Usa la Skill Automática de Entrega!

Para facilitarte la vida y asegurarnos de que no pierdas tu nota por un descuido técnico, este proyecto cuenta con la skill oficial:

👉 **`crear-pull-request`** (ubicada en `.agents/skills/crear-pull-request/`)

Si estás trabajando con el asistente de IA en este proyecto, solo pídele en el chat:
> *"Ayúdame a revisar y crear el Pull Request para entregar mi proyecto"*

El asistente:
1. Comprobará que ningún archivo sagrado `*.spec.ts` haya sido alterado.
2. Ejecutará las pruebas unitarias y te mostrará el resultado.
3. Te ayudará a estructurar tu rama, commits y bitácora.
4. Generará la **URL directa con un clic** para abrir el PR sin equivocarte de repositorio.

---

## 📚 Enlaces de Interés

* 📖 [Ejemplo Completo de un Pull Request Real](./ejemplo_pull_request.md)
* 📜 [Plantilla Oficial de la Bitácora de IA](./plantilla_bitacora_ia.md)
* 🪄 [Guía de la Varita Git](./varita_git.md)
