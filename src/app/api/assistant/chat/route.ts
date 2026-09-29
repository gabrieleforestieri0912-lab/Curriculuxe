import { NextRequest, NextResponse } from "next/server";
import { callAIText } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit, getCreditsInfo } from "@/lib/credits";
import { supabase } from "@/lib/supabase/client";
import { jobCatalog } from "@/lib/jobs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function trim(str: unknown, max: number): string {
  if (typeof str !== "string") return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function matchCompanies(message: string) {
  const lower = message.toLowerCase();
  return jobCatalog
    .filter((j) => {
      const company = j.company.toLowerCase();
      return company.length > 2 && (lower.includes(company) || company.split(" ").some((w) => w.length > 4 && lower.includes(w)));
    })
    .slice(0, 3)
    .map((j) => ({
      company: j.company,
      role: j.role,
      location: j.location,
      remote: j.remote,
      salary: `${j.salaryMin}-${j.salaryMax}`,
      skills: j.requiredSkills.slice(0, 8),
      description: trim(j.description, 500),
    }));
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = (await request.json()) as {
      message?: string;
      history?: ChatMessage[];
      lang?: string;
      progress?: string;
    };
    const message = (body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const lang = body.lang === "en" ? "en" : "it";
    const en = lang === "en";

    if (!message) {
      return NextResponse.json({ error: en ? "Empty message" : "Messaggio vuoto" }, { status: 400 });
    }

    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: en ? "Out of credits for chat." : "Crediti esauriti per la chat.", upgradeRequired: true },
        { status: 402 }
      );
    }

    // ---- Contesto totale: profilo, CV, analisi, onboarding ----
    let info = { credits: 0, plan: "free" };
    try {
      info = await getCreditsInfo(user.id);
    } catch { /* ignore */ }

    let cvs: unknown[] = [];
    try {
      const { data } = await supabase
        .from("cvs")
        .select("personalInfo, summary, experience, education, skills, updatedAt")
        .eq("userId", user.id)
        .order("updatedAt", { ascending: false })
        .limit(2);
      cvs = (data || []).map((cv) => {
        const c = cv as Record<string, unknown>;
        return {
          summary: trim(c.summary, 600),
          skills: trim(c.skills, 400),
          experience: ((c.experience as Array<Record<string, unknown>>) || []).slice(0, 4).map((e) => ({
            role: e.role,
            company: e.company,
            description: trim(e.description, 300),
          })),
          education: ((c.education as Array<Record<string, unknown>>) || []).slice(0, 2).map((e) => ({
            degree: e.degree,
            institution: e.institution,
          })),
        };
      });
    } catch { /* ignore */ }

    let analyses: unknown[] = [];
    try {
      const { data } = await supabase
        .from("analyses")
        .select("score, data, createdAt")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })
        .limit(3);
      analyses = (data || []).map((a) => {
        const r = a as Record<string, unknown>;
        const d = (r.data as Record<string, unknown>) || {};
        return { score: r.score, overall: trim(d.overall, 200), createdAt: r.createdAt };
      });
    } catch { /* ignore */ }

    let onboarding: unknown = null;
    try {
      const { data } = await supabase
        .from("onboarding_profiles")
        .select("answers, plan")
        .eq("userId", user.id)
        .single();
      if (data) {
        const p = (data.plan as Record<string, unknown>) || null;
        onboarding = {
          answers: data.answers,
          headline: p?.headline,
          roadmap: ((p?.roadmap as Array<Record<string, unknown>>) || []).map((ph) => ({
            phase: ph.phase,
            goal: ph.goal,
            actions: ((ph.actions as string[]) || []).slice(0, 4),
          })),
        };
      }
    } catch { /* tabella assente: si prosegue senza */ }

    const companies = matchCompanies(message);

    const systemEn = `You are Atlas, the Curriculuxe AI career copilot for tech/IT jobs. You know this user's CVs, analyses and onboarding plan (see CONTEXT). Rules:
- Answer concisely in English with concrete, personalized advice grounded in the context. No generic filler.
- When asked for interview practice, include EXACTLY ONE quiz block in this format (3-5 questions):
\`\`\`quiz
{"title": "...", "questions": [{"q": "...", "options": ["...", "...", "..."], "answer": 0, "explain": "..."}]}
\`\`\`
"answer" is the 0-based index of the correct option. Outside the block write only a 1-2 line intro.
- When asked about progress/paths, use ONBOARDING + PROGRESS to say exactly where they are and the next 2-3 steps.
- When asked about a specific company, use MATCHING POSTINGS (if any) plus their profile to explain fit, gaps and how to get in.
- Never invent user data. Max ~250 words outside quiz blocks.`;

    const systemIt = `Sei Atlas, il copilota AI di Curriculuxe per il lavoro tech/IT. Conosci CV, analisi e piano di onboarding di questo utente (vedi CONTESTO). Regole:
- Rispondi in italiano, conciso, con consigli concreti e personalizzati ancorati al contesto. Niente riempitivo generico.
- Quando chiede esercizi/simulazioni di colloquio, includi ESATTAMENTE UN blocco quiz in questo formato (3-5 domande):
\`\`\`quiz
{"title": "...", "questions": [{"q": "...", "options": ["...", "...", "..."], "answer": 0, "explain": "..."}]}
\`\`\`
"answer" è l'indice (da 0) dell'opzione corretta. Fuori dal blocco scrivi solo 1-2 righe di introduzione.
- Quando chiede a che punto è / prossimi passi, usa ONBOARDING + PROGRESS per dire esattamente dove si trova e i prossimi 2-3 passi.
- Quando chiede di un'azienda specifica, usa ANNUNCI CORRELATI (se presenti) più il profilo per spiegare fit, gap e come entrare.
- Non inventare mai dati dell'utente. Max ~250 parole fuori dai blocchi quiz.`;

    const prompt = `${en ? systemEn : systemIt}

=== CONTESTO UTENTE ===
Piano: ${info.plan || "free"} · Crediti residui: ${info.credits}
CV (max 2): ${JSON.stringify(cvs).slice(0, 6000)}
Analisi recenti: ${JSON.stringify(analyses).slice(0, 1500)}
ONBOARDING: ${JSON.stringify(onboarding).slice(0, 4000)}
PROGRESS NEI PATH (completamenti segnati dall'utente): ${trim(body.progress, 1500) || "nessun dato"}
ANNUNCI CORRELATI: ${JSON.stringify(companies).slice(0, 2500)}

=== CONVERSAZIONE RECENTE ===
${history.map((m) => `${m.role === "user" ? "Utente" : "Atlas"}: ${trim(m.content, 800)}`).join("\n")}

=== MESSAGGIO CORRENTE ===
${message}`;

    const reply = await callAIText(prompt, { maxTokens: 1500, temperature: 0.7 });
    if (!reply) {
      return NextResponse.json(
        { error: en ? "AI unavailable, try again." : "AI non disponibile, riprova." },
        { status: 502 }
      );
    }
    return NextResponse.json({ reply, credits: credit.credits });
  } catch (error) {
    console.error("Assistant chat error:", error);
    return NextResponse.json({ error: "Errore dell'assistente" }, { status: 500 });
  }
}
