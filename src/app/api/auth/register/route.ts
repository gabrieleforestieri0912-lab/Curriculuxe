import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
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

    return NextResponse.json({
      user: { id: user.id, email, name },
      message: "Registrazione completata con successo"
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Errore durante la registrazione" },
      { status: 400 }
    );
  }
}
