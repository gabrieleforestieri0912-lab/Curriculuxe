-- Progresso checklist risorse (roadmap, progetti, guide).
-- Una riga per utente + contenuto + voce di checklist: il vincolo unico
-- permette l'upsert da API senza conflitti.
-- IDEMPOTENTE: rieseguibile in sicurezza, non cancella dati.
CREATE TABLE IF NOT EXISTS resource_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  contentType TEXT NOT NULL CHECK (contentType IN ('roadmap', 'project', 'guide')),
  contentSlug TEXT NOT NULL,
  items JSONB DEFAULT '{}',
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE ("userId", contentType, contentSlug)
);

CREATE INDEX IF NOT EXISTS idx_resource_progress_user ON resource_progress("userId");