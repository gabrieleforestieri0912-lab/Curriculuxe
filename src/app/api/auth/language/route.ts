import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function PATCH(request: NextRequest) {
  try {
    const { language } = await request.json() as { language: string };
    const userCookie = request.cookies.get("user");

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const cookieUser = verifyUserToken(userCookie.value);
    if (!cookieUser) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const { error } = await supabase
      .from("users")
      .update({ language })
      .eq("id", cookieUser.id);

    if (error) throw error;

    return NextResponse.json({ language, message: "Lingua aggiornata" });
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json({ error: "Errore aggiornamento lingua" }, { status: 500 });
  }
}
