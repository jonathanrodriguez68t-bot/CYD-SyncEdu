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

CREATE INDEX idx_students_institution_id ON crm.students(institution_id);
CREATE INDEX idx_students_name ON crm.students(last_name, first_name);
CREATE INDEX idx_guardians_institution_id ON crm.guardians(institution_id);
CREATE INDEX idx_student_guardians_guardian_id ON crm.student_guardians(guardian_id);
CREATE INDEX idx_teachers_institution_id ON crm.teachers(institution_id);