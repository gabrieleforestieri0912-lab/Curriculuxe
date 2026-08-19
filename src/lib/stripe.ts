import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {
  apiVersion: "2026-03-25.dahlia",
});

export const STRIPE = stripe;
export const PRICES: Record<string, number> = {
  credits10: 999,
  starter: 499,
  pro: 900,
  enterprise: 2900,
};

/** Prezzi annuali (in centesimi) per i piani in abbonamento. */
export const YEARLY_PRICES: Record<string, number> = {
  starter: 399,
  pro: 599,
  enterprise: 1899,
};

/** Crediti AI erogati ogni mese/anno per ogni piano in abbonamento. */
export const CREDITS_PER_PLAN: Record<string, number> = {
  starter: 50,
  pro: 500,
  enterprise: 2000,
};

/** Crediti AI inclusi in un pagamento one-time. */
export const CREDITS_PER_PACK: Record<string, number> = {
  credits10: 10,
};

export async function createPaymentIntent(amount: number, userId: string, userEmail: string, plan: string) {
  try {
    console.log("Creating payment intent with:", { amount, userId, userEmail, plan });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      receipt_email: userEmail,
      metadata: {
        userId: String(userId),
        plan,
      },
    });
    console.log("Payment intent created:", paymentIntent.id);
    return paymentIntent;
  } catch (error: any) {
    console.error("Stripe PaymentIntent error:", error.message, error.type);
    throw error;
  }
}

export async function createCheckoutSession(amount: number, userId: string, userEmail: string, plan: string) {
  try {
    console.log("Creating checkout session with:", { amount, userId, userEmail, plan });
    console.log("NEXT_PUBLIC_URL:", process.env.NEXT_PUBLIC_URL);
    
    if (!process.env.NEXT_PUBLIC_URL) {
      throw new Error("NEXT_PUBLIC_URL is not defined");
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: plan === "enterprise" ? "Curriculuxe Enterprise" : plan === "credits10" ? "Ricarica 10 Crediti AI" : "Curriculuxe Pro",
              description: plan === "credits10" ? "Crediti per analisi AI complete e generazione di cover letter" : "Accesso Premium a Curriculuxe",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: plan === "credits10" ? `${process.env.NEXT_PUBLIC_URL}/dashboard?checkout_success=true` : `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: plan === "credits10" ? `${process.env.NEXT_PUBLIC_URL}/dashboard` : `${process.env.NEXT_PUBLIC_URL}/#pricing`,
      customer_email: userEmail,
      metadata: {
        userId: String(userId),
        plan,
      },
    });
    
    console.log("Checkout session created:", session.id, session.url);
    return session;
  } catch (error: any) {
    console.error("Stripe Checkout Session error:", error.message, error.type, error.statusCode);
    throw error;
  }
}

/**
 * Crea una sessione Checkout in abbonamento ricorrente (es. piano Starter
 * con crediti AI che si rinnovano ogni mese/anno).
 */
export async function createSubscriptionCheckout(
  amount: number,
  userId: string,
  userEmail: string,
  plan: string,
  interval: "month" | "year"
) {
  try {
    console.log("Creating subscription checkout with:", { amount, userId, userEmail, plan, interval });

    if (!process.env.NEXT_PUBLIC_URL) {
      throw new Error("NEXT_PUBLIC_URL is not defined");
    }

    const credits = CREDITS_PER_PLAN[plan] ?? 50;
    const planLabel =
      plan === "enterprise" ? "Enterprise" : plan === "pro" ? "Pro" : "Starter";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            recurring: { interval },
            product_data: {
              name: `Curriculuxe ${planLabel}`,
              description: `${credits} crediti AI al ${interval === "year" ? "anno" : "mese"} - si rinnovano automaticamente`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
      customer_email: userEmail,
      metadata: {
        userId: String(userId),
        plan,
      },
    });

    console.log("Subscription checkout session created:", session.id, session.url);
    return session;
  } catch (error: any) {
    console.error("Stripe Subscription Checkout error:", error.message, error.type, error.statusCode);
    throw error;
  }
}
