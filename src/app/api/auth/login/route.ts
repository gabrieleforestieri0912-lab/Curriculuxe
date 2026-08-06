import { NextResponse } from "next/server";
import { loginUser, signUserToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
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
