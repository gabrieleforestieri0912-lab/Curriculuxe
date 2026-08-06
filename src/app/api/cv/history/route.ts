import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user");

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const user = verifyUserToken(userCookie.value);
    if (!user) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const { data: analyses, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Errore durante il caricamento dello storico" }, { status: 500 });
  }
}
