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