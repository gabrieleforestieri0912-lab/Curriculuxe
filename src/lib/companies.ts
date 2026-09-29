import { jobCatalog, type Job } from "@/lib/jobs";

export type CompanyType = "bigtech" | "scaleup" | "enterprise" | "startup";

export interface CompanyMeta {
  type: CompanyType;
  hq: string;
}

const META: Record<string, CompanyMeta> = {
  "Bending Spoons": { type: "scaleup", hq: "Milano" },
  "Facile.it": { type: "scaleup", hq: "Milano" },
  "Remote.com Italia": { type: "scaleup", hq: "Remoto" },
  EssilorLuxottica: { type: "enterprise", hq: "Milano" },
  Reply: { type: "enterprise", hq: "Torino" },
  Docebo: { type: "scaleup", hq: "Biella" },
  "Prima Assicurazioni": { type: "scaleup", hq: "Milano" },
  Satispay: { type: "scaleup", hq: "Milano" },
  Leonardo: { type: "enterprise", hq: "Roma" },
  Privalia: { type: "scaleup", hq: "Milano" },
  "Salesforce Italia": { type: "bigtech", hq: "Milano" },
  iGenius: { type: "scaleup", hq: "Milano" },
  Bitpanda: { type: "scaleup", hq: "Vienna" },
  Zalando: { type: "bigtech", hq: "Berlino" },
  Miro: { type: "scaleup", hq: "Amsterdam" },
  "Booking.com": { type: "bigtech", hq: "Amsterdam" },
  Revolut: { type: "scaleup", hq: "Londra" },
  Deezer: { type: "scaleup", hq: "Parigi" },
  Spotify: { type: "bigtech", hq: "Stoccolma" },
  Typeform: { type: "scaleup", hq: "Barcellona" },
  Shopify: { type: "bigtech", hq: "Ottawa" },
  Stripe: { type: "bigtech", hq: "San Francisco" },
  Bloomberg: { type: "enterprise", hq: "New York" },
  Databricks: { type: "scaleup", hq: "San Francisco" },
  Figma: { type: "scaleup", hq: "San Francisco" },
  HubSpot: { type: "scaleup", hq: "Boston" },
  "Mia-Platform": { type: "startup", hq: "Milano" },
  "Enel X": { type: "enterprise", hq: "Roma" },
  Celonis: { type: "scaleup", hq: "Monaco" },
  Nexi: { type: "enterprise", hq: "Milano" },
  "Sistemi Informativi": { type: "enterprise", hq: "Roma" },
  GitHub: { type: "bigtech", hq: "San Francisco" },
  Scalapay: { type: "scaleup", hq: "Milano" },
  "Engineering Group": { type: "enterprise", hq: "Roma" },
};

const PROCESS_BY_TYPE: Record<CompanyType, { it: string[]; en: string[] }> = {
  bigtech: {
    it: ["Screening con recruiter", "Test tecnico online / phone screen", "Onsite: coding, system design, comportamentale", "Comitato assunzioni e offerta"],
    en: ["Recruiter screening", "Online tech test / phone screen", "Onsite: coding, system design, behavioral", "Hiring committee and offer"],
  },
  scaleup: {
    it: ["Colloquio conoscitivo", "Prova tecnica o take-home", "Colloquio con team e founder", "Offerta e negoziazione"],
    en: ["Intro call", "Technical test or take-home", "Team and founder interview", "Offer and negotiation"],
  },
  enterprise: {
    it: ["Candidatura e screening HR", "Colloqui tecnici (1-2 round)", "Colloquio manageriale", "Proposta e tempi di inserimento"],
    en: ["Application and HR screening", "Technical interviews (1-2 rounds)", "Managerial interview", "Proposal and onboarding timeline"],
  },
  startup: {
    it: ["Chiamata con founder", "Prova pratica sul prodotto", "Fit culturale e offerta"],
    en: ["Founder call", "Hands-on product task", "Culture fit and offer"],
  },
};

export interface CompanyContext {
  name: string;
  verified: boolean;
  type: CompanyType | null;
  hq: string;
  openRoles: Array<{ role: string; location: string; remote: boolean; salary: string }>;
  topSkills: string[];
  salaryRange: string | null;
  process: string[];
  careersUrl: string;
}

export function listCatalogCompanies(): string[] {
  return [...new Set(jobCatalog.map((j) => j.company))].sort((a, b) => a.localeCompare(b));
}

function topSkills(jobs: Job[]): string[] {
  const counts = new Map<string, number>();
  for (const j of jobs) {
    for (const s of [...j.requiredSkills, ...j.keywords]) {
      counts.set(s, (counts.get(s) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([s]) => s);
}

/**
 * Contesto reale di un'azienda: statistiche calcolate dai NOSTRI annunci
 * verificati + processo tipico per tipologia. Se l'azienda non è nel
 * catalogo, verified=false e l'AI deve dichiararlo esplicitamente.
 */
export function getCompanyContext(name: string, lang: string): CompanyContext {
  const en = lang === "en";
  const trimmed = name.trim();
  const jobs = jobCatalog.filter((j) => j.company.toLowerCase() === trimmed.toLowerCase());
  const meta = META[trimmed];
  const type = meta?.type || (jobs.length > 0 ? "scaleup" : null);

  let salaryRange: string | null = null;
  if (jobs.length > 0) {
    const mins = jobs.map((j) => j.salaryMin).filter(Boolean);
    const maxs = jobs.map((j) => j.salaryMax).filter(Boolean);
    if (mins.length && maxs.length) {
      salaryRange = `${Math.min(...mins)}k–${Math.max(...maxs)}k`;
    }
  }

  return {
    name: trimmed,
    verified: jobs.length > 0,
    type,
    hq: meta?.hq || "",
    openRoles: jobs.slice(0, 5).map((j) => ({
      role: j.role,
      location: j.location,
      remote: j.remote,
      salary: `${j.salaryMin}-${j.salaryMax}k`,
    })),
    topSkills: topSkills(jobs),
    salaryRange,
    process: type ? PROCESS_BY_TYPE[type][en ? "en" : "it"] : [],
    careersUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(trimmed + " careers")}`,
  };
}

/** Limiti target per piano: il free ne permette 1 sola. */
export const TARGET_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  pro: 10,
  enterprise: 50,
};
