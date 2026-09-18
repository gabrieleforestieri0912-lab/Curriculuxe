import { buildDailyDigest } from "@/lib/jobs";

/**
 * Atlas — agente con stato persistente legato al career record.
 * - Human-in-loop obbligatorio su ogni scrittura (preview→approvazione)
 * - Mai inventa esperienza; solo riformula bullet esistenti con evidenza
 * - Mai invio massivo candidature
 */
export function atlasDigest(profileText: string, market?: string) {
  const digest = buildDailyDigest(profileText, { limit: 8, market });
  return {
    generatedAt: new Date().toISOString(),
    summary: `Atlas ha trovato ${digest.length} opportunità con fit 0-100 spiegato con evidenze testuali.`,
    opportunities: digest.map((j) => ({
      id: j.id,
      company: j.company,
      role: j.role,
      score: j.score,
      highlight: j.highlight,
      reasons: j.reasons,
      nextAction: j.score >= 70 ? "Tailor → preview" : "Migliora keyword e riprova",
    })),
    guarantees: ["No mass auto-apply", "Review before save", "Evidence, not mystery score"],
  };
}
