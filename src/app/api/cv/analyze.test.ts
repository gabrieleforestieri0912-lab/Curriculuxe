import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { enqueue, resetDb, supabaseMock } = vi.hoisted(() => {
  const tableQueues: Record<string, Array<{ data?: unknown; error?: unknown }>> = {};

  function enqueue(table: string, res: { data?: unknown; error?: unknown }) {
    (tableQueues[table] ||= []).push(res);
  }

  function resetDb() {
    for (const key of Object.keys(tableQueues)) delete tableQueues[key];
  }

  function chainFor(table: string) {
    const queue = tableQueues[table] || [];
    const res = queue.length ? queue.shift()! : { data: null, error: null };
    const chain: any = { data: res.data ?? null, error: res.error ?? null };
    chain.select = () => chain;
    chain.insert = () => chain;
    chain.update = () => chain;
    chain.eq = () => chain;
    chain.single = async () => ({ data: chain.data, error: chain.error });
    return chain;
  }

  const supabaseMock = {
    from: vi.fn((table: string) => chainFor(table)),
  };

  return { enqueue, resetDb, supabaseMock };
});

vi.mock("@/lib/supabase/client", () => ({ supabase: supabaseMock }));

const analyzeCVWithAI = vi.hoisted(() => vi.fn());
vi.mock("@/lib/ai", () => ({ analyzeCVWithAI }));

import { POST } from "@/app/api/cv/analyze/route";
import { signUserToken } from "@/lib/auth";

const GOOD_TEXT = `Mario Rossi
mario.rossi@example.com
+39 333 1234567

Profilo
Senior full stack developer con esperienza su React, TypeScript e Node.js.

Esperienza
Sviluppato dashboard, implementato API REST e ridotto i tempi del 40%.

Formazione
Laurea in Informatica.

Competenze
React, TypeScript, Node.js, Docker`;

const AI_RESULT = {
  score: 90,
  atsScore: 80,
  jobMatchScore: 70,
  overall: "Ottimo CV",
  strengths: ["Sezioni chiare"],
  improvements: [],
  atsChecks: [],
  matchedKeywords: ["react"],
  missingKeywords: [],
  rewrittenBullets: [],
  review: "Revisione",
};

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-analyze-route";
});

beforeEach(() => {
  resetDb();
  vi.clearAllMocks();
});

describe("POST /api/cv/analyze", () => {
  it("restituisce 422 se il testo è troppo corto", async () => {
    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: "Corto" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.error).toContain("abbastanza testo");
    expect(analyzeCVWithAI).not.toHaveBeenCalled();
  });

  it("usa il fallback statico quando l'utente non è loggato", async () => {
    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: GOOD_TEXT, jobDescription: "React developer" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isFallback).toBe(true);
    expect(typeof json.score).toBe("number");
    expect(json.coverLetter).toBeTruthy();
    expect(json.detectedRole).toBeTruthy();
    expect(analyzeCVWithAI).not.toHaveBeenCalled();
  });

  it("usa l'AI e decrementa i crediti quando l'utente ha crediti", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    analyzeCVWithAI.mockResolvedValue(AI_RESULT);
    enqueue("users", { data: { credits: 3 } });
    enqueue("users", { data: { credits: 3 } });
    enqueue("users", { data: { cvCount: 0, keywordCount: 0, score: 0 } });

    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: GOOD_TEXT, jobDescription: "React developer" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isFallback).toBe(false);
    expect(json.score).toBe(90);
    expect(analyzeCVWithAI).toHaveBeenCalled();
  });

  it("usa il fallback statico se l'utente non ha crediti", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("users", { data: { credits: 0 } });
    enqueue("users", { data: { cvCount: 0, keywordCount: 0, score: 0 } });

    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: GOOD_TEXT, jobDescription: "React developer" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isFallback).toBe(true);
    expect(analyzeCVWithAI).not.toHaveBeenCalled();
  });

  it("usa l'AI e consuma crediti anche per il piano pro", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    analyzeCVWithAI.mockResolvedValue(AI_RESULT);
    enqueue("users", { data: { credits: 3, plan: "pro" } });
    enqueue("users", { data: { credits: 3, plan: "pro" } });
    enqueue("users", { data: { cvCount: 0, keywordCount: 0, score: 0 } });

    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: GOOD_TEXT, jobDescription: "React developer" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isFallback).toBe(false);
    expect(json.score).toBe(90);
    expect(analyzeCVWithAI).toHaveBeenCalled();
  });

  it("usa il fallback se il piano pro ha crediti esauriti", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("users", { data: { credits: 0, plan: "pro" } });
    enqueue("users", { data: { cvCount: 0, keywordCount: 0, score: 0 } });

    const req = new NextRequest("http://localhost/api/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ text: GOOD_TEXT, jobDescription: "React developer" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.isFallback).toBe(true);
    expect(analyzeCVWithAI).not.toHaveBeenCalled();
  });
});
