import type { AnalysisResult, Improvement, AtsCheck, ParsedResume, Experience, Education } from "@/lib/supabase/types";

interface CvInput {
  personalInfo?: { name?: string };
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string;
  languages?: string;
  certifications?: string;
}

const SECTION_ALIASES: Record<string, string[]> = {
  summary: ["profilo", "profilo professionale", "summary", "about", "obiettivo"],
  experience: ["esperienza", "esperienze", "esperienza lavorativa", "work experience", "employment"],
  education: ["istruzione", "formazione", "education", "studi"],
  skills: ["skills", "competenze", "competenze tecniche", "technical skills"],
  languages: ["lingue", "languages"],
  certifications: ["certificazioni", "certificates", "certifications"],
};

const ACTION_VERBS: string[] = [
  "aumentato",
  "ridotto",
  "guidato",
  "sviluppato",
  "ottimizzato",
  "gestito",
  "implementato",
  "coordinato",
  "migliorato",
  "automatizzato",
  "lanciato",
  "analizzato",
];

const STOP_WORDS: Set<string> = new Set([
  "con",
  "per",
  "dei",
  "del",
  "della",
  "delle",
  "alla",
  "allo",
  "agli",
  "the",
  "and",
  "for",
  "you",
  "are",
  "che",
  "una",
  "uno",
  "nel",
  "nella",
  "alle",
  "dagli",
  "anni",
  "ruolo",
  "lavoro",
  "team",
  "esperienza",
]);

export function normalizeText(value: string = ""): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cvToText(cv: CvInput = {}): string {
  const experience = (cv.experience || [])
    .map((exp) => [exp.role, exp.company, exp.period, exp.startDate, exp.endDate, exp.description].filter(Boolean).join(" "))
    .join("\n");
  const education = (cv.education || [])
    .map((edu) => [edu.degree, edu.institution, edu.school, edu.year].filter(Boolean).join(" "))
    .join("\n");

  return normalizeText(
    [
      cv.personalInfo?.name,
      cv.summary,
      experience,
      education,
      cv.skills,
      cv.languages,
      cv.certifications,
    ]
      .filter(Boolean)
      .join("\n\n")
  );
}

export function extractKeywords(text: string = "", limit: number = 28): string[] {
  const tokens = normalizeText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#. -]/gu, " ")
    .split(/[\s,;:()]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

export function parseResumeText(text: string = ""): ParsedResume {
  const normalized = normalizeText(text);
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let current = "summary";

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/:$/, "");
    const nextSection = Object.entries(SECTION_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => lower === alias || lower.startsWith(`${alias}:`))
    );

    if (nextSection) {
      current = nextSection[0];
      sections[current] = sections[current] || [];
      continue;
    }

    sections[current] = sections[current] || [];
    sections[current].push(line);
  }

  const firstEmail = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const firstPhone = normalized.match(/(?:\+?\d[\s().-]?){8,}/)?.[0] || "";

  return {
    personalInfo: {
      name: lines[0] && !lines[0].includes("@") ? lines[0] : "",
      email: firstEmail,
      phone: firstPhone,
    },
    summary: (sections.summary || []).slice(0, 4).join(" "),
    experience: (sections.experience || []).join("\n"),
    education: (sections.education || []).join("\n"),
    skills: (sections.skills || []).join(", "),
    languages: (sections.languages || []).join(", "),
    certifications: (sections.certifications || []).join(", "),
    rawText: normalized,
  };
}

export function rewriteExperienceBullets(text: string = ""): string[] {
  const lines = normalizeText(text)
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter((line) => line.length > 12)
    .slice(0, 8);

  return lines.map((line) => {
    const hasMetric = /\d+%|\d+\s*(k|m|clienti|utenti|progetti|persone|mesi|giorni|ore)/i.test(line);
    const startsWithAction = ACTION_VERBS.some((verb) => line.toLowerCase().startsWith(verb));
    const base = line.replace(/\.$/, "");

    if (hasMetric && startsWithAction) return base;
    if (hasMetric) return `Ottimizzato ${base.charAt(0).toLowerCase()}${base.slice(1)}`;
    return `Trasformare in risultato misurabile: ${base} (aggiungi numero, impatto e contesto)`;
  });
}

