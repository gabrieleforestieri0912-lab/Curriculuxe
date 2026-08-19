import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletWithAI } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    // Richiede autenticazione: l'AI non è disponibile per utenti anonimi.
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { bullet, role, jobDescription } = await request.json() as {
      bullet: string;
      role: string;
      jobDescription?: string;
    };

    if (!bullet || !role) {
      return NextResponse.json(
        { error: "Bullet point e ruolo sono richiesti" },
        { status: 400 }
      );
    }

    // La riscrittura bullet consuma 1 credito.
    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per usare l'AI." },
        { status: 402 }
      );
    }

    const result = await rewriteBulletWithAI(bullet, role, jobDescription);

    if (!result) {
      return NextResponse.json({
        original: bullet,
        rewritten: `${bullet} [Aggiungi: con quale risultato misurabile? Es: "riducendo i tempi del 30%"]`,
        metricsAdded: [],
        tone: "mid",
        explanation: "Per migliorare questo bullet, aggiungi una metrica concreta (percentuale, tempo, denaro) e un verbo d'azione forte all'inizio.",
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Bullet rewrite error:", error);
    return NextResponse.json(
      { error: "Errore durante la riscrittura" },
      { status: 500 }
    );
  }
}
