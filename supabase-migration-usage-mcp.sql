-- UsageCounter + MCPConnection + Atlas digest (ResuMax parity)
CREATE TABLE IF NOT EXISTS usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily','monthly')),
  count INTEGER DEFAULT 0,
  "resetAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE ("userId", feature, period)
);

CREATE TABLE IF NOT EXISTS mcp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  "clientName" TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  "lastActiveAt" TIMESTAMPTZ DEFAULT now(),
  "connectedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  digest JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

DO $$
DECLARE
  mapping TEXT[][] := ARRAY[
    ARRAY['usage_counters', 'userid', 'userId'],
    ARRAY['usage_counters', 'resetat', 'resetAt'],
    ARRAY['usage_counters', 'createdat', 'createdAt'],
    ARRAY['mcp_connections', 'userid', 'userId'],
    ARRAY['mcp_connections', 'clientname', 'clientName'],
    ARRAY['mcp_connections', 'lastactiveat', 'lastActiveAt'],
    ARRAY['mcp_connections', 'connectedat', 'connectedAt'],
    ARRAY['daily_digests', 'userid', 'userId'],
    ARRAY['daily_digests', 'createdat', 'createdAt']
  ];
  m TEXT[];
  old_exists BOOLEAN;
  new_exists BOOLEAN;
BEGIN
  FOREACH m SLICE 1 IN ARRAY mapping
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = m[1] AND column_name = m[2]
    ) INTO old_exists;
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = m[1] AND column_name = m[3]
    ) INTO new_exists;
    IF old_exists AND NOT new_exists THEN
      EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', m[1], m[2], m[3]);
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON usage_counters("userId", feature);
CREATE INDEX IF NOT EXISTS idx_mcp_user ON mcp_connections("userId");
CREATE INDEX IF NOT EXISTS idx_digests_user ON daily_digests("userId");
