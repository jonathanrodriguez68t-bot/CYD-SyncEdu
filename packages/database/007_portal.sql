CREATE TABLE portal.request_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES core.institutions(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT request_types_unique UNIQUE (institution_id, name)
);

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