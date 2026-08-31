import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  const key = serviceKey || supabaseKey || "";
  if (!key) {
    throw new Error("Missing Supabase key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  }

  client = createClient(supabaseUrl, key);
  return client;
}

/**
 * Handle lazy: il client viene creato solo al primo accesso a una proprietà,
 * a runtime, mai al momento dell'import del modulo. In questo modo `next build`
 * non fallisce quando le env non sono ancora disponibili durante la raccolta
 * delle page data (es. primo deploy su Vercel senza variabili configurate).
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    // `then` non deve rendere il client un "thenable", così non viene mai
    // scambiato per una Promise in contesti `await`.
    if (prop === "then") return undefined;

    const realClient = getSupabaseClient();
    const value = (realClient as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(realClient)
      : value;
  },
});
