import OpenAI from "openai";
import type { InterviewFeedback, BulletRewrite, SummaryResult } from "@/lib/supabase/types";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "deepseek-r1:8b";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const AI_TIMEOUT_MS = 30_000;

async function callOpenAI(prompt: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: AI_TIMEOUT_MS,
    maxRetries: 1,
  });
  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

async function callOllama(prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        format: "json",
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Ollama HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.response || null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callAI(prompt: string): Promise<string | null> {
  try {
    const openaiResponse = await callOpenAI(prompt);
    if (openaiResponse) return openaiResponse;
  } catch (openaiError) {
    console.warn("OpenAI non disponibile, fallback a Ollama:", openaiError);
  }
  try {
    return await callOllama(prompt);
  } catch (ollamaError) {
    console.warn("Ollama non disponibile, nessun provider AI attivo:", ollamaError);
    return null;
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
    const response = await callAI(prompt);
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
    const response = await callAI(prompt);
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
    const response = await callAI(prompt);
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
}

export async function generateCVWithAI(prompt: string): Promise<Record<string, unknown> | null> {
  const systemPrompt = `Sei un resume writer professionista. Genera un curriculum vitae strutturato in formato JSON basato sulla descrizione dell'utente.

Il JSON deve avere questa struttura ESATTA:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "city": "" },
  "summary": "Un professional summary di 2-3 frasi",
  "experience": [
    { "company": "Nome Azienda", "role": "Ruolo", "period": "Mese Anno - Mese Anno", "description": "Descrizione con risultati misurabili" }
  ],
  "education": [
    { "institution": "Università", "degree": "Titolo di Studio", "year": "Anno" }
  ],
  "skills": "Skill1, Skill2, Skill3, ...",
  "languages": "Italiano: Madrelingua, Inglese: ...",
  "certifications": "Cert1, Cert2, ..."
}

RISPONDI SOLO CON IL JSON. NESSUN ALTRO TESTO.`;

  const userPrompt = `Descrizione del profilo: ${prompt}

Genera un CV completo e professionale basato su questa descrizione. Includi:
- Esperienze lavorative realistiche con descrizioni che includono risultati misurabili
- Skill tecniche e soft skills pertinenti
- Un summary professionale convincente
- Istruzione appropriata`;

  try {
    const response = await callAI(`${systemPrompt}\n\n${userPrompt}`);
    if (!response) return null;
    return JSON.parse(response);
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
    const response = await callAI(prompt);
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
    const response = await callAI(prompt);
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
    const response = await callAI(prompt);
    if (!response) return null;
    return JSON.parse(response);
  } catch (error) {
    console.error("Error connecting to AI Provider:", error);
    return null;
  }
}
