import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { getCreditsInfo } from "@/lib/credits";

export type UsageFeature = "tailoring" | "cover_letter" | "review" | "atlas_turn" | "behavioral" | "system_design" | "negotiation";
export type UsagePeriod = "daily" | "monthly";

// Limiti mensili (atlas_turn: giornalieri) per piano. Il piano free è
// volutamente stretto: pochi utilizzi di assaggio, poi upgrade o ricarica.
const LIMITS: Record<string, Record<UsageFeature, number>> = {
  free: { tailoring: 2, cover_letter: 1, review: 3, atlas_turn: 0, behavioral: 0, system_design: 0, negotiation: 1 },
  starter: { tailoring: 30, cover_letter: 30, review: 25, atlas_turn: 50, behavioral: 50, system_design: 8, negotiation: 10 },
  pro: { tailoring: 150, cover_letter: 150, review: 100, atlas_turn: 200, behavioral: 200, system_design: 30, negotiation: 50 },
  enterprise: { tailoring: 500, cover_letter: 500, review: 300, atlas_turn: 500, behavioral: 500, system_design: 100, negotiation: 200 },
};

function periodOf(feature: UsageFeature): UsagePeriod {
  return feature === "atlas_turn" ? "daily" : "monthly";
}

export async function checkUsage(userId: string, feature: UsageFeature, plan: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const period = periodOf(feature);
  const limit = LIMITS[plan]?.[feature] ?? LIMITS.free[feature] ?? 0;
  if (limit === 0) return { allowed: false, remaining: 0, limit };

  try {
    const { data } = await supabase.from("usage_counters").select("count").eq("userId", userId).eq("feature", feature).eq("period", period).single();
    const count = data?.count ?? 0;
    return { allowed: count < limit, remaining: Math.max(0, limit - count), limit };
  } catch {
    return { allowed: true, remaining: limit, limit };
  }
}

export async function incrementUsage(userId: string, feature: UsageFeature) {
  const period = periodOf(feature);
  try {
    await supabase.rpc("increment_usage", { p_user_id: userId, p_feature: feature, p_period: period });
  } catch {
    // fallback upsert
    const { data } = await supabase.from("usage_counters").select("count").eq("userId", userId).eq("feature", feature).eq("period", period).single();
    const next = (data?.count ?? 0) + 1;
    await supabase.from("usage_counters").upsert({ userId, feature, period, count: next, resetAt: new Date().toISOString() }, { onConflict: "userId,feature,period" });
  }
}

export interface PlanLimitCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: string;
  feature: UsageFeature;
}

/** Legge il piano dell'account e verifica il limite mensile della feature. */
export async function checkPlanLimit(userId: string, feature: UsageFeature): Promise<PlanLimitCheck> {
  let plan = "free";
  try {
    const info = await getCreditsInfo(userId);
    plan = info.plan || "free";
  } catch {
    // piano sconosciuto: si applicano i limiti free
  }
  const check = await checkUsage(userId, feature, plan);
  return { ...check, plan, feature };
}

/** Risposta 402 standard quando il piano ha esaurito la quota mensile. */
export function planLimitResponse(check: PlanLimitCheck): NextResponse {
  const periodLabel = periodOf(check.feature) === "daily" ? "giornalieri" : "mensili";
  return NextResponse.json(
    {
      error: `Hai raggiunto il limite ${periodLabel} di questa funzione per il piano ${check.plan} (${check.limit}/mese). Passa a un piano superiore o attendi il rinnovo.`,
      upgradeRequired: true,
      remaining: 0,
      limit: check.limit,
      plan: check.plan,
    },
    { status: 402 }
  );
}
