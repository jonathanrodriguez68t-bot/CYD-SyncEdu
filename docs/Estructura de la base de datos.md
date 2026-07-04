Sí. La base de datos debe diseñarse pensando en que **CRM, portal, chatbot, n8n y ElevenLabs comparten una sola verdad**. No conviene crear una base para CRM y otra para portal. Eso rompería integridad y crearía deuda técnica.

Mi decisión para PostgreSQL sería esta:

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

---

# 1. Principios obligatorios

Antes de tablas, estas reglas son las que evitan deuda técnica:

```txt
1. Una sola base de datos oficial.
2. CRM y portal usan las mismas tablas.
3. El chatbot no tiene datos propios de alumnos/notas; solo consulta con permisos.
4. n8n no modifica datos críticos directamente.
5. ElevenLabs no toca la base de datos; solo voz/texto.
6. Toda tabla escolar importante lleva institution_id.
7. Nada de listas separadas por comas.
8. Nada de duplicar nombre de alumno en notas, pagos o actividades.
9. Toda acción sensible debe quedar en audit_logs.
10. IA/OCR debe quedar separada de las notas oficiales.
```

---

# 2. Normalización aplicada

## Primera Forma Normal — 1FN

Cada campo debe tener un solo valor.

Incorrecto:

```txt
student.subjects = "Matemática, Inglés, Ciencias"
guardian.phones = "7777-1111, 7777-2222"
```

Correcto:

```txt
subjects
enrollments
student_guardians
```

Cada materia, encargado, inscripción o relación va en su propia tabla.

---

## Segunda Forma Normal — 2FN

Cuando una tabla representa una relación, los datos deben depender de toda la relación.

Ejemplo correcto:

```txt
student_guardians
- student_id
- guardian_id
- relationship_type
- is_primary
```

La relación “madre”, “padre”, “encargado” no pertenece solo al padre ni solo al alumno. Pertenece a la relación entre ambos.

---

## Tercera Forma Normal — 3FN

No guardar datos que dependan de otros datos no clave.

Incorrecto:

```txt
student_grades
- student_name
- subject_name
- teacher_name
- score
```

Correcto:

```txt
student_grades
- student_id
- grade_item_id
- score
```

El nombre del alumno se obtiene desde `students`.
La materia se obtiene desde `grade_items → courses → subjects`.
El profesor se obtiene desde `courses → teacher_assignments`.

---

# 3. Extensiones y esquemas base

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS academic;
CREATE SCHEMA IF NOT EXISTS learning;
CREATE SCHEMA IF NOT EXISTS assessment;
CREATE SCHEMA IF NOT EXISTS portal;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS comms;
CREATE SCHEMA IF NOT EXISTS automation;
CREATE SCHEMA IF NOT EXISTS exams;
CREATE SCHEMA IF NOT EXISTS audit;
```

Uso `uuid` porque el sistema puede crecer con portal, chatbot, eventos, n8n, Telegram y servicios externos.

---

# 4. Módulo `core`

## Instituciones

```sql
CREATE TABLE core.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    timezone VARCHAR(80) NOT NULL DEFAULT 'America/El_Salvador',
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Usuarios

```sql
CREATE TABLE core.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    email CITEXT NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(180) NOT NULL,
    phone VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('invited', 'active', 'inactive', 'suspended')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT users_institution_email_unique UNIQUE (institution_id, email)
);

CREATE INDEX idx_users_institution_id ON core.users(institution_id);
CREATE INDEX idx_users_status ON core.users(status);
```

---

## Roles y permisos

```sql
CREATE TABLE core.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT roles_institution_name_unique UNIQUE (institution_id, name)
);

CREATE TABLE core.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(120) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE core.user_roles (
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE core.role_permissions (
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES core.permissions(id) ON DELETE CASCADE,

    PRIMARY KEY (role_id, permission_id)
);
```

Roles esperados:

