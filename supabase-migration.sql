-- Run this in Supabase SQL Editor to create the schema
-- Attenzione: i nomi colonna devono combaciare ESATTAMENTE con quelli usati
-- dal codice (camelCase, come `userId`, `createdAt`). Se il DB esistente usa
-- snake_case, esegui le ALTER TABLE in fondo al file per allinearlo.

CREATE TABLE users (
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
  cvCount INTEGER DEFAULT 0,
  keywordCount INTEGER DEFAULT 0,
  score INTEGER,
  appStatus_draft INTEGER DEFAULT 0,
  appStatus_sent INTEGER DEFAULT 0,
  appStatus_interview INTEGER DEFAULT 0,
  appStatus_offer INTEGER DEFAULT 0,
  appStatus_rejected INTEGER DEFAULT 0,
  appStatus_accepted INTEGER DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template TEXT DEFAULT 'moderno',
  personalInfo JSONB DEFAULT '{}',
  summary TEXT DEFAULT '',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills TEXT DEFAULT '',
  languages TEXT DEFAULT '',
  certifications TEXT DEFAULT '',
  prompt TEXT,
  aiGenerated BOOLEAN DEFAULT false,
  score INTEGER,
  atsScore INTEGER,
  analysis JSONB,
  applicationVersions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  applicationStatus TEXT,
  statusHistory JSONB DEFAULT '[]',
  createdAt TIMESTAMPTZ DEFAULT now(),
  updatedAt TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  fileName TEXT,
  jobDescription TEXT,
  score INTEGER,
  data JSONB,
  createdAt TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  userEmail TEXT,
  userName TEXT,
  type TEXT,
  message TEXT,
  createdAt TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  plan TEXT,
  amount INTEGER,
  currency TEXT,
  stripeSessionId TEXT,
  paymentIntentId TEXT,
  status TEXT,
  error TEXT,
  createdAt TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cvs_user_id ON cvs(userId);
CREATE INDEX idx_analyses_user_id ON analyses(userId);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(userId);
CREATE INDEX idx_payments_user_id ON payments(userId);

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
