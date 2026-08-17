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
