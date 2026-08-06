"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function SuccessPage() {
  const { t } = useLanguage();
  const tSuccess = t.success as Record<string, string>;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        router.push("/pricing");
        return;
      }

      try {
        setSession({ id: sessionId });
      } catch (error) {
        console.error("Errore verifica sessione:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="flex items-center justify-center min-h-screen px-6">
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
            {tSuccess.subtitle}
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
