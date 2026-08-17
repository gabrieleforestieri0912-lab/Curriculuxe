"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/lib/i18n";

export default function SettingsPage() {
  const { t, lang, changeLanguage } = useLanguage();
  const tNav = (t as Record<string, Record<string, string>>).nav;
  const tSettings = t.settings as Record<string, string>;
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    }
  }, [router]);

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="gradient-bg-animated relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-35" />
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Curriculuxe</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white px-4 py-2">
            {tNav.backDashboard}
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-8"
          >
            {tSettings.title}
          </motion.h1>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200"
            >
              {tSettings.saved}
            </motion.div>
          )}

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.language}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.languageDesc}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(languages as Record<string, { label: string; flag: string }>).map(([code, l]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      lang === code
                        ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                        : "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === code && (
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.account}</h2>
              <p className="text-sm text-zinc-400">{tSettings.accountDesc}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
