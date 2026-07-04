# Manual de Experiencias IA para Hackathon y Buildathon

Este manual es una guia practica para preparar un sistema nuevo en un
hackathon/buildathon usando IA sin perder criterio, foco, trazabilidad ni
capacidad de demostrar valor. No documenta la arquitectura de ningun sistema
previo. Toma experiencias acumuladas y las convierte en reglas, plantillas,
checklists y formas de trabajo para competir mejor.

La idea central es simple: en una competencia no gana necesariamente el equipo
que construye mas, sino el que entiende mejor el problema, recorta con
inteligencia, demuestra impacto, controla riesgos y cuenta una historia clara.

## Proposito

Este documento ayuda a:

- Convertir una idea amplia en un MVP demostrable.
- Usar IA como equipo ampliado, no como piloto automatico.
- Definir un demo path que funcione de inicio a fin.
- Preparar storytelling, pitch y evidencia para jueces.
- Evitar deuda peligrosa durante trabajo rapido.
- Repartir roles entre Codex, Cursor, n8n, ElevenLabs, Zabu, Flow, MCP y skills.
- Mantener humano en el ciclo cuando haya datos, decisiones o acciones sensibles.

No busca:

- Explicar arquitectura interna de proyectos anteriores.
- Copiar soluciones tecnicas sin contexto.
- Crear un documento largo que nadie use durante el evento.
- Reemplazar criterio humano con automatizacion.



### Evidencia mata promesa

No basta decir "nuestro sistema es inteligente", "es escalable" o "automatiza".
Hay que mostrar:

- Pantalla funcionando.
- Flujo completado.
- Dato antes/despues.
- Respuesta de API o automatizacion.
- Prueba, checklist o grabacion.
- Fallback si algo falla.

## Experiencias Transferibles

### 1. Nombrar bien evita confusiones caras

Cuando el equipo usa palabras ambiguas, la IA tambien se confunde. Definir
terminos desde el inicio ayuda a construir mas rapido.

Ejemplos de terminos que conviene fijar:

- Usuario principal.
- Problema.
- Demo path.
- Accion critica.
- Dato fuente.
- Resultado visible.
- Criterio de aceptacion.
- Riesgo.
- Fallback.

### 2. El KPI principal debe aparecer antes que el detalle

Si la demo necesita explicar cinco pantallas antes de mostrar valor, esta tarde.
La primera lectura debe decir que importa:

- tiempo ahorrado,
- dinero recuperado,
- riesgo detectado,
- tarea completada,
- personas ayudadas,
- error evitado,
- decision recomendada.

### 3. Los datos deben tener origen

Un numero bonito sin fuente puede destruir confianza. Para hackathon, basta una
trazabilidad simple:

```text
Dato mostrado:
De donde viene:
Como se calcula:
Que pasa si falta:
Como lo explico al juez:
```

### 4. El estado vacio tambien se presenta

Muchos demos fallan cuando no hay datos. Preparar estados vacios evita pantallas
muertas:

- "No hay registros todavia. Crea el primero."
- "No se recibio respuesta del servicio. Mostramos datos de respaldo."
- "Aun no hay historial suficiente para tendencia."
- "Demo sin conexion: usando dataset local."

### 5. La deuda aceptada debe ser visible

En competencia se acepta deuda, pero no deuda escondida. Diferencia:

- Deuda aceptable: "mock de pagos para demo, reemplazar por proveedor real".
- Deuda peligrosa: "credenciales pegadas en codigo".
- Deuda de demo: "flujo funciona con dataset preparado, no con cualquier archivo".
- Deuda de explicacion: "el equipo entiende el sistema, pero el juez no".

### 6. El revisor independiente mejora el resultado

Un miembro del equipo debe actuar como juez antes de la presentacion. Su trabajo
no es ser amable; es encontrar:

- flujo roto,
- historia confusa,
- texto demasiado largo,
- credenciales visibles,
- promesas sin evidencia,
- dependencia de internet sin fallback,
- feature que no aporta al criterio de evaluacion.

### 7. Mobile y accesibilidad no son lujo

Si la demo se ve en laptop, proyector o celular, debe seguir entendiendose. Lo
minimo:

- texto legible,
- contraste suficiente,
- botones principales visibles,
- nada cortado,
- sin animaciones que retrasen,
- foco claro para formularios,
- pantalla inicial entendible sin narracion larga.

## Lenguaje clave para el equipo

