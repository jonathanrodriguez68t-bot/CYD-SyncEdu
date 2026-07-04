# Evaluacion Profunda de 002 Visual UI Flow

Este documento evalua `specs/002-visual-ui-flow/` como caso de estudio para
extraer terminos, tecnicas, decisiones, patrones, riesgos y aprendizajes
reutilizables en otros sistemas. No es una nueva especificacion; es una lectura
critica de lo que la carpeta ya contiene.

## Patrones reutilizables

### Decision-first UI

Cada pantalla debe abrir con la pregunta que resuelve y una lectura dominante.
Esto evita dashboards genericos y reduce el tiempo de orientacion.

### Data storytelling con datos existentes

La visualizacion no es decoracion. Debe explicar cambio, riesgo, proporcion,
comparacion o siguiente accion. Si el dato no existe, se usa empty state honesto
o se difiere.

### Baseline preservado

Una pantalla de referencia puede guiar el sistema sin ser reimplementada. Esto
ayuda a mantener consistencia sin congelar todos los modulos en el mismo layout.

### Contrato antes de editar

El contrato por vista fuerza seis decisiones: que se elimina, que se fusiona,
que accion se mueve, que grafico se usa, cual es el orden mobile y que
comportamiento se preserva.

### Cards como material, no como idea

Una card queda solo si agrupa algo real. Si repite, pesa o distrae, se elimina,
fusiona o se convierte en forma abierta.

### Mobile como flujo propio

Mobile no es "desktop apilado". Debe reordenar accion, KPI, filtros, charts,
tablas y detalles segun la tarea.

### Estados como parte del contrato

Empty, zero, loading, error, hover, focus, active, selected y reduced-motion son
parte del trabajo, no remates opcionales.



## Terminos que deben quedar en glosarios generales

- contrato visual
- baseline preservado
- decision-first UI
- pregunta primaria
- lectura dominante
- comportamiento preservado
- dependencia verificada
- dato existente
- dato diferido
- estado cero
- empty state honesto
- mobile-first order
- mobile no mecanico
- microstatus
- minigrafico
- micrografico
- sparkline
- forma abierta
- riel de evidencia
- accion reformada
- redundancia visual
- card util
- deuda visual
- deuda documental
- data storytelling
- trazabilidad de datos
- trazabilidad de requisitos
- decision documentada
- riesgo de drift visual
- validacion desktop/mobile
- criterio de aceptacion visual

