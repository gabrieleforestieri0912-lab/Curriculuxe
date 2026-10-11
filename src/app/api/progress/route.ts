import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getRequestUser } from "@/lib/apiAuth";

export const runtime = "nodejs";

const CONTENT_TYPES = ["roadmap", "project", "guide"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && (CONTENT_TYPES as readonly string[]).includes(value);
}

async function readBody(request: NextRequest) {
  const body = (await request.json()) as {
    contentType?: unknown;
    contentSlug?: unknown;
    items?: unknown;
  };
  return {
    contentType: body.contentType,
    contentSlug: body.contentSlug,
    items: body.items,
  };
}

function sanitizeItems(items: unknown): Record<string, boolean> {
  if (!items || typeof items !== "object" || Array.isArray(items)) return {};
  const result: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(items as Record<string, unknown>)) {
    if (typeof value === "boolean") result[key.slice(0, 120)] = value;
  }
  return result;
}

/**
 * Stato delle checklist delle risorse.
 *
 * Gli utenti loggati vengono salvati su Supabase; per gli anonimi la route
 * risponde 401 e il client ricade su localStorage, cosi' il sito resta
 * usabile senza account. Idempotente: stessa richiesta due volte produce
 * lo stesso risultato.
 */
export async function GET(request: NextRequest) {
  const user = getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: "Autenticazione richiesta" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");
  const contentSlug = searchParams.get("contentSlug");

  let query = supabase.from("resource_progress").select("contentType, contentSlug, items, updatedAt").eq("userId", user.id);
  if (isContentType(contentType)) query = query.eq("contentType", contentType);
  if (contentSlug) query = query.eq("contentSlug", contentSlug);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rows: data ?? [] });
}

export async function PUT(request: NextRequest) {
  const user = getRequestUser(request);
  if (!user) {
    return NextResponse.json({ error: "Autenticazione richiesta" }, { status: 401 });
  }

  const { contentType, contentSlug, items } = await readBody(request);
  if (!isContentType(contentType) || typeof contentSlug !== "string" || !contentSlug) {
    return NextResponse.json({ error: "Parametri non validi" }, { status: 400 });
  }

  const { error } = await supabase
    .from("resource_progress")
    .upsert(
      {
        userId: user.id,
        contentType,
        contentSlug,
        items: sanitizeItems(items),
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "userId,contentType,contentSlug" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}