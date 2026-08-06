import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PRICES } from "@/lib/stripe";
import { verifyUserToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json() as { plan: string };

    if (!PRICES[plan]) {
      return NextResponse.json(
        { error: "Piano non valido" },
        { status: 400 }
      );
    }

    const userCookie = request.cookies.get("user")?.value;
    if (!userCookie) {
      return NextResponse.json(
        { error: "Non autorizzato - effettua l'accesso" },
        { status: 401 }
      );
    }

    const user = verifyUserToken(userCookie);
    if (!user) {
      return NextResponse.json(
        { error: "Token non valido" },
        { status: 401 }
      );
    }
    const userId = user.id;
    const userEmail = user.email;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Dati utente mancanti" },
        { status: 400 }
      );
    }

    const amount = PRICES[plan]!;
    const session = await createCheckoutSession(amount, userId as string, userEmail as string, plan);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", (error as Error).message);
    return NextResponse.json(
      { error: "Errore durante il checkout: " + (error as Error).message },
      { status: 500 }
    );
  }
}
