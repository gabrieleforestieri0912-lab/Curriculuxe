import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;
    const { status, notes } = await request.json() as { status: string; notes?: string };

    const validStatuses = ["draft", "sent", "interview", "offer", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status non valido" },
        { status: 400 }
      );
    }

    const statusEntry = {
      status,
      notes: notes || "",
      changedAt: new Date(),
    };

    const { data: cv } = await supabase
      .from("cvs")
      .select("statusHistory")
      .eq("id", cvId)
      .single();

    const currentHistory = (cv?.statusHistory as Array<Record<string, unknown>>) || [];
    const updatedHistory = [...currentHistory, statusEntry];

    const { error: cvError } = await supabase
      .from("cvs")
      .update({
        applicationStatus: status,
        statusHistory: updatedHistory,
        updatedAt: new Date(),
      })
      .eq("id", cvId);

    if (cvError) throw cvError;

    const userCookie = request.cookies.get("user");
    if (userCookie && userCookie.value) {
      const userObj = verifyUserToken(userCookie.value);
      if (userObj) {
        const fieldName = `appStatus_${status}`;

        const { data: currentUser } = await supabase
          .from("users")
          .select(fieldName)
          .eq("id", userObj.id)
          .single();

        await supabase
          .from("users")
          .update({
            [fieldName]: (((currentUser as unknown as Record<string, number>)?.[fieldName]) || 0) + 1
          })
          .eq("id", userObj.id);
      }
    }

    return NextResponse.json({ success: true, status, statusEntry });
  } catch (error) {
    console.error("Error updating CV status:", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento dello status" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;

    const { data: cv, error } = await supabase
      .from("cvs")
      .select("applicationStatus, statusHistory, fileName, template")
      .eq("id", cvId)
      .single();

    if (error || !cv) {
      return NextResponse.json({ error: "CV non trovato" }, { status: 404 });
    }

    return NextResponse.json(cv);
  } catch (error) {
    return NextResponse.json({ error: "Errore" }, { status: 500 });
  }
}