```txt
admin
teacher
student
guardian
```

Pero la seguridad no debe depender solo del rol. También debe validar relaciones:

```txt
padre → hijo
profesor → sección/materia
alumno → expediente propio
```

---

# 5. Módulo `crm`

## Alumnos

```sql
CREATE TABLE crm.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    user_id UUID UNIQUE REFERENCES core.users(id) ON DELETE SET NULL,
    student_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20)
        CHECK (gender IN ('male', 'female', 'other', 'not_specified')),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'graduated', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT students_institution_code_unique UNIQUE (institution_id, student_code)
);

CREATE INDEX idx_students_institution_id ON crm.students(institution_id);
CREATE INDEX idx_students_name ON crm.students(last_name, first_name);
```

---

## Expediente del alumno

```sql
CREATE TABLE crm.student_records (
    student_id UUID PRIMARY KEY REFERENCES crm.students(id) ON DELETE CASCADE,
    address TEXT,
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    medical_notes TEXT,
    academic_notes TEXT,
    behavioral_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Aquí hay datos sensibles. No deben mostrarse completos al chatbot ni al portal sin permisos.

---

## Encargados o padres

```sql
CREATE TABLE crm.guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    user_id UUID UNIQUE REFERENCES core.users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email CITEXT,
    phone VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT guardians_email_institution_unique UNIQUE (institution_id, email)
);

CREATE INDEX idx_guardians_institution_id ON crm.guardians(institution_id);
```

---

## Relación alumno-encargado

```sql
CREATE TABLE crm.student_guardians (
    student_id UUID NOT NULL REFERENCES crm.students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES crm.guardians(id) ON DELETE CASCADE,
    relationship_type VARCHAR(40) NOT NULL
        CHECK (relationship_type IN ('father', 'mother', 'guardian', 'grandparent', 'other')),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    can_receive_notifications BOOLEAN NOT NULL DEFAULT true,
    can_pick_up BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_guardian_id ON crm.student_guardians(guardian_id);
```

Esta tabla es crítica para el chatbot.

Ejemplo:

```txt
Padre pregunta: "¿Cómo va mi hijo?"
↓
El sistema busca guardian_id
↓
Valida relación en student_guardians
↓
Solo entonces responde
```

---

## Profesores

```sql
CREATE TABLE crm.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    user_id UUID UNIQUE REFERENCES core.users(id) ON DELETE SET NULL,
    employee_code VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT teachers_institution_employee_unique UNIQUE (institution_id, employee_code)
);

CREATE INDEX idx_teachers_institution_id ON crm.teachers(institution_id);
```

---

# 6. Módulo `academic`

## Año escolar

```sql
CREATE TABLE academic.school_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(80) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned', 'active', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT school_year_dates_check CHECK (start_date < end_date),
    CONSTRAINT school_year_institution_name_unique UNIQUE (institution_id, name)
);
```

---

## Grados

```sql
CREATE TABLE academic.grade_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(80) NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT grade_levels_unique UNIQUE (institution_id, name),
    CONSTRAINT grade_order_positive CHECK (order_index > 0)
);
```

---

## Secciones

```sql
CREATE TABLE academic.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    school_year_id UUID NOT NULL REFERENCES academic.school_years(id) ON DELETE RESTRICT,
    grade_level_id UUID NOT NULL REFERENCES academic.grade_levels(id) ON DELETE RESTRICT,
    name VARCHAR(50) NOT NULL,
    capacity INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT sections_capacity_check CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT sections_unique UNIQUE (school_year_id, grade_level_id, name)
);

