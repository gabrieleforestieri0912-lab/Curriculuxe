import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("stripe", () => {
  class MockStripe {
    paymentIntents = { create: vi.fn() };
    checkout = { sessions: { create: vi.fn() } };
  }
  return { __esModule: true, default: MockStripe };
});

import { STRIPE, PRICES, createPaymentIntent, createCheckoutSession, createSubscriptionCheckout } from "@/lib/stripe";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_URL", "http://localhost:3000");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("PRICES", () => {
  it("espone i piani con i prezzi in centesimi", () => {
    expect(PRICES).toEqual({ credits10: 999, starter: 499, pro: 900, enterprise: 2900 });
  });
});

describe("createPaymentIntent", () => {
  it("crea un payment intent in EUR con metadata utente", async () => {
    vi.mocked(STRIPE.paymentIntents.create).mockResolvedValue({ id: "pi_123" } as never);

    await createPaymentIntent(999, "u1", "a@b.it", "credits10");

    expect(STRIPE.paymentIntents.create).toHaveBeenCalledWith({
      amount: 999,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      receipt_email: "a@b.it",
      metadata: { userId: "u1", plan: "credits10" },
    });
  });

  it("propaga gli errori di Stripe", async () => {
    vi.mocked(STRIPE.paymentIntents.create).mockRejectedValue(new Error("card declined"));

    await expect(createPaymentIntent(999, "u1", "a@b.it", "credits10")).rejects.toThrow("card declined");
  });
});

describe("createCheckoutSession", () => {
  it("crea una sessione checkout con success_url corretto per credits10", async () => {
    vi.mocked(STRIPE.checkout.sessions.create).mockResolvedValue({ id: "cs_1", url: "https://checkout.stripe.com/x" } as never);

    const session = await createCheckoutSession(999, "u1", "a@b.it", "credits10");

    expect(session.url).toContain("checkout.stripe.com");
    const call = vi.mocked(STRIPE.checkout.sessions.create).mock.calls[0][0] as {
      success_url: string;
      metadata: { userId: string; plan: string };
      line_items: Array<{ price_data: { unit_amount: number } }>;
    };
    expect(call.success_url).toContain("/dashboard?checkout_success=true");
    expect(call.metadata).toEqual({ userId: "u1", plan: "credits10" });
    expect(call.line_items[0].price_data.unit_amount).toBe(999);
  });

  it("lancia errore se NEXT_PUBLIC_URL non è definito", async () => {
    vi.stubEnv("NEXT_PUBLIC_URL", "");

    await expect(createCheckoutSession(999, "u1", "a@b.it", "credits10")).rejects.toThrow("NEXT_PUBLIC_URL is not defined");
    expect(STRIPE.checkout.sessions.create).not.toHaveBeenCalled();
  });
});

describe("createSubscriptionCheckout", () => {
  it("crea una sessione in abbonamento ricorrente mensile per starter", async () => {
    vi.mocked(STRIPE.checkout.sessions.create).mockResolvedValue({ id: "cs_sub", url: "https://checkout.stripe.com/x" } as never);

    const session = await createSubscriptionCheckout(499, "u1", "a@b.it", "starter", "month");

    expect(session.url).toContain("checkout.stripe.com");
    const call = vi.mocked(STRIPE.checkout.sessions.create).mock.calls[0][0] as {
      mode: string;
      metadata: { userId: string; plan: string };
      line_items: Array<{ price_data: { unit_amount: number; recurring: { interval: string } } }>;
    };
    expect(call.mode).toBe("subscription");
    expect(call.metadata).toEqual({ userId: "u1", plan: "starter" });
    expect(call.line_items[0].price_data.unit_amount).toBe(499);
    expect(call.line_items[0].price_data.recurring.interval).toBe("month");
  });

  it("crea una sessione in abbonamento annuale quando richiesto", async () => {
    vi.mocked(STRIPE.checkout.sessions.create).mockResolvedValue({ id: "cs_sub", url: "https://checkout.stripe.com/x" } as never);

    await createSubscriptionCheckout(399, "u1", "a@b.it", "starter", "year");

    const call = vi.mocked(STRIPE.checkout.sessions.create).mock.calls[0][0] as {
      line_items: Array<{ price_data: { unit_amount: number; recurring: { interval: string } } }>;
    };
    expect(call.line_items[0].price_data.unit_amount).toBe(399);
    expect(call.line_items[0].price_data.recurring.interval).toBe("year");
  });

  it("lancia errore se NEXT_PUBLIC_URL non è definito", async () => {
    vi.stubEnv("NEXT_PUBLIC_URL", "");

    await expect(createSubscriptionCheckout(499, "u1", "a@b.it", "starter", "month")).rejects.toThrow("NEXT_PUBLIC_URL is not defined");
    expect(STRIPE.checkout.sessions.create).not.toHaveBeenCalled();
  });
});
