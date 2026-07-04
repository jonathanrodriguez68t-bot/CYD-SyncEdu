# Glosario Visual y Tecnico para Sistemas

Este documento reune terminos, tecnicas, habilidades y patrones utiles para
disenar, planificar, auditar y mantener sistemas con decisiones claras,
trazables e integras. 

El alcance no es solo visual. Incluye producto, negocio, arquitectura, datos,
calidad, deuda tecnica, riesgos, validacion y trabajo con IA.


## Producto y dominio

### Logica de negocio

Reglas reales del sistema que representan como funciona la panaderia o cualquier
negocio: vender, reservar stock, descontar ingredientes, registrar pagos,
cancelar ventas, crear pedidos o generar asientos contables. La UI puede cambiar
su forma, pero no debe romper estas reglas.

### Regla de dominio

Condicion que siempre debe cumplirse dentro del negocio. Ejemplos: una venta
descuenta stock, una cancelacion revierte movimientos, una receta define consumo
de ingredientes, un asiento contable debe conservar equilibrio.

### Modelo de dominio

Representacion de las entidades, relaciones, reglas y palabras propias del
negocio. Ayuda a que producto, desarrollo, QA e IA hablen del mismo sistema sin
mezclar conceptos.

### Flujo operativo

Secuencia diaria que sigue una persona para completar una tarea. Ejemplos:
seleccionar productos, cobrar, entregar pedido, registrar produccion o revisar
inventario. Un buen flujo muestra primero la decision y luego los detalles.

### Comportamiento preservado

Garantia de que rutas, formularios, permisos, filtros, acciones, datos enviados
y reglas de negocio siguen funcionando igual despues de un cambio visual o
tecnico.

### Baseline preservado

Pantalla, flujo o comportamiento usado como referencia que no debe modificarse
sin aprobacion explicita. Sirve para mantener una fuente estable de comparacion.

### Modulo

Area funcional del sistema con una tarea dominante. Ejemplos: Ventas, Pedidos,
Inventario, Produccion, Productos, Recetas, Finanzas y Usuarios.

### Tarea dominante

Pregunta principal que una pantalla debe responder. Evita que la interfaz sea
una suma de datos sueltos. Ejemplo: en Ventas, "cuanto dinero entro y que venta
requiere accion?".

### Lectura operativa

Frase o lectura corta que interpreta los datos para ayudar a decidir. No solo
muestra numeros; explica el estado de la operacion.

### Decision principal

La accion mental que el usuario debe poder tomar primero: vender, revisar,
preparar, reponer, corregir, entregar, auditar o cerrar.

### Alcance

Limite explicito de lo que se hara y lo que no se hara. En `002-visual-ui-flow`,
el alcance fue visual: cambiar composicion y jerarquia sin cambiar reglas de
negocio ni base de datos.

### Fuera de alcance

Trabajo que no debe hacerse en una feature especifica. Ejemplo: crear nuevas
migraciones, cambiar permisos o inventar KPIs sin datos existentes cuando la
feature fue declarada visual-only.

### Requisito

Condicion que el sistema debe cumplir. Puede ser funcional, visual, tecnico,
legal, operativo, de seguridad, de rendimiento o de accesibilidad.

### Requisito no funcional

Condicion de calidad que no describe una accion directa del usuario, sino como
debe comportarse el sistema: rendimiento, seguridad, accesibilidad,
mantenibilidad, disponibilidad, auditabilidad o usabilidad.

## Arquitectura y programacion

### Contrato

Acuerdo documentado que define que debe cumplir una pieza antes de implementarse.
En este proyecto, el contrato visual exige pregunta principal, KPI, flujo,
accion, estados, datos existentes, mobile order y comportamiento preservado.

### Contrato visual

Version del contrato aplicada a una pantalla. Define como debe leerse la vista,
que informacion domina, que acciones quedan cerca, que se elimina o fusiona, y
como se valida en desktop y mobile.

### ADR

