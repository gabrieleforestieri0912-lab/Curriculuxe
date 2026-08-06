import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { STRIPE } from "@/lib/stripe";
import { supabase } from "@/lib/supabase/client";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: { type: string; data: { object: Record<string, unknown> } };

  try {
    event = STRIPE.webhooks.constructEvent(body, signature || "", endpointSecret) as unknown as { type: string; data: { object: Record<string, unknown> } };
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Record<string, unknown>;
      const metadata = session.metadata as Record<string, unknown> | undefined;
      const userId = metadata?.userId as string | undefined;
      const plan = metadata?.plan as string | undefined;

      if (userId) {
        const updateData: Record<string, unknown> = {
          stripeCustomerId: session.customer,
          [`paidPlan_${plan}`]: true,
          [`paidAt_${plan}`]: new Date(),
        };

        if (plan === "pro") {
          updateData.plan = "pro";
        } else if (plan === "enterprise") {
          updateData.plan = "enterprise";
        } else if (plan === "credits10") {
          const { data: currentUser } = await supabase
            .from("users")
            .select("credits")
            .eq("id", userId)
            .single();

          updateData.credits = ((currentUser as Record<string, unknown>)?.credits as number || 0) + 10;
        }

        await supabase
          .from("users")
          .update(updateData)
          .eq("id", userId);
      }

      await supabase
        .from("payments")
        .insert({
          userId,
          plan,
          amount: session.amount_total,
          currency: session.currency,
          stripeSessionId: session.id,
          status: "completed",
          createdAt: new Date(),
        });
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Record<string, unknown>;
      await supabase
        .from("payments")
        .insert({
          stripeSessionId: session.id,
          status: "expired",
          createdAt: new Date(),
        });
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Record<string, unknown>;
      await supabase
        .from("payments")
        .update({ status: "succeeded" })
        .eq("paymentIntentId", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Record<string, unknown>;
      await supabase
        .from("payments")
        .insert({
          paymentIntentId: paymentIntent.id,
          status: "failed",
          error: (paymentIntent.last_payment_error as Record<string, string>)?.message,
          createdAt: new Date(),
        });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
