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