Architecture Decision Record. Documento corto que registra una decision tecnica
o de producto, su contexto, sus consecuencias y sus limites. Evita que una
decision importante quede solo en memoria o en conversacion.

### Dependencia verificada

Ruta, helper, componente, payload, script, clase, chart type o dato confirmado
antes de depender de el. Si no esta verificado, no debe usarse como base del
diseno o del codigo.

### Fuente de verdad

Archivo, modelo, accion, contrato o documento que manda cuando hay dudas. En
`002-visual-ui-flow`, Finanzas index fue la referencia visual primaria y
Dashboard fue la referencia secundaria.

### Fuente historica ausente

Documento o evidencia que una tarea dice haber usado, pero que ya no existe en
el estado actual del repositorio. Debe tratarse como deuda documental hasta que
se recupere, reemplace o se explique su ausencia.

### Arquitectura

Organizacion de alto nivel de un sistema: capas, responsabilidades,
dependencias, datos, integraciones, restricciones y decisiones que hacen posible
evolucionarlo.

### Migracion

Cambio de estructura en base de datos. Debe tratarse como cambio de alto impacto
porque altera persistencia, despliegue y compatibilidad. No debe agregarse a una
feature visual salvo aprobacion explicita.

### Backend boundary

Limite entre trabajo visual y cambios de backend. Si una feature es visual-only,
el backend solo se toca para reparar una dependencia rota indispensable.

### Frontend visual-only

Trabajo que cambia presentacion, jerarquia, orden, estados, tablas, graficos,
espaciado y composicion sin cambiar calculos, rutas, permisos ni reglas de
dominio.

### Payload

Datos entregados a una vista o script. Un grafico o KPI solo puede depender de
un payload existente o de una transformacion segura de datos ya disponibles.

### Refactor

Cambio interno que mejora estructura sin cambiar comportamiento externo. Puede
reducir deuda tecnica, pero debe tener pruebas o validacion cuando toca flujos
criticos.

### Mantenibilidad

Facilidad para cambiar, corregir, ampliar y entender un sistema sin generar
regresiones. Se mejora con nombres claros, pruebas, contratos, bajo acoplamiento
y decisiones documentadas.

### Acoplamiento

Grado de dependencia entre piezas. Alto acoplamiento significa que cambiar una
parte obliga a tocar muchas otras, aumentando riesgo y deuda tecnica.

### Cohesion

Grado en que una pieza agrupa responsabilidades relacionadas. Alta cohesion hace
que el codigo y la documentacion sean mas faciles de entender.

### Abstraccion

Forma reusable de encapsular una idea, componente o regla. Es util cuando reduce
duplicacion real o aclara un patron; es deuda si se crea antes de tiempo.

### Integracion

Conexion entre piezas del sistema: vista con ruta, controlador con accion,
modelo con relacion, chart con payload, formulario con request, o test con flujo
completo.

## UI, UX y visual storytelling

### KPI principal

Numero o lectura dominante de una pantalla. Debe responder la pregunta mas
importante del modulo y poder reconocerse en pocos segundos.

### Data storytelling

Tecnica para convertir datos crudos en una historia de decision: que cambio,
que esta en riesgo, que comparar, que requiere accion y que puede esperar.

### Decision-first UI

Patron de interfaz donde la primera lectura responde la pregunta mas importante
del usuario. Evita que una pantalla se convierta en tabla, card grid o reporte
sin prioridad.

### Jerarquia visual

Orden de importancia expresado con tamano, posicion, espacio, contraste,
proximidad y ritmo. La jerarquia correcta evita que todo parezca igual.

### Carga cognitiva

Esfuerzo mental necesario para entender una pantalla. Se reduce eliminando
repeticion, texto innecesario, cards sin proposito y acciones lejos de la
decision.

### Zona de accion

Area donde viven los comandos principales: nueva venta, nuevo pedido, registrar
movimiento, cambiar rango, abrir reporte o guardar.

### Zona de analisis

Area donde se comparan o explican datos mediante tablas, listas, graficos,
minigraficos, micrograficos, timelines, kanban o barras.

