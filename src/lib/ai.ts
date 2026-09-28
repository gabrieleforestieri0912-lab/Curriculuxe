import type { InterviewFeedback, BulletRewrite, SummaryResult } from "@/lib/supabase/types";

// Provider AI: gateway compatibile con le API OpenAI (una sola chiamata
// chat/completions con output forzato in JSON, senza provider di fallback).
const AI_API_URL =
  process.env.AI_API_URL || "https://api.xkiro.com/v1/chat/completions";
const AI_MODEL = process.env.AI_MODEL || "qwen/qwen3.5-plus:free";

const AI_TIMEOUT_MS = 30_000;

interface CallAIOptions {
  maxTokens?: number;
  temperature?: number;
}

async function callAI(prompt: string, opts?: CallAIOptions): Promise<string | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.warn("AI_API_KEY non configurata: nessuna funzionalità AI attiva.");
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: opts?.maxTokens ?? 2000,
        temperature: opts?.temperature ?? 0.5,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`AI provider HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content : null;
  } catch (error) {
    console.warn("AI provider non disponibile:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getInterviewFeedback(
  question: string,
  answer: string,
  role: string
): Promise<InterviewFeedback | null> {
  const prompt = `Sei un coach di carriera specializzato in preparazione ai colloqui tecnici e comportamentali.

Domanda del colloquio: "${question}"
Ruolo target: "${role}"
Risposta del candidato: "${answer}"

Analizza la risposta e fornisci:
1. Un punteggio da 1 a 10
2. 2-3 punti di forza specifici
3. 2-3 aree di miglioramento specifiche
4. Un suggerimento su come applicare il metodo STAR (Situazione, Task, Azione, Risultato)
5. Una versione migliorata della risposta

Rispondi in formato JSON:
{
  "score": <numero 1-10>,
  "strengths": ["<forza 1>", "<forza 2>", "<forza 3>"],
  "improvements": ["<miglioramento 1>", "<miglioramento 2>", "<miglioramento 3>"],
  "starSuggestion": "<consiglio STAR specifico per questa domanda>",
  "improvedAnswer": "<versione riscritta e migliorata della risposta>"
}`;

  try {
    const response = await callAI(prompt, { maxTokens: 1500, temperature: 0.6 });
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error getting interview feedback:", error);
    return null;
  }
}

export async function rewriteBulletWithAI(
  bullet: string,
  role: string,
  jobDescription?: string
): Promise<BulletRewrite | null> {
  const prompt = `Sei un esperto di resume writing e personal branding.

Bullet point originale: "${bullet}"
Ruolo target: "${role}"
Job Description: "${jobDescription || 'N/A'}"

Riscrivi questo bullet point per massimizzare l'impatto:
- Usa il formato: Azione + Strumento/Metodo + Risultato Misurabile
- Aggiungi metriche e numeri dove possibile (es. "40%", "3x", "€500K")
- Usa verbi d'azione forti
- Allinea il linguaggio alla job description
- Rendi l'esperienza più senior e d'impatto

Rispondi in formato JSON:
{
  "original": "<testo originale>",
  "rewritten": "<versione riscritta con metriche e impatto>",
  "metricsAdded": ["<es. Riduzione del 40% dei costi>", "<es. Gestione team di 5 persone>"],
  "tone": "<senior/mid/junior>",
  "explanation": "<breve spiegazione delle modifiche>"
}`;

  try {
    const response = await callAI(prompt, { maxTokens: 1200, temperature: 0.6 });
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error rewriting bullet:", error);
    return null;
  }
}

export async function generateSummaryWithAI(
  experiences?: Array<Record<string, unknown>>,
  skills?: string,
  targetRole?: string,
  tone?: string
): Promise<SummaryResult | null> {
  const prompt = `Sei un resume writer professionista.

Esperienze: ${JSON.stringify(experiences || [])}
Competenze: ${skills || 'N/A'}
Ruolo target: "${targetRole || 'N/A'}"
Tono: "${tone || 'professionale'}"

Genera un professional summary (2-4 frasi) per la sezione "Profilo" del CV che:
- Riassuma gli anni di esperienza e il settore
- Evidenzi le competenze chiave più rilevanti per il ruolo target
- Comunichi il valore unico del candidato
- Abbia un tono ${tone || 'professionale'} e orientato ai risultati

Rispondi in formato JSON:
{
  "summary": "<professional summary di 2-4 frasi>",
  "headline": "<titolo professionale di max 10 parole>",
  "keyStrengths": ["<punto di forza 1>", "<punto di forza 2>", "<punto di forza 3>"]
}`;

  try {
    const response = await callAI(prompt, { maxTokens: 1200, temperature: 0.6 });
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
}

const CV_SYSTEM_PROMPT = `Sei un resume writer professionista. Generi curriculum vitae COMPLETI e SOSTANZIOSI in formato JSON: un CV deve riempire almeno un'intera pagina, mai poche righe.

