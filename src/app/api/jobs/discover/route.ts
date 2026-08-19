import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getRequestUser } from "@/lib/apiAuth";
import { cvToText } from "@/lib/cvAnalysis";
import { buildDailyDigest } from "@/lib/jobs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    const { profileText = "", market = "", limit } = (await request.json().catch(() => ({}))) as {
      profileText?: string;
      market?: string;
      limit?: number;
    };

    // Il digest è deterministico e gratuito: proteggiamo solo l'endpoint
    // da abusi con un rate limit per IP, ma non richiediamo credito.
    const ipLimit = checkRateLimit(`discover:${getClientIp(request)}`, 20, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche minuto." },
        { status: 429 }
      );
    }

    let profileSource: "provided" | "latest-cv" | "default" = "provided";
    let resolvedProfile = profileText;

    if (!resolvedProfile.trim() && user) {
      const { data: cv } = await supabase
        .from("cvs")
        .select("personalInfo, summary, experience, education, skills, languages, certifications")
        .eq("userId", user.id)
        .order("updatedAt", { ascending: false })
        .limit(1)
        .maybeSingle();

      const text = cvToText(cv || undefined);
      if (text.trim()) {
        resolvedProfile = text;
        profileSource = "latest-cv";
      }
    }

    if (!resolvedProfile.trim()) {
      resolvedProfile = "Sviluppatore software con competenze in React, TypeScript e Node.js, esperienza in progetti web e attenzione alla qualità.";
      profileSource = "default";
    }

    const digest = buildDailyDigest(resolvedProfile, { limit, market });

    return NextResponse.json({
      digest,
      count: digest.length,
      profileSource,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione del digest" },
      { status: 500 }
    );
  }
}