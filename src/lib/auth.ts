import { createHmac } from "crypto";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";
import { SIGNUP_CREDITS } from "@/lib/credits";
import type { User } from "@/lib/supabase/types";

export function signUserToken(payload: Record<string, unknown>): string {
  const secret = process.env.JWT_SECRET || "curriculuxe-dev-secret-change-in-production";
  const data = JSON.stringify(payload);
  const signature = createHmac("sha256", secret).update(data).digest("hex");
  return `${Buffer.from(data).toString("base64")}.${signature}`;
}

export function verifyUserToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const data = Buffer.from(parts[0], "base64").toString("utf-8");
    const secret = process.env.JWT_SECRET || "curriculuxe-dev-secret-change-in-production";
    const expectedSig = createHmac("sha256", secret).update(data).digest("hex");
    if (parts[1] !== expectedSig) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string, name: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    throw new Error("Email già registrata");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      password: hashedPassword,
      name,
      credits: SIGNUP_CREDITS,
      language: "it",
      provider: "email",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new Error("Credenziali non valide");
  }

  const valid = await verifyPassword(password, user);
  if (!valid) {
    throw new Error("Credenziali non valide");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    credits: user.credits ?? 0,
    language: user.language || "it",
  };
}

export async function findOrCreateGoogleUser(googleUser: {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}) {
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", googleUser.email)
    .single();

  if (existing) {
    if (existing.provider !== "google") {
      throw new Error("Email già registrata con altro metodo. Usa il metodo originale.");
    }
    return {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      picture: existing.picture,
      credits: existing.credits ?? 0,
      language: existing.language || "it",
    };
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      credits: SIGNUP_CREDITS,
      language: "it",
      provider: "google",
      google_id: googleUser.googleId,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
    credits: data.credits ?? 0,
    language: data.language || "it",
  };
}

async function verifyPassword(password: string, user: User): Promise<boolean> {
  const hashedPassword = user.password;
  if (!hashedPassword) return false;

  if (hashedPassword.length === 64 && /^[a-f0-9]+$/.test(hashedPassword)) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const shaHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    if (shaHash === hashedPassword) {
      const newHash = await bcrypt.hash(password, 12);
      await supabase
        .from("users")
        .update({ password: newHash })
        .eq("id", user.id);
      return true;
    }
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
}
