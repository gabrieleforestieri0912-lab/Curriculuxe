import { NextRequest, NextResponse } from "next/server";
import { generateTargetPlan } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";
import { supabase } from "@/lib/supabase/client";
import { getCompanyContext } from "@/lib/companies";

function trim(str: unknown, max: number): string {
  if (typeof str !== "string") return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function fallbackPlan(company: string, role: string, lang: string, stack: string[]) {
  const en = lang === "en";
  return {
    fitSummary: en
      ? `Entry plan for ${role} at ${company}, built from your real data. Complete the assessment to unlock the full AI version.`
      : `Piano di ingresso per ${role} in ${company}, costruito sui tuoi dati reali. Completa la valutazione per la versione AI completa.`,
    fitScore: 50,
    gaps: stack.slice(0, 3).map((s) => ({
      area: s,
      why: en ? "Key skill for this company." : "Skill chiave per questa azienda.",
      action: en ? `Show a project using ${s}.` : `Mostra un progetto con ${s}.`,
    })),
    prepPlan: ["1", "2", "3", "4"].map((w) => ({
      week: w,
      focus: en ? "Profile, proof, practice, apply" : "Profilo, prove, pratica, candidature",
      actions: [
        en ? "Update CV with role keywords." : "Aggiorna il CV con le keyword del ruolo.",
        en ? "Prepare STAR stories." : "Prepara storie STAR.",
        en ? "Study the company product." : "Studia il prodotto dell'azienda.",
      ],
    })),
    interviewProcess: [],
    expectedQuestions: [],
    resources: [
      { label: en ? "Generate your CV" : "Genera il tuo CV", href: "/dashboard/create?mode=ai" },
      { label: en ? "Practice interviews" : "Allenati ai colloqui", href: "/dashboard/interview" },
      { label: en ? "Ask Atlas" : "Chiedi ad Atlas", href: "/dashboard/assistant" },
    ],
  };
}

async function getTarget(request: NextRequest, id: string) {
  const user = getRequestUser(request);
  if (!user) return { error: NextResponse.json({ error: "Non autorizzato" }, { status: 401 }) };
  const { data, error } = await supabase.from("target_companies").select("*").eq("id", id).single();
  if (error || !data || (data as Record<string, unknown>).userId !== user.id) {
    return { error: NextResponse.json({ error: "Non trovato" }, { status: 404 }) };
  }
  return { user, target: data as Record<string, unknown> };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const found = await getTarget(request, id);
    if (found.error) return found.error;
    const { user, target } = found as { user: { id: string }; target: Record<string, unknown> };

    const body = (await request.json()) as { answers?: string[]; lang?: string };
    const answers = Array.isArray(body.answers) ? body.answers.map(String) : [];
    const lang = body.lang === "en" ? "en" : "it";
    const en = lang === "en";

    const questions = (target.questions as Array<{ q: string; area: string }>) || [];
    if (questions.length === 0 || answers.length !== questions.length || answers.some((a) => !a.trim())) {
      return NextResponse.json(
        { error: en ? "Answer all questions." : "Rispondi a tutte le domande." },
        { status: 400 }
      );
    }

    const company = String(target.company || "");
    const role = String(target.role || "");
    const ctx = getCompanyContext(company, lang);

    // Profilo reale: ultimo CV + onboarding.
    let profile: Record<string, unknown> = {};
    try {
      const { data: cv } = await supabase
        .from("cvs")
        .select("personalInfo, summary, experience, education, skills")
        .eq("userId", user.id)
        .order("updatedAt", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cv) {
        const c = cv as Record<string, unknown>;
        profile = {
          summary: trim(c.summary, 600),
          skills: trim(c.skills, 400),
          experience: ((c.experience as Array<Record<string, unknown>>) || []).slice(0, 4).map((e) => ({
            role: e.role,
            company: e.company,
            description: trim(e.description, 300),
          })),
        };
      }
      const { data: ob } = await supabase
        .from("onboarding_profiles")
        .select("answers")
        .eq("userId", user.id)
        .single();
      if (ob) profile.onboarding = ob.answers;
    } catch { /* si prosegue con quel che c'è */ }

    const qa = questions.map((q, i) => ({ q: q.q, a: trim(answers[i], 800) }));

    const credit = await consumeCredit(user.id);
    let plan: Record<string, unknown> | null = null;
    let noCredits = false;
    if (!credit.ok) {
      noCredits = true;
    } else {
      const aiPlan = await generateTargetPlan({
        company,
        role,
        companyContext: ctx as unknown as Record<string, unknown>,
        profile,
        qa,
        lang,
      });
      if (aiPlan) plan = aiPlan as unknown as Record<string, unknown>;
    }
    if (!plan) plan = fallbackPlan(company, role, lang, ctx.topSkills) as unknown as Record<string, unknown>;

    await supabase
      .from("target_companies")
      .update({ answers, plan, status: "planned", updatedAt: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ target: { ...target, answers, plan, status: "planned" }, noCredits });
  } catch (error) {
    console.error("Error generating target plan:", error);
    return NextResponse.json({ error: "Errore nella generazione" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const found = await getTarget(request, id);
    if (found.error) return found.error;
    const { user } = found as { user: { id: string } };
    await supabase.from("target_companies").delete().eq("id", id).eq("userId", user.id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting target:", error);
    return NextResponse.json({ error: "Errore nella rimozione" }, { status: 500 });
  }
}