CREATE INDEX idx_sections_school_year ON academic.sections(school_year_id);
```

---

## Materias

```sql
CREATE TABLE academic.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    code VARCHAR(50),
    name VARCHAR(120) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT subjects_unique_name UNIQUE (institution_id, name),
    CONSTRAINT subjects_unique_code UNIQUE (institution_id, code)
);
```

---

## Inscripciones

```sql
CREATE TABLE academic.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES crm.students(id) ON DELETE RESTRICT,
    school_year_id UUID NOT NULL REFERENCES academic.school_years(id) ON DELETE RESTRICT,
    section_id UUID NOT NULL REFERENCES academic.sections(id) ON DELETE RESTRICT,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'transferred', 'withdrawn', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_enrollments_student_id ON academic.enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON academic.enrollments(section_id);
CREATE INDEX idx_enrollments_school_year_id ON academic.enrollments(school_year_id);

CREATE UNIQUE INDEX uq_active_enrollment_per_student_year
ON academic.enrollments(student_id, school_year_id)
WHERE status = 'active';
```

Aquí uso un índice único parcial para permitir historial, pero solo una inscripción activa por alumno/año.

---

## Asignación profesor-materia-sección

```sql
CREATE TABLE academic.teacher_subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    teacher_id UUID NOT NULL REFERENCES crm.teachers(id) ON DELETE RESTRICT,
    subject_id UUID NOT NULL REFERENCES academic.subjects(id) ON DELETE RESTRICT,
    section_id UUID NOT NULL REFERENCES academic.sections(id) ON DELETE RESTRICT,
    school_year_id UUID NOT NULL REFERENCES academic.school_years(id) ON DELETE RESTRICT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'finished')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT teacher_assignment_dates_check CHECK (
        end_date IS NULL OR start_date IS NULL OR start_date <= end_date
    )
);

CREATE INDEX idx_teacher_assignments_teacher ON academic.teacher_subject_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_section ON academic.teacher_subject_assignments(section_id);
CREATE INDEX idx_teacher_assignments_subject ON academic.teacher_subject_assignments(subject_id);

CREATE UNIQUE INDEX uq_active_teacher_subject_section
ON academic.teacher_subject_assignments(teacher_id, subject_id, section_id, school_year_id)
WHERE status = 'active';
```

Esta tabla permite saber qué profesor puede ver qué alumnos.

---

# 7. Módulo `learning`

## Cursos

Un curso representa una asignación académica usable por portal, actividades y notas.

```sql
CREATE TABLE learning.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    teacher_assignment_id UUID NOT NULL UNIQUE
        REFERENCES academic.teacher_subject_assignments(id) ON DELETE RESTRICT,
    title VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_institution_id ON learning.courses(institution_id);
```

---

## Actividades

```sql
CREATE TABLE learning.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES learning.courses(id) ON DELETE CASCADE,
    created_by_teacher_id UUID NOT NULL REFERENCES crm.teachers(id) ON DELETE RESTRICT,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    activity_type VARCHAR(40) NOT NULL DEFAULT 'assignment'
        CHECK (activity_type IN ('assignment', 'homework', 'project', 'quiz', 'exam', 'announcement')),
    due_at TIMESTAMPTZ,
    max_score NUMERIC(6,2),
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT activities_max_score_check CHECK (max_score IS NULL OR max_score > 0)
);

CREATE INDEX idx_activities_course_id ON learning.activities(course_id);
CREATE INDEX idx_activities_due_at ON learning.activities(due_at);
CREATE INDEX idx_activities_status ON learning.activities(status);
```

---

## Entregas

```sql
CREATE TABLE learning.activity_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES learning.activities(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES crm.students(id) ON DELETE RESTRICT,
    content TEXT,
    submitted_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'submitted', 'late', 'reviewed', 'missing')),
    teacher_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT activity_student_unique UNIQUE (activity_id, student_id)
);

