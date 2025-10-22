CREATE TABLE analytics_views (
    id BIGSERIAL PRIMARY KEY,
    recorded TIMESTAMPTZ NOT NULL,
    domain TEXT NOT NULL,
    site_path TEXT NOT NULL,
    user_id BIGINT,
    project_id BIGINT NOT NULL,
    monetized BOOLEAN DEFAULT TRUE,
    ip TEXT,
    country TEXT,
    user_agent TEXT,
    headers JSONB
);

CREATE TABLE analytics_downloads (
    id BIGSERIAL PRIMARY KEY,
    recorded TIMESTAMPTZ NOT NULL,
    domain TEXT NOT NULL,
    site_path TEXT NOT NULL,
    user_id BIGINT,
    project_id BIGINT NOT NULL,
    version_id BIGINT NOT NULL,
    ip TEXT,
    country TEXT,
    user_agent TEXT,
    headers JSONB
);

CREATE TABLE analytics_playtime (
    id BIGSERIAL PRIMARY KEY,
    recorded TIMESTAMPTZ NOT NULL,
    seconds BIGINT NOT NULL,
    user_id BIGINT,
    project_id BIGINT NOT NULL,
    version_id BIGINT NOT NULL,
    loader TEXT,
    game_version TEXT,
    parent_id BIGINT
);
