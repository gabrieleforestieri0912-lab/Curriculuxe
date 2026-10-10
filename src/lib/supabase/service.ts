import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Client privilegiato SOLO lato server (API route / Server Components).
 * Usa la service_role per leggere/scrivere la tabella `users` anche con RLS
 * attiva. Non importare mai questo modulo da "use client".
 */
let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  }
  const key = serviceKey || anonKey || "";
  if (!key) {
    throw new Error(
      "Missing Supabase key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  serviceClient = createClient(supabaseUrl, key);
  return serviceClient;
}
