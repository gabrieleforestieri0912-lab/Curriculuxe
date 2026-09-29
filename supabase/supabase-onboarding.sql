-- Onboarding profili: risposte al questionario + piano AI generato.
-- IDEMPOTENTE: rieseguibile in sicurezza, non cancella dati.
CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  answers JSONB DEFAULT '{}',
  plan JSONB,
  completed BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_user ON onboarding_profiles("userId");
