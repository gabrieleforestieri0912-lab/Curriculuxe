import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetterWithAI } from "@/lib/ai";
import { generateCoverAssets } from "@/lib/careerKit";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { cv = {}, jobDescription = "", company = "", role = "", market = "italia" } = await request.json() as {
      cv?: Record<string, unknown>;
      jobDescription?: string;
      company?: string;
      role?: string;
      market?: string;
    };

    if (!cv || Object.keys(cv).length === 0) {
      return NextResponse.json({ error: "Dati CV mancanti" }, { status: 400 });
    }

    const credit = await consumeCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per generare la cover letter con l'AI." },
        { status: 402 }
      );
    }

    const name = ((cv.personalInfo as Record<string, unknown> | undefined)?.name as string) || "";

    const aiResult = await generateCoverLetterWithAI({
      cv,
      jobDescription,
      company,
      role,
      market,
      name,
    });

    if (aiResult) {
      return NextResponse.json({ ...aiResult, source: "ai" });
    }

    const fallback = generateCoverAssets({
      cv,
      jobDescription,
      market,
      company,
      role,
    });

    return NextResponse.json({
      coverLetter: fallback.coverLetter,
      applicationEmail: fallback.applicationEmail,
      source: "template",
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione della cover letter" },
      { status: 500 }
    );
  }
}