import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("openai", () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(
    class MockOpenAI {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ ok: true }) } }],
          }),
        },
      };
    } as unknown as (...args: any[]) => any
  ),
}));

let fetchSpy: ReturnType<typeof vi.spyOn> | null = null;

function mockFetchImpl(impl: () => Promise<unknown>) {
  fetchSpy?.mockRestore();
  fetchSpy = vi.spyOn(global, "fetch").mockImplementation(impl as typeof global.fetch);
  return fetchSpy;
}

function mockOllamaJson(payload: unknown) {
  return mockFetchImpl(async () => ({ ok: true, json: async () => ({ response: JSON.stringify(payload) }) }));
}

function mockOllamaFailure() {
  return mockFetchImpl(async () => {
    throw new Error("ECONNREFUSED");
  });
}

function mockOllamaInvalidJson() {
  return mockFetchImpl(async () => ({ ok: true, json: async () => ({ response: "non è json" }) }));
}

import {
  getInterviewFeedback,
  rewriteBulletWithAI,
  generateSummaryWithAI,
  generateCVWithAI,
  analyzeCVWithAI,
} from "@/lib/ai";

const OLLAMA_HOST = "http://127.0.0.1:11434";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.stubEnv("OLLAMA_HOST", OLLAMA_HOST);
});

afterEach(() => {
  fetchSpy?.mockRestore();
  fetchSpy = null;
  vi.unstubAllEnvs();
});

describe("getInterviewFeedback", () => {
  it("restituisce il feedback parsato quando Ollama risponde con JSON valido", async () => {
    const fetchMock = mockOllamaJson({
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
    expect(url).toBe(`${OLLAMA_HOST}/api/generate`);
    const body = JSON.parse(String(init.body));
    expect(body.stream).toBe(false);
    expect(body.model).toBeTruthy();
  });

  it("restituisce null quando Ollama non è disponibile e non c'è OpenAI key", async () => {
    mockOllamaFailure();
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });

  it("restituisce null quando la risposta non è JSON valido", async () => {
    mockOllamaInvalidJson();
    expect(await getInterviewFeedback("q", "a", "role")).toBeNull();
  });

  it("usa OpenAI come provider primario quando c'è la key", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    mockOllamaFailure();
    const res = await getInterviewFeedback("q", "a", "role");
    expect(res).toEqual({ ok: true });
  });
});

describe("rewriteBulletWithAI", () => {
  it("restituisce il bullet riscritto", async () => {
    mockOllamaJson({
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
    mockOllamaFailure();
    expect(await rewriteBulletWithAI("x", "role")).toBeNull();
  });
});

describe("generateSummaryWithAI", () => {
  it("restituisce summary, headline e keyStrengths", async () => {
    mockOllamaJson({
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
    mockOllamaJson({ summary: "s", headline: "h", keyStrengths: [] });
    const res = await generateSummaryWithAI();
    expect(res?.summary).toBe("s");
  });
});

describe("generateCVWithAI", () => {
  it("restituisce il CV generato", async () => {
    mockOllamaJson({
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
    mockOllamaInvalidJson();
    expect(await generateCVWithAI("profilo")).toBeNull();
  });
});

describe("analyzeCVWithAI", () => {
  it("restituisce l'analisi strutturata", async () => {
    mockOllamaJson({
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
    mockOllamaJson({ score: 50 });
    const longText = "a".repeat(5000);

    await analyzeCVWithAI(longText);

    const [, init] = fetchSpy!.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.prompt).not.toContain("a".repeat(5000));
    expect(body.prompt).toContain("a".repeat(4000));
    expect(body.prompt.length).toBeLessThan(6500);
  });
});
