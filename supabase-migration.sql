-- Run this in Supabase SQL Editor to create the schema

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
  cv_count INTEGER DEFAULT 0,
  keyword_count INTEGER DEFAULT 0,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template TEXT DEFAULT 'moderno',
  personal_info JSONB DEFAULT '{}',
  summary TEXT DEFAULT '',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills TEXT DEFAULT '',
  languages TEXT DEFAULT '',
  certifications TEXT DEFAULT '',
  prompt TEXT,
  ai_generated BOOLEAN DEFAULT false,
  score INTEGER,
  ats_score INTEGER,
  analysis JSONB,
  application_versions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  application_status TEXT,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT,
  job_description TEXT,
  score INTEGER,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT,
  user_name TEXT,
  type TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  plan TEXT,
  amount INTEGER,
  currency TEXT,
  stripe_session_id TEXT,
  payment_intent_id TEXT,
  status TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
