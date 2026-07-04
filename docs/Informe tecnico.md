# Informe Técnico del Proyecto CYD-SyncEdu

## 1. Resumen ejecutivo

CYD-SyncEdu es una plataforma educativa integral orientada a instituciones escolares que necesitan centralizar la gestión administrativa, académica, comunicacional y automatizada en un solo sistema. El proyecto no se limita a un CRM escolar tradicional: integra CRM administrativo, portal escolar por roles, chatbot, Telegram, voz con ElevenLabs, automatización con n8n, notificaciones, aula tipo Classroom y preparación futura para procesamiento de exámenes mediante IA/OCR.

La decisión técnica principal del proyecto es construir el sistema con una arquitectura moderna, modular y escalable basada en **TypeScript**, usando **Next.js** para el frontend, **NestJS** para el backend, **PostgreSQL** como base de datos principal, **n8n** como capa de automatización, **ElevenLabs** como capa de voz, **Telegram** como canal conversacional, **Redis + BullMQ** para colas/eventos y **Python/FastAPI** únicamente para servicios futuros de IA/OCR.

La justificación central es que CYD-SyncEdu requiere más que CRUD: necesita APIs limpias, webhooks, eventos internos, chatbot, voz, automatización, validación por roles, validación por relación padre-hijo/profesor-sección, notificaciones, procesos asíncronos e integraciones externas. Por eso, TypeScript se define como el lenguaje principal para mantener consistencia entre frontend, backend, chatbot, validaciones, eventos e integraciones.

---

## 2. Nombre del proyecto

**CYD-SyncEdu**

El nombre representa una solución educativa sincronizada, donde la información académica, administrativa y comunicacional fluye desde una única fuente de verdad hacia distintos canales: CRM, portal, chatbot, Telegram, voz, notificaciones y automatizaciones.

---

## 3. Objetivo general

Diseñar y construir una plataforma escolar modular que permita administrar alumnos, padres, profesores, grados, secciones, materias, actividades, notas, solicitudes, avisos, pagos opcionales, chatbot, notificaciones, automatizaciones y futuros procesos de IA/OCR, manteniendo integridad de datos, trazabilidad, seguridad por roles y validación por relación.

---

## 4. Problema que resuelve

Muchas instituciones educativas manejan información dispersa entre hojas de cálculo, mensajes de WhatsApp, llamadas, documentos físicos, plataformas incompletas y sistemas que no se comunican entre sí. Esto genera problemas como:

* Datos duplicados entre administración, profesores y padres.
* Falta de trazabilidad en notas, actividades y solicitudes.
* Comunicación lenta entre colegio, padres, alumnos y docentes.
* Dificultad para consultar información académica de forma segura.
* Procesos manuales repetitivos que podrían automatizarse.
* Riesgo de que usuarios vean información que no les corresponde.
* Falta de preparación para IA, voz, chatbot y automatización.

CYD-SyncEdu busca resolver esto con una arquitectura donde **PostgreSQL sea la verdad del sistema**, **NestJS gobierne reglas y permisos**, **Next.js entregue la experiencia visual**, **n8n automatice flujos**, **ElevenLabs gestione voz**, **Telegram funcione como canal**, y **Python/FastAPI quede reservado para IA avanzada futura**.

---

## 5. Alcance funcional del sistema

El sistema contempla los siguientes bloques principales:

### 5.1 CRM administrativo

Módulo para administrar la información base de la institución:

* Alumnos.
* Padres o encargados.
* Profesores.
* Expedientes.
* Datos académicos.
* Datos de contacto.
* Relaciones padre-hijo.
* Estado del estudiante.
* Estado del profesor.
* Información institucional.

### 5.2 Portal escolar

Portal dividido por roles:

* Portal de administrador.
* Portal de profesor.
* Portal de alumno.
* Portal de padre o encargado.

El portal no debe duplicar datos del CRM. Debe consultar la misma base de datos oficial, aplicando permisos y validaciones por relación.

### 5.3 Aula tipo Classroom