### Trazable

Algo es trazable si se puede explicar de donde viene. En un hackathon:

```text
Este resultado viene de este input, pasa por este flujo y produce esta salida.
```

Usalo para datos, decisiones, automatizaciones, prompts y evaluaciones.

### Integro

Algo es integro si no deja contradicciones. En una demo:

```text
Si el usuario completa la accion, el estado final coincide con lo que prometimos.
```

No digas "integro" sin evidencia.

### Logica de negocio

Reglas esenciales del dominio, incluso si el dominio es inventado para el
evento. Ejemplos:

- una solicitud aprobada cambia de estado,
- un pago no puede duplicarse,
- un diagnostico debe marcar fuente,
- una reserva debe tener fecha,
- una alerta debe tener severidad.

### Deuda tecnica

Costo futuro por una decision rapida. En competencia puede aceptarse si:

- no rompe demo,
- no expone secretos,
- no engaña al juez,
- queda registrada,
- tiene plan post-evento.

### Deuda de demo

Fragilidad especifica de la presentacion:

- depende de una cuenta externa,
- requiere internet,
- solo funciona con un archivo,
- necesita datos cargados antes,
- tarda demasiado en responder,
- no tiene fallback.

### Plan de riesgos

Lista viva de que puede fallar, como detectarlo y que hara el equipo.

### Demo path

Ruta minima que el juez debe ver funcionando sin fallar.

### Criterio de aceptacion

Condicion observable para decir "esto esta listo". Ejemplo:

```text
El juez puede crear una solicitud, recibir una recomendacion IA y ver una
explicacion trazable en menos de 90 segundos.
```

### Evidencia

Prueba concreta: pantalla, log, test, export, audio, automatizacion, video,
dataset, captura o checklist.

### Diferenciador

Lo que hace que el proyecto no sea "otra app con IA". Puede ser:

- mejor problema,
- mejor flujo,
- mejor integracion,
- mejor demo,
- mejor impacto,
- mejor confianza,
- mejor uso multimodal,
- mejor automatizacion,
- mejor explicabilidad.



### Regla de oro del demo

Si algo no ayuda al juez a ver el antes/despues, no debe ocupar el centro de la
demo.


## Plan de riesgos de competencia

### Matriz rapida

| Riesgo | Senal | Mitigacion | Fallback |
|---|---|---|---|
| Internet falla | APIs no responden | dataset local | video corto |
| API se agota | errores 401/429 | plan alterno, limitar llamadas | mock honesto |
| Demo se rompe | flujo no completa | congelar version | capturas/video |
| IA inventa | respuesta sin fuente | pedir citas/datos | modo manual |
| Pitch largo | no llega al demo | ensayar con cronometro | cortar intro |
| Scope creep | demasiadas pantallas | demo path manda | backlog post-evento |
| Credenciales expuestas | keys en repo/pantalla | env vars, limpiar logs | rotar keys |
| Voz no se escucha | audio bajo/sala ruidosa | subtitulos | reproducir texto |
| Workflow lento | demora visible | ejecucion previa | mostrar evidencia |
| UI confusa | juez pregunta que mirar | KPI principal | narracion guiada |

### Riesgos especificos de IA

- Prompt injection: texto externo intenta instruir al modelo para ignorar reglas.
- Tool overreach: un agente tiene mas permisos de los necesarios.
- Data leakage: se envia informacion sensible a servicios externos.
- Hallucination: la IA responde con confianza pero sin fuente.
- Automation runaway: un workflow se repite, envia spam o consume credito.
- Human bypass: el sistema toma decisiones sensibles sin revision humana.

Mitigaciones:

- limitar permisos,
- usar datos de demo anonimos,
- mantener humano en el ciclo,
- registrar fuentes,
- agregar fallback manual,
- no exponer secretos,
- probar prompts con entradas adversas,
- definir acciones prohibidas.

## Deuda aceptable vs deuda peligrosa

| Tipo | Aceptable en hackathon | Peligrosa |
|---|---|---|
| Datos | dataset pequeno anonimo | datos reales sensibles |
| IA | respuesta explicada y revisable | decision automatica sin fuente |
| UI | flujo principal pulido | muchas pantallas a medias |
| Backend | mock honesto para demo | fingir integracion real |
| Seguridad | keys en entorno local | keys en repo o pantalla |
| Tests | checklist manual + prueba core | cero validacion del demo |
| Docs | README corto y claro | nada explica como correr |

