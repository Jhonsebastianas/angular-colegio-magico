---
name: crear-pull-request
description: >-
  Guía y asiste al estudiante paso a paso para preparar, validar y abrir el Pull Request (PR) obligatorio de entrega en GitHub, evitando el 0.0 automático por no entregar el PR o por alterar pruebas *.spec.ts. Usar cuando el usuario pida ayuda para entregar la tarea, crear el PR, validar su entrega, subir cambios a GitHub o verificar el estado para calificar.
---

# 🚪 Skill: Preparación y Creación de Pull Request Oficial (Colegio Mágico)

Esta skill guía y protege al estudiante para que cumpla con la **Regla de Oro #2 (PR Obligatorio)** y entregue su proyecto exitosamente sin riesgo de obtener una calificación de 0.0 por omisión o por modificar archivos de prueba protegidos.

---

## ⚡ Flujo de Asistencia Paso a Paso

Cuando el estudiante mencione que desea:
* "Entregar el proyecto" o "entregar la tarea"
* "Crear el Pull Request" o "hacer el PR"
* "Verificar si ya puedo entregar"
* "Subir mis cambios para calificación"

Sigue rigurosamente estos 6 pasos en orden:

---

### Paso 1: 🛡️ Verificación de Integridad Sagrada (Anti-Maldición 0.0)

**Regla de Oro #1:** Los archivos `*.spec.ts` son sagrados e intocables.
1. Ejecuta el comando de verificación:
   ```bash
   git diff origin/main -- 'src/**/*.spec.ts'
   ```
2. **Si hay diferencias:**
   - ⚠️ ALERTA INMEDIATA AL ESTUDIANTE: Explícale que modificar archivos de prueba provoca un 0.0 automático por el Tribunal de GitHub Actions.
   - Ofrécele restaurar los archivos originales inmediatamente con:
     ```bash
     git checkout origin/main -- src/app/**/*.spec.ts
     ```
3. **Si está limpio:** Continúa al Paso 2.

---

### Paso 2: 🧪 Verificación de Pruebas Unitarias del Tribunal

1. Ejecuta el suite de pruebas en modo CI:
   ```bash
   npm run test:ci
   ```
2. Analiza el resultado:
   - Si todos los retos pasan: Felícitalo y continúa.
   - Si fallan retos: Muestra cuáles retos tienen pruebas pendientes y pregúntale si desea resolverlos primero para maximizar su nota técnica (50% de la calificación) antes de abrir el PR.

---

### Paso 3: 🌿 Preparación de Rama y Consagración de Cambios (Git)

1. Revisa la rama actual y el estado de los archivos:
   ```bash
   git status
   ```
2. Si el estudiante se encuentra en la rama `main`, sugiérele crear una rama de entrega con su nombre o feature:
   ```bash
   git checkout -b feature/entrega-[nombre-o-usuario]
   ```
3. Ayúdalo a consagrar sus cambios con un commit convencional claro:
   ```bash
   git add .
   git commit -m "feat: completar retos del caldero y artefacto creativo para entrega oficial"
   ```

---

### Paso 4: 🚀 Enviar Cambios a GitHub (Push)

1. Empuja la rama al repositorio remoto del estudiante:
   ```bash
   git push -u origin [nombre-de-rama]
   ```

---

### Paso 5: 🔗 Generar la URL Exacta del Pull Request (Sin Trampas)

El error más común de los estudiantes es abrir el PR contra su propio fork en lugar de contra el repositorio oficial del profesor (`Jhonsebastianas/angular-colegio-magico`).

1. Determina el usuario del fork del estudiante inspeccionando el remote:
   ```bash
   git remote get-url origin
   ```
2. Construye y proporciónale el enlace directo de comparación:
   ```text
   https://github.com/Jhonsebastianas/angular-colegio-magico/compare/main...[USUARIO]:[RAMA]?expand=1
   ```
   *(Al hacer clic en este enlace, GitHub abrirá directamente la pantalla de PR con el repositorio base y la rama destino configurados a la perfección).*

---

### Paso 6: 📝 Asistir con la Bitácora Obligatoria de IA (20% de la Nota)

1. Recuérdale al estudiante que el **20% de la calificación** depende de la Bitácora de IA incluida en el cuerpo del PR.
2. Lee la plantilla en [assets/plantilla_bitacora_ia.md](file:///Users/sebastianagudelo/Documents/apps/angular-colegio-magico/assets/plantilla_bitacora_ia.md).
3. Revisa el historial de la conversación o los prompts usados en los Retos 5 y 6 para recordarle qué prompts utilizó y qué ajustes manuales realizó.
4. **IMPORTANTE:** Guía al estudiante para que la reflexión crítica y las explicaciones sean redactadas por él mismo con criterio humano, tal como lo exige el reglamento del curso.
5. Puedes remitirlo al ejemplo completo de referencia en [assets/ejemplo_pull_request.md](file:///Users/sebastianagudelo/Documents/apps/angular-colegio-magico/assets/ejemplo_pull_request.md).

---

## 🛠️ Script Auxiliar de Verificación

El estudiante o tú pueden ejecutar en cualquier momento el script automatizado:
```bash
bash .agents/skills/crear-pull-request/scripts/verificar-entrega.sh
```
Este script audita la integridad de las pruebas, el estado de git y genera la URL del PR en la terminal.
