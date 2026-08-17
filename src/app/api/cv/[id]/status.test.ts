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

import { PUT, GET } from "@/app/api/cv/[id]/status/route";
import { signUserToken } from "@/lib/auth";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-status-route";
});

beforeEach(() => {
  resetDb();
  vi.clearAllMocks();
});

describe("PUT /api/cv/[id]/status", () => {
  it("restituisce 400 per uno status non valido", async () => {
    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "inesistente" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });

    expect(res.status).toBe(400);
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("aggiorna lo status e lo storico senza cookie utente", async () => {
    enqueue("cvs", { data: { statusHistory: [] } });

    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "sent", notes: "Inviato via LinkedIn" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cv1" }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.status).toBe("sent");
    expect(json.statusEntry.notes).toBe("Inviato via LinkedIn");
    expect(supabaseMock.from).toHaveBeenCalledWith("cvs");
  });

  it("incrementa il contatore utente quando il cookie è valido", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", { data: { statusHistory: [{ status: "draft", notes: "", changedAt: new Date() }] } });
    enqueue("users", { data: { appStatus_sent: 0 } });

    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "sent" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cv1" }) });

    expect(res.status).toBe(200);
    const userCalls = supabaseMock.from.mock.calls.filter((c) => c[0] === "users");
    expect(userCalls.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /api/cv/[id]/status", () => {
  it("restituisce 404 se il CV non esiste", async () => {
    enqueue("cvs", { error: new Error("not found") });

    const res = await GET(new Request("http://localhost/api/cv/1/status"), {
      params: Promise.resolve({ id: "x" }),
    });

    expect(res.status).toBe(404);
  });

  it("restituisce lo stato corrente del CV", async () => {
    enqueue("cvs", {
      data: { applicationStatus: "interview", statusHistory: [], fileName: "cv.pdf", template: "ats" },
    });

    const res = await GET(new Request("http://localhost/api/cv/1/status"), {
      params: Promise.resolve({ id: "x" }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.applicationStatus).toBe("interview");
  });
});
