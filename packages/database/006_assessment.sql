CREATE TABLE assessment.grade_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT grade_categories_unique UNIQUE (institution_id, name)
);

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