# 📜 Bitácora de Uso de IA en el Colegio Mágico (Entrega en PR)

> **Instrucciones:** Copia todo este contenido y pégalo en la descripción de tu Pull Request (PR).  
> **Recordatorio:** Este informe vale el **20% de tu calificación final** y debe ser redactado con tus propias palabras (sin utilizar IA para generar el texto del reporte).

---

## 🧙‍♂️ Datos del Aprendiz
* **Nombre del Estudiante:** [Santiago Fonseca Ramirez]
* **Usuario de GitHub:** [[Fonseca28](https://github.com/Fonseca28)]
* **Herramientas de IA utilizadas:** [Claude,OpenCode]

---

## 🔍 Bitácora del Reto 5: El Transmutador de Estados (Filtros y Estabilidad)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[# RETO 5: MOTOR DE BÚSQUEDA, FILTROS COMBINADOS Y ESTABILIDAD

## Objetivo
Completar el Reto 5 en `caldero.component.ts`: implementar
`getPocionesFiltradas()` y `calcularEstabilidadCaldero()` para que pasen los
tests 5.1 a 5.9. Haz el cambio mínimo necesario.

## Dónde está lo que debes hacer
Busca en `caldero.component.ts` los comentarios `TODO: Reto 5` (motor de
búsqueda y filtros combinados, y estabilidad del caldero). Sigue exactamente lo
que dicen. Revisa también en el spec los tests 5.1 a 5.9 para ver qué exigen.

## Requisitos clave
- `getPocionesFiltradas()` devuelve una copia filtrada y ordenada de
  `this.pociones`. Los filtros son: texto (nombre o descripción, sin distinguir
  mayúsculas, vacío = no filtra), tipo de magia (distinto de 'TODAS') y solo
  peligrosas (`nivelPeligro > 7`). El orden por `nivelPeligro` se aplica después
  de los filtros.
- `calcularEstabilidadCaldero()` devuelve 'CRÍTICO' con 2 o más pociones de
  peligro >= 8, 'INESTABLE' con al menos 1 de peligro >= 5 y 'SEGURO' en los
  demás casos.

## Restricciones
- No modificar `this.pociones` ni ordenarlo directamente (usar una copia).
- No modificar archivos `*.spec.ts` ni debilitar pruebas.
- Mantener nombres de propiedades, métodos y tipos actuales.
- No tocar los Retos 3, 4 y 6 ni lo que ya funciona.
- No agregar dependencias ni refactorizar código ajeno al reto.

## Flujo de trabajo
1. Leer el archivo y el spec antes de editar.
2. Explicarme en español, con ejemplos sencillos, qué hace el código actual.
3. Implementar la solución.
4. Ejecutar `npm run test:ci` y mostrarme el resultado real (sin afirmar que
   pasa si no se ejecutó).
5. Revisar el diff: solo debe cambiar el archivo del Reto 5.
6. [GIT: commit/push según lo que yo decida]

## Explicación
Explícame qué hace cada filtro, por qué se usa una copia del arreglo y cómo
funciona el ordenamiento. No avances al Reto 6 hasta terminar este.

## Reporte final
Archivos modificados, cambios, tests ejecutados con resultado real y pendientes.]
```

### 2. ¿Qué respuesta te entregó la IA?
*Describe brevemente la solución que te propuso:*
- [Implemento dos métodos en caldero.component.ts:
Cuales son:
getPocionesFiltradas()
Cual crea una copia de this.pociones con [...this.pociones] para no mutar el arreglo original.
Aplica tres filtros combinados con &&:
Texto: convierte filtroTexto a minúsculas y busca coincidencia en nombre o descripcion; si está vacío, no filtra.
Tipo de magia: si filtroTipoMagia !== 'TODAS', exige que coincida con tipoMagia.
Peligrosas: si filtroSoloPeligrosas es true, exige nivelPeligro > 7.
Ordena el resultado por nivelPeligro después de filtrar: ascendente (a - b) si ordenAscendente es true, descendente (b - a) si es false.
calcularEstabilidadCaldero()
Cuenta las pociones con nivelPeligro >= 8: si hay 2 o más, devuelve 'CRÍTICO'.
Si no, comprueba si existe al menos una con nivelPeligro >= 5: devuelve 'INESTABLE'.
En caso contrario, devuelve 'SEGURO'.]

### 3. Ajustes y Correcciones Manuales
*¿La solución funcionó a la primera? ¿Qué tuviste que corregir o adaptar para que pasaran las pruebas del Tribunal?*
- [funciono a la primera]

---

## ⏳ Bitácora del Reto 6: El Giratiempo (Undo / Redo Inmutable)

### 1. Prompt Principal Formulado
> *Pega aquí el prompt exacto que le diste a la IA:*
```text
[# RETO 6: EL GIRATIEMPO (HISTORIAL UNDO / REDO INMUTABLE)

## Objetivo
Completar el Reto 6 en `caldero.component.ts`: implementar `guardarEstadoGiratiempo()`,
`puedeDeshacer()`, `puedeRehacer()`, `giratiempoDeshacer()` y `giratiempoRehacer()`
para que pasen los tests 6.1 a 6.5. Haz el cambio mínimo necesario.

## Dónde está lo que debes hacer
Busca en `caldero.component.ts` los comentarios `TODO: Reto 6` (El Giratiempo /
Historial Inmutable) y sigue exactamente lo que dicen. Revisa también en el spec
los tests 6.1 a 6.5 para ver qué exigen (valores iniciales, nombres de
propiedades y comportamiento esperado).

## Requisitos clave
- Usa las propiedades `historialPasos` e `indiceHistorial`. Comprueba si ya están
  declaradas y con qué valor inicial. Si faltan, decláralas con el tipo y valor
  inicial que pidan los tests.
- `guardarEstadoGiratiempo()`: si se hizo undo y se agrega una acción, descarta el
  futuro (`slice(0, indiceHistorial + 1)`). Después clona `this.pociones` en
  profundidad (`structuredClone` o equivalente), añade el clon a `historialPasos`
  y mueve `indiceHistorial` al último paso.
- `puedeDeshacer()`: `true` si `indiceHistorial > 0`.
- `puedeRehacer()`: `true` si `indiceHistorial < historialPasos.length - 1`.
- `giratiempoDeshacer()`: retrocede el índice y restaura una copia (clon) de ese
  estado en `this.pociones`. No debe hacer nada si no se puede deshacer.
- `giratiempoRehacer()`: avanza el índice y restaura una copia (clon) de ese
  estado en `this.pociones`. No debe hacer nada si no se puede rehacer.
- Inmutabilidad profunda: ni el historial ni `this.pociones` deben compartir
  referencias de memoria entre sí (ni al guardar ni al restaurar).

## Restricciones
- No modificar archivos `*.spec.ts` ni debilitar pruebas.
- Mantener nombres de propiedades, métodos y tipos actuales.
- No tocar los Retos 1 al 5 ni el 7, ni lo que ya funciona (los Retos 4 y 5
  ya están implementados y pasan sus tests).
- No agregar dependencias ni refactorizar código ajeno al reto.

## Flujo de trabajo
1. Revisar el estado del repositorio (`git status`) y confirmar que los Retos 4 y
   5 siguen implementados antes de editar.
2. Leer el archivo y el spec del Reto 6 (6.1 a 6.5).
3. Explicarme en español, con ejemplos sencillos, qué hace el código actual.
4. Implementar la solución.
5. Ejecutar `npm run test:ci` y mostrarme el resultado real (sin afirmar que
   pasa si no se ejecutó). Debe quedar en 42 de 42 sin fallos.
6. Revisar el diff: solo debe cambiar el archivo del Reto 6, y no deben
   desaparecer los cambios de los Retos 4 y 5.
7. [GIT: commit/push según lo que yo decida]

## Explicación
Explícame cómo funciona el historial con el índice, por qué se descarta el
futuro al hacer una acción nueva después de un undo, y por qué se necesitan
clones profundos. Usa un ejemplo corto (por ejemplo, 3 estados y un undo).

## Reporte final
Archivos modificados, cambios, tests ejecutados con resultado real y pendientes.]
```

### 2. ¿Cómo abordó la IA la inmutabilidad de los objetos?
*Explica qué método te sugirió para clonar el arreglo de pociones sin mutar las referencias originales (ej. map con spread operator, structuredClone, etc.):*
- [Sugirio structuredClone ya que copia todo el arreglo con todo lo de adentro]

### 3. Depuración de Errores con la IA
*Si una prueba de Jasmine falló, ¿cómo usaste la IA para encontrar el bug?*
- [En este proyecto no me paas ningun problema,Pero normalmente le pregunto que analize el error que aparecio y que me aydue a entender y como solucionarlo]

---

## 🎨 Resumen del Reto Creativo (Reto 7 - 30%)
* **Nombre de tu Artefacto Mágico:** [Tamagichi Escarbato]
* **¿Qué hace tu artefacto y cómo interactúa el usuario?**
  - [Usted lo adopta,cuida,evoluciona y escapa,Donde se alimenta,juega y se le pone a dormir,al jugarlo se le guarda los tesoros y si no lo alimentos y no lo cuidas se escapa,y si lo cuidas bien evoluciona]
* **¿Qué hooks de ciclo de vida implementaste?**
  - [Ej: ngOnInit inicar la cria y el temporizador, ngOnDestroy para limpiar el intervalo ]
* **¿Qué directivas y enlaces utilizaste?**
  - [Ej: @if cual cambia de pantalla segun el estado(madrigera,evolucionando,cuidando,escapando),@for dodne recorres las comidas y tesoros que tienes con @empty para mostrar cuando esta vacio,[(ngModel)] para el nombre del escarabato y para la comida seleccionada,]

---

## 💡 Reflexión Crítica del Aprendiz
*¿En qué momentos sentiste que la IA te ahorró tiempo y en qué momentos una mala respuesta te retrasó?*
- [me ahorro mucho para entender el test cual no entendia bien las cosas,y en partes que me falta conceptos para poder entenderlo,pero me retrazo cuando la ia solo hace el commit el solo y me dificulto el proceso]
