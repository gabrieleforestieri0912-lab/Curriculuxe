CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  language TEXT DEFAULT 'it',
  provider TEXT DEFAULT 'email',
  google_id TEXT,
  picture TEXT,
  plan TEXT,
  stripe_customer_id TEXT,
  "cvCount" INTEGER DEFAULT 0,
  "keywordCount" INTEGER DEFAULT 0,
  score INTEGER,
  "appStatus_draft" INTEGER DEFAULT 0,
  "appStatus_sent" INTEGER DEFAULT 0,
  "appStatus_interview" INTEGER DEFAULT 0,
  "appStatus_offer" INTEGER DEFAULT 0,
  "appStatus_rejected" INTEGER DEFAULT 0,
  "appStatus_accepted" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template TEXT DEFAULT 'moderno',
  "personalInfo" JSONB DEFAULT '{}',
  summary TEXT DEFAULT '',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills TEXT DEFAULT '',
  languages TEXT DEFAULT '',
  certifications TEXT DEFAULT '',
  prompt TEXT,
  "aiGenerated" BOOLEAN DEFAULT false,
  score INTEGER,
  "atsScore" INTEGER,
  analysis JSONB,
  "applicationVersions" JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  "applicationStatus" TEXT,
  "statusHistory" JSONB DEFAULT '[]',
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  "fileName" TEXT,
  "jobDescription" TEXT,
  score INTEGER,
  data JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  "userEmail" TEXT,
  "userName" TEXT,
  type TEXT,
  message TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES users(id) ON DELETE
  SET NULL,
    plan TEXT,
    amount INTEGER,
    currency TEXT,
    "stripeSessionId" TEXT,
    "paymentIntentId" TEXT,
    status TEXT,
    error TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs("userId");
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses("userId");
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks("userId");
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments("userId");
-- ============================================================
-- Allineamento colonne (per DB creati con una versione vecchia
-- di questo file a cui mancavano delle colonne). Ogni istruzione
-- aggiunge la colonna SOLO se non esiste: rieseguibile in sicurezza.
-- ============================================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'it';
ALTER TABLE users
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS picture TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "cvCount" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "keywordCount" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_draft" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_sent" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_interview" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_offer" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_rejected" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "appStatus_accepted" INTEGER DEFAULT 0;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'moderno';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "personalInfo" JSONB DEFAULT '{}';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT '';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS languages TEXT DEFAULT '';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS certifications TEXT DEFAULT '';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "aiGenerated" BOOLEAN DEFAULT false;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "atsScore" INTEGER;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS analysis JSONB;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "applicationVersions" JSONB DEFAULT '[]';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "applicationStatus" TEXT;
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "statusHistory" JSONB DEFAULT '[]';
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE cvs
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS "jobDescription" TEXT;
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS "userEmail" TEXT;
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS "userName" TEXT;
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE feedbacks
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE
SET NULL;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS amount INTEGER;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS "paymentIntentId" TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS error TEXT;
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
-- ============================================================
-- Migrazione per DB esistenti (schema vecchio snake_case)
-- ============================================================
-- Esegui queste istruzioni SOLO se il tuo DB usa ancora i vecchi
-- nomi colonna (user_id, created_at, cv_count, ...).
-- ALTER TABLE users
--   RENAME COLUMN cv_count TO "cvCount";
-- ALTER TABLE users
--   RENAME COLUMN keyword_count TO "keywordCount";
-- ALTER TABLE users
--   RENAME COLUMN created_at TO "createdAt";
-- ALTER TABLE users
--   ADD COLUMN IF NOT EXISTS "appStatus_draft" INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS "appStatus_sent" INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS "appStatus_interview" INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS "appStatus_offer" INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS "appStatus_rejected" INTEGER DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS "appStatus_accepted" INTEGER DEFAULT 0;
-- ALTER TABLE cvs
--   RENAME COLUMN user_id TO "userId";
-- ALTER TABLE cvs
--   RENAME COLUMN personal_info TO "personalInfo";
-- ALTER TABLE cvs
--   RENAME COLUMN ai_generated TO "aiGenerated";
-- ALTER TABLE cvs
--   RENAME COLUMN ats_score TO "atsScore";
-- ALTER TABLE cvs
--   RENAME COLUMN application_versions TO "applicationVersions";
-- ALTER TABLE cvs
--   RENAME COLUMN application_status TO "applicationStatus";
-- ALTER TABLE cvs
--   RENAME COLUMN status_history TO "statusHistory";
-- ALTER TABLE cvs
--   RENAME COLUMN created_at TO "createdAt";
-- ALTER TABLE cvs
--   RENAME COLUMN updated_at TO "updatedAt";
-- ALTER TABLE analyses
--   RENAME COLUMN user_id TO "userId";
-- ALTER TABLE analyses
--   RENAME COLUMN file_name TO "fileName";
-- ALTER TABLE analyses
--   RENAME COLUMN job_description TO "jobDescription";
-- ALTER TABLE analyses
--   RENAME COLUMN created_at TO "createdAt";
-- ALTER TABLE feedbacks
--   RENAME COLUMN user_id TO "userId";
-- ALTER TABLE feedbacks
--   RENAME COLUMN user_email TO "userEmail";
-- ALTER TABLE feedbacks
--   RENAME COLUMN user_name TO "userName";
-- ALTER TABLE feedbacks
--   RENAME COLUMN created_at TO "createdAt";
-- ALTER TABLE payments
--   RENAME COLUMN user_id TO "userId";
-- ALTER TABLE payments
--   RENAME COLUMN stripe_session_id TO "stripeSessionId";
-- ALTER TABLE payments
--   RENAME COLUMN payment_intent_id TO "paymentIntentId";
-- ALTER TABLE payments
--   RENAME COLUMN created_at TO "createdAt";