### Microstatus

Resumen compacto de salud o estado: stock, respaldos, pedidos entregados, datos
completos, alertas o errores menores. Debe aparecer despues de la decision
principal, no competir con ella.

### Minigrafico

Grafico pequeno para tendencia o proporcion. Orienta sin reemplazar un reporte
completo.

### Micrografico

Representacion muy compacta, como barra, sparkline o proporcion simple. Debe
aclarar riesgo, avance, comparacion o tendencia con datos existentes.

### Sparkline

Linea o micrografico muy pequeno que muestra ritmo o tendencia sin ejes pesados.
Sirve para escaneo rapido.

### Composicion asimetrica

Layout donde los bloques no tienen el mismo tamano. Se usa para mostrar
jerarquia real, no para decorar.

### Reticula 12 adaptable

Base de 12 columnas en desktop que puede adaptarse a 7/5, 8/4, 9/3, tabla con
riel lateral, layout escalonado o composicion abierta.

### Forma abierta

Composicion sin card tradicional: lineas, separadores, fondos transparentes,
bandas de color, riel lateral o texto con datos alrededor.

### Riel de evidencia

Zona secundaria, normalmente lateral o debajo del flujo principal, que sostiene
la decision con datos verificables: origen, estado, trazabilidad, suficiencia,
historial o detalle de calculo.

### Card util

Contenedor que agrupa informacion relacionada y mejora lectura. Si solo encierra
texto o repite otra zona, debe eliminarse, fusionarse o convertirse en layout
abierto.

### Redundancia visual

Repetir el mismo KPI, conteo, estado o texto en zonas cercanas sin agregar una
decision, comparacion, accion, detalle o contexto nuevo.

### Accion reformada

Boton o grupo de acciones movido, redimensionado, simplificado o reagrupado para
quedar cerca de la decision principal sin cambiar la ruta ni la accion real.

### Mobile-first order

Orden de lectura en celular: contexto, KPI o decision principal, accion
principal, analisis y detalles. No significa apilar cards sin criterio.

### Mobile no mecanico

Principio segun el cual mobile debe reorganizar prioridad, acciones, filtros,
tablas, graficos y detalles. Si solo apila el desktop, puede seguir siendo dificil
de usar.

### Estado vacio honesto

Diseno para cuando no hay datos. Debe explicar que significa el vacio y, si
aplica, cual es la siguiente accion. No debe fingir precision ni esconder el
problema.

### Microanimacion

Movimiento corto para feedback, carga, seleccion, refresh o confirmacion tactil.
No debe usarse como decoracion ni bloquear tareas.

### Reduced motion

Respeto por preferencias de movimiento reducido. Si el usuario prefiere menos
animacion, la interfaz conserva claridad sin depender del movimiento.

### Accesibilidad

Capacidad de una interfaz para ser usada por personas con distintas necesidades,
dispositivos y contextos. Incluye contraste, foco visible, navegacion por
teclado, texto claro, estructura semantica y alternativas cuando hay movimiento
o contenido visual.

### Usabilidad

Facilidad con la que una persona logra su objetivo sin confusion innecesaria.
No es solo estetica; depende de flujo, lenguaje, estados, feedback y jerarquia.

## Calidad, riesgos y deuda tecnica

### Deuda tecnica

Costo futuro creado por una decision rapida, incompleta o poco clara. Puede ser
codigo duplicado, reglas dispersas, falta de pruebas, dependencias no verificadas
o nombres ambiguos.

### Deuda visual

Costo futuro de una interfaz que funciona pero confunde: cards repetidas, KPIs
duplicados, textos largos, jerarquia plana, botones lejos de la tarea o mobile
solo apilado.

### Deuda de documentacion

Riesgo creado cuando las decisiones no quedan escritas. Hace dificil mantener,
auditar o explicar el sistema.

### Evidencia incompleta

Situacion donde la implementacion parece terminada, pero falta una prueba,
revision, fuente, captura, checklist o validacion final que confirme el cierre.

### Riesgo

