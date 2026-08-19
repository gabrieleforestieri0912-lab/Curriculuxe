"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import BackgroundVideo from "@/components/BackgroundVideo";

export default function SuccessPage() {
  const { t } = useLanguage();
  const tSuccess = t.success as Record<string, string>;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creditsUpdated, setCreditsUpdated] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (!sessionId) {
      router.push("/#pricing");
      return;
    }

    // Il webhook Stripe accredita i crediti con un piccolo ritardo:
    // attende (max ~15s) che /api/auth/me rifletta i nuovi crediti prima
    // di mostrare la conferma, così l'utente non vede "successo" a vuoto.
    const previousCredits = (() => {
      try {
        const cached = localStorage.getItem("user");
        return cached ? (JSON.parse(cached) as { credits?: number }).credits ?? 0 : 0;
      } catch {
        return 0;
      }
    })();

    const startedAt = Date.now();
    let cancelled = false;

    const pollCredits = async () => {
      if (cancelled) return;
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const credits = data.user?.credits ?? 0;
          if (credits > previousCredits) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setCreditsUpdated(true);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignora e riprova
      }

      if (Date.now() - startedAt < 15000) {
        setTimeout(pollCredits, 1500);
      } else {
        setLoading(false);
      }
    };

    pollCredits();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-x-clip">
      <BackgroundVideo />
      <div className="fixed inset-0 bg-black/35 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">{tSuccess.title}</h1>
          <p className="text-zinc-300 mb-6">
            {creditsUpdated ? tSuccess.subtitle : (tSuccess as Record<string, string>).waitingCredits || "Stiamo confermando il pagamento..."}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full py-3 rounded-full font-medium"
            >
              {tSuccess.backDashboard}
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary w-full py-3 rounded-full font-medium"
            >
              {tSuccess.backHome}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
