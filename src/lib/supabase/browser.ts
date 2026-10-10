import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Client browser per l'autenticazione (OAuth Google incluso).
 * Usa @supabase/ssr così il verifier PKCE viene salvato nei cookie,
 * gli stessi che la route /api/auth/supabase-callback legge lato server
 * con exchangeCodeForSession. Con il client JS classico (localStorage)
 * il server non vede il verifier e il callback fallisce sempre.
 * Usa SOLO la anon key: mai la service_role nel browser.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Configurazione Supabase mancante: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
