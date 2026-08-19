"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function FeedbackPage() {
  const { t } = useLanguage();
  const tFeedback = t.feedback as Record<string, string>;
  const [formData, setFormData] = useState<{ type: string; message: string }>({ type: "feature", message: "" });
  const [status, setStatus] = useState<string>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore durante l'invio");
      }

      setStatus("success");
      setFormData({ type: "feature", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-35" />
      <div className="relative z-10 pt-28 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2">{tFeedback.title}</h1>
            <p className="text-zinc-400 mb-8">
              {tFeedback.subtitle}
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">{tFeedback.success}</h3>
                <p className="text-zinc-400 mb-6">{tFeedback.successDesc}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-secondary px-6 py-2 rounded-full text-sm font-semibold"
                >
                  {tFeedback.sendAnother}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {tFeedback.type}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="feature">{tFeedback.feature}</option>
                    <option value="bug">{tFeedback.bug}</option>
                    <option value="generic">{tFeedback.general}</option>
                    <option value="other">{tFeedback.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {tFeedback.message}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={tFeedback.messagePlaceholder as string}
                    className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !formData.message.trim()}
                  className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? tFeedback.sending : tFeedback.submit}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
