"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, X, HeadphonesIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const { t } = useLanguage();
  const tPricing = t.pricing as Record<string, unknown>;

  const plans = [
    {
      monthlyPrice: 0,
      yearlyPrice: 0,
      name: ((tPricing.plans as Array<Record<string, unknown>>)?.[0]?.name as string) || "Free",
      description: ((tPricing.plans as Array<Record<string, unknown>>)?.[0]?.desc as string) || "",
      features: (tPricing.plans as Array<Record<string, unknown>>)?.[0]?.features || [],
      missing: ((tPricing.plans as Array<Record<string, unknown>>)?.[2]?.features as string[])?.filter((f: string) => !((tPricing.plans as Array<Record<string, unknown>>)?.[0]?.features as string[])?.includes(f))?.slice(0, 3) || [],
      buttonText: ((tPricing.plans as Array<Record<string, unknown>>)?.[0]?.cta as string) || "",
      badge: null,
      savings: null,
      popular: false,
      planId: "free",
    },
    {
      monthlyPrice: 8.99,
      yearlyPrice: 5.99,
      name: ((tPricing.plans as Array<Record<string, unknown>>)?.[1]?.name as string) || "Pro",
      description: ((tPricing.plans as Array<Record<string, unknown>>)?.[1]?.desc as string) || "",
      features: (tPricing.plans as Array<Record<string, unknown>>)?.[1]?.features || [],
      missing: [],
      buttonText: ((tPricing.plans as Array<Record<string, unknown>>)?.[1]?.cta as string) || "",
      badge: tPricing.popular as string,
      savings: `${tPricing.save as string} €36`,
      popular: true,
      planId: "pro",
    },
    {
      monthlyPrice: 28.99,
      yearlyPrice: 18.99,
      name: ((tPricing.plans as Array<Record<string, unknown>>)?.[2]?.name as string) || "Enterprise",
      description: ((tPricing.plans as Array<Record<string, unknown>>)?.[2]?.desc as string) || "",
      features: (tPricing.plans as Array<Record<string, unknown>>)?.[2]?.features || [],
      missing: [],
      buttonText: ((tPricing.plans as Array<Record<string, unknown>>)?.[2]?.cta as string) || "",
      badge: null,
      savings: `${tPricing.save as string} €120`,
      popular: false,
      planId: "enterprise",
    },
  ];

  const handleSubscribe = async (plan: string, planId: string) => {
    const userData = localStorage.getItem("user");

    if (planId === "free") {
      if (userData) {
        router.push("/dashboard/create");
      } else {
        router.push("/login");
      }
      return;
    }

    const user = JSON.parse(userData!);

    if (plan === "Enterprise") {
      window.location.href = "mailto:gabriele.forestieri0912@gmail.com?subject=Piano Enterprise Applimix";
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          userId: user._id || user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Errore durante il checkout");
      }
    } catch {
      alert("Errore durante il checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-24 px-6 gradient-bg"
    >
      <div className="max-w-6xl mx-auto">
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

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
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
                whileHover={{ y: -5 }}
                className={`glass-card rounded-2xl p-8 relative flex flex-col h-full ${
                  plan.popular
                    ? "border-fuchsia-500/30 glow-magenta ring-2 ring-fuchsia-500/20 scale-[1.03]"
                    : "border-white/10"
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
                    🎉 {plan.savings}
                  </motion.div>
                )}

                {billingCycle === "yearly" && plan.monthlyPrice > 0 && (
                  <div className="text-zinc-600 text-sm line-through mb-2">
                    invece di €{plan.monthlyPrice.toFixed(2).replace(".", ",")}/mese
                  </div>
                )}

                <p className="text-zinc-400 text-sm mb-6">{plan.description as string}</p>

                <button
                  onClick={() => handleSubscribe(plan.name, plan.planId)}
                  disabled={loading === plan.planId}
                  className={`w-full py-3.5 rounded-full text-white font-bold transition-all disabled:opacity-50 text-sm mb-6 ${
                    plan.popular
                      ? "btn-primary glow-border"
                      : plan.monthlyPrice === 0
                      ? "btn-secondary"
                      : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                  }`}
                >
                  {loading === plan.planId ? "Caricamento..." : plan.buttonText as string}
                </button>

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
