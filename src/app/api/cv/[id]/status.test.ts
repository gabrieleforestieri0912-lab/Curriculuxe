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
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", { data: { statusHistory: [], userId: "u1" } });

    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "inesistente" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });

    expect(res.status).toBe(400);
  });

  it("restituisce 401 senza cookie utente", async () => {
    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "sent", notes: "Inviato via LinkedIn" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cv1" }) });

    expect(res.status).toBe(401);
  });

  it("aggiorna lo status e lo storico quando il cookie è valido e il CV è dell'utente", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", { data: { statusHistory: [], userId: "u1" } });
    enqueue("users", { data: { appStatus_sent: 0 } });

    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "sent", notes: "Inviato via LinkedIn" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cv1" }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.status).toBe("sent");
    expect(json.statusEntry.notes).toBe("Inviato via LinkedIn");
    expect(supabaseMock.from).toHaveBeenCalledWith("cvs");
  });

  it("restituisce 403 se il CV appartiene a un altro utente", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", { data: { statusHistory: [], userId: "altro-utente" } });

    const req = new NextRequest("http://localhost/api/cv/1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "sent" }),
      headers: { "content-type": "application/json", cookie: `user=${token}` },
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cv1" }) });

    expect(res.status).toBe(403);
  });
});

describe("GET /api/cv/[id]/status", () => {
  it("restituisce 401 senza cookie utente", async () => {
    const res = await GET(new NextRequest("http://localhost/api/cv/1/status"), {
      params: Promise.resolve({ id: "x" }),
    });

    expect(res.status).toBe(401);
  });

  it("restituisce 404 se il CV non esiste", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", { error: new Error("not found") });

    const res = await GET(
      new NextRequest("http://localhost/api/cv/1/status", { headers: { cookie: `user=${token}` } }),
      { params: Promise.resolve({ id: "x" }) }
    );

    expect(res.status).toBe(404);
  });

  it("restituisce lo stato corrente del CV", async () => {
    const token = signUserToken({ id: "u1", email: "a@b.it", name: "Mario" });
    enqueue("cvs", {
      data: { applicationStatus: "interview", statusHistory: [], fileName: "cv.pdf", template: "ats", userId: "u1" },
    });

    const res = await GET(
      new NextRequest("http://localhost/api/cv/1/status", { headers: { cookie: `user=${token}` } }),
      { params: Promise.resolve({ id: "x" }) }
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.applicationStatus).toBe("interview");
  });
});
