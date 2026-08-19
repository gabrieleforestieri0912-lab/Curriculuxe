import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getRequestUser } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { data: userCVs, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("userId", user.id)
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

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { template, personalInfo } = await request.json() as {
      template?: string;
      personalInfo?: Record<string, unknown>;
    };

    const newCV = {
      userId: user.id,
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
