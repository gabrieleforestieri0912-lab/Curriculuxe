import { NextResponse } from "next/server";
import { rewriteBulletWithAI } from "@/lib/ollama";

export async function POST(request: Request) {
  try {
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
