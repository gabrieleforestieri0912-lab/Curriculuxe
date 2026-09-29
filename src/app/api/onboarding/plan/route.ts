import { NextRequest, NextResponse } from "next/server";
import { generateOnboardingPlan } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";

function buildFallbackPlan(answers: Record<string, unknown>, lang: string) {
  const en = lang === "en";
  const role = (answers.roleLabel as string) || (en ? "Tech professional" : "Professionista tech");
  const goal = (answers.goalLabel as string) || "";
  const skills = Array.isArray(answers.skills) ? (answers.skills as string[]) : [];
  const missing = (Array.isArray(answers.skillGapHints) ? (answers.skillGapHints as string[]) : []).slice(0, 4);
  return {
    headline: en
      ? `Your path to ${role}${goal ? `: ${goal}` : ""} starts here.`
      : `La tua strada verso ${role}${goal ? `: ${goal}` : ""} parte da qui.`,
    profileSummary: en
      ? `Based on your answers, we mapped your starting point and the key gaps for ${role}. Follow the roadmap step by step.`
      : `Dalle tue risposte abbiamo mappato punto di partenza e gap principali per ${role}. Segui la roadmap passo passo.`,
    skillGap: missing.map((s) => ({
      skill: s,
      action: en ? `Build a small project using ${s} and add it to your CV.` : `Costruisci un mini-progetto con ${s} e aggiungilo al CV.`,
    })),
    roadmap: [
      {
        phase: en ? "Weeks 1-2: foundations" : "Settimane 1-2: fondamenta",
        weeks: "1-2",
        goal: en ? "CV ready and gaps mapped" : "CV pronto e gap mappati",
        actions: [
          en ? "Generate your CV with AI and reach at least 80/100 ATS." : "Genera il CV con l'AI e raggiungi almeno 80/100 ATS.",
          en ? `Close one gap: start with ${missing[0] || "the top missing skill"}.` : `Colma un gap: parti da ${missing[0] || "la skill mancante principale"}.`,
          en ? "Save one tailored CV version per top job posting." : "Salva una versione mirata del CV per ogni offerta top.",
        ],
      },
      {
        phase: en ? "Weeks 3-6: proof" : "Settimane 3-6: prove",
        weeks: "3-6",
        goal: en ? "Portfolio and metrics" : "Portfolio e metriche",
        actions: [
          en ? "Publish 1-2 projects with measurable results." : "Pubblica 1-2 progetti con risultati misurabili.",
          en ? `Current stack: ${skills.slice(0, 4).join(", ") || "to be completed"}.` : `Stack attuale: ${skills.slice(0, 4).join(", ") || "da completare"}.`,
          en ? "Practice STAR stories on your real experience." : "Allena storie STAR sulle tue esperienze reali.",
        ],
      },
      {
        phase: en ? "Weeks 7+: apply" : "Settimane 7+: candidature",
        weeks: "7+",
        goal: en ? "Targeted applications and interviews" : "Candidature mirate e colloqui",
        actions: [
          en ? "Apply to 5 tailored postings per week." : "Candidati a 5 offerte mirate a settimana.",
          en ? "Run mock interviews and track feedback." : "Fai simulazioni di colloquio e traccia i feedback.",
          en ? "Negotiate with market benchmarks." : "Negozia con benchmark di mercato.",
        ],
      },
    ],
    cvTips: [
      en ? "Mirror the posting's keywords in context." : "Rispecchia le keyword dell'offerta nel contesto.",
      en ? "Every bullet needs a number or it is invisible." : "Ogni bullet deve avere un numero o è invisibile.",
      en ? "Single-column layout, native PDF under 2 MB." : "Layout a colonna singola, PDF nativo sotto 2 MB.",
    ],
    interviewPrep: [
      en ? "Prepare 5 STAR stories from real experience." : "Prepara 5 storie STAR da esperienze reali.",
      en ? "Practice live coding or role-specific exercises." : "Allenati con live coding o esercizi di ruolo.",
      en ? "Study the company: product, stack, recent news." : "Studia l'azienda: prodotto, stack, news recenti.",
    ],
    salaryBenchmark: en
      ? `Check Levels.fyi and Glassdoor for ${role} in your market before every negotiation.`
      : `Controlla Levels.fyi e Glassdoor per ${role} nel tuo mercato prima di ogni trattativa.`,
    nextActions: [
      { label: en ? "Generate your CV" : "Genera il tuo CV", href: "/dashboard/create?mode=ai" },
      { label: en ? "Analyze your CV" : "Analizza il tuo CV", href: "/analyze" },
      { label: en ? "Practice interviews" : "Allenati ai colloqui", href: "/dashboard/interview" },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = (await request.json()) as { answers?: Record<string, unknown>; lang?: string };
    const answers = body.answers || {};
    const lang = body.lang === "en" ? "en" : "it";

    // Il piano AI consuma 1 credito; senza crediti si restituisce comunque
    // un piano base dai dati, così l'onboarding non blocca mai nessuno.
    const credit = await consumeCredit(user.id as string);
    if (!credit.ok) {
      return NextResponse.json({ plan: buildFallbackPlan(answers, lang), aiGenerated: false, noCredits: true });
    }

    const plan = await generateOnboardingPlan({ answers, lang });
    if (!plan) {
      return NextResponse.json({ plan: buildFallbackPlan(answers, lang), aiGenerated: false });
    }
    return NextResponse.json({ plan, aiGenerated: true });
  } catch (error) {
    console.error("Error generating onboarding plan:", error);
    return NextResponse.json({ error: "Errore durante la generazione del piano" }, { status: 500 });
  }
}
