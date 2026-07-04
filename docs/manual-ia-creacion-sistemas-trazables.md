# Manual IA para Crear Sistemas Trazables

Este manual explica como usar IA para crear, redisenar o auditar sistemas sin
perder logica de negocio, integridad, trazabilidad ni claridad visual. 

La idea central: una IA trabaja mejor cuando recibe decisiones claras, lenguaje
estable, fuentes verificables y criterios de aceptacion observables.


## Principios para sistemas trazables

### 1. Primero la decision, despues la forma

Antes de pedir pantallas, componentes o codigo, define que decision debe tomar
el usuario o el sistema.

Ejemplo:

```text
La pantalla de inventario debe responder primero:
"que ingrediente esta en riesgo y cual debo reponer?"
```

### 2. Preservar comportamiento es obligatorio

Un cambio visual o de estructura no debe romper rutas, permisos, formularios,
filtros, validaciones ni logica de negocio. Si algo debe cambiar, debe decirse
como cambio funcional y aprobarse como tal.

### 3. Todo dato debe tener fuente

Un KPI, grafico o alerta debe venir de datos existentes, de un calculo derivado
verificable o de una nueva fuente aprobada. Nunca debe inventarse para que la UI
se vea completa.

### 4. La trazabilidad se disena

No basta con mostrar numeros. El sistema debe permitir entender de donde viene
cada numero importante: venta, compra, gasto, inventario, pedido, produccion,
usuario, reporte o asiento.

### 5. La integridad necesita evidencia

Usa "integro" solo cuando puedes revisar consistencia con pruebas, reglas,
checklists o auditorias. En sistemas con dinero, stock o permisos, la palabra
"integro" debe significar algo comprobable.

### 6. La deuda tecnica se nombra

Si una decision crea deuda tecnica, visual o documental, debe registrarse. La
deuda explicita se puede gestionar; la deuda escondida se convierte en riesgo.

### 7. La IA debe trabajar con limites

Toda instruccion a IA debe aclarar lo que puede tocar y lo que no. Ejemplo:
"visual-only", "sin migraciones", "sin cambiar backend", "usar datos
existentes", "no modificar reglas de dominio".

### 8. Investigar antes de decidir

Antes de implementar, la IA debe revisar fuentes locales y, cuando haga falta,
referencias externas confiables. Investigar no significa acumular enlaces;
significa reducir incertidumbre para tomar una decision mejor.

### 9. Validar despues de construir

Una respuesta de IA no esta completa solo porque genero codigo o texto. Debe
cerrar con evidencia: archivos creados, pruebas, build, checklist, revision
visual, fuentes consultadas o limitaciones declaradas.

## Como investigar antes de implementar

Usa esta secuencia cuando una tarea tenga ambiguedad, impacto tecnico o
vocabulario especializado:

1. Revisar fuentes locales: specs, planes, ADRs, glosarios, rutas, modelos,
   tests, configuracion y documentos previos.
2. Identificar que falta: decision de producto, dato, dependencia, regla de
   dominio, estandar o criterio de calidad.
3. Consultar fuentes externas solo para conceptos generales, normas, buenas
   practicas o informacion que puede haber cambiado.
4. Separar hechos de inferencias. Un hecho viene de un archivo o fuente; una
   inferencia debe decir "por lo tanto" o "se asume".
5. Convertir la investigacion en decision, riesgo, criterio de aceptacion o
   pregunta concreta.

Prompt util:

```text
Antes de planificar, investiga el contexto.

Primero revisa fuentes locales relevantes.
Luego, si el concepto es general o normativo, consulta fuentes confiables.
Entrega:
- Hechos encontrados.
- Inferencias.
- Riesgos.
- Decisiones recomendadas.
- Preguntas que realmente bloquean.
```

## Como pedir cambios a IA sin romper logica de negocio

Usa esta estructura:

