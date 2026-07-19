-- English Gauntlet: rooms table for multiplayer (no auth required)
-- Run this in Supabase SQL Editor

CREATE TABLE rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'waiting', -- waiting | starting | active | finished

  creator_id   UUID NOT NULL,
  creator_name TEXT NOT NULL,
  joiner_id    UUID,
  joiner_name  TEXT,

  question_ids JSONB NOT NULL,
  time_limit   INTEGER NOT NULL DEFAULT 60,
  penalty      INTEGER NOT NULL DEFAULT 10,
  started_at   TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_code ON rooms (code);
CREATE INDEX idx_rooms_status ON rooms (status);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Anyone can read rooms (needed to join by code)
CREATE POLICY "Anyone can read rooms"
  ON rooms FOR SELECT USING (true);

-- Anyone can create rooms (anonymous or authed)
CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT WITH CHECK (true);

-- Anyone can update rooms (anonymous or authed, used for joining + game state)
CREATE POLICY "Anyone can update rooms"
  ON rooms FOR UPDATE USING (true);
