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

CREATE TABLE finance.payment_allocations (
    payment_id UUID NOT NULL REFERENCES finance.payments(id) ON DELETE CASCADE,
    charge_id UUID NOT NULL REFERENCES finance.student_charges(id) ON DELETE RESTRICT,
    amount_applied NUMERIC(10,2) NOT NULL,

    PRIMARY KEY (payment_id, charge_id),
    CONSTRAINT payment_allocations_amount_check CHECK (amount_applied > 0)
);