## Plantillas de prompts

### Prompt para definir idea

```text
Actua como mentor de hackathon.
Ayudame a recortar esta idea.

Idea:
[descripcion]

Entrega:
- usuario principal,
- dolor real,
- demo path de 3 minutos,
- MVP minimo,
- diferenciador,
- riesgos,
- que cortar,
- primera tarea para construir.
```

## Checklists

### Checklist de MVP

- Hay usuario claro.
- Hay problema en una frase.
- Hay demo path escrito.
- El flujo principal corre de inicio a fin.
- Hay dato de entrada preparado.
- Hay resultado visible.
- Hay evidencia.
- Hay fallback.
- Hay README o instrucciones cortas.
- Hay responsable de presentar.
- Hay responsable de apagar integraciones si algo falla.

### Checklist de demo

- App abierta o URL lista.
- Dataset cargado.
- Credenciales fuera de pantalla.
- Audio probado.
- Internet probado.
- Video backup grabado.
- Navegador limpio.
- Zoom del navegador adecuado.
- Primer click ensayado.
- Ultimo resultado ensayado.
- Preguntas tecnicas preparadas.

### Checklist de IA segura

- No se subieron secretos al repo.
- No se pegaron API keys en prompts publicos.
- Los datos de demo son anonimos.
- Las herramientas tienen permisos minimos.
- Las respuestas IA muestran fuente o explicacion.
- Hay humano en decisiones sensibles.
- Hay fallback si la IA falla.
- Los workflows tienen manejo de error.

### Checklist de pitch

- Problema en 20 segundos.
- Usuario concreto.
- Antes/despues claro.
- Demo ocupa la mayor parte.
- Diferenciador explicado.
- Impacto cuantificado o cualificado.
- Limites nombrados con confianza.
- Cierre memorable.

## Contrato de agente

Usa este contrato cuando varias IAs participen:

```text
Agente/herramienta:
Rol:
Puede hacer:
No puede hacer:
Fuentes que debe leer:
Datos permitidos:
Secretos prohibidos:
Evidencia esperada:
Criterio de terminado:
Responsable humano:
```

Ejemplo:

```text
Agente/herramienta: Codex
Rol: implementar y revisar el corte vertical.
Puede hacer: editar codigo del MVP, crear tests ligeros, documentar riesgos.
No puede hacer: cambiar alcance, exponer keys, agregar features fuera del demo.
Evidencia esperada: demo corriendo, archivos listados, validacion ejecutada.
Responsable humano: builder lead.
```

## Matriz de herramientas

| Necesidad | Herramienta principal | Apoyo | Riesgo |
|---|---|---|---|
| Plan y recorte | Codex | equipo | plan demasiado grande |
| Edicion rapida | Cursor | Codex | cambios sin revisar |
| Automatizacion | n8n | MCP/API | credenciales o errores |
| Voz | ElevenLabs | guion humano | latencia o audio bajo |
| Orquestacion externa | Zabu/Flow | n8n/MCP | fuente no verificada |
| Conectar herramientas | MCP | Codex/Cursor | permisos amplios |
| Repetir procesos | Skills | docs | instrucciones viejas |
| QA final | Codex + humano | checklist | sesgo del creador |

## Antipatrones

### Construir demasiado

Sintoma: muchas pantallas, ninguna memorable. Solucion: volver al demo path.

### Explicar arquitectura antes que valor

Sintoma: pitch empieza con stack tecnico. Solucion: abrir con problema humano y
mostrar resultado.

### Demo sin historia

Sintoma: el equipo hace clicks sin explicar por que importan. Solucion: narrar
antes/despues.

### IA sin supervision

Sintoma: respuestas o acciones automaticas sin revision. Solucion: humano en el
ciclo y explicacion trazable.

### Automatizacion sin fallback

Sintoma: todo depende de una API en vivo. Solucion: dataset, mock honesto,
capturas o video backup.

### Voz por decoracion

Sintoma: audio bonito que no mejora comprension. Solucion: usar voz solo si
aclara, guia o diferencia.

### Secretos en pantalla

Sintoma: API keys en repo, consola, logs, captura o prompt. Solucion: variables
de entorno, redaccion, rotacion y limpieza antes de presentar.

### Storytelling falso

Sintoma: graficos o metricas sin fuente. Solucion: mostrar fuente, formula o
decir que es dato simulado.
