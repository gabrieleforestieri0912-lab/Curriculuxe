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

CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON usage_counters("userId", feature);
CREATE INDEX IF NOT EXISTS idx_mcp_user ON mcp_connections("userId");
CREATE INDEX IF NOT EXISTS idx_digests_user ON daily_digests("userId");
