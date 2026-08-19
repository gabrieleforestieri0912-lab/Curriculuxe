import type { NextRequest } from "next/server";
import { verifyUserToken } from "@/lib/auth";

export interface AuthedUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Legge il cookie httpOnly `user` dalla request e ne verifica la firma.
 * Restituisce null se il cookie manca o il token non è valido.
 * Da usare nelle API routes per autenticazione e ownership check.
 */
export function getRequestUser(request: NextRequest): AuthedUser | null {
  const cookie = request.cookies.get("user");
  if (!cookie?.value) return null;

  const user = verifyUserToken(cookie.value);
  if (!user || !user.id) return null;

  return {
    id: String(user.id),
    email: user.email ? String(user.email) : undefined,
    name: user.name ? String(user.name) : undefined,
    picture: user.picture ? String(user.picture) : undefined,
  };
}
