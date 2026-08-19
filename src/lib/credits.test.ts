import { describe, it, expect, vi, beforeEach } from "vitest";

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
    chain.update = (updates: Record<string, unknown>) => {
      // Simula l'update condizionale: applica il decremento se credits > 0.
      const current = chain.data as { credits?: number } | null;
      if (current && typeof current.credits === "number" && current.credits > 0) {
        chain.data = { ...current, ...updates };
      } else {
        chain.data = null;
      }
      return chain;
    };
    chain.eq = () => chain;
    chain.gte = () => chain;
    chain.single = async () => ({ data: chain.data, error: chain.error });
    return chain;
  }

  const supabaseMock = {
    from: vi.fn((table: string) => chainFor(table)),
  };

  return { enqueue, resetDb, supabaseMock };
});

vi.mock("@/lib/supabase/client", () => ({ supabase: supabaseMock }));

import { getCreditsInfo, consumeCredit, SIGNUP_CREDITS } from "@/lib/credits";

beforeEach(() => {
  resetDb();
  vi.clearAllMocks();
});

describe("SIGNUP_CREDITS", () => {
  it("assegna 5 crediti gratuiti alla registrazione", () => {
    expect(SIGNUP_CREDITS).toBe(5);
  });
});

describe("getCreditsInfo", () => {
  it("restituisce crediti e piano dell'utente", async () => {
    enqueue("users", { data: { credits: 3, plan: "starter" } });

    const info = await getCreditsInfo("u1");

    expect(info).toEqual({ credits: 3, plan: "starter" });
  });

  it("restituisce crediti anche per i piani premium", async () => {
    enqueue("users", { data: { credits: 500, plan: "pro" } });

    const info = await getCreditsInfo("u1");

    expect(info).toEqual({ credits: 500, plan: "pro" });
  });

  it("default a 0 crediti se il campo manca", async () => {
    enqueue("users", { data: { plan: null } });

    const info = await getCreditsInfo("u1");

    expect(info.credits).toBe(0);
    expect(info.plan).toBeNull();
  });
});

describe("consumeCredit", () => {
  it("decrementa i crediti quando disponibili", async () => {
    // consumeCredit legge i crediti (getCreditsInfo) e poi aggiorna in modo
    // condizionale: serve una risposta per ciascuna query su "users".
    enqueue("users", { data: { credits: 3, plan: "starter" } });
    enqueue("users", { data: { credits: 3, plan: "starter" } });

    const res = await consumeCredit("u1");

    expect(res).toEqual({ ok: true, credits: 2 });
    expect(supabaseMock.from).toHaveBeenCalledWith("users");
  });

  it("decrementa i crediti anche per i piani premium", async () => {
    enqueue("users", { data: { credits: 500, plan: "pro" } });
    enqueue("users", { data: { credits: 500, plan: "pro" } });

    const res = await consumeCredit("u1");

    expect(res).toEqual({ ok: true, credits: 499 });
  });

  it("fallisce se i crediti sono esauriti", async () => {
    enqueue("users", { data: { credits: 0, plan: "pro" } });
    enqueue("users", { data: { credits: 0, plan: "pro" } });

    const res = await consumeCredit("u1");

    expect(res).toEqual({ ok: false, credits: 0 });
  });

  it("fallisce se l'update condizionale non tocca righe (race)", async () => {
    enqueue("users", { data: { credits: 1, plan: "pro" } });
    enqueue("users", { data: null });

    const res = await consumeCredit("u1");

    expect(res).toEqual({ ok: false, credits: 0 });
  });
});
