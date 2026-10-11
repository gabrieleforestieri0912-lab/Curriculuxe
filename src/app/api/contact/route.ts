import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_LENGTH = 4000;

export async function POST(request: NextRequest) {
  let body: { name?: unknown; email?: unknown; topic?: unknown; message?: unknown; website?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  // Campo esca: i bot compilano i form, gli umani lo lasciano vuoto.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 120) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_LENGTH) : "";

  if (!message) {
    return NextResponse.json({ error: "Scrivi un messaggio" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Indirizzo email non valido" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "gabriele.forestieri0912@gmail.com";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Invio non disponibile. Scrivi direttamente all'indirizzo indicato nella pagina." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Curriculuxe <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject: `[Contatti] ${topic || "Richiesta"} — ${name || "senza nome"}`,
      text: [
        `Nome: ${name || "-"}`,
        `Email: ${email}`,
        `Tema: ${topic || "-"}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Invio non riuscito" },
      { status: 500 }
    );
  }
}