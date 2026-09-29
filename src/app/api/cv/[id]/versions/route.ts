import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { analyzeResume } from "@/lib/cvAnalysis";
import { generateCoverAssets, suggestSkills, buildTailoredCV } from "@/lib/careerKit";
import { getRequestUser } from "@/lib/apiAuth";
import { checkPlanLimit, incrementUsage, planLimitResponse } from "@/lib/usage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: cvId } = await params;
    const { company = "", role = "", jobDescription = "", market = "italia" } = await request.json() as {
      company?: string;
      role?: string;
      jobDescription?: string;
      market?: string;
    };

    if (!jobDescription.trim()) {
      return NextResponse.json(
        { error: "Incolla una job description per creare una versione mirata" },
        { status: 400 }
      );
    }

    const { data: cv, error: fetchError } = await supabase
      .from("cvs")
      .select("*")
      .eq("id", cvId)
      .single();

    if (fetchError || !cv) {
      return NextResponse.json({ error: "CV non trovato" }, { status: 404 });
    }

    if ((cv as { userId?: string }).userId !== user.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const limit = await checkPlanLimit(user.id, "tailoring");
    if (!limit.allowed) return planLimitResponse(limit);

    const analysis = analyzeResume({
      cv,
      jobDescription,
      template: (cv as Record<string, unknown>).template as string || "ats",
    });
    const skillKit = suggestSkills({
      role,
      jobDescription,
      currentSkills: (cv as Record<string, unknown>).skills as string || "",
    });
    const coverAssets = generateCoverAssets({
      cv,
      jobDescription,
      market,
      company,
      role: role || skillKit.role,
    });

    const tailored = buildTailoredCV({
      cv,
      matchedKeywords: analysis.matchedKeywords,
      rewrittenBullets: analysis.rewrittenBullets,
      suggestedSkills: skillKit.suggestions,
      targetRole: role || skillKit.role,
    });

    const version = {
      id: crypto.randomUUID(),
      company: company.trim() || "Azienda target",
      role: role.trim() || "Ruolo target",
      jobDescription,
      matchScore: analysis.jobMatchScore,
      missingKeywords: analysis.missingKeywords.slice(0, 16),
      matchedKeywords: analysis.matchedKeywords.slice(0, 16),
      rewrittenBullets: analysis.rewrittenBullets.slice(0, 8),
      suggestedSkills: skillKit.suggestions,
      market: coverAssets.market,
      marketGuidance: coverAssets.marketGuidance,
      coverLetter: coverAssets.coverLetter,
      applicationEmail: coverAssets.applicationEmail,
      tailored,
      status: "bozza",
      createdAt: new Date(),
    };

    const currentVersions = ((cv as Record<string, unknown>).applicationVersions as Array<Record<string, unknown>>) || [];
    const updatedVersions = [version, ...currentVersions];

    const { error: updateError } = await supabase
      .from("cvs")
      .update({
        applicationVersions: updatedVersions,
        score: analysis.score,
        atsScore: analysis.atsScore,
        updatedAt: new Date(),
      })
      .eq("id", cvId);

    if (updateError) throw updateError;

    await incrementUsage(user.id, "tailoring");
    return NextResponse.json({ version, analysis });
  } catch (error) {
    console.error("Error creating CV version:", error);
    return NextResponse.json(
      { error: "Errore durante la creazione della versione" },
      { status: 500 }
    );
  }
}