```text
Objetivo:
Quiero [resultado observable].

Contexto:
El sistema es [tipo de sistema]. La feature afecta [modulos].

Logica de negocio que debe preservarse:
- [regla 1]
- [regla 2]
- [regla 3]

Alcance:
Puedes cambiar [archivos/capas].
No puedes cambiar [rutas/permisos/modelos/migraciones/reglas].

Datos:
Usa solo [fuentes existentes].
Si falta un dato, documenta el vacio o propone una pregunta antes de implementarlo.

Criterios de aceptacion:
- [criterio verificable 1]
- [criterio verificable 2]
- [criterio verificable 3]
```

Ejemplo aplicado:

```text
Objetivo:
Redisenar la pantalla de pedidos para que la cola activa sea la primera lectura.

Logica de negocio que debe preservarse:
- Los estados de pedido no cambian.
- Las rutas de crear, ver, marcar listo y entregar se mantienen.
- Los filtros GET siguen funcionando.

Alcance:
Solo Blade/CSS/JS si ya existe el dato.
No crear migraciones ni nuevos estados.

Criterios:
- En mobile se ve primero cola activa y accion principal.
- No se repiten conteos de estado si no agregan una decision.
- El build pasa.
```

## Como exigir preservacion de rutas, datos, permisos y comportamiento

Pide a la IA que haga una verificacion previa antes de editar:

```text
Antes de implementar, verifica:
- Rutas usadas por botones y formularios.
- Campos enviados por cada formulario.
- Permisos o middlewares existentes.
- Variables disponibles en la vista.
- Componentes y scripts que ya existen.
- Estados vacio, cero, error, hover, focus y mobile.

No dependas de algo que no hayas verificado.
```

Durante la implementacion, usa esta regla:

```text
Puedes mover o reformar una accion, pero no eliminar su capacidad real.
Si cambias donde vive un boton, conserva su ruta, metodo, payload y permisos.
```

## Como documentar decisiones, riesgos y deuda tecnica

### Decision documentada

Usa este formato cuando algo cambia jerarquia, KPI, orden de pantalla, datos o
arquitectura:

```text
Decision:
[Que se decidio]

Razon:
[Por que ayuda al usuario o al sistema]

Alternativas consideradas:
- [opcion rechazada y razon]

Limites:
[Que no cambia]

Evidencia esperada:
[Como se valida]
```

### Plan de riesgos

Usa este formato para una feature importante:

```text
Riesgo:
[Que podria salir mal]

Impacto:
[Que se rompe o se vuelve confuso]

Senal de alerta:
[Como lo detectamos]

Mitigacion:
[Que haremos para reducirlo]

Decision:
[Aceptar, evitar, reducir o aplazar]
```

Ejemplos de riesgos frecuentes:

- Una nueva UI repite KPIs y aumenta carga cognitiva.
- Un grafico usa datos incompletos y crea falsa precision.
- Una refactorizacion cambia comportamiento sin pruebas.
- Una migracion aparece en una feature que debia ser visual-only.
- Una accion se mueve y deja de ser visible en mobile.
- La documentacion dice "trazable" pero no explica la fuente del dato.
- Una IA cambia una regla de dominio porque confundio mejora visual con cambio
  funcional.
- Un prompt pide "optimizar" sin decir si prioriza rendimiento, claridad,
  mantenibilidad, costo o experiencia.

### Matriz ligera de riesgos

Para sistemas pequenos o medianos, esta matriz suele bastar:

```text
Riesgo:
Impacto: bajo / medio / alto
Probabilidad: baja / media / alta
Detectable por:
Mitigacion:
Evidencia:
Decision:
```

Usala para deuda tecnica, seguridad, datos, UI, IA, rendimiento, accesibilidad y
operacion.

### Registro de deuda tecnica

Usa este formato:

```text
Deuda:
[Que queda pendiente o fragil]

Causa:
[Por que se acepto]

Riesgo:
[Que puede pasar si no se corrige]

Plan:
[Cuando o como se atendera]
```