Módulo para manejar:

* Cursos.
* Materias.
* Secciones.
* Actividades.
* Tareas.
* Proyectos.
* Quices.
* Exámenes.
* Entregas.
* Retroalimentación docente.

### 5.4 Evaluaciones y notas

Módulo para administrar:

* Categorías de evaluación.
* Ítems evaluables.
* Notas de alumnos.
* Retroalimentación.
* Publicación de notas.
* Consulta de notas por padres/alumnos.
* Validación de profesor autorizado.

### 5.5 Chatbot por roles

Chatbot que responde según el usuario:

* Padre: puede consultar información de sus hijos.
* Alumno: puede consultar su propia información.
* Profesor: puede consultar sus secciones y materias.
* Admin: puede consultar información institucional autorizada.

El chatbot no debe ser un controlador gigante ni un parche. Debe funcionar como una capa de orquestación con detección de intención, validación de permisos, consulta controlada, generación de respuesta y auditoría.

### 5.6 Telegram

Telegram funciona como canal externo para:

* Consultas de padres.
* Avisos.
* Recordatorios.
* Notificaciones.
* Respuestas de chatbot.
* Confirmaciones.

### 5.7 ElevenLabs

ElevenLabs se usará como capa de voz para:

* Text-to-speech.
* Respuestas habladas.
* Experiencias de voz.
* Posible speech-to-text en fases posteriores.

La voz cambia la arquitectura porque puede requerir flujos como audio → transcripción → detección de intención → validación de permisos → consulta → respuesta textual → conversión a audio → entrega por Telegram o portal.

### 5.8 n8n

n8n se usará para automatizaciones externas:

* Recordatorios.
* Alertas.
* Notificaciones.
* Eventos académicos.
* Avisos programados.
* Workflows conectados por webhooks.

n8n no debe ser backend ni fuente de verdad. Su función es automatizar, no gobernar reglas críticas ni permisos.

### 5.9 IA/OCR futura

En una fase futura se contempla:

* Subida de fotos de exámenes.
* OCR.
* Extracción de texto.
* Revisión asistida.
* Sugerencia de nota.
* Validación final del profesor.

La IA solo debe sugerir. El profesor debe aprobar antes de afectar notas oficiales.

---

## 6. Stack tecnológico recomendado

La arquitectura definitiva recomendada es:

```txt
Frontend: Next.js / React + TypeScript
Backend principal: NestJS + TypeScript
Base de datos: PostgreSQL
ORM: Prisma o Drizzle
Automatización: n8n
Voz: ElevenLabs
Bot: Telegram
Colas/eventos: Redis + BullMQ
IA/OCR futura: Python/FastAPI
```

Esta decisión se fundamenta en que el producto necesita consistencia de tipos, APIs limpias, webhooks, WebSockets, eventos, integraciones, automatización, voz y escalabilidad modular. TypeScript permite compartir contratos entre frontend, backend, chatbot, integraciones, validaciones y eventos, reduciendo errores de payload y duplicación lógica.

---

## 7. Comparación de tecnologías evaluadas

| Opción                        | Fortalezas                                                                            | Debilidades                                                  | Veredicto                                |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| TypeScript + NestJS + Next.js | Alta consistencia frontend/backend, ideal para APIs, eventos, webhooks, chatbot y voz | Requiere arquitectura disciplinada                           | Mejor opción definitiva                  |
| Laravel/PHP                   | Muy bueno para CRM, CRUD, paneles y reportes                                          | Menos natural para chatbot, voz, eventos y tipos compartidos | Buena opción táctica, no definitiva      |
| Python/FastAPI                | Excelente para IA/OCR, procesamiento y modelos                                        | No ideal como núcleo de CRM/portal completo                  | Servicio futuro, no núcleo               |
| Java/Spring Boot              | Muy robusto y empresarial                                                             | Más pesado para MVP y buildathon                             | Potente, pero menos ágil                 |
| C#/.NET                       | Profesional y escalable                                                               | Menos ágil para este MVP específico                          | Viable, pero no preferido                |
| Supabase + Next.js            | Rápido para demo                                                                      | Riesgoso en reglas escolares complejas                       | Útil para prototipo, no ideal definitivo |
| Firebase                      | Rápido para apps simples                                                              | Modelo relacional escolar complejo, permisos difíciles       | No recomendado                           |

