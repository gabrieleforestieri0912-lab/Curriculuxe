import { NextRequest, NextResponse } from "next/server";
import { loginUser, signUserToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 tentativi / 15 minuti per IP (anti brute-force).
    const limit = checkRateLimit(`login:${getClientIp(request)}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Troppi tentativi. Riprova più tardi." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatori" },
        { status: 400 }
      );
    }

    const user = await loginUser(email, password);

    const token = signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({ user });
    response.cookies.set("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Errore durante il login" },
      { status: 401 }
    );
  }
}
