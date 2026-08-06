import { NextResponse } from "next/server";
import { findOrCreateGoogleUser, signUserToken } from "@/lib/auth";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=auth_denied", request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId ?? "",
        client_secret: clientSecret ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(
        new URL("/login?error=token_failed", request.url),
      );
    }

    const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    const googleUser = {
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split("@")[0],
      picture: userInfo.picture,
      googleId: userInfo.id,
    };

    const user = await findOrCreateGoogleUser(googleUser);

    const token = signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url),
    );
  }
}
