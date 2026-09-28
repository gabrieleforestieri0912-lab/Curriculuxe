import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const AI_API_URL = "https://api.xkiro.com/v1/chat/completions";

let fetchSpy: ReturnType<typeof vi.spyOn> | null = null;

function mockFetchImpl(impl: () => Promise<unknown>) {
  fetchSpy?.mockRestore();
  fetchSpy = vi.spyOn(global, "fetch").mockImplementation(impl as typeof global.fetch);
  return fetchSpy;
}

function mockAIJson(payload: unknown) {
  return mockFetchImpl(async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
  }));
}

function mockAIRaw(content: string) {
  return mockFetchImpl(async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  }));
}

function mockAIFailure() {
  return mockFetchImpl(async () => {
    throw new Error("ECONNREFUSED");
  });
}

function mockAIHttpError(status = 429) {
  return mockFetchImpl(async () => ({ ok: false, status }));
}

import {
  getInterviewFeedback,
  rewriteBulletWithAI,
  generateSummaryWithAI,
  generateCVWithAI,
  analyzeCVWithAI,
} from "@/lib/ai";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("AI_API_KEY", "sk-xt-test");
});

afterEach(() => {
  fetchSpy?.mockRestore();
  fetchSpy = null;
  vi.unstubAllEnvs();
});

describe("getInterviewFeedback", () => {
  it("restituisce il feedback parsato quando il provider risponde con JSON valido", async () => {
    mockAIJson({
      score: 8,
      strengths: ["Chiaro", "Concreto"],
      improvements: ["Manca contesto"],
      starSuggestion: "Usa STAR",
      improvedAnswer: "Risposta migliorata",
    });

    const res = await getInterviewFeedback("Parlami di te", "Ho lavorato su X", "Frontend Developer");

    expect(res).toEqual({
      score: 8,
      strengths: ["Chiaro", "Concreto"],
      improvements: ["Manca contesto"],
      starSuggestion: "Usa STAR",
      improvedAnswer: "Risposta migliorata",
    });

    const [url, init] = fetchSpy!.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(AI_API_URL);
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer sk-xt-test");
    const body = JSON.parse(String(init.body));
    expect(body.model).toBeTruthy();
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages[0].content).toContain("Parlami di te");
  });

  it("restituisce null quando AI_API_KEY non è configurata", async () => {
    vi.stubEnv("AI_API_KEY", "");
    const res = await getInterviewFeedback("q", "a", "role");
    expect(res).toBeNull();
    expect(fetchSpy).toBeNull();
  });

  it("restituisce null quando la rete fallisce", async () => {
    mockAIFailure();
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });

  it("restituisce null su errore HTTP del provider", async () => {
    mockAIHttpError();
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });

  it("restituisce null quando la risposta non è JSON valido", async () => {
    mockAIRaw("non è json");
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });

  it("restituisce null quando il contenuto della risposta è vuoto", async () => {
    mockAIRaw("");
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });
});

describe("rewriteBulletWithAI", () => {
  it("restituisce il bullet riscritto", async () => {
    mockAIJson({
      original: "Ho lavorato su X",
      rewritten: "Ottimizzato X riducendo i costi del 40%",
      metricsAdded: ["40%"],
      tone: "senior",
      explanation: "Aggiunta metrica",
    });

    const res = await rewriteBulletWithAI("Ho lavorato su X", "Developer", "React role");

    expect(res?.rewritten).toContain("40%");
    expect(res?.tone).toBe("senior");
  });

  it("restituisce null su errore di rete", async () => {
    mockAIFailure();
    expect(await rewriteBulletWithAI("x", "role")).toBeNull();
  });
});

describe("generateSummaryWithAI", () => {
  it("restituisce summary, headline e keyStrengths", async () => {
    mockAIJson({
      summary: "Developer con 8 anni di esperienza",
      headline: "Senior Full Stack Developer",
      keyStrengths: ["React", "Node.js"],
    });

    const res = await generateSummaryWithAI(
      [{ role: "Developer", company: "Acme" }],
      "React, Node.js",
      "Full Stack Developer",
      "professionale"
    );

    expect(res?.headline).toBe("Senior Full Stack Developer");
    expect(res?.keyStrengths).toContain("React");
  });

  it("gestisce input senza parametri", async () => {
    mockAIJson({ summary: "s", headline: "h", keyStrengths: [] });
    const res = await generateSummaryWithAI();
    expect(res?.summary).toBe("s");
  });
});

describe("generateCVWithAI", () => {
  it("restituisce il CV generato", async () => {
    mockAIJson({
      personalInfo: { name: "Mario Rossi" },
      summary: "Profilo",
      experience: [{ company: "Acme", role: "Dev", description: "Ridotti costi del 40%" }],
      education: [],
      skills: "React",
      languages: "Italiano",
      certifications: "",
    });

    const res = await generateCVWithAI("Sviluppatore full stack con 5 anni");

    expect(res?.personalInfo).toEqual({ name: "Mario Rossi" });
    expect((res?.experience as Array<{ company: string }>)[0].company).toBe("Acme");
  });

  it("restituisce null su risposta non JSON", async () => {
    mockAIRaw("non è json");
    expect(await generateCVWithAI("profilo")).toBeNull();
  });
});

describe("analyzeCVWithAI", () => {
  it("restituisce l'analisi strutturata", async () => {
    mockAIJson({
      score: 85,
      atsScore: 90,
      jobMatchScore: 80,
      overall: "Ottimo CV",
      strengths: ["Sezioni chiare"],
      improvements: [],
      atsChecks: [],
      matchedKeywords: ["react"],
      missingKeywords: ["kubernetes"],
      rewrittenBullets: [],
      review: "Bene",
    });

    const res = await analyzeCVWithAI("testo cv", "job description");
    expect(res?.score).toBe(85);
    expect(res?.missingKeywords).toContain("kubernetes");
  });

  it("tronca il testo del CV a 4000 caratteri nel prompt", async () => {
    mockAIJson({ score: 50 });
    const longText = "a".repeat(5000);

    await analyzeCVWithAI(longText);

    const [, init] = fetchSpy!.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    const prompt = body.messages[0].content as string;
    expect(prompt).not.toContain("a".repeat(5000));
    expect(prompt).toContain("a".repeat(4000));
    expect(prompt.length).toBeLessThan(6500);
  });
});