La decisión final es **TypeScript + NestJS + Next.js + PostgreSQL**, porque el proyecto no es solo escolar: es escolar, conversacional, automatizado, auditable y preparado para IA.

---

## 8. Arquitectura general del repositorio

La estructura recomendada del proyecto es:

```txt
CYD-SyncEdu/
│
├── apps/
│   ├── web/                         # Next.js
│   │   ├── crm/
│   │   ├── portal/
│   │   ├── auth/
│   │   └── shared-ui/
│   │
│   └── api/                         # NestJS
│       ├── src/
│       │   ├── core/
│       │   ├── identity/
│       │   ├── academic/
│       │   ├── crm/
│       │   ├── portal/
│       │   ├── classroom/
│       │   ├── chatbot/
│       │   ├── notifications/
│       │   ├── integrations/
│       │   └── automation/
│       └── test/
│
├── packages/
│   ├── database/                    # Prisma/Drizzle schema
│   ├── shared-types/                # Tipos compartidos
│   ├── validation/                  # Zod schemas
│   ├── permissions/                 # Reglas comunes
│   └── ui/                          # Componentes reutilizables
│
├── services/
│   └── ai-exams/                    # Python/FastAPI futuro
│       ├── ocr/
│       ├── image-processing/
│       └── grading/
│
├── workflows/
│   └── n8n/
│       ├── activity-created.json
│       ├── grade-published.json
│       ├── parent-alert.json
│       └── daily-summary.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── permissions.md
│   ├── chatbot-flows.md
│   ├── elevenlabs.md
│   ├── n8n-events.md
│   └── technical-debt.md
│
└── docker-compose.yml
```

Esta estructura separa claramente frontend, backend, paquetes compartidos, servicios futuros de IA, workflows de automatización y documentación técnica.

---

## 9. Arquitectura backend por dominios

El backend en NestJS debe organizarse por dominios, no por archivos genéricos. La estructura base sería:

```txt
apps/api/src/
│
├── core/
│   ├── config/
│   ├── database/
│   ├── audit/
│   ├── events/
│   └── errors/
│
├── identity/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   └── auth/
│
├── academic/
│   ├── institutions/
│   ├── school-years/
│   ├── grades/
│   ├── sections/
│   ├── subjects/
│   └── enrollments/
│
├── crm/
│   ├── students/
│   ├── guardians/
│   ├── teachers/
│   ├── records/
│   └── payments/
│
├── portal/
│   ├── parent/
│   ├── student/
│   ├── teacher/
│   └── admin/
│
├── classroom/
│   ├── courses/
│   ├── activities/
│   ├── submissions/
│   └── reminders/
│
├── chatbot/
│   ├── sessions/
│   ├── messages/
│   ├── intents/
│   ├── actions/
│   ├── guards/
│   └── orchestrator/
│
├── notifications/
│   ├── in-app/
│   ├── telegram/
│   ├── email/
│   └── voice/
│
├── integrations/
│   ├── elevenlabs/
│   ├── telegram/
│   ├── n8n/
│   └── google-classroom/
│
└── automation/
    ├── events/
    ├── webhooks/
    └── dispatchers/
```

Esta organización evita controladores gigantes, reduce acoplamiento, facilita pruebas, permite crecimiento modular y separa correctamente reglas de negocio, integraciones y automatizaciones.

---

## 10. Arquitectura de base de datos

La base de datos será **PostgreSQL**, dividida por schemas funcionales:

