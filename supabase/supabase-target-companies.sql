-- Aziende target: scelta utente + questionario + piano di ingresso AI.
-- IDEMPOTENTE: rieseguibile in sicurezza, non cancella dati.
CREATE TABLE IF NOT EXISTS target_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  questions JSONB DEFAULT '[]',
  answers JSONB DEFAULT '[]',
  plan JSONB,
  status TEXT DEFAULT 'picked',
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_targets_user ON target_companies("userId");
