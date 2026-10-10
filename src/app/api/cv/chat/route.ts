import { NextRequest, NextResponse } from "next/server";
import { callAIText } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";
import { supabase } from "@/lib/supabase/client";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Solo i campi del CV che la chat può modificare. */
const EDITABLE_FIELDS = [
  "summary",
  "skills",
  "languages",
  "certifications",
  "personalInfo",
  "experience",
  "education",
] as const;

function trim(str: unknown, max: number): string {
  if (typeof str !== "string") return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/** Estrae il primo oggetto JSON dalla risposta (anche dentro ```json ... ```). */
function extractJson(raw: string): Record<string, unknown> | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : raw).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function sanitizeUpdates(updates: unknown): Record<string, unknown> {
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) return {};
  const clean: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    const value = (updates as Record<string, unknown>)[key];
    if (value !== undefined) clean[key] = value;
  }
  return clean;
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = (await request.json()) as {
      cvId?: string;
      message?: string;
      history?: ChatMessage[];
      lang?: string;
    };
    const cvId = (body.cvId || "").trim();
    const message = (body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const en = body.lang === "en";

    if (!cvId) {
      return NextResponse.json({ error: en ? "Missing CV" : "CV mancante" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: en ? "Empty message" : "Messaggio vuoto" }, { status: 400 });
    }

    // Carica il CV e verifica la proprietà prima di consumare crediti.
    const { data: cv, error: cvError } = await supabase
      .from("cvs")
      .select("*")
      .eq("id", cvId)
      .single();

    if (cvError || !cv) {
      return NextResponse.json({ error: en ? "CV not found" : "CV non trovato" }, { status: 404 });
    }
    if ((cv as { userId?: string }).userId !== user.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: en ? "Out of credits for chat." : "Crediti esauriti per la chat.", upgradeRequired: true },
        { status: 402 }
      );
    }

    const cvRecord = cv as Record<string, unknown>;
    const cvSnapshot = {
      personalInfo: cvRecord.personalInfo,
      summary: trim(cvRecord.summary, 1200),
      experience: cvRecord.experience,
      education: cvRecord.education,
      skills: trim(cvRecord.skills, 600),
      languages: trim(cvRecord.languages, 300),
      certifications: trim(cvRecord.certifications, 500),
    };

    const system = en
      ? `You are Atlas, an expert CV editor. You receive the user's CURRENT CV (JSON) and a change request.
RULES:
- Reply in English, concise (max ~120 words).
- If the user asks for a change, apply it and put ONLY the changed fields in "updates" (allowed keys: summary, skills, languages, certifications, personalInfo, experience, education). Keep the same shape as the current CV. Never invent employers, degrees or dates: reuse what is already there unless the user provides new facts.
- If no CV change is needed (question, advice), return "updates" as {} and answer helpfully.
- Respond with ONLY a JSON object: {"reply": "...", "updates": {...}}. No markdown fences, no extra text.`
      : `Sei Atlas, un editor esperto di curriculum. Ricevi il CV ATTUALE (JSON) e una richiesta di modifica.
REGOLE:
- Rispondi in italiano, conciso (max ~120 parole).
- Se l'utente chiede una modifica, applicala e metti in "updates" SOLO i campi cambiati (chiavi ammesse: summary, skills, languages, certifications, personalInfo, experience, education). Mantieni la stessa struttura del CV attuale. Non inventare mai datori di lavoro, titoli di studio o date: riusa ciò che esiste già, a meno che l'utente fornisca nuovi fatti.
- Se non serve modificare il CV (domanda, consiglio), restituisci "updates" come {} e rispondi in modo utile.
- Rispondi con il SOLO oggetto JSON: {"reply": "...", "updates": {...}}. Niente fence markdown, niente altro testo.`;

    const prompt = `${system}

=== CV ATTUALE ===
${JSON.stringify(cvSnapshot).slice(0, 8000)}

=== CONVERSAZIONE RECENTE ===
${history.map((m) => `${m.role === "user" ? "Utente" : "Atlas"}: ${trim(m.content, 600)}`).join("\n")}

=== RICHIESTA ===
${message}`;

    const raw = await callAIText(prompt, { maxTokens: 2000, temperature: 0.5 });
    if (!raw) {
      return NextResponse.json(
        { error: en ? "AI unavailable, try again." : "AI non disponibile, riprova." },
        { status: 502 }
      );
    }

    const parsed = extractJson(raw);
    const reply =
      (parsed?.reply as string) || raw.slice(0, 800).trim() || (en ? "Done." : "Fatto.");
    const updates = sanitizeUpdates(parsed?.updates);

    // Salva subito le modifiche: la chat laterale mostra il CV aggiornato.
    let updatedCv: Record<string, unknown> | null = null;
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("cvs")
        .update({ ...updates, updatedAt: new Date() })
        .eq("id", cvId);
      if (!updateError) {
        const { data: fresh } = await supabase.from("cvs").select("*").eq("id", cvId).single();
        updatedCv = (fresh as Record<string, unknown>) || null;
      }
    }

    return NextResponse.json({
      reply,
      updates,
      cv: updatedCv,
      credits: credit.credits,
    });
  } catch (error) {
    console.error("CV chat error:", error);
    return NextResponse.json({ error: "Errore della chat CV" }, { status: 500 });
  }
}