```txt
PostgreSQL
├── core          # institución, usuarios, roles, permisos
├── crm           # alumnos, padres, profesores, expedientes
├── academic      # año escolar, grados, secciones, materias, inscripciones
├── learning      # cursos, actividades, entregas
├── assessment    # evaluaciones y notas
├── portal        # solicitudes, avisos
├── finance       # pagos opcionales
├── comms         # chatbot, Telegram, notificaciones, voz
├── automation    # eventos para n8n
├── exams         # IA/OCR de exámenes, fase futura
└── audit         # auditoría
```

La base se diseña bajo el principio de que **CRM, portal, chatbot, n8n y ElevenLabs comparten una sola verdad**. No conviene crear una base para CRM y otra para portal, porque eso rompería integridad y aumentaría deuda técnica.

---

## 11. Principios obligatorios de datos

Los principios de base de datos son:

1. Una sola base de datos oficial.
2. CRM y portal usan las mismas tablas.
3. El chatbot no tiene datos propios de alumnos/notas; solo consulta con permisos.
4. n8n no modifica datos críticos directamente.
5. ElevenLabs no toca la base de datos; solo procesa voz/texto.
6. Toda tabla escolar importante lleva `institution_id`.
7. No se usan listas separadas por comas.
8. No se duplica nombre de alumno en notas, pagos o actividades.
9. Toda acción sensible queda en `audit_logs`.
10. IA/OCR queda separada de las notas oficiales.

---

## 12. Normalización aplicada

La base de datos aplica 1FN, 2FN y 3FN.

### 12.1 Primera Forma Normal

Cada campo debe tener un solo valor. Por ejemplo, no se debe guardar:

```txt
student.subjects = "Matemática, Inglés, Ciencias"
guardian.phones = "7777-1111, 7777-2222"
```

En su lugar, deben usarse tablas relacionadas como:

```txt
subjects
enrollments
student_guardians
```

### 12.2 Segunda Forma Normal

Cuando una tabla representa una relación, los datos deben depender de toda la relación. Por ejemplo, en `student_guardians`, el tipo de relación —madre, padre, encargado— pertenece a la relación entre alumno y encargado, no solamente al alumno ni solamente al encargado.

### 12.3 Tercera Forma Normal

No se deben guardar datos que dependan de otros datos no clave. Por ejemplo, en `student_grades` no se guardan `student_name`, `subject_name` o `teacher_name`. Solo se guarda `student_id`, `grade_item_id` y `score`; la materia y profesor se obtienen mediante relaciones. Esto evita duplicación e inconsistencias.

---

## 13. Módulos principales de la base de datos

### 13.1 Schema `core`

Contiene la base institucional y de identidad:

* `core.institutions`
* `core.users`
* `core.roles`
* `core.permissions`
* `core.user_roles`
* `core.role_permissions`

Este módulo permite manejar instituciones, usuarios, roles y permisos.

### 13.2 Schema `crm`

Contiene la información administrativa escolar:

* `crm.students`
* `crm.student_records`
* `crm.guardians`
* `crm.student_guardians`
* `crm.teachers`

La tabla `student_guardians` es crítica para validar qué padre o encargado puede consultar información de qué alumno.

### 13.3 Schema `academic`

Contiene la estructura académica formal:

* `academic.school_years`
* `academic.grade_levels`
* `academic.sections`
* `academic.subjects`
* `academic.enrollments`
* `academic.teacher_subject_assignments`

Este módulo permite saber en qué grado, sección, año escolar y materia participa cada alumno/profesor.

### 13.4 Schema `learning`

Contiene el aula tipo Classroom:

* `learning.courses`
* `learning.activities`
* `learning.activity_submissions`

Un curso representa una asignación académica usable por portal, actividades y notas. Las actividades pueden ser tareas, proyectos, quices, exámenes o anuncios.

### 13.5 Schema `assessment`

Contiene evaluaciones y notas:

* `assessment.grade_categories`
* `assessment.grade_items`
* `assessment.student_grades`

El diseño evita duplicar materia, profesor o sección dentro de `student_grades`, manteniendo normalización y consistencia.

### 13.6 Schema `portal`

Contiene solicitudes y avisos:

