export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  credits: number;
  language: string;
  provider: string;
  google_id?: string;
  picture?: string;
  plan?: string;
  stripe_customer_id?: string;
  cv_count?: number;
  keyword_count?: number;
  score?: number;
  created_at: string;
}

export interface CV {
  id: string;
  user_id: string;
  template: string;
  personal_info: Record<string, string>;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  languages: string;
  certifications: string;
  prompt?: string;
  ai_generated?: boolean;
  score?: number;
  ats_score?: number;
  analysis?: Record<string, unknown>;
  application_versions: ApplicationVersion[];
  status: string;
  application_status?: string;
  status_history: StatusEntry[];
  created_at: string;
  updated_at: string;
}

export interface Experience {
  company: string;
  role: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year?: string;
  school?: string;
}

export interface ApplicationVersion {
  id: string;
  company: string;
  role: string;
  jobDescription: string;
  matchScore?: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  rewrittenBullets: string[];
  suggestedSkills: string[];
  market?: string;
  marketGuidance?: string[];
  coverLetter?: string;
  applicationEmail?: string;
  status: string;
  createdAt: string;
}

export interface StatusEntry {
  status: string;
  notes: string;
  changedAt: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  file_name: string;
  job_description?: string;
  score: number;
  data: Record<string, unknown>;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  type: string;
  message: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id?: string;
  plan?: string;
  amount?: number;
  currency?: string;
  stripe_session_id?: string;
  payment_intent_id?: string;
  status: string;
  error?: string;
  created_at: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  secondaryText: string;
  fontFamily: string;
  layout: "single-column" | "two-column";
  headerStyle: string;
  skillsStyle: string;
}

export interface AnalysisResult {
  score: number;
  atsScore: number;
  jobMatchScore: number | null;
  overall: string;
  strengths: string[];
  improvements: Improvement[];
  atsChecks: AtsCheck[];
  matchedKeywords: string[];
  missingKeywords: string[];
  rewrittenBullets: string[];
  review: string;
  parsed?: ParsedResume;
  resumeKeywords?: string[];
}

export interface Improvement {
  area: string;
  impact: string;
  description: string;
}

export interface AtsCheck {
  label: string;
  passed: boolean;
  fix: string;
}

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  certifications: string;
  rawText?: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  starSuggestion: string;
  improvedAnswer: string;
}

export interface BulletRewrite {
  original: string;
  rewritten: string;
  metricsAdded: string[];
  tone: string;
  explanation: string;
}

export interface SummaryResult {
  summary: string;
  headline: string;
  keyStrengths: string[];
}

export interface CoverAssets {
  coverLetter: string;
  applicationEmail: string;
  market: string;
  marketGuidance: string[];
}

export interface SkillSuggestion {
  role: string;
  suggestions: string[];
}

export interface TemplateAdvice {
  label: string;
  category: string;
  warning: string;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}
