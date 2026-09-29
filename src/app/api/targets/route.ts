import { NextRequest, NextResponse } from "next/server";
import { generateTargetQuestions } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit, getCreditsInfo } from "@/lib/credits";
import { supabase } from "@/lib/supabase/client";
import { getCompanyContext, TARGET_LIMITS } from "@/lib/companies";

function fallbackQuestions(role: string, lang: string) {
  const en = lang === "en";
  return [
    { q: en ? `Write pseudo-code for a typical ${role} task and explain your choices.` : `Scrivi lo pseudo-codice di un task tipico da ${role} e spiega le scelte.`, area: "code" },
    { q: en ? "How do you debug a production issue you have never seen before?" : "Come debugghi un problema in produzione mai visto prima?", area: "code" },
    { q: en ? "Describe your most impactful project: your role, decisions, measurable result." : "Descrivi il tuo progetto di maggior impatto: ruolo, decisioni, risultato misurabile.", area: "experience" },
    { q: en ? "Tell me about a conflict or difficult deadline: what did you do?" : "Racconta un conflitto o una deadline difficile: cosa hai fatto?", area: "experience" },
    { q: en ? "Which tools do you master and which one are you learning now?" : "Quali strumenti padroneggi e quale stai imparando ora?", area: "skills" },
  ];
}

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const { data, error } = await supabase
      .from("target_companies")
      .select("*")
      .eq("userId", user.id)
      .order("updatedAt", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ targets: data || [] });
  } catch (error) {
    console.error("Error listing targets:", error);
    return NextResponse.json({ error: "Errore nel caricamento" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = (await request.json()) as { company?: string; role?: string; lang?: string };
    const company = (body.company || "").trim();
    const role = (body.role || "").trim();
    const lang = body.lang === "en" ? "en" : "it";
    const en = lang === "en";

    if (!company || !role) {
      return NextResponse.json(
        { error: en ? "Company and target role are required." : "Azienda e ruolo target sono obbligatori." },
        { status: 400 }
      );
    }

    let plan = "free";
    try {
      plan = (await getCreditsInfo(user.id)).plan || "free";
    } catch { /* limiti free */ }
    const maxTargets = TARGET_LIMITS[plan] ?? TARGET_LIMITS.free;
    const { count } = await supabase
      .from("target_companies")
      .select("id", { count: "exact", head: true })
      .eq("userId", user.id);
    if ((count || 0) >= maxTargets) {
      return NextResponse.json(
        {
          error: en
            ? `Plan limit reached (${maxTargets} target). Upgrade for more.`
            : `Limite del piano raggiunto (${maxTargets} target). Passa a un piano superiore.`,
          upgradeRequired: true,
          limit: maxTargets,
        },
        { status: 402 }
      );
    }

    const ctx = getCompanyContext(company, lang);

    const { data: created, error: insertError } = await supabase
      .from("target_companies")
      .insert({ userId: user.id, company: ctx.name, role, status: "picked" })
      .select()
      .single();
    if (insertError || !created) throw insertError || new Error("insert failed");

    // 1 credito per il questionario; senza crediti si usano domande standard.
    let questions = fallbackQuestions(role, lang);
    let noCredits = false;
    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      noCredits = true;
    } else {
      const aiQuestions = await generateTargetQuestions({
        company: ctx.name,
        role,
        stack: ctx.topSkills,
        lang,
      });
      if (aiQuestions && aiQuestions.length > 0) questions = aiQuestions;
    }

    await supabase
      .from("target_companies")
      .update({ questions, updatedAt: new Date().toISOString() })
      .eq("id", (created as Record<string, unknown>).id);

    return NextResponse.json({ target: { ...(created as object), questions }, noCredits });
  } catch (error) {
    console.error("Error creating target:", error);
    return NextResponse.json({ error: "Errore nella creazione" }, { status: 500 });
  }
}