* `portal.request_types`
* `portal.requests`
* `portal.announcements`
* `portal.v_student_current_summary`
* `portal.v_student_grades`

Las vistas ayudan al portal a consultar información sin duplicar datos.

### 13.7 Schema `finance`

Contiene pagos opcionales:

* `finance.payment_concepts`
* `finance.student_charges`
* `finance.payments`
* `finance.payment_allocations`

El diseño permite pagos parciales, pagos múltiples y aplicación clara de pagos contra cargos.

### 13.8 Schema `comms`

Contiene comunicación, chatbot y notificaciones:

* `comms.telegram_accounts`
* `comms.chatbot_sessions`
* `comms.chatbot_messages`
* `comms.notifications`
* `comms.notification_deliveries`

En `chatbot_messages`, `metadata` puede ser `jsonb` porque el contenido puede variar por canal, intención o proveedor. Sin embargo, notas, alumnos, padres y materias no deben guardarse en JSON.

### 13.9 Schema `automation`

Contiene eventos para automatizaciones:

* `automation.events`

Este módulo usa un patrón tipo **outbox**: la aplicación guarda un evento y luego un worker o n8n lo procesa. Eventos esperados incluyen `student.created`, `guardian.linked`, `grade.published`, `activity.created`, `request.created`, `payment.pending`, `announcement.created` y `chatbot.parent_summary_requested`.

### 13.10 Schema `exams`

Contiene la fase futura de IA/OCR:

* `exams.exam_batches`
* `exams.exam_images`
* `exams.exam_ocr_results`
* `exams.exam_reviews`

Este módulo no debe afectar notas oficiales automáticamente. La IA sugiere, el profesor revisa y solo después se puede crear o actualizar una nota.

### 13.11 Schema `audit`

Contiene auditoría:

* `audit.audit_logs`

Debe auditar especialmente:

* Cambios de notas.
* Acceso a expedientes.
* Consultas del chatbot sobre alumnos.
* Cambios de roles.
* Creación de pagos.
* Edición de relaciones padre-alumno.

---

## 14. Seguridad por roles y relación

La seguridad del sistema no debe depender solo del rol. Debe validar relaciones reales:

* Padre → hijo.
* Profesor → sección.
* Profesor → materia.
* Alumno → expediente propio.
* Admin → institución correspondiente.

Ejemplo: un padre con rol `guardian` no puede ver cualquier estudiante. Solo puede ver estudiantes relacionados en `crm.student_guardians`.

Ejemplo: un profesor no puede ver cualquier alumno. Solo puede ver alumnos inscritos en secciones donde tenga una asignación activa en `academic.teacher_subject_assignments`.

Estas validaciones deben vivir en servicios/policies del backend, no en n8n ni en el frontend.

---

## 15. Reglas de integridad obligatorias

Las reglas principales son:

1. Toda tabla escolar importante lleva `institution_id`.
2. Toda acción sensible genera registro en `audit.audit_logs`.
3. El chatbot nunca consulta datos sin pasar por permisos.
4. n8n nunca decide permisos ni modifica datos críticos directamente.
5. ElevenLabs no conoce la base de datos.
6. Las notas oficiales solo las modifica profesor/admin autorizado.
7. La IA solo sugiere; un humano aprueba.
8. Las automatizaciones se activan por eventos, no por consultas improvisadas.
9. Portal y CRM no duplican datos.
10. El backend es la única fuente de verdad.

---

## 16. Flujo general del sistema

### 16.1 Flujo de consulta de padre

```txt
Padre entra al portal o Telegram
↓
Sistema identifica usuario
↓
Valida rol guardian
↓
Valida relación en student_guardians
↓
Consulta resumen académico del alumno
↓
Genera respuesta textual
↓
Opcionalmente convierte respuesta a voz con ElevenLabs
↓
Registra auditoría
```

### 16.2 Flujo de publicación de nota

```txt
Profesor crea o actualiza nota
↓
Backend valida asignación profesor-materia-sección
↓
Guarda student_grades
↓
Publica grade_item si corresponde
↓
Crea evento grade.published
↓
n8n procesa recordatorio/notificación
↓
Padre/alumno recibe aviso
↓
Se registra auditoría
```

