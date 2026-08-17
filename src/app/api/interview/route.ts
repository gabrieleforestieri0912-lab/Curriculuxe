import { NextRequest, NextResponse } from "next/server";
import { getInterviewFeedback } from "@/lib/ai";
import { verifyUserToken } from "@/lib/auth";
import { consumeCredit } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
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

    // Il feedback colloquio consuma 1 credito per gli utenti autenticati.
    const userCookie = request.cookies.get("user")?.value;
    const user = userCookie ? verifyUserToken(userCookie) : null;

    if (user) {
      const credit = await consumeCredit(user.id as string);
      if (!credit.ok) {
        return NextResponse.json(
          { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per usare l'AI." },
          { status: 402 }
        );
      }
    }

    const feedback = await getInterviewFeedback(question, answer, role);

    if (!feedback) {
      return NextResponse.json({
        score: 6,
        strengths: ["Hai fornito una risposta strutturata", "Dimostri conoscenza del ruolo", "Comunichi con chiarezza"],
        improvements: ["Prova a usare il metodo STAR per maggiore impatto", "Quantifica i risultati quando possibile", "Collega la tua esperienza ai requisiti del ruolo"],
        starSuggestion: "Struttura la risposta con Situazione (contesto), Task (cosa dovevi fare), Action (cosa hai fatto concretamente), Result (risultato misurabile).",
        improvedAnswer: `Basandomi sulla tua risposta, ecco una versione migliorata con metodo STAR:\n\n${answer}\n\n[Aggiungi: In che contesto? Qual era il tuo compito specifico? Cosa hai fatto? Quale risultato hai ottenuto?]`,
      });
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Interview feedback error:", error);
    return NextResponse.json(
      { error: "Errore durante l'analisi della risposta" },
      { status: 500 }
    );
  }
}
