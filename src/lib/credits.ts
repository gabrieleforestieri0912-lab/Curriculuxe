import { supabase } from "@/lib/supabase/client";

/** Crediti AI gratuiti assegnati alla registrazione di un nuovo utente. */
export const SIGNUP_CREDITS = 3;

export async function getCreditsInfo(userId: string) {
  const { data } = await supabase
    .from("users")
    .select("credits, plan")
    .eq("id", userId)
    .single();

  const row = data as { credits?: number; plan?: string | null } | null;

  return {
    credits: row?.credits ?? 0,
    plan: row?.plan ?? null,
  };
}

/**
 * Consuma 1 credito AI per l'utente (tutti i piani sono a crediti).
 * - Crediti disponibili: decremento di 1, ok = true.
 * - Crediti esauriti: ok = false.
 *
 * L'update usa un filtro condizionale `credits > 0` per evitare la race
 * condition read-then-write che poteva portare i crediti in negativo con
 * richieste concorrenti.
 */
export async function consumeCredit(userId: string) {
  const info = await getCreditsInfo(userId);

  if (info.credits <= 0) {
    return { ok: false, credits: 0 };
  }

  const { data, error } = await supabase
    .from("users")
    .update({ credits: info.credits - 1 })
    .eq("id", userId)
    .gte("credits", 1)
    .select("credits")
    .single();

  // Se l'update condizionale non ha toccato righe (crediti cambiati nel
  // frattempo o esauriti), consideriamo il consumo fallito.
  if (error || !data) {
    return { ok: false, credits: 0 };
  }

  return { ok: true, credits: (data as { credits: number }).credits };
}
