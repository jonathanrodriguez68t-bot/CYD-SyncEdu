BEGIN;

INSERT INTO core.institutions (
    id,
    name,
    slug,
    timezone,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Colegio Demo SyncEdu',
    'colegio-demo-syncedu',
    'America/El_Salvador',
    'active'
);

INSERT INTO core.users (
    id,
    institution_id,
    email,
    password_hash,
    full_name,
    phone,
    status
)
VALUES
(
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    'admin@syncedu.test',
    'dev_hash_temporal',
    'Administrador Demo',
    '7000-0001',
    'active'
),
(
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000001',
    'profesor@syncedu.test',
    'dev_hash_temporal',
    'Carlos Mendoza',
    '7000-0002',
    'active'
),
(
    '00000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000001',
    'encargado@syncedu.test',
    'dev_hash_temporal',
    'María López',
    '7000-0003',
    'active'
),
(
    '00000000-0000-4000-8000-000000000104',
    '00000000-0000-4000-8000-000000000001',
    'alumno@syncedu.test',
    'dev_hash_temporal',
    'Diego López',
    NULL,
    'active'
);

INSERT INTO core.roles (
    id,
    institution_id,
    name,
    display_name,
    description
)
VALUES
(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000001',
    'admin',
    'Administrador',
    'Acceso administrativo general'
),
(
    '00000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000001',
    'teacher',
    'Profesor',
    'Usuario profesor'
),
(
    '00000000-0000-4000-8000-000000000203',
    '00000000-0000-4000-8000-000000000001',
    'guardian',
    'Encargado',
    'Padre, madre o encargado'
),
(
    '00000000-0000-4000-8000-000000000204',
    '00000000-0000-4000-8000-000000000001',
    'student',
    'Alumno',
    'Usuario alumno'
);

INSERT INTO core.permissions (
    id,
    code,
    description
)
VALUES
(
    '00000000-0000-4000-8000-000000000301',
    'students.read',
    'Leer información de alumnos'
),
(
    '00000000-0000-4000-8000-000000000302',
    'grades.read',
    'Leer notas publicadas'
),
(
    '00000000-0000-4000-8000-000000000303',
    'grades.write',
    'Crear o modificar notas'
),
(
    '00000000-0000-4000-8000-000000000304',
    'portal.requests.manage',
    'Gestionar solicitudes del portal'
);

INSERT INTO core.user_roles (
    user_id,
    role_id
)
VALUES
(
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000201'
),
(
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000202'
),
(
    '00000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000203'
),
(
    '00000000-0000-4000-8000-000000000104',
    '00000000-0000-4000-8000-000000000204'
);

INSERT INTO core.role_permissions (
    role_id,
    permission_id
)
VALUES
(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000301'
),
(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000302'
),
(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000303'
),
(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000304'
),
(
    '00000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000301'
),
(
    '00000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000302'
),
(
    '00000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000303'
),
(
    '00000000-0000-4000-8000-000000000203',
    '00000000-0000-4000-8000-000000000302'
);

INSERT INTO crm.students (
    id,
    institution_id,
    user_id,
    student_code,
    first_name,
    last_name,
    birth_date,
    gender,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000104',
    'EST-001',
    'Diego',
    'López',
    '2012-05-15',
    'male',
    'active'
);

INSERT INTO crm.student_records (
    student_id,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_notes,
    academic_notes,
    behavioral_notes
)
VALUES (
    '00000000-0000-4000-8000-000000000401',
    'San Salvador, El Salvador',
    'María López',
    '7000-0003',
    'Sin observaciones médicas registradas',
    'Buen desempeño general',
    'Participativo en clase'
);

INSERT INTO crm.guardians (
    id,
    institution_id,
    user_id,
    first_name,
    last_name,
    email,
    phone,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000000501',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000103',
    'María',
    'López',
    'encargado@syncedu.test',
    '7000-0003',
    'active'
);

INSERT INTO crm.student_guardians (
    student_id,
    guardian_id,
    relationship_type,
    is_primary,
    can_receive_notifications,
    can_pick_up
)
VALUES (
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000501',
    'mother',
    true,
    true,
    true
);

