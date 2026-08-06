import type { CoverAssets, SkillSuggestion, TemplateAdvice, Experience as ExperienceType, Education as EducationType } from "@/lib/supabase/types";
import { extractKeywords, cvToText, normalizeText } from "@/lib/cvAnalysis";

interface CvInput {
  personalInfo?: { name?: string };
  summary?: string;
  experience?: ExperienceType[];
  education?: EducationType[];
  skills?: string;
  languages?: string;
  certifications?: string;
}

export const marketProfiles: Record<string, { label: string; guidance: string[]; coverTone: string }> = {
  italia: {
    label: "Italia",
    guidance: [
      "Mantieni un profilo professionale chiaro e sintetico in apertura.",
      "Inserisci lingue, certificazioni e disponibilita se rilevanti.",
      "Evita dati personali non necessari se non richiesti dall'azienda.",
    ],
    coverTone: "professionale, diretto e concreto",
  },
  europa: {
    label: "Europa",
    guidance: [
      "Usa livelli lingua CEFR, per esempio Inglese C1 o Francese B2.",
      "Evidenzia mobilita, contesto internazionale e strumenti comuni al ruolo.",
      "Mantieni formato leggibile e sezioni standard anche se usi un template europeo.",
    ],
    coverTone: "internazionale, misurato e orientato alle competenze",
  },
  usa: {
    label: "USA",
    guidance: [
      "Non includere foto, data di nascita, stato civile o nazionalita.",
      "Usa bullet brevi, metriche forti e una sola pagina quando possibile.",
      "Privilegia risultati, impatto business e keyword esatte dell'offerta.",
    ],
    coverTone: "conciso, orientato ai risultati e sicuro",
  },
};

const roleSkillMap: Record<string, string[]> = {
  frontend: ["React", "TypeScript", "JavaScript", "Accessibility", "Performance", "Testing", "REST API", "Git"],
  backend: ["Node.js", "API design", "SQL", "MongoDB", "Docker", "Cloud", "Testing", "Security"],
  "full stack": ["React", "Node.js", "TypeScript", "Database design", "REST API", "Docker", "CI/CD", "Testing"],
  data: ["Python", "SQL", "Pandas", "Machine Learning", "Data Visualization", "Statistics", "ETL", "Cloud"],
  marketing: ["SEO", "Google Analytics", "Paid Ads", "Content Strategy", "CRM", "A/B Testing", "Email Marketing"],
  sales: ["CRM", "Negotiation", "Pipeline Management", "B2B Sales", "Lead Generation", "Forecasting", "Account Management"],
  manager: ["Project Management", "Agile", "Stakeholder Management", "Budget", "Roadmap", "Leadership", "Risk Management"],
  designer: ["Figma", "UX Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
};

export function detectRole(input: string = ""): string {
  const text = input.toLowerCase();
  if (text.includes("frontend") || text.includes("front-end") || text.includes("react")) return "frontend";
  if (text.includes("backend") || text.includes("back-end") || text.includes("api")) return "backend";
  if (text.includes("full stack") || text.includes("fullstack")) return "full stack";
  if (text.includes("data") || text.includes("machine learning") || text.includes("analyst")) return "data";
  if (text.includes("marketing") || text.includes("seo")) return "marketing";
  if (text.includes("sales") || text.includes("commerciale")) return "sales";
  if (text.includes("manager") || text.includes("project")) return "manager";
  if (text.includes("designer") || text.includes("ux") || text.includes("ui")) return "designer";
  return "general";
}

export function suggestSkills({ role = "", jobDescription = "", currentSkills = "" }: { role?: string; jobDescription?: string; currentSkills?: string } = {}): SkillSuggestion {
  const detectedRole = role || detectRole(`${jobDescription} ${currentSkills}`);
  const baseSkills = roleSkillMap[detectedRole] || [];
  const jdKeywords = extractKeywords(jobDescription, 18);
  const current = normalizeText(currentSkills).toLowerCase();
  const suggestions = [...new Set([...baseSkills, ...jdKeywords])]
    .filter((skill) => !current.includes(skill.toLowerCase()))
    .slice(0, 14);

  return {
    role: detectedRole,
    suggestions,
  };
}

export function generateCoverAssets({ cv = {}, jobDescription = "", market = "italia", company = "", role = "" }: { cv?: CvInput; jobDescription?: string; market?: string; company?: string; role?: string } = {}): CoverAssets {
  const profile = marketProfiles[market] || marketProfiles.italia;
  const text = cvToText(cv);
  const name = cv.personalInfo?.name || "Candidato";
  const targetRole = role || detectRole(jobDescription);
  const targetCompany = company || "la vostra azienda";
  const keywords = extractKeywords(jobDescription, 10);
  const cvKeywords = extractKeywords(text, 10);
  const topStrengths = cvKeywords.slice(0, 4).join(", ") || "esperienza, affidabilita e orientamento ai risultati";

  const coverLetter = [
    `Gentile team di ${targetCompany},`,
    "",
    `mi candido per il ruolo di ${targetRole}. Il mio profilo unisce ${topStrengths}, con un approccio ${profile.coverTone}.`,
    keywords.length
      ? `L'offerta evidenzia priorita come ${keywords.slice(0, 5).join(", ")}: sono aree che posso valorizzare nel CV e approfondire in colloquio con esempi concreti.`
      : "Posso portare un contributo concreto grazie a esperienze operative, capacita di apprendimento rapido e attenzione alla qualita del lavoro.",
    "Sarei felice di approfondire come il mio percorso possa supportare gli obiettivi del team.",
    "",
    `Cordiali saluti,\n${name}`,
  ].join("\n");

  const applicationEmail = [
    `Oggetto: Candidatura ${targetRole} - ${name}`,
    "",
    `Buongiorno,`,
    `invio la mia candidatura per il ruolo di ${targetRole}. In allegato trovate il mio CV aggiornato e mirato alla posizione.`,
    `Resto a disposizione per un colloquio conoscitivo.`,
    "",
    `Cordiali saluti,\n${name}`,
  ].join("\n");

  return {
    coverLetter,
    applicationEmail,
    market: profile.label,
    marketGuidance: profile.guidance,
  };
}

export function getTemplateAdvice(template: { id?: string; layout?: string } = {}): TemplateAdvice {
  const atsSafeIds = new Set(["ats", "minimal", "harvard", "stanford", "mit"]);
  const creativeIds = new Set(["creativo", "moderno", "tech"]);
  const academicIds = new Set(["accademico", "harvard", "oxford", "cambridge", "yale", "princeton"]);

  if (atsSafeIds.has(template.id!)) {
    return {
      label: "ATS-safe",
      category: "ATS Standard",
      warning: "Consigliato per candidature tramite portali e sistemi ATS.",
    };
  }

  if (creativeIds.has(template.id!)) {
    return {
      label: "Creativo",
      category: template.id === "tech" ? "Tech" : "Creativo",
      warning: "Ottimo per impatto visivo, meno prudente per ATS rigidi.",
    };
  }

  if (academicIds.has(template.id!)) {
    return {
      label: "Accademico",
      category: template.id === "accademico" ? "Accademico" : "Executive",
      warning: "Adatto a profili senior, accademici o istituzionali.",
    };
  }

  return {
    label: "Standard",
    category: "Standard",
    warning: template.layout === "two-column" ? "Layout elegante, ma verifica compatibilita ATS." : "Template generale.",
  };
}