CREATE INDEX idx_activity_submissions_student ON learning.activity_submissions(student_id);
```

---

# 8. Módulo `assessment`

## Categorías de evaluación

```sql
CREATE TABLE assessment.grade_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT grade_categories_unique UNIQUE (institution_id, name)
);
```

---

## Ítems evaluables

```sql
CREATE TABLE assessment.grade_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES learning.courses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES assessment.grade_categories(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES learning.activities(id) ON DELETE SET NULL,
    title VARCHAR(180) NOT NULL,
    max_score NUMERIC(6,2) NOT NULL,
    weight NUMERIC(5,2),
    evaluation_date DATE,
    published_at TIMESTAMPTZ,
    created_by_teacher_id UUID NOT NULL REFERENCES crm.teachers(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT grade_item_score_check CHECK (max_score > 0),
    CONSTRAINT grade_item_weight_check CHECK (weight IS NULL OR weight >= 0)
);

CREATE INDEX idx_grade_items_course ON assessment.grade_items(course_id);
CREATE INDEX idx_grade_items_status ON assessment.grade_items(status);
```

---

## Notas de alumnos

```sql
CREATE TABLE assessment.student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_item_id UUID NOT NULL REFERENCES assessment.grade_items(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES crm.students(id) ON DELETE RESTRICT,
    score NUMERIC(6,2),
    feedback TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'graded', 'excused', 'missing')),
    graded_by_teacher_id UUID REFERENCES crm.teachers(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT student_grade_unique UNIQUE (grade_item_id, student_id),
    CONSTRAINT student_grade_score_check CHECK (score IS NULL OR score >= 0)
);

CREATE INDEX idx_student_grades_student ON assessment.student_grades(student_id);
CREATE INDEX idx_student_grades_grade_item ON assessment.student_grades(grade_item_id);
```

La base no duplica materia, profesor ni sección dentro de `student_grades`. Eso mantiene 3FN.

---

# 9. Módulo `portal`

## Tipos de solicitud

```sql
CREATE TABLE portal.request_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT request_types_unique UNIQUE (institution_id, name)
);
```

---

## Solicitudes

```sql
CREATE TABLE portal.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    requester_user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
    student_id UUID REFERENCES crm.students(id) ON DELETE SET NULL,
    request_type_id UUID NOT NULL REFERENCES portal.request_types(id) ON DELETE RESTRICT,
    subject VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'cancelled')),
    assigned_to_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_requests_requester ON portal.requests(requester_user_id);
CREATE INDEX idx_requests_student ON portal.requests(student_id);
CREATE INDEX idx_requests_status ON portal.requests(status);
```

---

## Avisos

```sql
CREATE TABLE portal.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    created_by_user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(40) NOT NULL
        CHECK (audience IN ('all', 'guardians', 'students', 'teachers', 'section')),
    section_id UUID REFERENCES academic.sections(id) ON DELETE CASCADE,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_audience ON portal.announcements(audience);
CREATE INDEX idx_announcements_section ON portal.announcements(section_id);
```

---

# 10. Módulo `finance`

No recomiendo una tabla simple llamada `payments` solamente. Para normalizar bien, se separan:

```txt
payment_concepts  → qué se cobra
student_charges   → deuda generada al alumno
payments          → pago recibido
payment_allocations → qué pago cubre qué deuda
```

## Conceptos de pago

```sql
CREATE TABLE finance.payment_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    default_amount NUMERIC(10,2),
    is_active BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT payment_concepts_unique UNIQUE (institution_id, name),
    CONSTRAINT payment_concepts_amount_check CHECK (default_amount IS NULL OR default_amount >= 0)
);
```

---

## Cargos del alumno

```sql
CREATE TABLE finance.student_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES crm.students(id) ON DELETE RESTRICT,
    concept_id UUID NOT NULL REFERENCES finance.payment_concepts(id) ON DELETE RESTRICT,
    amount_due NUMERIC(10,2) NOT NULL,
    due_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'partial', 'paid', 'cancelled', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT student_charges_amount_check CHECK (amount_due >= 0)
);

