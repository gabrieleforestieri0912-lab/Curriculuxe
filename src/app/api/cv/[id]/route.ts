import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;
    const updates = await request.json() as Record<string, unknown>;

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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cvId } = await params;

    const { data: existing } = await supabase
      .from("cvs")
      .select("id")
      .eq("id", cvId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "CV non trovato" },
        { status: 404 }
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