Evento posible que puede romper calidad, alcance, datos, tiempo, seguridad,
rendimiento o confianza del usuario.

En investigacion de riesgos, conviene tratar el riesgo como incertidumbre frente
a objetivos: algo puede amenazar, retrasar o incluso revelar una oportunidad,
pero siempre debe evaluarse contra el objetivo del sistema.

### Plan de riesgos

Lista de riesgos con mitigacion, senales de alerta y decision de aceptacion. Un
plan de riesgos bueno no solo enumera problemas; dice como detectarlos y que se
hace si aparecen.

### Registro de riesgos

Inventario vivo de riesgos con responsable, impacto, probabilidad, senal de
alerta, mitigacion, decision y estado. Es mas util que una lista estatica.

### Mitigacion

Accion para reducir probabilidad o impacto de un riesgo. Ejemplo: verificar
rutas antes de redisenar, conservar datos existentes o documentar decisiones
grandes antes de editar.

### Limite

Frontera tecnica o funcional aceptada. Ejemplo: "no nuevas migraciones", "no
cambiar reglas de negocio", "no usar graficos sin datos existentes".

### Criterio de aceptacion

Condicion observable que indica que el trabajo esta completo. Debe ser
verificable, no una intencion subjetiva.

### Validacion

Revision de que el resultado cumple los criterios. Puede ser build, test,
revision visual, mobile review, checklist, auditoria de rutas o inspeccion de
datos.

### Checklist

Lista breve para no olvidar reglas importantes. Es util cuando se repite un
proceso, como revisar cada modulo antes de implementarlo.

### Definicion de terminado

Acuerdo sobre que debe cumplirse para cerrar una tarea. Debe incluir evidencia:
codigo, documentacion, build, pruebas, revision visual, checklist o aprobacion.

### Prueba automatizada

Test ejecutable que confirma comportamiento. No reemplaza revision visual, pero
protege logica de negocio y flujos criticos.

### Prueba manual

Revision humana guiada. Es necesaria para jerarquia visual, mobile, legibilidad,
tono, flujo y claridad de decisiones.

### Regresion

Fallo que aparece cuando algo que antes funcionaba deja de funcionar despues de
un cambio.

## Datos, integridad y trazabilidad

### Trazabilidad

Capacidad de entender de que evento viene un numero, estado o decision: venta,
compra, gasto, inventario, pedido, produccion o asiento contable.

### Trazabilidad de requisitos

Capacidad de conectar una necesidad inicial con spec, plan, tareas,
implementacion, pruebas y evidencia. Permite responder por que existe un cambio
y como se comprobo.

### Integridad

Condicion de que los datos se mantienen correctos y consistentes. Ejemplos:
stock no corrupto, kardex reconciliable, debe igual a haber, rutas preservadas.

### Dato existente

Dato ya disponible en la vista, controlador, modelo o payload. Debe preferirse a
crear nuevas fuentes cuando el alcance no aprueba backend.

### Dato inventado

Numero, estado o KPI que no viene de una fuente real. Debe evitarse porque rompe
confianza y trazabilidad.

### Dato derivado

Dato calculado desde informacion existente sin cambiar persistencia. Debe ser
claro, simple y verificable.

### Dato diferido

Dato o KPI que seria util, pero no existe o requiere backend, schema, ruta o
payload nuevo. Debe documentarse como diferido en vez de inventarse.

### Estado cero

Cuando el valor es `0` y ese cero tiene significado. No debe ocultarse como si
fuera ausencia de datos.

### Estado de error

Respuesta visual o tecnica cuando algo falla. Debe preservar informacion util,
explicar el problema y ofrecer accion cuando sea posible.

### Auditoria

Revision sistematica para confirmar cumplimiento, integridad, alcance,
rendimiento o calidad. Puede ser tecnica, visual, funcional o documental.

### Evidencia

Prueba concreta de que una afirmacion es cierta: archivo, captura, resultado de
build, test, checklist, reporte, ruta verificada o decision documentada.

### Observabilidad