INSERT INTO crm.teachers (
    id,
    institution_id,
    user_id,
    employee_code,
    first_name,
    last_name,
    specialty,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000000601',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000102',
    'PROF-001',
    'Carlos',
    'Mendoza',
    'Matemática',
    'active'
);

INSERT INTO academic.school_years (
    id,
    institution_id,
    name,
    start_date,
    end_date,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000000701',
    '00000000-0000-4000-8000-000000000001',
    '2026',
    '2026-01-15',
    '2026-11-15',
    'active'
);

INSERT INTO academic.grade_levels (
    id,
    institution_id,
    name,
    order_index
)
VALUES (
    '00000000-0000-4000-8000-000000000801',
    '00000000-0000-4000-8000-000000000001',
    'Séptimo grado',
    7
);

INSERT INTO academic.sections (
    id,
    institution_id,
    school_year_id,
    grade_level_id,
    name,
    capacity
)
VALUES (
    '00000000-0000-4000-8000-000000000901',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000701',
    '00000000-0000-4000-8000-000000000801',
    'A',
    35
);

INSERT INTO academic.subjects (
    id,
    institution_id,
    code,
    name,
    description,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001001',
    '00000000-0000-4000-8000-000000000001',
    'MAT-7',
    'Matemática',
    'Matemática de séptimo grado',
    'active'
);

INSERT INTO academic.enrollments (
    id,
    institution_id,
    student_id,
    school_year_id,
    section_id,
    enrollment_date,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001101',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000701',
    '00000000-0000-4000-8000-000000000901',
    '2026-01-15',
    'active'
);

INSERT INTO academic.teacher_subject_assignments (
    id,
    institution_id,
    teacher_id,
    subject_id,
    section_id,
    school_year_id,
    start_date,
    end_date,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001201',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000601',
    '00000000-0000-4000-8000-000000001001',
    '00000000-0000-4000-8000-000000000901',
    '00000000-0000-4000-8000-000000000701',
    '2026-01-15',
    NULL,
    'active'
);

INSERT INTO learning.courses (
    id,
    institution_id,
    teacher_assignment_id,
    title,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001301',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000001201',
    'Matemática - Séptimo A',
    'active'
);

INSERT INTO learning.activities (
    id,
    institution_id,
    course_id,
    created_by_teacher_id,
    title,
    description,
    activity_type,
    due_at,
    max_score,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001401',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000001301',
    '00000000-0000-4000-8000-000000000601',
    'Tarea de fracciones',
    'Resolver ejercicios básicos de fracciones.',
    'homework',
    '2026-07-10 23:59:00-06',
    10.00,
    'published'
);

INSERT INTO learning.activity_submissions (
    id,
    activity_id,
    student_id,
    content,
    submitted_at,
    status,
    teacher_feedback
)
VALUES (
    '00000000-0000-4000-8000-000000001501',
    '00000000-0000-4000-8000-000000001401',
    '00000000-0000-4000-8000-000000000401',
    'Entrega de ejercicios de fracciones.',
    '2026-07-09 18:30:00-06',
    'reviewed',
    'Buen trabajo, revisar simplificación.'
);

INSERT INTO assessment.grade_categories (
    id,
    institution_id,
    name,
    description
)
VALUES (
    '00000000-0000-4000-8000-000000001601',
    '00000000-0000-4000-8000-000000000001',
    'Tareas',
    'Actividades y tareas evaluadas'
);

INSERT INTO assessment.grade_items (
    id,
    institution_id,
    course_id,
    category_id,
    activity_id,
    title,
    max_score,
    weight,
    evaluation_date,
    published_at,
    created_by_teacher_id,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000001701',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000001301',
    '00000000-0000-4000-8000-000000001601',
    '00000000-0000-4000-8000-000000001401',
    'Nota tarea de fracciones',
    10.00,
    20.00,
    '2026-07-09',
    '2026-07-09 20:00:00-06',
    '00000000-0000-4000-8000-000000000601',
    'published'
);