## Como convertir una idea en spec, plan, tareas y checklist

### 1. Spec

La spec responde que se quiere lograr y como se sabra que funciona.

Debe incluir:

- Objetivo.
- Usuarios o audiencia.
- Escenarios principales.
- Requisitos funcionales.
- Requisitos no funcionales.
- Edge cases.
- Criterios de exito.
- Supuestos.
- Fuera de alcance.

Prompt util:

```text
Crea una spec para esta feature.
Debe incluir objetivo, user stories, requisitos, edge cases, criterios medibles,
supuestos y fuera de alcance.
No propongas implementacion todavia.
Marca cualquier ambiguedad que pueda cambiar alcance o logica de negocio.
```

### 2. Plan

El plan decide como se construira.

Debe incluir:

- Resumen tecnico.
- Archivos o subsistemas afectados.
- Interfaces publicas o contratos.
- Datos de entrada y salida.
- Riesgos y mitigaciones.
- Validacion.
- Limites explicitos.



### 3. Tasks

Las tareas convierten el plan en pasos ejecutables.

Deben ser:

- Pequenas.
- Ordenadas por dependencia.
- Verificables.
- Con archivo o resultado esperado cuando aplique.
- Separadas por fase o historia.
- Separadas entre investigacion, implementacion y verificacion cuando el riesgo
  lo justifique.

Prompt util:



### 4. Checklist

El checklist evita olvidar reglas al revisar.

Ejemplo:

```text
- La decision principal aparece primero.
- No se cambio logica de negocio.
- No se agregaron migraciones sin aprobacion.
- Toda accion conserva ruta, metodo y permisos.
- Todo KPI tiene fuente.
- Los estados cero y vacio son honestos.
- Mobile no es solo una pila de cards.
- Hay evidencia de build, test o revision manual.
```

## Como generalizar patrones entre sistemas

Un patron es reusable cuando conserva la intencion, no cuando copia la forma.

Cuando uses este manual en otro sistema, cambia ejemplos y fuentes de dominio,
pero conserva las preguntas:

- Que decision debe tomar el usuario?
- Que regla no puede romperse?
- De donde viene el dato?
- Que riesgo estamos aceptando?
- Como se valida?
- Que deuda queda?


## Como usar terminos tecnicos con IA

### "Trazable"

Usalo asi:

```text
El resultado debe ser trazable: cada KPI o lectura debe indicar de que dato,
evento o fuente viene.
```

No lo uses como sinonimo generico de "bien hecho".

### "Integro"

Usalo asi:

```text
El flujo debe mantener integridad: no debe dejar stock, pagos, kardex, permisos
o estados en contradiccion.
```

Pide evidencia:

```text
Indica que pruebas, checks o revisiones demuestran integridad.
```

### "Logica de negocio"

Usalo asi:

```text
No cambies logica de negocio. Preserva calculos, estados, transacciones,
validaciones y efectos secundarios existentes.
```

### "Deuda tecnica"

Usalo asi:

```text
Si eliges una solucion temporal, documenta la deuda tecnica, el riesgo y el
plan para corregirla.
```

### "Plan de riesgos"

Usalo asi:

```text
Incluye un plan de riesgos con impacto, senal de alerta, mitigacion y decision.
```

### "Storytelling"

Usalo asi:

```text
Usa data storytelling: muestra tendencia, riesgo, comparacion o siguiente accion
con datos existentes. No agregues graficos decorativos.
```

### "Contrato"

Usalo asi:

```text
Antes de implementar, define el contrato del modulo: pregunta principal, KPI,
datos, acciones, estados, mobile order y comportamiento preservado.
```

## Regla de oro

Cuando trabajes con IA, no pidas solo "hazlo bonito" o "arreglalo". Pide una
decision trazable, con comportamiento preservado, datos verificables, riesgos
nombrados y criterios de aceptacion claros.
