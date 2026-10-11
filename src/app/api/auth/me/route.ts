import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user");

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const cookieUser = verifyUserToken(userCookie.value);
    if (!cookieUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", cookieUser.id)
      .single();

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      picture: dbUser.picture,
      credits: dbUser.credits !== undefined ? dbUser.credits : 0,
      plan: dbUser.plan || null,
      language: dbUser.language || "it"
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error reading user cookie:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user");

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const cookieUser = verifyUserToken(userCookie.value);
    if (!cookieUser) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const { name } = (await request.json()) as { name?: unknown };
    const cleanName = typeof name === "string" ? name.trim().slice(0, 80) : "";

    if (!cleanName) {
      return NextResponse.json({ error: "Nome non valido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("users")
      .update({ name: cleanName })
      .eq("id", cookieUser.id);

    if (error) throw error;

    return NextResponse.json({ name: cleanName }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Errore aggiornamento profilo" }, { status: 500 });
  }
}