INSERT INTO assessment.student_grades (
    id,
    grade_item_id,
    student_id,
    score,
    feedback,
    status,
    graded_by_teacher_id,
    graded_at
)
VALUES (
    '00000000-0000-4000-8000-000000001801',
    '00000000-0000-4000-8000-000000001701',
    '00000000-0000-4000-8000-000000000401',
    8.50,
    'Buen resultado general.',
    'graded',
    '00000000-0000-4000-8000-000000000601',
    '2026-07-09 20:10:00-06'
);

INSERT INTO portal.request_types (
    id,
    institution_id,
    name,
    description,
    is_active
)
VALUES (
    '00000000-0000-4000-8000-000000001901',
    '00000000-0000-4000-8000-000000000001',
    'Consulta académica',
    'Solicitud relacionada con desempeño académico',
    true
);

INSERT INTO portal.requests (
    id,
    institution_id,
    requester_user_id,
    student_id,
    request_type_id,
    subject,
    description,
    status,
    assigned_to_user_id
)
VALUES (
    '00000000-0000-4000-8000-000000002001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000001901',
    'Consulta sobre nota de matemática',
    'Solicito información sobre la última tarea de fracciones.',
    'open',
    '00000000-0000-4000-8000-000000000101'
);

INSERT INTO portal.announcements (
    id,
    institution_id,
    created_by_user_id,
    title,
    body,
    audience,
    section_id,
    published_at,
    expires_at
)
VALUES (
    '00000000-0000-4000-8000-000000002101',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000101',
    'Reunión de padres',
    'Se convoca a reunión de padres para revisar avances académicos.',
    'section',
    '00000000-0000-4000-8000-000000000901',
    '2026-07-04 08:00:00-06',
    '2026-07-20 23:59:00-06'
);

INSERT INTO finance.payment_concepts (
    id,
    institution_id,
    name,
    description,
    default_amount,
    is_active
)
VALUES (
    '00000000-0000-4000-8000-000000002201',
    '00000000-0000-4000-8000-000000000001',
    'Mensualidad',
    'Pago mensual del alumno',
    50.00,
    true
);

INSERT INTO finance.student_charges (
    id,
    institution_id,
    student_id,
    concept_id,
    amount_due,
    due_date,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000002301',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000002201',
    50.00,
    '2026-07-15',
    'partial'
);

INSERT INTO finance.payments (
    id,
    institution_id,
    payer_guardian_id,
    received_by_user_id,
    amount,
    method,
    reference,
    status,
    paid_at
)
VALUES (
    '00000000-0000-4000-8000-000000002401',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000501',
    '00000000-0000-4000-8000-000000000101',
    25.00,
    'cash',
    'REC-0001',
    'confirmed',
    '2026-07-04 10:00:00-06'
);

INSERT INTO finance.payment_allocations (
    payment_id,
    charge_id,
    amount_applied
)
VALUES (
    '00000000-0000-4000-8000-000000002401',
    '00000000-0000-4000-8000-000000002301',
    25.00
);

INSERT INTO comms.telegram_accounts (
    id,
    user_id,
    telegram_chat_id,
    telegram_username,
    verified_at,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000002501',
    '00000000-0000-4000-8000-000000000103',
    '123456789',
    'maria_demo',
    '2026-07-04 09:00:00-06',
    'active'
);

INSERT INTO comms.chatbot_sessions (
    id,
    institution_id,
    user_id,
    channel,
    external_thread_id,
    status,
    last_message_at
)
VALUES (
    '00000000-0000-4000-8000-000000002601',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000103',
    'telegram',
    'telegram-thread-demo-001',
    'active',
    '2026-07-04 09:15:00-06'
);

