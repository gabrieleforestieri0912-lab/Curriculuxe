import { describe, it, expect, beforeAll } from "vitest";

type AuthModule = typeof import("@/lib/auth");

let auth: AuthModule;

// auth.ts crea il client Supabase a livello di modulo, quindi serve
// impostare env fittizi PRIMA dell'import dinamico.
beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.JWT_SECRET = "test-secret-for-tests";
  auth = await import("@/lib/auth");
});

describe("signUserToken / verifyUserToken", () => {
  it("genera un token verificabile con gli stessi dati", () => {
    const token = auth.signUserToken({ id: "123", email: "a@b.it", name: "Mario" });
    expect(typeof token).toBe("string");
    expect(auth.verifyUserToken(token)).toEqual({ id: "123", email: "a@b.it", name: "Mario" });
  });

  it("restituisce null per token manomessi", () => {
    const token = auth.signUserToken({ id: "1" });
    const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    expect(auth.verifyUserToken(tampered)).toBeNull();
  });

  it("restituisce null per token con formato errato", () => {
    expect(auth.verifyUserToken("not-a-valid-token")).toBeNull();
    expect(auth.verifyUserToken("")).toBeNull();
    expect(auth.verifyUserToken("aaaa.bbbb.cccc")).toBeNull();
  });

  it("token validi firmati anche con secret di default", () => {
    const token = auth.signUserToken({ id: "x" });
    expect(auth.verifyUserToken(token)).toEqual({ id: "x" });
  });
});