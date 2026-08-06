import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId mancante" },
        { status: 400 }
      );
    }

    const { data: userCVs, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json(userCVs);
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dei CV" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, template, personalInfo } = await request.json() as {
      userId: string;
      template?: string;
      personalInfo?: Record<string, unknown>;
    };

    if (!userId) {
      return NextResponse.json(
        { error: "UserId mancante" },
        { status: 400 }
      );
    }

    const newCV = {
      userId,
      template: template || "moderno",
      personalInfo: personalInfo || {},
      summary: "",
      experience: [],
      education: [],
      skills: "",
      languages: "",
      certifications: "",
      applicationVersions: [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { data, error } = await supabase
      .from("cvs")
      .insert(newCV)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del CV" },
      { status: 500 }
    );
  }
}
