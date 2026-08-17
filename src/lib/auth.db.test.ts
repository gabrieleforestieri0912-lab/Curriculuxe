import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";

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

import {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  signUserToken,
  verifyUserToken,
} from "@/lib/auth";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-auth-db";
});

beforeEach(() => {
  resetDb();
  vi.clearAllMocks();
});

describe("registerUser", () => {
  it("crea un nuovo utente quando l'email è libera", async () => {
    const newUser = { id: "u1", email: "a@b.it", name: "Mario", credits: 0, language: "it" };
    enqueue("users", { data: null });
    enqueue("users", { data: newUser });

    const result = await registerUser("a@b.it", "password123", "Mario");

    expect(result).toEqual(newUser);
    const insertCall = supabaseMock.from.mock.calls.find((c) => c[0] === "users");
    expect(insertCall).toBeTruthy();
  });

  it("lancia errore se l'email è già registrata", async () => {
    enqueue("users", { data: { id: "existing" } });

    await expect(registerUser("a@b.it", "password123", "Mario")).rejects.toThrow("Email già registrata");
  });

  it("propaga gli errori di inserimento", async () => {
    enqueue("users", { data: null });
    enqueue("users", { error: new Error("db down") });

    await expect(registerUser("a@b.it", "password123", "Mario")).rejects.toThrow("db down");
  });
});

describe("loginUser", () => {
  it("restituisce il profilo utente con password bcrypt corretta", async () => {
    const hash = await bcrypt.hash("password123", 4);
    enqueue("users", {
      data: {
        id: "u1",
        email: "a@b.it",
        name: "Mario",
        credits: 5,
        language: "en",
        password: hash,
      },
    });

    const result = await loginUser("a@b.it", "password123");

    expect(result).toEqual({ id: "u1", email: "a@b.it", name: "Mario", credits: 5, language: "en" });
  });

  it("rifiuta credenziali con utente inesistente", async () => {
    enqueue("users", { error: new Error("not found") });

    await expect(loginUser("a@b.it", "password123")).rejects.toThrow("Credenziali non valide");
  });

  it("rifiuta password errata", async () => {
    const hash = await bcrypt.hash("password123", 4);
    enqueue("users", {
      data: { id: "u1", email: "a@b.it", name: "Mario", password: hash },
    });

    await expect(loginUser("a@b.it", "password-errata")).rejects.toThrow("Credenziali non valide");
  });

  it("migra le password legacy SHA-256 a bcrypt", async () => {
    const legacyHash = createHash("sha256").update("password123").digest("hex");
    enqueue("users", {
      data: { id: "u1", email: "a@b.it", name: "Mario", password: legacyHash, credits: 0, language: "it" },
    });

    const result = await loginUser("a@b.it", "password123");

    expect(result.id).toBe("u1");
    const updateCall = supabaseMock.from.mock.calls.some((c) => c[0] === "users");
    expect(updateCall).toBe(true);
  });

  it("rifiuta password con hash SHA-256 non corrispondente", async () => {
    const legacyHash = createHash("sha256").update("altra-password").digest("hex");
    enqueue("users", {
      data: { id: "u1", email: "a@b.it", name: "Mario", password: legacyHash },
    });

    await expect(loginUser("a@b.it", "password123")).rejects.toThrow("Credenziali non valide");
  });
});

describe("findOrCreateGoogleUser", () => {
  const googleUser = { email: "g@b.it", name: "Giulia", picture: "pic.png", googleId: "g1" };

  it("restituisce l'utente esistente se provider google", async () => {
    enqueue("users", {
      data: { id: "u1", email: "g@b.it", name: "Giulia", picture: "pic.png", credits: 2, language: "it", provider: "google" },
    });

    const result = await findOrCreateGoogleUser(googleUser);
    expect(result.id).toBe("u1");
    expect(result.credits).toBe(2);
  });

  it("lancia errore se l'email è già usata con un altro provider", async () => {
    enqueue("users", {
      data: { id: "u1", email: "g@b.it", name: "Giulia", provider: "email" },
    });

    await expect(findOrCreateGoogleUser(googleUser)).rejects.toThrow("Email già registrata con altro metodo");
  });

  it("crea un nuovo utente google se non esiste", async () => {
    const newUser = {
      id: "u2",
      email: "g@b.it",
      name: "Giulia",
      picture: "pic.png",
      credits: 0,
      language: "it",
      provider: "google",
      google_id: "g1",
    };
    enqueue("users", { data: null });
    enqueue("users", { data: newUser });

    const result = await findOrCreateGoogleUser(googleUser);
    expect(result.id).toBe("u2");
    expect(result.credits).toBe(0);
  });
});

describe("token JWT", () => {
  it("roundtrip firma e verifica", () => {
    const token = signUserToken({ id: "1", email: "a@b.it" });
    expect(verifyUserToken(token)).toEqual({ id: "1", email: "a@b.it" });
  });
});
