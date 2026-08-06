import { NextResponse } from "next/server";
import { generateSummaryWithAI } from "@/lib/ollama";

export async function POST(request: Request) {
  try {
    const { experiences, skills, targetRole, tone } = await request.json() as {
      experiences?: Array<Record<string, unknown>>;
      skills?: string;
      targetRole?: string;
      tone?: string;
    };

    if (!experiences && !skills) {
      return NextResponse.json(
        { error: "Esperienze o competenze richieste" },
        { status: 400 }
      );
    }

    const result = await generateSummaryWithAI(experiences, skills, targetRole, tone);

    if (!result) {
      const yearCount = experiences?.length || 0;
      return NextResponse.json({
        summary: `Professionista con ${Math.max(yearCount, 3)}+ anni di esperienza nel settore${targetRole ? `, specializzato come ${targetRole}` : ""}. Combino competenze tecniche e capacità di problem-solving per generare risultati misurabili. Appassionato di innovazione e miglioramento continuo, cerco una sfida stimolante in un ambiente dinamico.`,
        headline: targetRole ? `${targetRole} - Esperienza ${Math.max(yearCount, 3)}+ Anni` : "Professionista con Esperienza Comprovata",
        keyStrengths: ["Orientamento ai risultati", "Problem-solving", "Lavoro in team"],
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione del summary" },
      { status: 500 }
    );
  }
}