REQUISITI MINIMI OBBLIGATORI (se mancano, il CV è inaccettabile):
- "summary": professional summary di 3-4 frasi (minimo 40 parole), con anni di esperienza, settore, competenze chiave e valore distintivo.
- "experience": MINIMO 2 voci (3 se il profilo indica 5+ anni di esperienza). OGNI voce ha una "description" di 3-5 frasi (minimo 40 parole) con risultati MISURABILI (percentuali, numeri, budget, dimensioni team, utenti). Mai descrizioni generiche di una riga.
- "education": almeno 1 voce completa (istituzione, titolo, anno ed eventuali dettagli).
- "skills": MINIMO 10 skill pertinenti al ruolo, separate da virgola.
- "languages": livello per ogni lingua citata (mai voci vuote).
- "certifications": pertinenti al settore, oppure stringa vuota (mai placeholder tipo "Cert1").
- TOTALE: il CV completo deve superare le 350 parole. Sii concreto e specifico, mai generico.

Il JSON deve avere questa struttura ESATTA:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "city": "" },
  "summary": "Professional summary di 3-4 frasi",
  "experience": [
    { "company": "Nome Azienda", "role": "Ruolo", "period": "Mese Anno - Mese Anno", "description": "3-5 frasi con risultati misurabili" }
  ],
  "education": [
    { "institution": "Università", "degree": "Titolo di Studio", "year": "Anno" }
  ],
  "skills": "Skill1, Skill2, Skill3, ... (minimo 10)",
  "languages": "Italiano: Madrelingua, Inglese: ...",
  "certifications": "Cert1, Cert2, ..."
}

RISPONDI SOLO CON IL JSON. NESSUN ALTRO TESTO.`;

function countWords(text: unknown): number {
  if (typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function cvWordCount(cv: Record<string, unknown>): number {
  let total = countWords(cv.summary) + countWords(cv.skills);
  for (const exp of (cv.experience as Array<Record<string, unknown>>) || []) {
    total += countWords(exp?.description) + countWords(exp?.company) + countWords(exp?.role);
  }
  for (const edu of (cv.education as Array<Record<string, unknown>>) || []) {
    total += countWords(edu?.institution) + countWords(edu?.degree);
  }
  return total;
}

/** Un CV è accettabile solo se sostanzioso: voci ed estensione minime. */
export function isSubstantialCV(cv: Record<string, unknown> | null): boolean {
  if (!cv || typeof cv !== "object") return false;
  const experience = (cv.experience as Array<Record<string, unknown>>) || [];
  if (experience.length < 2) return false;
  if (!experience.every((e) => countWords(e?.description) >= 30)) return false;
  if (countWords(cv.summary) < 35) return false;
  const skills = typeof cv.skills === "string" ? cv.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
  if (skills.length < 8) return false;
  return cvWordCount(cv) >= 300;
}

export async function generateCVWithAI(prompt: string): Promise<Record<string, unknown> | null> {
  const userPrompt = `Descrizione del profilo: ${prompt}

Genera un CV completo e professionale basato su questa descrizione. Dedici gli anni di esperienza citati (se non indicati, ipotizza un percorso credibile con almeno 2 ruoli in progressione) e includi:
- Esperienze lavorative dettagliate con descrizioni di 3-5 frasi che includono risultati misurabili
- Almeno 10 skill tecniche e soft skills pertinenti
- Un summary professionale convincente di 3-4 frasi
- Istruzione appropriata e completa`;

  try {
    const first = await callAI(`${CV_SYSTEM_PROMPT}\n\n${userPrompt}`, { maxTokens: 4000, temperature: 0.7 });
    if (first) {
      const parsed = JSON.parse(first) as Record<string, unknown>;
      if (isSubstantialCV(parsed)) return parsed;
    }
    // Retry: il primo tentativo era troppo stringato, chiedi esplicitamente di espandere.
    console.warn("CV generato troppo stringato, retry con richiesta di espansione.");
    const retry = await callAI(
      `${CV_SYSTEM_PROMPT}\n\n${userPrompt}\n\nIMPORTANTE: la bozza precedente era troppo corta. ESPANDI ogni sezione fino ai minimi richiesti (350+ parole totali, descrizioni da 3-5 frasi con metriche, minimo 10 skill).`,
      { maxTokens: 4000, temperature: 0.7 }
    );
    if (!retry) return null;
    const parsedRetry = JSON.parse(retry) as Record<string, unknown>;
    return isSubstantialCV(parsedRetry) ? parsedRetry : null;
  } catch (error) {
    console.error("Error generating CV with AI:", error);
    return null;
  }
}

export async function generateCoverLetterWithAI({
  cv,
  jobDescription,
  company = "",
  role = "",
  market = "italia",
  name = "",
}: {
  cv: Record<string, unknown>;
  jobDescription?: string;
  company?: string;
  role?: string;
  market?: string;
  name?: string;
}): Promise<{ coverLetter: string; applicationEmail: string } | null> {
  const marketGuidance: Record<string, string> = {
    italia: "tono professionale, diretto e concreto; usa il Lei solo se l'azienda lo usa; firma con nome e recapiti.",
    europa: "tono internazionale, misurato e orientato alle competenze; lingua dell'offerta.",
    usa: "conciso, orientato ai risultati e sicuro; mai piu di una pagina; evidenzia impatto misurabile.",
  };

  const prompt = `Sei un esperto di candidature professionali. Scrivi una cover letter personalizzata e una email di candidatura ancorate ALL'ESPERIENZA REALE del candidato.

