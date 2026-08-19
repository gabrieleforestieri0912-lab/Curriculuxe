import { NextRequest, NextResponse } from "next/server";

const DEV_FALLBACK_SECRET = "curriculuxe-dev-secret-change-in-production";

/**
 * Verifica la firma HMAC-SHA256 del token utente usando Web Crypto
 * (disponibile su Edge runtime). Restituisce true se il token è valido.
 */
async function isValidToken(token: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : DEV_FALLBACK_SECRET);
  if (!secret) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    // La firma in auth.ts è calcolata sul JSON decodificato dalla base64,
    // non sulla stringa base64: decodifichiamo prima di firmare.
    const payload = atob(parts[0]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const hex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hex === parts[1];
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user");

  if (!userCookie?.value || !(await isValidToken(userCookie.value))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
