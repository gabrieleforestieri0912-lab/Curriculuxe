import { NextRequest, NextResponse } from "next/server";
import { negotiateOfferWithAI } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";
import { cvToText } from "@/lib/cvAnalysis";
import { supabase } from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { company = "", role = "", salary = "", profile = "", points = "", market = "italia" } = await request.json() as {
      company?: string;
      role?: string;
      salary?: string;
      profile?: string;
      points?: string;
      market?: string;
    };

    if (!role.trim()) {
      return NextResponse.json(
        { error: "Indica il ruolo per cui hai ricevuto l'offerta" },
        { status: 400 }
      );
    }

    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per usare il negoziatore AI." },
        { status: 402 }
      );
    }

    let resolvedProfile = profile;
    if (!resolvedProfile.trim()) {
      const { data: cv } = await supabase
        .from("cvs")
        .select("personalInfo, summary, experience, education, skills, languages, certifications")
        .eq("userId", user.id)
        .order("updatedAt", { ascending: false })
        .limit(1)
        .maybeSingle();
      resolvedProfile = cvToText(cv || undefined);
    }

    const result = await negotiateOfferWithAI({
      company,
      role,
      salary,
      profile: resolvedProfile,
      points,
      market,
    });

    if (!result) {
      return NextResponse.json({
        emailSubject: `Negoziazione Offerta - ${role}`,
        emailBody: `Gentile [Nome Hiring Manager],\n\nLa ringrazio per l'offerta per il ruolo di ${role}${company ? ` presso ${company}` : ""}. Sono molto interessato e vorrei discutere alcuni aspetti del pacchetto.\n\nBasandomi sulle mie competenze ed esperienze, e considerando i benchmark di mercato per posizioni simili, proporrei un compenso nel range di [Range] e valuterei anche bonus, benefit e modalità di lavoro.\n\nSono certo che possiamo trovare un accordo che soddisfi entrambi. Resto a disposizione per approfondire.\n\nCordiali saluti,\n[Tuo Nome]`,
        talkingPoints: [
          "Ringrazia e ribadisci l'entusiasmo per il ruolo prima di parlare di cifre.",
          "Cita 2-3 benchmark di mercato (Glassdoor, LinkedIn Salary, Levels.fyi) per il ruolo e la città.",
          "Ancora la richiesta a risultati concreti del tuo percorso (metriche, impatto).",
          "Proponi alternative oltre alla RAL: bonus, equity, budget formazione, remote work allowance.",
          "Chiedi la lettera d'offerta aggiornata per iscritto una volta trovato l'accordo.",
        ],
        counterProposal: "Proponi un range realistico (es. X€ - Y€) e un punto non economico da concordare (benefit o remote).",
        benchmarks: [
          "Glassdoor / LinkedIn Salary: fascia per il ruolo e la seniority nella tua città.",
          "Levels.fyi: compensation (base + bonus + equity) per posizioni simili.",
          "Offerte di mercato per il tuo stesso profilo e seniority.",
        ],
        source: "template",
      });
    }

    return NextResponse.json({ ...result, source: "ai" });
  } catch (error) {
    console.error("Negotiation error:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione della negoziazione" },
      { status: 500 }
    );
  }
}