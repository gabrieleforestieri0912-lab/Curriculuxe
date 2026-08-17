import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { analyzeResume, normalizeText } from "@/lib/cvAnalysis";
import { generateCoverAssets, suggestSkills } from "@/lib/careerKit";
import { analyzeCVWithAI } from "@/lib/ai";
import { verifyUserToken } from "@/lib/auth";
import { consumeCredit, getCreditsInfo } from "@/lib/credits";
import { supabase } from "@/lib/supabase/client";

export const runtime = "nodejs";

async function extractPdfText(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text || "";
  } finally {
    await parser.destroy();
  }
}

async function extractTextFromFile(file: File) {
  if (!file) return "";

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  if (file.type.startsWith("text/") || fileName.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  return "";
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let text = "";
    let jobDescription = "";
    let template = "ats";
    let market = "italia";
    let fileName = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      fileName = file?.name || "";
      jobDescription = formData.get("jobDescription")?.toString() || "";
      template = formData.get("template")?.toString() || "ats";
      market = formData.get("market")?.toString() || "italia";
      text = await extractTextFromFile(file as File);
    } else {
      const body = await request.json() as {
        text?: string;
        jobDescription?: string;
        template?: string;
        market?: string;
        fileName?: string;
      };
      text = body.text || "";
      jobDescription = body.jobDescription || "";
      template = body.template || "ats";
      market = body.market || "italia";
      fileName = body.fileName || "";
    }

    const cleanText = normalizeText(text);

    if (cleanText.length < 80) {
      return NextResponse.json(
        {
          error:
            "Non sono riuscito a leggere abbastanza testo dal CV. Se il PDF è scannerizzato, esportalo come DOCX o incolla il testo del CV.",
          extractedLength: cleanText.length,
          fileName,
        },
        { status: 422 }
      );
    }

    let analysis: Record<string, unknown> | null = null;
    let isFallback = true;
    const fallbackAnalysis = analyzeResume({ text: cleanText, jobDescription, template });

    const userCookie = request.cookies.get("user");
    let userObj: Record<string, unknown> | null = null;

    if (userCookie && userCookie.value) {
      userObj = verifyUserToken(userCookie.value);
      if (!userObj) {
        userObj = null;
      }
      try {
        const creditInfo = await getCreditsInfo(userObj.id as string);

        // Tutti i piani sono a crediti: l'analisi AI richiede almeno 1 credito.
        if (creditInfo.credits > 0) {
          analysis = await analyzeCVWithAI(cleanText, jobDescription);
          if (analysis) {
            isFallback = false;
            await consumeCredit(userObj.id as string);
          }
        }
      } catch (err) {
        console.error("DB Error during AI check", err);
      }
    }

    if (analysis) {
      (analysis as Record<string, unknown>).parsed = fallbackAnalysis.parsed;
    } else {
      analysis = fallbackAnalysis as unknown as Record<string, unknown>;
    }

    const parsed = (analysis as Record<string, unknown>).parsed as Record<string, unknown> | undefined;

    const skills = suggestSkills({
      jobDescription,
      currentSkills: (parsed?.skills as string) || "",
    });

    const coverAssets = generateCoverAssets({
      cv: analysis,
      jobDescription,
      market,
      role: skills.role,
    });

    const finalResult = {
      ...analysis,
      ...coverAssets,
      detectedRole: skills.role,
      suggestedSkills: skills.suggestions,
      fileName,
      extractedTextLength: cleanText.length,
      isFallback,
    };

    try {
      if (userObj) {
        await supabase
          .from("analyses")
          .insert({
            userId: userObj.id as string,
            fileName,
            jobDescription,
            score: (finalResult as Record<string, unknown>).score as number || 0,
            createdAt: new Date(),
            data: finalResult
          });

        const { data: currentUser } = await supabase
          .from("users")
          .select("cvCount, keywordCount, score")
          .eq("id", userObj.id)
          .single();

        const keywordCount = ((finalResult as Record<string, unknown>).matchedKeywords as string[])?.length || 0;

        await supabase
          .from("users")
          .update({
            cvCount: (currentUser?.cvCount || 0) + 1,
            keywordCount: (currentUser?.keywordCount || 0) + keywordCount,
            score: Math.max(((finalResult as Record<string, unknown>).score as number) || 0, currentUser?.score ?? 0)
          })
          .eq("id", userObj.id);
      }
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
    }

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return NextResponse.json(
      { error: "Errore durante l'analisi del curriculum" },
      { status: 500 }
    );
  }
}
