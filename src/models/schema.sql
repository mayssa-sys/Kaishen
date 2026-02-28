-- Kaishen MVP — PostgreSQL Schema
-- Run: psql $DATABASE_URL -f src/models/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     VARCHAR(255) NOT NULL,
  phone         VARCHAR(20) NOT NULL UNIQUE,    -- Lebanese format: +961XXXXXXXX
  email         VARCHAR(255),
  monthly_income NUMERIC(12,2),
  employment_type VARCHAR(50),                  -- salaried, self_employed, freelance, unemployed
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trust scores (history)
CREATE TABLE IF NOT EXISTS trust_scores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  score         INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  band          VARCHAR(20) NOT NULL,
  breakdown     JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trust_scores_user ON trust_scores(user_id);

-- Credolab behavioral scores
CREATE TABLE IF NOT EXISTS credolab_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  credolab_id     VARCHAR(255) NOT NULL,
  raw_score       INTEGER,                     -- 0-1000 (Credolab native)
  normalized_score INTEGER CHECK (normalized_score >= 0 AND normalized_score <= 100),
  risk_category   VARCHAR(50),
  modules         JSONB,                       -- per-module breakdowns
  fetched_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, credolab_id)
);

CREATE INDEX idx_credolab_scores_user ON credolab_scores(user_id);

-- BNPL transactions (placeholder for next phase)
CREATE TABLE IF NOT EXISTS transactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  merchant_id   UUID,
  amount_usd    NUMERIC(12,2) NOT NULL,
  installments  INTEGER NOT NULL DEFAULT 4,
  status        VARCHAR(20) DEFAULT 'pending', -- pending, active, completed, defaulted
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
