import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/cvAnalysis";
import { getRequestUser } from "@/lib/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { cv, prompt = "", jobDescription = "" } = await request.json() as { cv: Record<string, unknown>; prompt?: string; jobDescription?: string };

    if (!cv) {
      return NextResponse.json({ error: "Dati CV mancanti" }, { status: 400 });
    }

    const analysis = analyzeResume({
      cv,
      jobDescription: jobDescription || prompt,
      template: (cv.template as string) || "ats",
    });

    const suggestions = [
      `Score ATS: ${analysis.atsScore}/100`,
      analysis.jobMatchScore !== null ? `Match offerta: ${analysis.jobMatchScore}/100` : null,
      "",
      "Priorita di intervento:",
      ...analysis.improvements.slice(0, 5).map((item: { impact: string; area: string; description: string }) => `- [${item.impact}] ${item.area}: ${item.description}`),
      "",
      "Bullet da riscrivere:",
      ...analysis.rewrittenBullets.slice(0, 5).map((item: string) => `- ${item}`),
    ]
      .filter((item): item is string => item !== null)
      .join("\n");

    return NextResponse.json({
      suggestions,
      tips: analysis.improvements,
      analysis,
    });
  } catch (error) {
    console.error("Error in AI revision:", error);
    return NextResponse.json(
      { error: "Errore durante la revisione AI" },
      { status: 500 }
    );
  }
}
