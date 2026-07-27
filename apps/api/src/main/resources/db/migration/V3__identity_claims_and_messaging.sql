-- Identidad progresiva y mensajería privada.
--
-- Una mención crea una referencia biográfica, no una identidad verificada. Las
-- reclamaciones y coincidencias siempre necesitan revisión y evidencia. Los
-- identificadores oficiales se mantienen en person_identifiers cifrados; nunca
-- se copian a estas tablas ni se usan como contenido de un mensaje.

CREATE TABLE person_mentions (
    id TEXT PRIMARY KEY,
    mentioned_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    source_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    referenced_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    relationship_hint TEXT,
    context_excerpt TEXT,
    mention_status TEXT NOT NULL DEFAULT 'UNRESOLVED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT,
    CHECK (mention_status IN ('UNRESOLVED', 'LINKED', 'DISPUTED', 'HIDDEN'))
);

CREATE TABLE profile_claims (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    claimant_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    claim_reason TEXT NOT NULL,
    claim_status TEXT NOT NULL DEFAULT 'PENDING',
    reviewed_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    reviewer_notes TEXT,
    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT,
    UNIQUE (person_id, claimant_user_id),
    CHECK (claim_status IN ('PENDING', 'NEEDS_EVIDENCE', 'APPROVED', 'REJECTED', 'WITHDRAWN'))
);

CREATE TABLE profile_claim_evidence (
    id TEXT PRIMARY KEY,
    profile_claim_id TEXT NOT NULL REFERENCES profile_claims(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL,
    media_asset_id TEXT REFERENCES media_assets(id) ON DELETE SET NULL,
    encrypted_reference TEXT,
    description TEXT,
    verification_status TEXT NOT NULL DEFAULT 'UNREVIEWED',
    verified_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (verification_status IN ('UNREVIEWED', 'ACCEPTED', 'REJECTED'))
);

CREATE TABLE identity_match_candidates (
    id TEXT PRIMARY KEY,
    left_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    right_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    confidence_score INTEGER NOT NULL,
    matching_signals TEXT NOT NULL,
    decision_status TEXT NOT NULL DEFAULT 'PENDING',
    decided_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    decided_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (left_person_id <> right_person_id),
    CHECK (confidence_score BETWEEN 0 AND 100),
    CHECK (decision_status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'IGNORED')),
    UNIQUE (left_person_id, right_person_id)
);

CREATE TABLE message_conversations (
    id TEXT PRIMARY KEY,
    conversation_type TEXT NOT NULL DEFAULT 'DIRECT',
    subject TEXT,
    created_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    about_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (conversation_type IN ('DIRECT', 'FAMILY', 'PROFILE_REVIEW'))
);

CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES message_conversations(id) ON DELETE CASCADE,
    sender_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    body_ciphertext TEXT NOT NULL,
    body_preview TEXT,
    reply_to_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
    sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TEXT,
    deleted_at TEXT
);

CREATE TABLE conversation_participants (
    conversation_id TEXT NOT NULL REFERENCES message_conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    participant_role TEXT NOT NULL DEFAULT 'MEMBER',
    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TEXT,
    last_read_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
    PRIMARY KEY (conversation_id, user_id),
    CHECK (participant_role IN ('OWNER', 'MODERATOR', 'MEMBER'))
);

CREATE TABLE message_attachments (
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
    attachment_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, media_asset_id)
);

CREATE TABLE message_receipts (
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    delivered_at TEXT,
    read_at TEXT,
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE contact_requests (
    id TEXT PRIMARY KEY,
    sender_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    recipient_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    about_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    introductory_message TEXT,
    request_status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TEXT,
    CHECK (sender_user_id <> recipient_user_id),
    CHECK (request_status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')),
    UNIQUE (sender_user_id, recipient_user_id, about_person_id)
);

CREATE TABLE blocked_contacts (
    blocker_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    blocked_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_user_id, blocked_user_id),
    CHECK (blocker_user_id <> blocked_user_id)
);

CREATE INDEX idx_person_mentions_reference
    ON person_mentions(referenced_person_id, mention_status);
CREATE INDEX idx_profile_claims_review
    ON profile_claims(claim_status, submitted_at);
CREATE INDEX idx_identity_matches_status
    ON identity_match_candidates(decision_status, confidence_score);
CREATE INDEX idx_conversations_about_person
    ON message_conversations(about_person_id, updated_at);
CREATE INDEX idx_messages_conversation_time
    ON messages(conversation_id, sent_at);
CREATE INDEX idx_contact_requests_recipient
    ON contact_requests(recipient_user_id, request_status);
