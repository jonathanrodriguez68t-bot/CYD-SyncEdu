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

CREATE TABLE academic.grade_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(80) NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT grade_levels_unique UNIQUE (institution_id, name),
    CONSTRAINT grade_order_positive CHECK (order_index > 0)
);

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

CREATE INDEX idx_sections_school_year ON academic.sections(school_year_id);
CREATE INDEX idx_enrollments_student_id ON academic.enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON academic.enrollments(section_id);
CREATE INDEX idx_enrollments_school_year_id ON academic.enrollments(school_year_id);

CREATE UNIQUE INDEX uq_active_enrollment_per_student_year
ON academic.enrollments(student_id, school_year_id)
WHERE status = 'active';

CREATE INDEX idx_teacher_assignments_teacher ON academic.teacher_subject_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_section ON academic.teacher_subject_assignments(section_id);
CREATE INDEX idx_teacher_assignments_subject ON academic.teacher_subject_assignments(subject_id);

CREATE UNIQUE INDEX uq_active_teacher_subject_section
ON academic.teacher_subject_assignments(teacher_id, subject_id, section_id, school_year_id)
WHERE status = 'active';