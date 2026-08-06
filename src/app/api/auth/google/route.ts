import { NextResponse } from "next/server";
import { findOrCreateGoogleUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { googleToken?: string };
    const { googleToken } = body;

    if (!googleToken) {
      return NextResponse.json(
        { error: "Token Google mancante" },
        { status: 400 }
      );
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || !googleClientSecret) {
      return NextResponse.json(
        { error: "Configurazione Google OAuth non disponibile" },
        { status: 500 }
      );
    }

    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`,
      { method: "GET" }
    );

    if (!tokenInfoRes.ok) {
      return NextResponse.json(
        { error: "Token Google non valido" },
        { status: 401 }
      );
    }

    const tokenInfo = await tokenInfoRes.json();

    if (tokenInfo.error) {
      return NextResponse.json(
        { error: "Token Google non valido" },
        { status: 401 }
      );
    }

    const googleUser = {
      email: tokenInfo.email,
      name: tokenInfo.name || tokenInfo.email.split("@")[0],
      picture: tokenInfo.picture,
      googleId: tokenInfo.sub,
    };

    const user = await findOrCreateGoogleUser(googleUser);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      message: "Login con Google completato"
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Errore durante il login con Google" },
      { status: 400 }
    );
  }
}
