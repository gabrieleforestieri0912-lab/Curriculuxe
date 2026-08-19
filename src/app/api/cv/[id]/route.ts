import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getRequestUser } from "@/lib/apiAuth";

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
      .select("*")
      .eq("id", cvId)
      .single();

    if (error || !cv) {
      return NextResponse.json(
        { error: "CV non trovato" },
        { status: 404 }
      );
    }

    if ((cv as { userId?: string }).userId !== user.id) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 403 }
      );
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      { error: "Errore durante il recupero del CV" },
      { status: 500 }
    );
  }
}

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

    const { data: existing } = await supabase
      .from("cvs")
      .select("id, userId")
      .eq("id", cvId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "CV non trovato" },
        { status: 404 }
      );
    }

    if ((existing as { userId?: string }).userId !== user.id) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 403 }
      );
    }

    const updates = await request.json() as Record<string, unknown>;

    // Impedisce di cambiare il proprietario del CV tramite payload.
    delete updates.userId;
    delete updates.id;

    const { error } = await supabase
      .from("cvs")
      .update({ ...updates, updatedAt: new Date() })
      .eq("id", cvId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating CV:", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento del CV" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: cvId } = await params;

    const { data: existing } = await supabase
      .from("cvs")
      .select("id, userId")
      .eq("id", cvId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "CV non trovato" },
        { status: 404 }
      );
    }

    if ((existing as { userId?: string }).userId !== user.id) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("cvs")
      .delete()
      .eq("id", cvId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting CV:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione del CV" },
      { status: 500 }
    );
  }
}
