-- Migrazione: sezione "Interview Questions" (contenuti + mock interview AI-gradato)
-- Run this in Supabase SQL Editor.
-- Convenzioni allineate al DB esistente: colonne in camelCase (`companyId`, `createdAt`),
-- FK verso la tabella `users` (auth custom di Curriculuxe, NON auth.users).
-- L'accesso al DB avviene sempre via client service-role lato server; il controllo
-- d'accesso (ownership, gating crediti) è gestito nelle Next.js API routes.

-- ============================================================
-- Tabella aziende (archivio domande per azienda)
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logoUrl TEXT,
  isPublished BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tabella domande di colloquio (contenuto pubblico, popolato a mano)
-- type: coding | system_design | behavioral
-- ============================================================
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companyId UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  questionText TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coding', 'system_design', 'behavioral')),
  difficulty TEXT,
  approachNotes TEXT,
  isPublished BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tabella sessioni di mock interview AI-gradate (dati utente, privati)
-- aiFeedback: JSONB { score: 0-100, strengths: [], improvements: [], sampleAnswer: "" }
-- ============================================================
CREATE TABLE IF NOT EXISTS mock_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  questionId UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
  userAnswer TEXT NOT NULL,
  aiFeedback JSONB,
  createdAt TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indici
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_published ON companies(isPublished);
CREATE INDEX IF NOT EXISTS idx_questions_company ON interview_questions(companyId);
CREATE INDEX IF NOT EXISTS idx_questions_published ON interview_questions(isPublished);
CREATE INDEX IF NOT EXISTS idx_questions_type ON interview_questions(type);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_user ON mock_sessions(userId);

-- ============================================================
-- RLS: il client service-role bypassa le policy (come in tutto Curriculuxe).
-- Aggiungiamo comunque una SELECT pubblica per le tabelle di contenuto
-- così eventuali accessi con anon key restano limitati ai soli record pubblicati.
-- NOTA: niente policy basate su auth.uid(): l'auth è custom, la protezione
-- dei dati privati (mock_sessions) è gestita nelle API routes.
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_public_read" ON companies
  FOR SELECT USING (isPublished = true);

CREATE POLICY "interview_questions_public_read" ON interview_questions
  FOR SELECT USING (isPublished = true);