import { NextRequest, NextResponse } from "next/server";
import { getInterviewFeedback } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";
import { checkPlanLimit, incrementUsage, planLimitResponse } from "@/lib/usage";

export async function POST(request: NextRequest) {
  try {
    // Richiede autenticazione: l'AI non è disponibile per utenti anonimi.
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { question, answer, role } = await request.json() as {
      question: string;
      answer: string;
      role: string;
    };

    if (!question || !answer || !role) {
      return NextResponse.json(
        { error: "Domanda, risposta e ruolo sono richiesti" },
        { status: 400 }
      );
    }

    // Il feedback colloquio consuma 1 credito e conta nella quota mensile piano.
    const limit = await checkPlanLimit(user.id, "behavioral");
    if (!limit.allowed) return planLimitResponse(limit);

    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per usare l'AI." },
        { status: 402 }
      );
    }

    const feedback = await getInterviewFeedback(question, answer, role);

    if (!feedback) {
      await incrementUsage(user.id, "behavioral");
      return NextResponse.json({
        score: 6,
        strengths: ["Hai fornito una risposta strutturata", "Dimostri conoscenza del ruolo", "Comunichi con chiarezza"],
        improvements: ["Prova a usare il metodo STAR per maggiore impatto", "Quantifica i risultati quando possibile", "Collega la tua esperienza ai requisiti del ruolo"],
        starSuggestion: "Struttura la risposta con Situazione (contesto), Task (cosa dovevi fare), Action (cosa hai fatto concretamente), Result (risultato misurabile).",
        improvedAnswer: `Basandomi sulla tua risposta, ecco una versione migliorata con metodo STAR:\n\n${answer}\n\n[Aggiungi: In che contesto? Qual era il tuo compito specifico? Cosa hai fatto? Quale risultato hai ottenuto?]`,
      });
    }

    await incrementUsage(user.id, "behavioral");
    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Interview feedback error:", error);
    return NextResponse.json(
      { error: "Errore durante l'analisi della risposta" },
      { status: 500 }
    );
  }
}