CREATE INDEX idx_student_charges_student ON finance.student_charges(student_id);
CREATE INDEX idx_student_charges_status ON finance.student_charges(status);
```

---

## Pagos

```sql
CREATE TABLE finance.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    payer_guardian_id UUID REFERENCES crm.guardians(id) ON DELETE SET NULL,
    received_by_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    method VARCHAR(40) NOT NULL
        CHECK (method IN ('cash', 'bank_transfer', 'card', 'online', 'other')),
    reference VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed'
        CHECK (status IN ('pending', 'confirmed', 'voided', 'refunded')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT payments_amount_check CHECK (amount > 0)
);

CREATE INDEX idx_payments_payer ON finance.payments(payer_guardian_id);
CREATE INDEX idx_payments_paid_at ON finance.payments(paid_at);
```

---

## Aplicación de pagos

```sql
CREATE TABLE finance.payment_allocations (
    payment_id UUID NOT NULL REFERENCES finance.payments(id) ON DELETE CASCADE,
    charge_id UUID NOT NULL REFERENCES finance.student_charges(id) ON DELETE RESTRICT,
    amount_applied NUMERIC(10,2) NOT NULL,

    PRIMARY KEY (payment_id, charge_id),
    CONSTRAINT payment_allocations_amount_check CHECK (amount_applied > 0)
);
```

Este diseño permite pagos parciales, pagos múltiples y estados claros.

---

# 11. Módulo `comms`

## Cuentas de Telegram

```sql
CREATE TABLE comms.telegram_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES core.users(id) ON DELETE CASCADE,
    telegram_chat_id VARCHAR(120) NOT NULL UNIQUE,
    telegram_username VARCHAR(120),
    verified_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('pending', 'active', 'blocked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Sesiones de chatbot

```sql
CREATE TABLE comms.chatbot_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    channel VARCHAR(40) NOT NULL
        CHECK (channel IN ('portal', 'telegram', 'voice', 'api')),
    external_thread_id VARCHAR(180),
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'closed', 'expired')),
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_sessions_user ON comms.chatbot_sessions(user_id);
CREATE INDEX idx_chatbot_sessions_channel ON comms.chatbot_sessions(channel);
```

---

## Mensajes de chatbot

```sql
CREATE TABLE comms.chatbot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES comms.chatbot_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(30) NOT NULL
        CHECK (sender_type IN ('user', 'assistant', 'system')),
    message_text TEXT,
    audio_url TEXT,
    intent_key VARCHAR(120),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_messages_session ON comms.chatbot_messages(session_id);
CREATE INDEX idx_chatbot_messages_intent ON comms.chatbot_messages(intent_key);
```

Aquí `metadata` sí tiene sentido como `jsonb` porque el contenido puede variar por canal, intención o proveedor. Pero las notas, alumnos, padres y materias no deben ir en JSON.

---

## Notificaciones

```sql
CREATE TABLE comms.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    notification_type VARCHAR(60) NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON comms.notifications(user_id);
CREATE INDEX idx_notifications_read ON comms.notifications(read_at);
```

---

## Entregas de notificaciones

```sql
CREATE TABLE comms.notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES comms.notifications(id) ON DELETE CASCADE,
    channel VARCHAR(40) NOT NULL
        CHECK (channel IN ('in_app', 'email', 'telegram', 'voice')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    provider_message_id VARCHAR(180),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_deliveries_status ON comms.notification_deliveries(status);
```

---

# 12. Módulo `automation`

Este módulo es importante para n8n. Recomiendo usar patrón **outbox**.

La aplicación guarda un evento.
Luego un worker o n8n lo procesa.

```sql
CREATE TABLE automation.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    event_name VARCHAR(120) NOT NULL,
    aggregate_type VARCHAR(120) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_automation_events_status ON automation.events(status);
CREATE INDEX idx_automation_events_name ON automation.events(event_name);
CREATE INDEX idx_automation_events_created_at ON automation.events(created_at);
```

Eventos esperados:

```txt
student.created
guardian.linked
grade.published
activity.created
activity.due_soon
request.created
payment.pending
announcement.created
teacher.message.sent
chatbot.parent_summary_requested
```

---

# 13. Módulo `exams` — fase futura

No lo metería en MVP fuerte, pero sí dejaría el diseño preparado.

```sql
CREATE TABLE exams.exam_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES learning.courses(id) ON DELETE RESTRICT,
    created_by_teacher_id UUID NOT NULL REFERENCES crm.teachers(id) ON DELETE RESTRICT,
    title VARCHAR(180) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'uploaded'
        CHECK (status IN ('uploaded', 'processing', 'review_required', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exams.exam_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES exams.exam_batches(id) ON DELETE CASCADE,
    student_id UUID REFERENCES crm.students(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (processing_status IN ('pending', 'processing', 'processed', 'failed')),
    confidence_score NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT exam_images_confidence_check CHECK (
        confidence_score IS NULL OR confidence_score BETWEEN 0 AND 100
    )
);

CREATE TABLE exams.exam_ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_image_id UUID NOT NULL UNIQUE REFERENCES exams.exam_images(id) ON DELETE CASCADE,
    extracted_text TEXT,
    raw_response JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exams.exam_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_image_id UUID NOT NULL REFERENCES exams.exam_images(id) ON DELETE CASCADE,
    reviewed_by_teacher_id UUID REFERENCES crm.teachers(id) ON DELETE SET NULL,
    suggested_score NUMERIC(6,2),
    final_score NUMERIC(6,2),
    feedback TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'needs_manual_review')),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Regla:

```txt
La IA sugiere.
El profesor aprueba.
Solo después se puede crear o actualizar student_grades.
```

---

# 14. Módulo `audit`

```sql
CREATE TABLE audit.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES core.institutions(id) ON DELETE SET NULL,
    actor_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    action VARCHAR(120) NOT NULL,
    entity_schema VARCHAR(80) NOT NULL,
    entity_table VARCHAR(120) NOT NULL,
    entity_id UUID,
    before_data JSONB,
    after_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor ON audit.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit.audit_logs(entity_table, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit.audit_logs(created_at);
```

Auditar especialmente:

```txt
- Cambios de notas
- Acceso a expediente
- Consultas del chatbot sobre alumnos
- Cambios de roles
- Creación de pagos
- Edición de relaciones padre-alumno
```

---

# 15. Índices críticos

No indexar todo. Indexar lo que se consulta mucho:

```sql
CREATE INDEX idx_students_institution_status
ON crm.students(institution_id, status);

CREATE INDEX idx_teacher_assignments_lookup
ON academic.teacher_subject_assignments(teacher_id, section_id, subject_id, school_year_id);

CREATE INDEX idx_grades_student_lookup
ON assessment.student_grades(student_id, grade_item_id);

CREATE INDEX idx_activities_course_status_due
ON learning.activities(course_id, status, due_at);

CREATE INDEX idx_notifications_user_created
ON comms.notifications(user_id, created_at DESC);

CREATE INDEX idx_automation_pending
ON automation.events(created_at)
WHERE status = 'pending';
```

---

# 16. Vistas útiles para el portal

No todo debe ser una tabla. Para lectura del portal puedes crear vistas.

## Vista resumen del alumno

```sql
CREATE VIEW portal.v_student_current_summary AS
SELECT
    s.id AS student_id,
    s.institution_id,
    s.student_code,
    s.first_name,
    s.last_name,
    sy.name AS school_year,
    gl.name AS grade_level,
    sec.name AS section_name,
    e.status AS enrollment_status
FROM crm.students s
JOIN academic.enrollments e ON e.student_id = s.id
JOIN academic.school_years sy ON sy.id = e.school_year_id
JOIN academic.sections sec ON sec.id = e.section_id
JOIN academic.grade_levels gl ON gl.id = sec.grade_level_id
WHERE e.status = 'active';
```

## Vista para notas del alumno

```sql
CREATE VIEW portal.v_student_grades AS
SELECT
    sg.student_id,
    gi.id AS grade_item_id,
    gi.title AS grade_title,
    sub.name AS subject_name,
    sg.score,
    gi.max_score,
    sg.status,
    sg.feedback,
    gi.published_at
FROM assessment.student_grades sg
JOIN assessment.grade_items gi ON gi.id = sg.grade_item_id
JOIN learning.courses c ON c.id = gi.course_id
JOIN academic.teacher_subject_assignments tsa ON tsa.id = c.teacher_assignment_id
JOIN academic.subjects sub ON sub.id = tsa.subject_id
WHERE gi.status = 'published';
```

Esto ayuda al portal sin duplicar datos.

---

# 17. Seguridad por relación

La seguridad debe validar más que el rol.

## Padre viendo hijo

```sql
SELECT 1
FROM crm.student_guardians sg
JOIN crm.guardians g ON g.id = sg.guardian_id
WHERE g.user_id = :current_user_id
  AND sg.student_id = :student_id;
```

## Profesor viendo alumno

```sql
SELECT 1
FROM academic.teacher_subject_assignments tsa
JOIN learning.courses c ON c.teacher_assignment_id = tsa.id
JOIN academic.enrollments e ON e.section_id = tsa.section_id
JOIN crm.teachers t ON t.id = tsa.teacher_id
WHERE t.user_id = :current_user_id
  AND e.student_id = :student_id
  AND e.status = 'active'
  AND tsa.status = 'active';
```

Esto debe estar en servicios/policies del backend, no en n8n.

---

# 18. Estructura final de tablas

```txt
core.institutions
core.users
core.roles
core.permissions
core.user_roles
core.role_permissions

crm.students
crm.student_records
crm.guardians
crm.student_guardians
crm.teachers

academic.school_years
academic.grade_levels
academic.sections
academic.subjects
academic.enrollments
academic.teacher_subject_assignments

learning.courses
learning.activities
learning.activity_submissions

assessment.grade_categories
assessment.grade_items
assessment.student_grades

portal.request_types
portal.requests
portal.announcements
portal.v_student_current_summary
portal.v_student_grades

finance.payment_concepts
finance.student_charges
finance.payments
finance.payment_allocations

comms.telegram_accounts
comms.chatbot_sessions
comms.chatbot_messages
comms.notifications
comms.notification_deliveries

automation.events

exams.exam_batches
exams.exam_images
exams.exam_ocr_results
exams.exam_reviews

audit.audit_logs
```

---

# 19. Orden recomendado de migraciones

```txt
1. Extensiones y schemas
2. core.institutions
3. core.users
4. core.roles / permissions
5. crm.students / guardians / teachers
6. academic.school_years / grade_levels / sections / subjects
7. academic.enrollments
8. academic.teacher_subject_assignments
9. learning.courses / activities / submissions
10. assessment.grade_categories / grade_items / student_grades
11. portal.requests / announcements
12. finance
13. comms
14. automation
15. exams
16. audit
17. views
18. indexes finales
```

---

# Veredicto final

Esta estructura está pensada para que el sistema sea:

```txt
normalizado
escalable
auditable
seguro por rol y relación
compatible con portal
compatible con chatbot
compatible con n8n
compatible con ElevenLabs
preparado para IA/OCR futura
```

La decisión más importante es esta:

```txt
No crear tablas separadas para CRM y portal.
No meter lógica crítica en n8n.
No dejar que ElevenLabs o el chatbot consulten datos sin permisos.
No guardar información académica seria en JSON.
```

La base correcta para CYD-SyncEdu en PostgreSQL es una base relacional modular, con `institution_id`, llaves foráneas fuertes, tablas puente para relaciones muchos-a-muchos, eventos para automatización y auditoría para acciones sensibles.
