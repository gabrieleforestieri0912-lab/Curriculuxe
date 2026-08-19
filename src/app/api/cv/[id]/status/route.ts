import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/apiAuth";
import { supabase } from "@/lib/supabase/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: cvId } = await params;
    const { status, notes } = await request.json() as { status: string; notes?: string };

    const validStatuses = ["draft", "sent", "interview", "offer", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status non valido" },
        { status: 400 }
      );
    }

    const { data: cv } = await supabase
      .from("cvs")
      .select("statusHistory, userId")
      .eq("id", cvId)
      .single();

    if (!cv) {
      return NextResponse.json({ error: "CV non trovato" }, { status: 404 });
    }

    if ((cv as { userId?: string }).userId !== user.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    const statusEntry = {
      status,
      notes: notes || "",
      changedAt: new Date(),
    };

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

    const fieldName = `appStatus_${status}`;

    const { data: currentUser } = await supabase
      .from("users")
      .select(fieldName)
      .eq("id", user.id)
      .single();

    await supabase
      .from("users")
      .update({
        [fieldName]: (((currentUser as unknown as Record<string, number>)?.[fieldName]) || 0) + 1
      })
      .eq("id", user.id);

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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: cvId } = await params;

    const { data: cv, error } = await supabase
      .from("cvs")
      .select("applicationStatus, statusHistory, fileName, template, userId")
      .eq("id", cvId)
      .single();

    if (error || !cv) {
      return NextResponse.json({ error: "CV non trovato" }, { status: 404 });
    }

    if ((cv as { userId?: string }).userId !== user.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    return NextResponse.json(cv);
  } catch (error) {
    return NextResponse.json({ error: "Errore" }, { status: 500 });
  }
}
