CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "logoUrl" TEXT,
  "isPublished" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  "questionText" TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coding', 'system_design', 'behavioral')),
  difficulty TEXT,
  "approachNotes" TEXT,
  "isPublished" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  "questionId" UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
  "userAnswer" TEXT NOT NULL,
  "aiFeedback" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

DO $$
DECLARE
  mapping TEXT[][] := ARRAY[
    ARRAY['companies', 'logourl', 'logoUrl'],
    ARRAY['companies', 'ispublished', 'isPublished'],
    ARRAY['companies', 'createdat', 'createdAt'],
    ARRAY['interview_questions', 'companyid', 'companyId'],
    ARRAY['interview_questions', 'questiontext', 'questionText'],
    ARRAY['interview_questions', 'approachnotes', 'approachNotes'],
    ARRAY['interview_questions', 'ispublished', 'isPublished'],
    ARRAY['interview_questions', 'createdat', 'createdAt'],
    ARRAY['mock_sessions', 'userid', 'userId'],
    ARRAY['mock_sessions', 'questionid', 'questionId'],
    ARRAY['mock_sessions', 'useranswer', 'userAnswer'],
    ARRAY['mock_sessions', 'aifeedback', 'aiFeedback'],
    ARRAY['mock_sessions', 'createdat', 'createdAt']
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

CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_published ON companies("isPublished");
CREATE INDEX IF NOT EXISTS idx_questions_company ON interview_questions("companyId");
CREATE INDEX IF NOT EXISTS idx_questions_published ON interview_questions("isPublished");
CREATE INDEX IF NOT EXISTS idx_questions_type ON interview_questions(type);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_user ON mock_sessions("userId");

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "companies_public_read" ON companies;
CREATE POLICY "companies_public_read" ON companies
  FOR SELECT USING ("isPublished" = true);

DROP POLICY IF EXISTS "interview_questions_public_read" ON interview_questions;
CREATE POLICY "interview_questions_public_read" ON interview_questions
  FOR SELECT USING ("isPublished" = true);