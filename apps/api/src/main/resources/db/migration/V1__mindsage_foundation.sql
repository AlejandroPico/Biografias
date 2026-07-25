-- MindSage: esquema fundacional portable entre SQLite y PostgreSQL.
-- Los identificadores se generan en la aplicación como UUID para evitar
-- dependencias de funciones específicas de un motor.

CREATE TABLE app_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'es-ES',
    time_zone TEXT NOT NULL DEFAULT 'Europe/Madrid',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_credentials (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    password_hash TEXT,
    identity_provider TEXT,
    provider_subject TEXT,
    mfa_enabled INTEGER NOT NULL DEFAULT 0,
    password_changed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    token_fingerprint TEXT NOT NULL UNIQUE,
    ip_hash TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_role_assignments (
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    granted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE households (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE household_members (
    household_id TEXT NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    membership_role TEXT NOT NULL DEFAULT 'MEMBER',
    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (household_id, user_id)
);

CREATE TABLE invitations (
    id TEXT PRIMARY KEY,
    household_id TEXT REFERENCES households(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    invited_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    token_fingerprint TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    accepted_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE people (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    given_names TEXT NOT NULL,
    family_names TEXT NOT NULL,
    preferred_name TEXT,
    pronouns TEXT,
    gender_identity TEXT,
    birth_date TEXT,
    death_date TEXT,
    summary TEXT NOT NULL,
    birthplace TEXT,
    current_residence TEXT,
    primary_occupation TEXT,
    nationality TEXT,
    languages TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    consent_status TEXT NOT NULL DEFAULT 'PENDING',
    biography_completeness INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (biography_completeness BETWEEN 0 AND 100)
);

CREATE TABLE person_names (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    name_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    valid_from TEXT,
    valid_until TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE person_contacts (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE person_identifiers (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    identifier_type TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    issuing_country TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (person_id, identifier_type, encrypted_value)
);

CREATE TABLE person_preferences (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL UNIQUE REFERENCES people(id) ON DELETE CASCADE,
    preferred_language TEXT NOT NULL DEFAULT 'es-ES',
    accessibility_notes TEXT,
    interview_pace TEXT,
    sensitive_topics TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consent_records (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    granted_by_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    legal_basis TEXT NOT NULL,
    status TEXT NOT NULL,
    signed_at TEXT,
    expires_at TEXT,
    revoked_at TEXT,
    evidence_uri TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consent_scopes (
    id TEXT PRIMARY KEY,
    consent_record_id TEXT NOT NULL REFERENCES consent_records(id) ON DELETE CASCADE,
    scope_code TEXT NOT NULL,
    allowed INTEGER NOT NULL DEFAULT 0,
    restrictions TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (consent_record_id, scope_code)
);

CREATE TABLE data_processing_records (
    id TEXT PRIMARY KEY,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL,
    data_categories TEXT NOT NULL,
    legal_basis TEXT NOT NULL,
    processor TEXT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_grants (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    grantee_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    access_level TEXT NOT NULL,
    expires_at TEXT,
    granted_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (person_id, grantee_user_id)
);

CREATE TABLE access_audit_events (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    outcome TEXT NOT NULL,
    ip_hash TEXT,
    occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE relationships (
    id TEXT PRIMARY KEY,
    from_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    to_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    started_on TEXT,
    ended_on TEXT,
    confidence TEXT NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    visibility TEXT NOT NULL DEFAULT 'FAMILY',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_person_id <> to_person_id)
);

CREATE TABLE relationship_evidence (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    source_id TEXT,
    description TEXT NOT NULL,
    confidence_score INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 100)
);

CREATE TABLE family_trees (
    id TEXT PRIMARY KEY,
    household_id TEXT REFERENCES households(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT NOT NULL DEFAULT 'FAMILY',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE family_tree_members (
    tree_id TEXT NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    generation_index INTEGER,
    branch_label TEXT,
    PRIMARY KEY (tree_id, person_id)
);

CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location_type TEXT NOT NULL,
    address TEXT,
    city TEXT,
    region TEXT,
    country_code TEXT,
    latitude REAL,
    longitude REAL,
    historical_name TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE TABLE residences (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    started_on TEXT,
    ended_on TEXT,
    residence_type TEXT,
    reason TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE migrations (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    from_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    to_location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    departed_on TEXT,
    arrived_on TEXT,
    reason TEXT,
    transport_mode TEXT,
    narrative TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journeys (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    purpose TEXT,
    started_on TEXT,
    ended_on TEXT,
    narrative TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journey_stops (
    id TEXT PRIMARY KEY,
    journey_id TEXT NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    stop_order INTEGER NOT NULL,
    arrived_on TEXT,
    departed_on TEXT,
    notes TEXT,
    UNIQUE (journey_id, stop_order)
);

CREATE TABLE life_events (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    start_date TEXT,
    end_date TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    date_precision TEXT NOT NULL DEFAULT 'DAY',
    order_index INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_participants (
    event_id TEXT NOT NULL REFERENCES life_events(id) ON DELETE CASCADE,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    participation_role TEXT,
    notes TEXT,
    PRIMARY KEY (event_id, person_id)
);

CREATE TABLE event_locations (
    event_id TEXT NOT NULL REFERENCES life_events(id) ON DELETE CASCADE,
    location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    location_role TEXT NOT NULL DEFAULT 'PRIMARY',
    PRIMARY KEY (event_id, location_id, location_role)
);

CREATE TABLE historical_eras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    started_on TEXT,
    ended_on TEXT,
    geographic_scope TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE person_eras (
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    era_id TEXT NOT NULL REFERENCES historical_eras(id) ON DELETE CASCADE,
    relevance TEXT,
    firsthand_witness INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (person_id, era_id)
);

CREATE TABLE education_records (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    study_field TEXT,
    qualification TEXT,
    started_on TEXT,
    ended_on TEXT,
    location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    narrative TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE qualifications (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuing_organization TEXT,
    issued_on TEXT,
    expires_on TEXT,
    credential_uri TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE occupations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employment_records (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    occupation_id TEXT REFERENCES occupations(id) ON DELETE SET NULL,
    organization TEXT NOT NULL,
    role_title TEXT,
    started_on TEXT,
    ended_on TEXT,
    location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    narrative TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE military_service (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    organization TEXT,
    unit_name TEXT,
    rank_or_role TEXT,
    conflict_name TEXT,
    started_on TEXT,
    ended_on TEXT,
    location_summary TEXT,
    narrative TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE civic_service (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    organization TEXT,
    role_title TEXT,
    cause TEXT,
    started_on TEXT,
    ended_on TEXT,
    narrative TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stories (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    synopsis TEXT,
    happened_on TEXT,
    story_status TEXT NOT NULL DEFAULT 'DRAFT',
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_versions (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    language_code TEXT NOT NULL DEFAULT 'es-ES',
    content TEXT NOT NULL,
    change_summary TEXT,
    authored_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (story_id, version_number, language_code)
);

CREATE TABLE wisdom_entries (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    audience TEXT,
    theme TEXT NOT NULL,
    recorded_on TEXT,
    source_type TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reflections (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    period_of_life TEXT,
    recorded_on TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE letters (
    id TEXT PRIMARY KEY,
    author_person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    recipient_description TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    written_on TEXT,
    delivery_moment TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    origin_story TEXT,
    servings INTEGER,
    visibility TEXT NOT NULL DEFAULT 'FAMILY',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE traditions (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    season_or_date TEXT,
    place_summary TEXT,
    transmission_notes TEXT,
    visibility TEXT NOT NULL DEFAULT 'FAMILY',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interviews (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    interviewer_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    interview_status TEXT NOT NULL DEFAULT 'PLANNED',
    scheduled_for TEXT,
    started_at TEXT,
    ended_at TEXT,
    location_summary TEXT,
    consent_record_id TEXT REFERENCES consent_records(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interview_sessions (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    started_at TEXT,
    ended_at TEXT,
    mood_notes TEXT,
    technical_notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (interview_id, session_number)
);

CREATE TABLE question_catalog (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    prompt TEXT NOT NULL,
    follow_up_hint TEXT,
    sensitivity_level TEXT NOT NULL DEFAULT 'NORMAL',
    age_context TEXT,
    locale TEXT NOT NULL DEFAULT 'es-ES',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interview_questions (
    id TEXT PRIMARY KEY,
    interview_session_id TEXT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    catalog_question_id TEXT REFERENCES question_catalog(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    asked_at TEXT,
    question_order INTEGER NOT NULL,
    skipped_reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (interview_session_id, question_order)
);

CREATE TABLE interview_answers (
    id TEXT PRIMARY KEY,
    interview_question_id TEXT NOT NULL UNIQUE REFERENCES interview_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    started_at TEXT,
    ended_at TEXT,
    emotional_tone TEXT,
    confidence_notes TEXT,
    review_status TEXT NOT NULL DEFAULT 'UNREVIEWED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answer_segments (
    id TEXT PRIMARY KEY,
    answer_id TEXT NOT NULL REFERENCES interview_answers(id) ON DELETE CASCADE,
    segment_order INTEGER NOT NULL,
    start_seconds REAL,
    end_seconds REAL,
    transcript_text TEXT,
    speaker_label TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (answer_id, segment_order)
);

CREATE TABLE media_assets (
    id TEXT PRIMARY KEY,
    owner_person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    uploaded_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    media_type TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    original_filename TEXT,
    mime_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    checksum_sha256 TEXT NOT NULL,
    captured_at TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    encryption_status TEXT NOT NULL DEFAULT 'AT_REST',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (byte_size >= 0)
);

CREATE TABLE media_variants (
    id TEXT PRIMARY KEY,
    media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    duration_seconds REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (media_asset_id, variant_type)
);

CREATE TABLE media_links (
    id TEXT PRIMARY KEY,
    media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    relation_type TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transcripts (
    id TEXT PRIMARY KEY,
    media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    transcript_status TEXT NOT NULL DEFAULT 'PENDING',
    plain_text TEXT,
    generated_by TEXT,
    reviewed_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transcript_segments (
    id TEXT PRIMARY KEY,
    transcript_id TEXT NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
    segment_order INTEGER NOT NULL,
    start_seconds REAL NOT NULL,
    end_seconds REAL NOT NULL,
    speaker_label TEXT,
    text TEXT NOT NULL,
    confidence REAL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (transcript_id, segment_order)
);

CREATE TABLE captions (
    id TEXT PRIMARY KEY,
    media_asset_id TEXT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    format TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    human_reviewed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (media_asset_id, language_code, format)
);

CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    media_asset_id TEXT NOT NULL UNIQUE REFERENCES media_assets(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    issued_on TEXT,
    issuing_body TEXT,
    extracted_text TEXT,
    sensitivity_level TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sources (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL,
    title TEXT NOT NULL,
    author_or_creator TEXT,
    publisher TEXT,
    publication_date TEXT,
    url TEXT,
    archive_uri TEXT,
    accessed_on TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE citations (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    locator TEXT,
    quotation TEXT,
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tagged_resources (
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    tagged_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tag_id, resource_type, resource_id)
);

CREATE TABLE collections (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    visibility TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_items (
    collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (collection_id, resource_type, resource_id)
);

CREATE TABLE ai_consent_profiles (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL UNIQUE REFERENCES people(id) ON DELETE CASCADE,
    voice_synthesis_allowed INTEGER NOT NULL DEFAULT 0,
    avatar_generation_allowed INTEGER NOT NULL DEFAULT 0,
    conversational_simulation_allowed INTEGER NOT NULL DEFAULT 0,
    training_use_allowed INTEGER NOT NULL DEFAULT 0,
    disclosure_text TEXT NOT NULL,
    approved_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    approved_at TEXT,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_models (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    consent_profile_id TEXT NOT NULL REFERENCES ai_consent_profiles(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL,
    external_model_reference TEXT NOT NULL,
    model_status TEXT NOT NULL,
    disclosure_required INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT
);

CREATE TABLE avatar_models (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    consent_profile_id TEXT NOT NULL REFERENCES ai_consent_profiles(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL,
    external_model_reference TEXT NOT NULL,
    model_status TEXT NOT NULL,
    disclosure_required INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT
);

CREATE TABLE persona_simulations (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    consent_profile_id TEXT NOT NULL REFERENCES ai_consent_profiles(id) ON DELETE RESTRICT,
    system_description TEXT NOT NULL,
    source_snapshot TEXT NOT NULL,
    model_provider TEXT NOT NULL,
    model_name TEXT NOT NULL,
    simulation_status TEXT NOT NULL DEFAULT 'DISABLED',
    approved_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_interaction_logs (
    id TEXT PRIMARY KEY,
    simulation_id TEXT NOT NULL REFERENCES persona_simulations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    session_reference TEXT NOT NULL,
    prompt_hash TEXT NOT NULL,
    response_hash TEXT NOT NULL,
    safety_outcome TEXT NOT NULL,
    disclosure_shown INTEGER NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    author_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    body TEXT NOT NULL,
    moderation_status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, resource_type, resource_id, reaction_type)
);

CREATE TABLE reports (
    id TEXT PRIMARY KEY,
    reporter_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    reason_code TEXT NOT NULL,
    details TEXT,
    report_status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT
);

CREATE TABLE moderation_actions (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES reports(id) ON DELETE SET NULL,
    moderator_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE retention_policies (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL UNIQUE,
    retention_days INTEGER,
    after_death_policy TEXT,
    legal_hold_allowed INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deletion_requests (
    id TEXT PRIMARY KEY,
    requester_user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    request_scope TEXT NOT NULL,
    reason TEXT,
    request_status TEXT NOT NULL DEFAULT 'RECEIVED',
    requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TEXT,
    completed_at TEXT
);

CREATE TABLE export_jobs (
    id TEXT PRIMARY KEY,
    requested_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    person_id TEXT REFERENCES people(id) ON DELETE SET NULL,
    export_format TEXT NOT NULL,
    export_scope TEXT NOT NULL,
    job_status TEXT NOT NULL DEFAULT 'QUEUED',
    storage_key TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT
);

CREATE TABLE import_jobs (
    id TEXT PRIMARY KEY,
    requested_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
    source_format TEXT NOT NULL,
    source_storage_key TEXT NOT NULL,
    job_status TEXT NOT NULL DEFAULT 'QUEUED',
    imported_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    report_storage_key TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT
);

CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    action_uri TEXT,
    read_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE backup_manifests (
    id TEXT PRIMARY KEY,
    backup_type TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    checksum_sha256 TEXT NOT NULL,
    encrypted INTEGER NOT NULL DEFAULT 1,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    verification_status TEXT NOT NULL DEFAULT 'PENDING',
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_people_visibility ON people(visibility);
CREATE INDEX idx_people_family_names ON people(family_names, given_names);
CREATE INDEX idx_life_events_person_order ON life_events(person_id, order_index);
CREATE INDEX idx_wisdom_person_date ON wisdom_entries(person_id, recorded_on);
CREATE INDEX idx_relationships_from ON relationships(from_person_id);
CREATE INDEX idx_relationships_to ON relationships(to_person_id);
CREATE INDEX idx_residences_person ON residences(person_id);
CREATE INDEX idx_migrations_person ON migrations(person_id);
CREATE INDEX idx_stories_person ON stories(person_id);
CREATE INDEX idx_media_owner ON media_assets(owner_person_id);
CREATE INDEX idx_interviews_person ON interviews(person_id);
CREATE INDEX idx_audit_person_time ON access_audit_events(person_id, occurred_at);
