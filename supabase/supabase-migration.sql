-- Run this in Supabase SQL Editor to create the schema
-- IDEMPOTENTE: puoi eseguirlo più volte in sicurezza. Se le tabelle
-- esistono già, le salta; normalizza le colonne minuscole (vecchio
-- script) ai nomi camelCase; aggiunge solo le colonne mancanti.
-- Non cancella dati.
--
-- IMPORTANTE Postgres: gli identificatori camelCase sono sempre tra
-- doppie virgolette ("userId"), altrimenti Postgres li converte in
-- minuscolo (userid) e il codice non li trova (errore 42703).
--
-- Diagnostica (opzionale): mostra i nomi reali delle colonne
-- SELECT table_name, column_name
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name IN ('users', 'cvs', 'analyses', 'feedbacks', 'payments')
-- ORDER BY 1, 2;

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
  "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
  plan TEXT,
  amount INTEGER,
  currency TEXT,
  "stripeSessionId" TEXT,
  "paymentIntentId" TEXT,
  status TEXT,
  error TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Normalizza colonne minuscole (create dal vecchio script non
-- quotato: userid, createdat, ...) ai nomi camelCase attesi dal
-- codice ("userId", "createdAt", ...). RENAME preserva i dati.
-- Rieseguibile: rinomina SOLO se esiste la versione minuscola
-- e manca quella camelCase.
-- ============================================================
DO $$
DECLARE
  mapping TEXT[][] := ARRAY[
    ARRAY['users', 'userid', 'userId'],
    ARRAY['users', 'cvcount', 'cvCount'],
    ARRAY['users', 'keywordcount', 'keywordCount'],
    ARRAY['users', 'appstatus_draft', 'appStatus_draft'],
    ARRAY['users', 'appstatus_sent', 'appStatus_sent'],
    ARRAY['users', 'appstatus_interview', 'appStatus_interview'],
    ARRAY['users', 'appstatus_offer', 'appStatus_offer'],
    ARRAY['users', 'appstatus_rejected', 'appStatus_rejected'],
    ARRAY['users', 'appstatus_accepted', 'appStatus_accepted'],
    ARRAY['users', 'createdat', 'createdAt'],
    ARRAY['cvs', 'userid', 'userId'],
    ARRAY['cvs', 'personalinfo', 'personalInfo'],
    ARRAY['cvs', 'aigenerated', 'aiGenerated'],
    ARRAY['cvs', 'atsscore', 'atsScore'],
    ARRAY['cvs', 'applicationversions', 'applicationVersions'],
    ARRAY['cvs', 'applicationstatus', 'applicationStatus'],
    ARRAY['cvs', 'statushistory', 'statusHistory'],
    ARRAY['cvs', 'createdat', 'createdAt'],
    ARRAY['cvs', 'updatedat', 'updatedAt'],
    ARRAY['analyses', 'userid', 'userId'],
    ARRAY['analyses', 'filename', 'fileName'],
    ARRAY['analyses', 'jobdescription', 'jobDescription'],
    ARRAY['analyses', 'createdat', 'createdAt'],
    ARRAY['feedbacks', 'userid', 'userId'],
    ARRAY['feedbacks', 'useremail', 'userEmail'],
    ARRAY['feedbacks', 'username', 'userName'],
    ARRAY['feedbacks', 'createdat', 'createdAt'],
    ARRAY['payments', 'userid', 'userId'],
    ARRAY['payments', 'stripesessionid', 'stripeSessionId'],
    ARRAY['payments', 'paymentintentid', 'paymentIntentId'],
    ARRAY['payments', 'createdat', 'createdAt']
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

-- ============================================================
-- Allineamento colonne (per DB a cui mancavano delle colonne).
-- Aggiunge la colonna SOLO se non esiste: rieseguibile.
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'it';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS picture TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "cvCount" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "keywordCount" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_draft" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_sent" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_interview" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_offer" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_rejected" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "appStatus_accepted" INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();

ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'moderno';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "personalInfo" JSONB DEFAULT '{}';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT '';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS languages TEXT DEFAULT '';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS certifications TEXT DEFAULT '';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "aiGenerated" BOOLEAN DEFAULT false;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "atsScore" INTEGER;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS analysis JSONB;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "applicationVersions" JSONB DEFAULT '[]';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "applicationStatus" TEXT;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "statusHistory" JSONB DEFAULT '[]';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT now();

ALTER TABLE analyses ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS "jobDescription" TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();

ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS "userEmail" TEXT;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS "userName" TEXT;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();

ALTER TABLE payments ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS "paymentIntentId" TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS error TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT now();

-- ============================================================
-- Indici (dopo rinomina/allineamento: le colonne esistono già
-- con i nomi finali camelCase).
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs("userId");
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses("userId");
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks("userId");
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments("userId");
