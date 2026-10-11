export type ContentType = "roadmap" | "project" | "guide";

export type GuideCategory = "cv" | "ats" | "cover-letter" | "colloqui" | "stipendi";

export type Difficulty = "principiante" | "intermedio" | "avanzato";

export type Market = "italia" | "europa" | "usa";

export interface ResourceMeta {
  slug: string;
  href: string;
  label: string;
  /** Etichetta usata nelle tab del hub e nel menu Risorse. */
  navLabel: string;
  description: string;
}

export interface GuideExample {
  label: string;
  before: string;
  after: string;
  note?: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  example?: GuideExample;
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: GuideCategory;
  intro: string;
  sections: GuideSection[];
  checklist: string[];
  faq: { q: string; a: string }[];
  sources: { label: string; href?: string }[];
  related: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface RoadmapStop {
  id: string;
  title: string;
  goal: string;
  skills: string[];
  projects: string[];
  cvEvidence: string;
  doneWhen: string;
  resources: { label: string; href?: string }[];
}

export interface Roadmap {
  slug: string;
  title: string;
  metaDescription: string;
  role: string;
  level: string;
  levelLabel: string;
  months: number;
  hoursPerWeek: number;
  market: Market;
  intro: string;
  prerequisites: string[];
  stops: RoadmapStop[];
  /** Keyword che collegano la roadmap agli annunci reali del Career Market. */
  jobKeywords: string[];
  relatedGuides: string[];
}

export interface Project {
  slug: string;
  title: string;
  stack: string[];
  difficulty: Difficulty;
  hours: number;
  roles: string[];
  goal: string;
  /** Milestone anteprima: visibili a tutti. */
  previewMilestones: string[];
  /** Milestone riservate ai piani indicati. */
  fullMilestones: string[];
  architecture: string[];
  commonMistakes: string[];
  qualityCriteria: string[];
  cvBullet: string;
  skills: string[];
  roadmapSlug?: string;
  guideSlug?: string;
  minPlan: "free" | "starter" | "pro" | "enterprise";
}

export interface CompareCell {
  value: "yes" | "no" | "partial" | "unknown";
  detail: string;
}

export interface CompareRow {
  feature: string;
  category: "ats" | "tailoring" | "mercato" | "trasparenza";
  curriculuxe: CompareCell;
  generic: CompareCell;
}

export interface ComparePlan {
  plan: string;
  price: string;
  curriculuxe: string;
  generic: string;
}

export interface SalaryBand {
  key: string;
  role: string;
  seniority: string;
  market: Market;
  locations: string[];
  remote: boolean | null;
  currency: "EUR" | "USD";
  min: number;
  median: number;
  max: number;
  sampleSize: number;
  jobIds: string[];
  latestPostedAt: string;
}