Dati del candidato:
Nome: ${name || "Il Candidato"}
Esperienze: ${JSON.stringify((cv.experience as Array<Record<string, unknown>>) || [])}
Competenze: ${(cv.skills as string) || "N/A"}
Istruzione: ${JSON.stringify((cv.education as Array<Record<string, unknown>>) || [])}
Profilo: ${(cv.summary as string) || "N/A"}

Offerta di lavoro:
Azienda: ${company || "l'azienda"}
Ruolo: ${role || "il ruolo"}
Job Description: ${jobDescription || "N/A"}
Mercato: ${market} (${marketGuidance[market] || marketGuidance.italia})

Requisiti della cover letter:
1. Deve citare 2-3 esperienze/risultati REALI del candidato, in modo specifico (azienda, ruolo, impatto), non generico.
2. Deve collegare ogni esperienza citata ai requisiti dell'offerta.
3. Massimo 200 parole, tono ${marketGuidance[market] || marketGuidance.italia}.
4. Non inventare dati: usa solo quanto fornito. Se manca qualcosa, mantienilo generico ma credibile.

Rispondi SOLO in formato JSON:
{
  "coverLetter": "<cover letter completa, con saluto iniziale e firma con il nome del candidato>",
  "applicationEmail": "<email di candidatura breve: oggetto + corpo + firma>"
}`;

  try {
    const response = await callAI(prompt, { maxTokens: 1500, temperature: 0.6 });
    if (!response) return null;
    const parsed = JSON.parse(response);
    if (!parsed.coverLetter || !parsed.applicationEmail) return null;
    return { coverLetter: parsed.coverLetter, applicationEmail: parsed.applicationEmail };
  } catch (error) {
    console.error("Error generating cover letter with AI:", error);
    return null;
  }
}

export interface NegotiationResult {
  emailSubject: string;
  emailBody: string;
  talkingPoints: string[];
  counterProposal: string;
  benchmarks: string[];
}

export async function negotiateOfferWithAI({
  company = "",
  role = "",
  salary = "",
  profile = "",
  points = "",
  market = "italia",
}: {
  company?: string;
  role?: string;
  salary?: string;
  profile?: string;
  points?: string;
  market?: string;
}): Promise<NegotiationResult | null> {
  const benchmarkHints: Record<string, string> = {
    italia: "riferimenti a Glassdoor Italia, LinkedIn Salary, Levels.fyi per il ruolo, la seniority e la citta",
    europa: "benchmark di mercato europei per il ruolo e il paese (Glassdoor, Levels.fyi, LinkedIn Salary)",
    usa: "salary bands USA da Levels.fyi, Glassdoor e compensazioni di mercato per citta e seniority",
  };

  const prompt = `Sei un negoziatore di offerte di lavoro esperto, con una solida conoscenza dei benchmark di mercato (${benchmarkHints[market] || benchmarkHints.italia}).

Offerta ricevuta:
Azienda: ${company || "N/A"}
Ruolo: ${role || "N/A"}
Compenso offerto: ${salary || "N/A"}

Profilo del candidato (esperienze/skill rilevanti): ${profile || "N/A"}

Punti che il candidato vuole negoziare (es. RAL, bonus, equity, ferie, remote, budget formazione): ${points || "compenso complessivo e benefit"}

Genera:
1. Un'email di negoziazione professionale e assertiva (mai aggressiva) in italiano, che:
   - ringrazia e mostra entusiasmo per il ruolo
   - propone un range di compenso realistico basato su benchmark e sul profilo
   - elenca 1-2 punti di negoziazione oltre alla RAL (bonus, equity, benefit, remote)
   - chiude con apertura al dialogo
2. 4-5 talking points da usare in una call di negoziazione.
3. Una proposta controfferta sintetica (una riga).
4. 2-3 benchmark di mercato plausibili da citare.

