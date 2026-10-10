import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { signUserToken } from "@/lib/auth";
import { SIGNUP_CREDITS } from "@/lib/credits";

function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/dashboard";
}

function fail(origin: string, reason: string) {
  return NextResponse.redirect(
    new URL(
      `/login?error=auth_failed&reason=${encodeURIComponent(reason)}`,
      origin
    )
  );
}

/**
 * Callback OAuth Google.
 * Il login parte dal browser con il client @supabase/ssr (verifier PKCE nei
 * cookie), quindi exchangeCodeForSession qui lato server riesce a leggerlo.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // Errori rimandati da Supabase/Google (es. provider disabilitato,
  // redirect URI non autorizzato, consenso negato).
  const oauthError = searchParams.get("error");
  const oauthDesc =
    searchParams.get("error_description") || searchParams.get("error_code");
  if (oauthError) {
    console.error("Google OAuth provider error:", oauthError, oauthDesc);
    return fail(origin, oauthDesc || oauthError);
  }

  if (!code) {
    console.error("Google OAuth callback senza code");
    return fail(origin, "missing_code");
  }

  try {
    const supabaseServer = await createClient();
    const { error: exchangeError } =
      await supabaseServer.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("exchangeCodeForSession fallito:", exchangeError.message);
      return fail(origin, exchangeError.message);
    }

    const {
      data: { session },
    } = await supabaseServer.auth.getSession();

    const email = session?.user?.email?.trim().toLowerCase();
    if (!session?.user || !email) {
      console.error("Callback OAuth senza sessione o senza email");
      return fail(origin, "missing_session");
    }

    const { id, user_metadata } = session.user;
    const name =
      (user_metadata?.full_name as string) ||
      (user_metadata?.name as string) ||
      email.split("@")[0] ||
      "";
    const picture =
      (user_metadata?.avatar_url as string) ||
      (user_metadata?.picture as string) ||
      "";

    const db = getSupabaseServiceClient();
    const { data: existing } = await db
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    let userId: string;
    let userName = name;
    let userPicture = picture;

    if (existing) {
      userId = existing.id;
      userName = existing.name || name;
      userPicture = existing.picture || picture;
      if (existing.provider !== "google") {
        await db
          .from("users")
          .update({ provider: "google", google_id: id, picture })
          .eq("id", existing.id);
      }
    } else {
      const { data: newUser, error: insertError } = await db
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

      if (insertError || !newUser) {
        console.error("Creazione utente Google fallita:", insertError?.message);
        return fail(origin, insertError?.message || "db_insert_failed");
      }
      userId = newUser.id;
    }

    const token = signUserToken({
      id: userId,
      email,
      name: userName,
      picture: userPicture,
    });

    const response = NextResponse.redirect(new URL(next, origin));
    response.cookies.set("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Errore imprevisto nel callback Google:", err);
    return fail(
      origin,
      err instanceof Error ? err.message : "unexpected_error"
    );
  }
}
