import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/api/auth/supabase-callback`,
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
