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