Capacidad de entender que esta pasando dentro del sistema mediante logs,
metricas, trazas, reportes, errores y estados visibles. Es clave para auditar y
diagnosticar sin adivinar.

## Trabajo con IA

### Instruccion

Pedido dado a la IA. Debe incluir objetivo, contexto, restricciones, alcance,
criterios de aceptacion y fuentes relevantes.

### Contexto

Informacion que permite a la IA actuar con precision: sistema, stack, reglas,
archivos, documentos, decisiones previas y estado actual.

### Prompt reutilizable

Instruccion preparada para repetirse en otros sistemas. Debe ser concreta y no
depender de nombres internos salvo que sean parametros.

### Gobernanza de IA

Conjunto de reglas, controles y responsabilidades para usar IA de forma segura:
contexto correcto, limites, supervision humana, privacidad, trazabilidad,
evaluacion de riesgos y validacion de resultados.

### Decision documentada

Registro breve de una eleccion importante, su razon y su limite. Es clave cuando
se cambia KPI, orden de pantalla, estructura, datos o flujo.

### Pregunta de alto impacto

Pregunta que debe resolverse antes de implementar porque cambia alcance,
comportamiento, datos, arquitectura o experiencia principal.

### Supuesto

Decision temporal tomada cuando no hay confirmacion explicita. Debe escribirse
para que pueda corregirse despues.

### Plan de implementacion

Descripcion accionable de que se hara, donde, con que limites, como se probara y
que se considera terminado.

### Spec

Documento de intencion: problema, usuarios, escenarios, requisitos, criterios de
exito, edge cases y supuestos.

### Tasks

Lista de trabajo ordenada y verificable. Cada tarea debe ser pequena, concreta y
tener archivo o resultado esperado cuando aplique.

### Review

Revision critica para encontrar riesgos, bugs, regresiones, ambiguedades,
deuda, inconsistencias o falta de pruebas.

### Humano en el ciclo

Practica de mantener decision y supervision humana en cambios relevantes. Es
especialmente importante cuando la IA puede tocar dinero, permisos, datos
personales, inventario, salud, cumplimiento o reputacion.

## Antipatrones y palabras que deben usarse con cuidado

### Card-only layout

Pantalla construida casi solo con cards iguales. Oculta jerarquia y aumenta
carga cognitiva.

### Decoracion sin decision

Grafico, icono, animacion, color o texto que no ayuda a decidir, comparar,
entender riesgo o actuar.

### KPI duplicado

Mismo numero repetido cerca sin nuevo nivel de detalle. Debe fusionarse,
eliminarse o transformarse en comparacion distinta.

### Texto explicativo excesivo

Parrafos que narran la interfaz en lugar de ayudar a operar. En producto diario,
la claridad debe venir de la composicion y las etiquetas precisas.

### Cambio visual que rompe dominio

Redisenio que mueve, elimina o altera acciones hasta cambiar comportamiento real.
Debe evitarse; el comportamiento preservado manda.

### Nueva dependencia no verificada

Usar una ruta, helper, grafico, payload o componente sin comprobar que existe y
funciona.

### Deuda escondida

Problema conocido que no se documenta. Es peor que deuda explicita porque nadie
sabe que debe corregirse.

### Integridad declarada sin evidencia

Decir que algo es integro, trazable o seguro sin mostrar fuente, validacion o
prueba.


### Demo path

Definición: ruta mínima que el juez debe ver funcionando sin fallar.

No es “toda la app”. Es la secuencia exacta:

abrir → entender problema → ejecutar acción → ver resultado → comprobar impacto.


### Agent role contract

Definición: contrato que define qué puede hacer cada IA.

Ejemplo:

Cursor: editar código local.
Codex: revisar arquitectura, tests o bugs.
Claude: razonar producto y edge cases.
ChatGPT: investigación, pitch, términos, riesgos.
n8n: automatización y flujos.
Devin: tarea aislada larga o integración específica.



### Prompt injection seguridad

Definición: cualquier texto externo que una IA pueda leer y obedecer accidentalmente.