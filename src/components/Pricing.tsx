"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, X, HeadphonesIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const { t } = useLanguage();
  const tPricing = t.pricing as Record<string, unknown>;

  const tPlans = tPricing.plans as Array<Record<string, unknown>>;
  const planAt = (i: number) => tPlans?.[i] || {};

  const plans = [
    {
      monthlyPrice: 0,
      yearlyPrice: 0,
      name: (planAt(0).name as string) || "Free",
      description: (planAt(0).desc as string) || "",
      features: planAt(0).features || [],
      missing: ((planAt(3).features as string[]) || [])?.filter((f: string) => !((planAt(0).features as string[]) || [])?.includes(f))?.slice(0, 3) || [],
      buttonText: (planAt(0).cta as string) || "",
      badge: null,
      savings: null,
      popular: false,
      planId: "free",
    },
    {
      monthlyPrice: 4.99,
      yearlyPrice: 3.99,
      name: (planAt(1).name as string) || "Starter",
      description: (planAt(1).desc as string) || "",
      features: planAt(1).features || [],
      missing: [],
      buttonText: (planAt(1).cta as string) || "",
      badge: null,
      savings: `${tPricing.save as string} €12`,
      popular: false,
      planId: "starter",
    },
    {
      monthlyPrice: 6.99,
      yearlyPrice: 4.99,
      name: (planAt(2).name as string) || "Pro",
      description: (planAt(2).desc as string) || "",
      features: planAt(2).features || [],
      missing: [],
      buttonText: (planAt(2).cta as string) || "",
      badge: tPricing.popular as string,
      savings: `${tPricing.save as string} €24`,
      popular: true,
      planId: "pro",
    },
    {
      monthlyPrice: 9.99,
      yearlyPrice: 6.99,
      name: (planAt(3).name as string) || "Enterprise",
      description: (planAt(3).desc as string) || "",
      features: planAt(3).features || [],
      missing: [],
      buttonText: (planAt(3).cta as string) || "",
      badge: null,
      savings: `${tPricing.save as string} €36`,
      popular: false,
      planId: "enterprise",
    },
  ];

  const handleSubscribe = async (plan: string, planId: string) => {
    setCheckoutError(null);
    const userData = localStorage.getItem("user");

    if (planId === "free") {
      if (userData) {
        router.push("/dashboard/create");
      } else {
        router.push("/login?next=" + encodeURIComponent("/dashboard/create"));
      }
      return;
    }

    if (plan === "Enterprise") {
      window.location.href = "mailto:gabriele.forestieri0912@gmail.com?subject=Piano Enterprise Curriculuxe";
      return;
    }

    if (!userData) {
      router.push("/login?next=" + encodeURIComponent("/#pricing"));
      return;
    }

    let user: { _id?: string; id?: string; email?: string };
    try {
      user = JSON.parse(userData);
    } catch {
      router.push("/login?next=" + encodeURIComponent("/#pricing"));
      return;
    }
    if (!user?.email) {
      router.push("/login?next=" + encodeURIComponent("/#pricing"));
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          billingCycle,
          userId: user._id || user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?next=" + encodeURIComponent("/#pricing"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Errore durante il checkout");
      }
    } catch {
      setCheckoutError("Errore durante il checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {tPricing.title as string} <span className="text-gradient text-magenta-glow-strong">{tPricing.titleHighlight as string}</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
            {tPricing.subtitle as string}
          </p>

          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tPricing.monthly as string}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tPricing.yearly as string}
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                -35%
              </span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {checkoutError && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-2xl mx-auto mb-8 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              <span>{checkoutError}</span>
              <button
                onClick={() => setCheckoutError(null)}
                aria-label="Chiudi errore"
                className="rounded-lg p-1 hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, i) => {
            const raw =
              plan.monthlyPrice === 0
                ? null
                : billingCycle === "yearly"
                ? plan.yearlyPrice
                : plan.monthlyPrice;

            const [euros, cents] = raw !== null ? String(raw).split(".") : [null, null];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                className={`glass-card rounded-2xl p-8 relative flex flex-col h-full transition-colors duration-300 ${
                  plan.popular
                    ? "border-fuchsia-500/30 glow-magenta ring-2 ring-fuchsia-500/20 hover:border-fuchsia-400/60"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-fuchsia-500/25">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`text-sm font-bold mb-3 uppercase tracking-widest ${plan.popular ? "text-fuchsia-400" : "text-zinc-500"}`}>
                  {plan.name}
                </div>

                <div className="mb-1 flex items-end gap-1">
                  {raw === null ? (
                    <span className="text-5xl font-extrabold text-white leading-none">€0</span>
                  ) : (
                    <>
                      <span className="text-5xl font-extrabold text-white leading-none">€{euros}</span>
                      <span className="text-2xl font-bold text-white/70 mb-1">,{cents || "99"}</span>
                    </>
                  )}
                  {raw !== null && (
                    <span className="text-zinc-500 text-sm mb-1">/ mese</span>
                  )}
                </div>

                {billingCycle === "yearly" && plan.savings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-emerald-400 text-xs font-semibold mb-1"
                  >
                    {plan.savings}
                  </motion.div>
                )}

                {billingCycle === "yearly" && plan.monthlyPrice > 0 && (
                  <div className="text-zinc-600 text-sm line-through mb-2">
                    invece di €{plan.monthlyPrice.toFixed(2).replace(".", ",")}/mese
                  </div>
                )}

                <p className="text-zinc-400 text-sm mb-6">{plan.description as string}</p>

                <div className="border-t border-white/10 mb-6" aria-hidden="true" />

                <ul className="space-y-3 flex-1">
                  {(plan.features as string[]).map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {(plan.missing as string[]).map((feature, j) => (
                    <li key={`missing-${j}`} className="flex items-start gap-3 text-zinc-600 text-sm line-through">
                      <svg className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.name, plan.planId)}
                  disabled={loading === plan.planId}
                  className={`w-full py-3.5 rounded-full text-white font-bold transition-all disabled:opacity-50 text-sm mt-6 ${
                    plan.popular
                      ? "btn-primary glow-border"
                      : plan.monthlyPrice === 0
                      ? "btn-secondary"
                      : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                  }`}
                >
                  {loading === plan.planId ? "Caricamento..." : plan.buttonText as string}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-6">
            {[Shield, Zap, X, HeadphonesIcon].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-500 text-sm">
                <Icon className="w-4 h-4 text-zinc-500" />
                <span>{(tPricing.trust as string[])?.[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-600 text-xs">
            Tutti i prezzi sono IVA esclusa. Fattura emessa per ogni pagamento.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
