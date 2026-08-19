import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const rawNext = request.nextUrl.searchParams.get("next") ?? "/dashboard";
    const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

    const callbackUrl = new URL("/api/auth/supabase-callback", process.env.NEXT_PUBLIC_URL);
    callbackUrl.searchParams.set("next", next);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) throw error;

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Supabase Google OAuth error:", error);
    return NextResponse.json(
      { error: "Errore durante l'inizializzazione OAuth" },
      { status: 500 }
    );
  }
}
