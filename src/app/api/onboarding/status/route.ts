import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/apiAuth";
import { supabase } from "@/lib/supabase/client";

function storageKey(userId: string) {
  return `curriculuxe:onboarding:${userId}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const { data, error } = await supabase
      .from("onboarding_profiles")
      .select("answers, plan, completed, updatedAt")
      .eq("userId", user.id)
      .single();
    if (error || !data) {
      return NextResponse.json({ completed: false, storageKey: storageKey(user.id as string) });
    }
    return NextResponse.json({
      completed: !!(data as Record<string, unknown>).completed,
      answers: (data as Record<string, unknown>).answers || null,
      plan: (data as Record<string, unknown>).plan || null,
      storageKey: storageKey(user.id as string),
    });
  } catch (error) {
    console.error("Error reading onboarding status:", error);
    return NextResponse.json({ completed: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const body = (await request.json()) as {
      answers?: Record<string, unknown>;
      plan?: Record<string, unknown> | null;
      completed?: boolean;
    };
    const { error } = await supabase.from("onboarding_profiles").upsert(
      {
        userId: user.id,
        answers: body.answers || {},
        plan: body.plan || null,
        completed: !!body.completed,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "userId" }
    );
    if (error) throw error;
    return NextResponse.json({ saved: true });
  } catch (error) {
    // Tabella assente o DB non raggiungibile: il client usa localStorage.
    console.error("Error saving onboarding status:", error);
    return NextResponse.json({ saved: false });
  }
}