INSERT INTO comms.chatbot_messages (
    id,
    session_id,
    sender_type,
    message_text,
    audio_url,
    intent_key,
    metadata
)
VALUES
(
    '00000000-0000-4000-8000-000000002701',
    '00000000-0000-4000-8000-000000002601',
    'user',
    '¿Cómo va mi hijo en matemática?',
    NULL,
    'chatbot.parent_summary_requested',
    '{"channel":"telegram"}'::jsonb
),
(
    '00000000-0000-4000-8000-000000002702',
    '00000000-0000-4000-8000-000000002601',
    'assistant',
    'Diego tiene una nota publicada de 8.50 sobre 10.00 en la tarea de fracciones.',
    NULL,
    'chatbot.parent_summary_response',
    '{"source":"portal.v_student_grades"}'::jsonb
);

INSERT INTO comms.notifications (
    id,
    institution_id,
    user_id,
    title,
    body,
    notification_type,
    priority,
    read_at
)
VALUES (
    '00000000-0000-4000-8000-000000002801',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000103',
    'Nueva nota publicada',
    'Se publicó una nota de Matemática para Diego López.',
    'grade.published',
    'normal',
    NULL
);

INSERT INTO comms.notification_deliveries (
    id,
    notification_id,
    channel,
    status,
    provider_message_id,
    error_message,
    sent_at
)
VALUES (
    '00000000-0000-4000-8000-000000002901',
    '00000000-0000-4000-8000-000000002801',
    'telegram',
    'sent',
    'telegram-msg-demo-001',
    NULL,
    '2026-07-04 09:20:00-06'
);

INSERT INTO automation.events (
    id,
    institution_id,
    event_name,
    aggregate_type,
    aggregate_id,
    payload,
    status,
    attempts,
    last_error,
    processed_at
)
VALUES (
    '00000000-0000-4000-8000-000000003001',
    '00000000-0000-4000-8000-000000000001',
    'grade.published',
    'assessment.grade_items',
    '00000000-0000-4000-8000-000000001701',
    '{"student_id":"00000000-0000-4000-8000-000000000401","score":8.50}'::jsonb,
    'pending',
    0,
    NULL,
    NULL
);

INSERT INTO exams.exam_batches (
    id,
    institution_id,
    course_id,
    created_by_teacher_id,
    title,
    status
)
VALUES (
    '00000000-0000-4000-8000-000000003101',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000001301',
    '00000000-0000-4000-8000-000000000601',
    'Examen diagnóstico de fracciones',
    'review_required'
);

INSERT INTO exams.exam_images (
    id,
    batch_id,
    student_id,
    image_url,
    processing_status,
    confidence_score
)
VALUES (
    '00000000-0000-4000-8000-000000003201',
    '00000000-0000-4000-8000-000000003101',
    '00000000-0000-4000-8000-000000000401',
    'https://example.com/demo/examen-fracciones-diego.jpg',
    'processed',
    92.50
);

INSERT INTO exams.exam_ocr_results (
    id,
    exam_image_id,
    extracted_text,
    raw_response
)
VALUES (
    '00000000-0000-4000-8000-000000003301',
    '00000000-0000-4000-8000-000000003201',
    'Respuesta detectada: 3/4 + 1/4 = 1',
    '{"provider":"demo","confidence":92.5}'::jsonb
);

INSERT INTO exams.exam_reviews (
    id,
    exam_image_id,
    reviewed_by_teacher_id,
    suggested_score,
    final_score,
    feedback,
    status,
    reviewed_at
)
VALUES (
    '00000000-0000-4000-8000-000000003401',
    '00000000-0000-4000-8000-000000003201',
    '00000000-0000-4000-8000-000000000601',
    9.00,
    9.00,
    'Respuesta correcta en el ejercicio principal.',
    'approved',
    '2026-07-04 11:00:00-06'
);

INSERT INTO audit.audit_logs (
    id,
    institution_id,
    actor_user_id,
    action,
    entity_schema,
    entity_table,
    entity_id,
    before_data,
    after_data,
    ip_address,
    user_agent
)
VALUES (
    '00000000-0000-4000-8000-000000003501',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000102',
    'grade.created',
    'assessment',
    'student_grades',
    '00000000-0000-4000-8000-000000001801',
    NULL,
    '{"score":8.50,"status":"graded"}'::jsonb,
    '127.0.0.1',
    'pgAdmin demo seed'
);

COMMIT;