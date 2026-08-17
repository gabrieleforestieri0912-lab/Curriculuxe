import { supabase } from "@/lib/supabase/client";

/** Crediti AI gratuiti assegnati alla registrazione di un nuovo utente. */
export const SIGNUP_CREDITS = 5;

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
 */
export async function consumeCredit(userId: string) {
  const info = await getCreditsInfo(userId);

  if (info.credits <= 0) {
    return { ok: false, credits: 0 };
  }

  await supabase
    .from("users")
    .update({ credits: info.credits - 1 })
    .eq("id", userId);

  return { ok: true, credits: info.credits - 1 };
}