### 16.3 Flujo de actividad

```txt
Profesor crea actividad
↓
Backend valida curso/asignación
↓
Guarda learning.activities
↓
Crea evento activity.created
↓
n8n envía recordatorio o aviso
↓
Alumno/padre consulta actividad en portal o Telegram
```

### 16.4 Flujo futuro de examen por foto

```txt
Profesor sube lote de exámenes
↓
Se crea exams.exam_batches
↓
Se guardan imágenes en exams.exam_images
↓
Servicio Python/FastAPI procesa OCR
↓
Se guarda resultado en exams.exam_ocr_results
↓
Sistema genera sugerencia de revisión
↓
Profesor aprueba o rechaza en exams.exam_reviews
↓
Solo si aprueba, se actualiza assessment.student_grades
```

---

## 17. MVP recomendado

El MVP debe enfocarse en el corte vertical que demuestre valor real sin intentar construir todo desde el inicio.

### MVP 1

```txt
Login
Roles
CRM básico
├── alumnos
├── padres
├── profesores
├── materias
├── grados
└── secciones

Portal por rol
├── padre
├── alumno
└── profesor

Notas
Actividades
Chatbot básico
Telegram texto
ElevenLabs TTS
n8n para recordatorios
```

Este MVP permite demostrar el valor central: un sistema escolar donde los datos se crean una vez, se consultan por portal/chatbot, se notifican por Telegram, se pueden convertir en voz y se automatizan mediante eventos.

### Fase 2

```txt
Voz a texto
Respuestas por audio
Recordatorios avanzados
Dashboard de riesgo académico
```

### Fase 3

```txt
OCR de exámenes
Revisión por IA
Google Classroom real
Pagos en línea
```

La planificación por fases está alineada con la arquitectura recomendada: primero núcleo escolar, luego voz/automatización avanzada, y finalmente IA/OCR y pagos.

---

## 18. Riesgos técnicos principales

### 18.1 Usar n8n como backend

Riesgo alto. Generaría permisos débiles, datos fragmentados, dificultad para testear, baja auditabilidad y automatizaciones frágiles. n8n debe automatizar, no gobernar.

### 18.2 Usar Firebase como núcleo

Riesgo alto. El modelo escolar es fuertemente relacional: padre-hijo, profesor-sección, materia-curso, alumno-notas, actividad-entrega. Firebase puede complicar validaciones y reportes.

### 18.3 Usar Laravel como núcleo definitivo

Riesgo medio. Laravel es fuerte para CRM y CRUD, pero el sistema requiere voz, chatbot, eventos, automatización, WebSockets, Telegram y tipos compartidos. Puede funcionar, pero con mayor riesgo de deuda técnica.

### 18.4 Usar Python para todo

Riesgo medio. Python es excelente para IA/OCR, pero menos conveniente como núcleo de CRM, portal, frontend, roles e integraciones web.

### 18.5 Usar TypeScript sin disciplina modular

Riesgo medio. TypeScript solo no garantiza buena arquitectura. Puede generar deuda si se usa NestJS sin módulos claros, Prisma sin relaciones bien diseñadas, Next.js como backend improvisado o n8n tocando datos críticos.

---

## 19. Decisiones arquitectónicas clave

### Decisión 1: Una sola base de datos oficial

**Razón:** CRM, portal, chatbot, automatización y voz deben consultar datos consistentes.

**Consecuencia:** Menos duplicidad, mejor trazabilidad, permisos más confiables.

### Decisión 2: PostgreSQL como fuente de verdad

**Razón:** El dominio escolar es relacional y requiere integridad fuerte.

**Consecuencia:** Uso de llaves foráneas, schemas, constraints, vistas, índices y auditoría.

### Decisión 3: NestJS como backend principal

**Razón:** Permite módulos, guards, providers, eventos, WebSockets e integraciones organizadas.

