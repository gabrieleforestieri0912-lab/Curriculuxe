import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { Resend } from "resend";

const SUPPORT_EMAIL = "gabriele.forestieri0912@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFeedbackEmail(feedback: { userEmail: string; type: string; userName: string; message: string }) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: SUPPORT_EMAIL,
      subject: `[Curriculuxe Feedback] ${feedback.type} - ${feedback.userName}`,
      html: `
        <h2>Nuovo Feedback</h2>
        <p><strong>Da:</strong> ${feedback.userName} (${feedback.userEmail})</p>
        <p><strong>Tipo:</strong> ${feedback.type}</p>
        <p><strong>Messaggio:</strong></p>
        <blockquote style="padding: 12px; background: #f5f5f5; border-left: 4px solid #818cf8;">
          ${feedback.message.replace(/\n/g, "<br>")}
        </blockquote>
        <p><small>Inviato il ${new Date().toLocaleString("it-IT")}</small></p>
      `,
    });
  } catch (err) {
    console.error("Failed to send feedback email:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userCookie = request.cookies.get("user");
    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const user = verifyUserToken(userCookie.value);
    if (!user) {
      return NextResponse.json({ error: "Token non valido" }, { status: 401 });
    }

    const { type, message } = await request.json() as { type: string; message: string };

    if (!type || !message) {
      return NextResponse.json({ error: "Dati incompleti" }, { status: 400 });
    }

    const { error: dbError } = await supabase
      .from("feedbacks")
      .insert({
        userId: user.id as string,
        userEmail: user.email as string,
        userName: user.name as string,
        type,
        message,
        createdAt: new Date(),
      });

    if (dbError) throw dbError;

    sendFeedbackEmail({ type, message, userName: user.name as string, userEmail: user.email as string });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Errore durante il salvataggio del feedback" },
      { status: 500 }
    );
  }
}
