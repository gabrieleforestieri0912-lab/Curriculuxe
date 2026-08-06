import { NextResponse } from "next/server";
import { generateCoverAssets, suggestSkills } from "@/lib/careerKit";

export async function POST(request: Request) {
  try {
    const { cv = {}, jobDescription = "", market = "italia", company = "", role = "" } = await request.json() as {
      cv?: Record<string, unknown>;
      jobDescription?: string;
      market?: string;
      company?: string;
      role?: string;
    };

    const skills = suggestSkills({
      role,
      jobDescription,
      currentSkills: (cv.skills as string) || "",
    });

    const coverAssets = generateCoverAssets({
      cv,
      jobDescription,
      market,
      company,
      role: role || skills.role,
    });

    return NextResponse.json({
      ...coverAssets,
      suggestedSkills: skills.suggestions,
      detectedRole: skills.role,
    });
  } catch (error) {
    console.error("Error generating career kit:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione dei materiali candidatura" },
      { status: 500 }
    );
  }
}
