import { NextRequest, NextResponse } from "next/server";
import { registerUser, signUserToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 registrazioni / 15 minuti per IP.
    const limit = checkRateLimit(`register:${getClientIp(request)}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova più tardi." },
        { status: 429 }
      );
    }

    const { email, password, name } = await request.json() as { email: string; password: string; name: string };

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Tutti i campi sono obbligatori" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La password deve essere di almeno 6 caratteri" },
        { status: 400 }
      );
    }

    const user = await registerUser(email, password, name);

    // Imposta il cookie di sessione così l'utente è autenticato subito
    // (prima restava solo in localStorage e ogni API rispondeva 401).
    const token = signUserToken({
      id: user.id,
      email,
      name,
    });

    const response = NextResponse.json({
      user: { id: user.id, email, name },
      message: "Registrazione completata con successo"
    });
    response.cookies.set("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Errore durante la registrazione" },
      { status: 400 }
    );
  }
}
