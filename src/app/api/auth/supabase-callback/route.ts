import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { signUserToken } from "@/lib/auth";
import { SIGNUP_CREDITS } from "@/lib/credits";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabaseServer = await createClient();
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { session },
      } = await supabaseServer.auth.getSession();

      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const name = user_metadata?.name || email?.split("@")[0] || "";
        const picture = user_metadata?.avatar_url || user_metadata?.picture || "";

        const { data: existing } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        let userId: string;

        if (existing) {
          userId = existing.id;
          if (existing.provider !== "google") {
            await supabase
              .from("users")
              .update({ provider: "google", google_id: id, picture })
              .eq("id", existing.id);
          }
        } else {
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              email,
              name,
              picture,
              credits: SIGNUP_CREDITS,
              language: "it",
              provider: "google",
              google_id: id,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          userId = newUser.id;
        }

        const token = signUserToken({
          id: userId,
          email,
          name,
          picture,
        });

        const response = NextResponse.redirect(new URL(next, origin));
        response.cookies.set("user", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
}