Rispondi SOLO in formato JSON:
{
  "emailSubject": "<oggetto email>",
  "emailBody": "<corpo email completo>",
  "talkingPoints": ["<punto 1>", "<punto 2>", "<punto 3>", "<punto 4>"],
  "counterProposal": "<proposta in una riga>",
  "benchmarks": ["<benchmark 1>", "<benchmark 2>", "<benchmark 3>"]
}`;

  try {
    const response = await callAI(prompt, { maxTokens: 2000, temperature: 0.6 });
    if (!response) return null;
    const parsed = JSON.parse(response);
    if (!parsed.emailSubject || !parsed.emailBody) return null;
    return {
      emailSubject: parsed.emailSubject,
      emailBody: parsed.emailBody,
      talkingPoints: Array.isArray(parsed.talkingPoints) ? parsed.talkingPoints : [],
      counterProposal: parsed.counterProposal || "",
      benchmarks: Array.isArray(parsed.benchmarks) ? parsed.benchmarks : [],
    };
  } catch (error) {
    console.error("Error negotiating offer with AI:", error);
    return null;
  }
}

export async function analyzeCVWithAI(
  cvText: string,
  jobDescription?: string
): Promise<Record<string, unknown> | null> {
  const prompt = `Sei un esperto selezionatore IT (Tech Recruiter) e sistema ATS.
Analizza questo CV rispetto a questa Job Description.

REGOLE DI ACCURATEZZA (obbligatorie):
- Ogni punto di forza e ogni miglioramento DEVONO riferirsi a contenuti REALI del CV (cita aziende, ruoli, skill o frasi presenti nel testo). Vietato generico ("migliora la formattazione" senza dire cosa e dove).
- I punteggi devono essere coerenti tra loro e con il giudizio: un CV senza metriche non può superare 70 in atsScore; un CV senza keyword dell'offerta non può superare 60 in jobMatchScore.
- "missingKeywords" deve contenere SOLO termini presenti nella Job Description e assenti nel CV.
- "rewrittenBullets" devono riscrivere esperienze REALI del CV (stessa azienda/ruolo), mai inventarne di nuove.
- Se non è fornita alcuna Job Description, valuta il CV in assoluto e metti jobMatchScore a null.

Restituisci l'analisi ESCLUSIVAMENTE in formato JSON con questa esatta struttura:
{
  "score": <numero da 0 a 100 che valuta il match complessivo>,
  "atsScore": <numero da 0 a 100 che valuta quanto il CV è ben formattato per gli ATS (sezioni chiare, risultati misurabili)>,
  "contentScore": <numero da 0 a 100 che valuta la completezza e ricchezza dei contenuti (esperienze, competenze, istruzione)>,
  "writingScore": <numero da 0 a 100 che valuta la qualità della scrittura (verbi d'azione, chiarezza, grammatica, bullet quantificati)>,
  "readinessScore": <numero da 0 a 100 che valuta quanto il CV è pronto per l'invio (contatti, profilo, esperienza, lingue, metriche)>,
  "jobMatchScore": <numero da 0 a 100 che indica la sovrapposizione delle competenze>,
  "overall": "<Una frase breve (max 15 parole) che riassume il giudizio sul CV>",
  "strengths": ["<punto di forza 1>", "<punto di forza 2>", "<punto di forza 3>"],
  "improvements": [
    {
      "area": "<nome area, es: Esperienze, Competenze, Risultati>",
      "impact": "<Alto, Medio o Basso>",
      "description": "<Descrizione del problema e come risolverlo (breve)>"
    }
  ],
  "atsChecks": [
    {
      "label": "Risultati quantificati",
      "passed": <true o false>,
      "fix": "<Come migliorare>"
    },
    {
      "label": "Keyword mirate",
      "passed": <true o false>,
      "fix": "<Come migliorare>"
    }
  ],
  "matchedKeywords": ["<keyword1>", "<keyword2>"],
  "missingKeywords": ["<keyword mancante 1>", "<keyword mancante 2>"],
  "rewrittenBullets": [
    "<Riscrivi un'esperienza del CV in formato Azione + Strumento + Risultato>",
    "<Riscrivi un'altra esperienza in formato STAR>"
  ],
  "review": "<Un paragrafo (max 40 parole) che offre una revisione generale e costruttiva.>"
}

JOB DESCRIPTION:
${jobDescription || "Nessuna Job Description fornita. Fai un'analisi generale del CV."}

CV TESTO ESTRATTO:
${cvText.substring(0, 4000)}

RISPONDI SOLO CON IL JSON. NESSUN ALTRO TESTO.`;

  try {
    const response = await callAI(prompt, { maxTokens: 3000, temperature: 0.3 });
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error connecting to AI Provider:", error);
    return null;
  }
}
