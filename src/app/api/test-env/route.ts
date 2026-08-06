import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasPublicUrl: !!process.env.NEXT_PUBLIC_URL,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) : "undefined",
    publicUrl: process.env.NEXT_PUBLIC_URL || "undefined",
  });
}