export function analyzeResume({ text = "", cv = null, jobDescription = "", template = "ats" }: { text?: string; cv?: CvInput | null; jobDescription?: string; template?: string } = {}): AnalysisResult {
  const resumeText = normalizeText(text || cvToText(cv || undefined));
  const parsed = parseResumeText(resumeText);
  const lower = resumeText.toLowerCase();
  const jobKeywords = extractKeywords(jobDescription, 32);
  const resumeKeywords = extractKeywords(resumeText, 40);
  const missingKeywords = jobKeywords.filter((keyword) => !lower.includes(keyword.toLowerCase()));
  const matchedKeywords = jobKeywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
  const jobMatchScore = jobKeywords.length ? Math.round((matchedKeywords.length / jobKeywords.length) * 100) : null;

  const atsChecks: AtsCheck[] = [
    {
      label: "Sezioni standard",
      passed: ["summary", "experience", "education", "skills"].filter((key) => parsed[key as keyof ParsedResume]).length >= 3,
      fix: "Usa intestazioni semplici: Profilo, Esperienza, Formazione, Competenze.",
    },
    {
      label: "Contatti leggibili",
      passed: Boolean(parsed.personalInfo.email || parsed.personalInfo.phone),
      fix: "Inserisci email e telefono in testo normale, non dentro immagini o header grafici.",
    },
    {
      label: "Keyword mirate",
      passed: !jobKeywords.length || jobMatchScore >= 55,
      fix: "Riprendi nel CV le parole chiave reali dell'offerta, solo se coerenti con il tuo profilo.",
    },
    {
      label: "Risultati quantificati",
      passed: /\d+%|\d+\s*(k|m|clienti|utenti|progetti|persone|mesi|giorni|ore)/i.test(resumeText),
      fix: "Aggiungi numeri a impatto, volumi, tempi, budget, clienti o dimensione del team.",
    },
    {
      label: "Formato ATS-safe",
      passed: template === "ats" || !/[│┌┐└┘■◆]/.test(resumeText),
      fix: "Evita tabelle complesse, simboli decorativi e layout a colonne per candidature tramite ATS.",
    },
  ];

  const improvements: Improvement[] = [];
  if (!parsed.summary || parsed.summary.length < 80) {
    improvements.push({
      area: "Profilo",
      impact: "Alto",
      description: "Scrivi un profilo iniziale di 3-4 righe con ruolo, seniority, settore e risultati principali.",
    });
  }
  if (!parsed.experience || parsed.experience.length < 80) {
    improvements.push({
      area: "Esperienze",
      impact: "Alto",
      description: "Aggiungi responsabilità, tecnologie/strumenti e risultati per ogni esperienza.",
    });
  }
  if (missingKeywords.length > 0) {
    improvements.push({
      area: "Keyword offerta",
      impact: "Alto",
      description: `Integra keyword mancanti se autentiche: ${missingKeywords.slice(0, 8).join(", ")}.`,
    });
  }
  if (!atsChecks[3].passed) {
    improvements.push({
      area: "Risultati",
      impact: "Medio",
      description: "Riscrivi i bullet con formula Azione + Strumento + Risultato misurabile.",
    });
  }
  if (!parsed.skills || parsed.skills.length < 30) {
    improvements.push({
      area: "Competenze",
      impact: "Medio",
      description: "Separa competenze tecniche, strumenti, metodologie, lingue e certificazioni.",
    });
  }

  const atsScore = Math.round((atsChecks.filter((check) => check.passed).length / atsChecks.length) * 100);

  const bulletLines = normalizeText(text || parsed.experience || "")
    .split(/\n|•|- /)
    .map((line) => line.trim())
    .filter((line) => line.length > 15);
  const actionLines = bulletLines.filter((line) => ACTION_VERBS.some((verb) => line.toLowerCase().startsWith(verb)));
  const metricLines = bulletLines.filter((line) => /\d+%|\d+\s*(k|m|clienti|utenti|progetti|persone|mesi|giorni|ore)/i.test(line));
  const writingScore = Math.min(
    100,
    Math.round(
      (bulletLines.length === 0 ? 0 : (actionLines.length / bulletLines.length) * 50) +
        (metricLines.length > 0 ? 20 : 0) +
        (parsed.summary && parsed.summary.length >= 80 ? 15 : 0) +
        (resumeText.length > 0 ? 15 : 0)
    )
  );

  const contentScore = Math.min(
    100,
    Math.round(
      (resumeText.length / 18) + (parsed.experience ? 20 : 0) + (parsed.skills ? 15 : 0) + (parsed.education ? 10 : 0)
    )
  );

  const readinessScore = Math.min(
    100,
    Math.round(
      [
        parsed.personalInfo.email || parsed.personalInfo.phone ? 15 : 0,
        parsed.summary && parsed.summary.length >= 80 ? 15 : 0,
        parsed.experience ? 25 : 0,
        parsed.education ? 15 : 0,
        parsed.skills ? 15 : 0,
        parsed.languages ? 10 : 0,
        metricLines.length > 0 ? 5 : 0,
      ].reduce((sum, value) => sum + value, 0)
    )
  );

  const scoreParts = [atsScore, contentScore, writingScore, readinessScore, jobMatchScore].filter((score) => score !== null);
  const score = Math.round(scoreParts.reduce((sum, value) => sum + value, 0) / scoreParts.length);

  return {
    score,
    atsScore,
    contentScore,
    writingScore,
    readinessScore,
    jobMatchScore,
    overall:
      score >= 80
        ? "CV solido: ora va personalizzato finemente per l'offerta."
        : score >= 60
        ? "Buona base, ma servono keyword, risultati e struttura più chiara."
        : "CV da rinforzare prima dell'invio: mancano elementi ATS e contenuti misurabili.",
    strengths: [
      parsed.personalInfo.email || parsed.personalInfo.phone ? "Contatti rilevati nel documento" : null,
      parsed.experience ? "Sezione esperienza presente" : null,
      parsed.skills ? "Competenze presenti" : null,
      matchedKeywords.length ? `Keyword in match: ${matchedKeywords.slice(0, 8).join(", ")}` : null,
    ].filter(Boolean) as string[],
    improvements,
    atsChecks,
    matchedKeywords,
    missingKeywords,
    resumeKeywords,
    rewrittenBullets: rewriteExperienceBullets(parsed.experience || resumeText),
    parsed,
    review: "Priorita: rendi leggibili le sezioni, allinea le keyword alla posizione e trasforma le esperienze in risultati misurabili.",
  };
}
