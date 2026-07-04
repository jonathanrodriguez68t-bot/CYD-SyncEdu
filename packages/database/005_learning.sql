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