**Consecuencia:** Mejor separación de dominio y menor deuda técnica.

### Decisión 4: Next.js como frontend

**Razón:** Permite CRM y portal modernos con React/TypeScript.

**Consecuencia:** Buena experiencia visual y posibilidad de compartir tipos/componentes.

### Decisión 5: n8n solo como automatización

**Razón:** n8n es fuerte para workflows, pero no debe manejar permisos ni datos críticos.

**Consecuencia:** Los eventos salen del backend mediante `automation.events`.

### Decisión 6: ElevenLabs solo como capa de voz

**Razón:** ElevenLabs no debe tocar la base de datos ni decidir permisos.

**Consecuencia:** El backend prepara texto seguro y ElevenLabs solo convierte o procesa audio.

### Decisión 7: Python/FastAPI solo para IA/OCR futura

**Razón:** Python es ideal para OCR, imagen y modelos, pero no para gobernar todo el sistema.

**Consecuencia:** IA queda separada del núcleo escolar.

---

## 20. Entregables recomendados del proyecto

### Documentación

```txt
docs/architecture.md
docs/database.md
docs/permissions.md
docs/chatbot-flows.md
docs/elevenlabs.md
docs/n8n-events.md
docs/technical-debt.md
```

### Código

```txt
apps/web
apps/api
packages/database
packages/shared-types
packages/validation
packages/permissions
packages/ui
services/ai-exams
workflows/n8n
```

### Base de datos

```txt
database/001_init.sql
database/002_core.sql
database/003_crm.sql
database/004_academic.sql
database/005_learning.sql
database/006_assessment.sql
database/007_portal.sql
database/008_finance.sql
database/009_comms.sql
database/010_automation.sql
database/011_exams.sql
database/012_audit.sql
database/013_views.sql
database/014_indexes.sql
```

### Workflows n8n

```txt
activity-created.json
grade-published.json
parent-alert.json
daily-summary.json
```

---

## 21. Criterios de aceptación del MVP

El MVP puede considerarse funcional si cumple:

* Existe login por usuario.
* Existen roles básicos: admin, teacher, student, guardian.
* Admin puede crear alumnos, padres, profesores, grados, secciones y materias.
* Se puede relacionar padre con alumno.
* Se puede asignar profesor a materia y sección.
* Profesor puede crear actividad.
* Profesor puede publicar nota.
* Padre puede consultar información de su hijo.
* Alumno puede consultar su propia información.
* Chatbot valida permisos antes de responder.
* Telegram puede recibir al menos una notificación o respuesta.
* ElevenLabs puede convertir una respuesta segura en audio.
* n8n procesa al menos un evento desde `automation.events`.
* Toda acción sensible queda registrada o preparada para auditoría.
* No hay datos académicos duplicados entre CRM y portal.

---

## 22. Conclusión

CYD-SyncEdu debe construirse como una plataforma escolar modular, relacional, auditable y preparada para integraciones inteligentes. La decisión más importante es no tratarlo como un simple CRM ni como una app de formularios. El sistema combina administración escolar, portal por roles, chatbot, voz, Telegram, automatización, actividades, notas, notificaciones y futura IA/OCR.

La arquitectura definitiva recomendada es:

```txt
TypeScript + NestJS + Next.js + PostgreSQL
```

con:

```txt
n8n como automatización
ElevenLabs como voz
Telegram como canal
Redis + BullMQ como colas/eventos
Python/FastAPI como servicio futuro de IA/OCR
```

La base de datos debe mantenerse como una sola fuente de verdad, normalizada, con schemas por dominio, `institution_id` en tablas escolares importantes, llaves foráneas fuertes, auditoría, eventos para automatización y seguridad por rol más relación.

El veredicto final es que CYD-SyncEdu tiene potencial para ser una solución más sólida que un CRM escolar tradicional, siempre que se respete la arquitectura modular, la integridad de datos, la seguridad por relación y la separación correcta de responsabilidades entre backend, portal, chatbot, n8n, ElevenLabs y futuros servicios de IA.
