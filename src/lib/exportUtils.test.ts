import { describe, it, expect } from "vitest";
import { generateTxtContent } from "@/lib/exportUtils";
import type { AnalysisResult } from "@/lib/supabase/types";

const sampleResult: AnalysisResult = {
  score: 75,
  atsScore: 80,
  contentScore: 70,
  writingScore: 65,
  readinessScore: 72,
  jobMatchScore: 60,
  overall: "Buona base, ma servono keyword.",
  strengths: ["Contatti rilevati", "Sezione esperienza presente"],
  improvements: [
    { area: "Profilo", impact: "Alto", description: "Scrivi un profilo iniziale." },
  ],
  atsChecks: [],
  matchedKeywords: [],
  missingKeywords: [],
  rewrittenBullets: [],
  review: "Rendi leggibili le sezioni.",
};

describe("generateTxtContent", () => {
  it("include punteggio e giudizio", () => {
    const out = generateTxtContent(sampleResult);
    expect(out).toContain("PUNTEGGIO: 75/100");
    expect(out).toContain("Buona base, ma servono keyword.");
  });

  it("elenca punti di forza numerati", () => {
    const out = generateTxtContent(sampleResult);
    expect(out).toContain("1. Contatti rilevati");
    expect(out).toContain("2. Sezione esperienza presente");
  });

  it("elenca miglioramenti con impatto", () => {
    const out = generateTxtContent(sampleResult);
    expect(out).toContain("[ALTO] Profilo: Scrivi un profilo iniziale.");
  });

  it("include la revisione completa", () => {
    const out = generateTxtContent(sampleResult);
    expect(out).toContain("REVISIONE COMPLETA");
    expect(out).toContain("Rendi leggibili le sezioni.");
  });

  it("gestisce liste vuote senza errori", () => {
    const out = generateTxtContent({ ...sampleResult, strengths: [], improvements: [] });
    expect(out).toContain("PUNTEGGIO: 75/100");
  });
});