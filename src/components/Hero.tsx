"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import AnimatedCounter from "@/components/AnimatedCounter";
import BackgroundVideo from "@/components/BackgroundVideo";
import { useLanguage } from "@/context/LanguageContext";

const scanSteps = [
  { label: "ATS", value: "91/100", tone: "text-emerald-300" },
  { label: "Keyword match", value: "18 trovate", tone: "text-indigo-300" },
  { label: "Bullet riscritti", value: "6 pronti", tone: "text-fuchsia-300" },
];

export default function Hero() {
  const router = useRouter();
  const { t } = useLanguage();
  const tHero = t.hero as Record<string, string>;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobText, setJobText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleAnalyze = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (jobText.trim()) {
      sessionStorage.setItem("curriculuxe:jobDescription", jobText.trim());
    }

    router.push("/analyze");
  };

  return (
    <section className="gradient-bg relative min-h-screen overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20">
      <BackgroundVideo />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(232,121,249,0.18),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.38))]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight"
          >
            {tHero.title}{" "}
            <span className="text-gradient text-magenta-glow-strong">{tHero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            {tHero.subtitle}
          </motion.p>

          <motion.form
            onSubmit={handleAnalyze}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="glass-card rounded-2xl p-3 mb-8 border border-white/10 max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <textarea
                value={jobText}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setJobText(event.target.value)}
                placeholder={tHero.jobMatchDesc as string}
                className="min-h-24 rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-left text-white placeholder:text-zinc-500 outline-none focus:border-indigo-400 resize-none"
              />
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex-1 md:flex-none text-white px-5 py-3 rounded-xl font-medium"
                >
                  {selectedFileName ? "CV" : tHero.ctaDemo as string}
                </button>
                <button type="submit" className="btn-primary flex-1 md:flex-none text-white px-6 py-3 rounded-xl font-semibold">
                  {tHero.ctaAnalyze as string}
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setSelectedFileName(file.name);
                sessionStorage.setItem("curriculuxe:selectedFileName", file.name);
                router.push("/analyze");
              }}
            />
            {selectedFileName && (
              <p className="text-zinc-500 text-xs text-left mt-2 px-1">
                File scelto: {selectedFileName}. Per motivi di sicurezza il browser richiederà di ricaricarlo nella pagina analisi.
              </p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14"
          >
            <Link href="/dashboard" className="btn-primary text-white px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg w-full sm:w-auto glow-border">
              {tHero.ctaCreate as string}
            </Link>
            <Link href="/analyze" className="btn-secondary text-white px-6 sm:px-8 py-4 rounded-full font-medium text-base sm:text-lg w-full sm:w-auto text-center">
              {tHero.ctaDemo as string}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-4 sm:p-5 glow-border border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <p className="text-white font-semibold">{tHero.jobMatchTitle as string}</p>
                <p className="text-zinc-500 text-sm">Frontend Developer · Milano</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-sm"
              >
                Live score
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-[1fr_0.72fr] gap-4">
              <div className="rounded-xl bg-white text-slate-900 p-4 sm:p-5 min-h-0 sm:min-h-80">
                <div className="border-b-2 border-slate-900 pb-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">Mario Rossi</h2>
                      <p className="text-sm text-slate-500">Frontend Developer</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">ATS-safe</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-2">Profilo</p>
                    <p className="text-sm">
                      Sviluppatore frontend con focus su React, performance e UI accessibili.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-2">Esperienza</p>
                    <motion.p
                      initial={{ backgroundColor: "rgba(16,185,129,0)" }}
                      animate={{ backgroundColor: ["rgba(16,185,129,0)", "rgba(16,185,129,0.18)", "rgba(16,185,129,0)"] }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                      className="rounded-md text-sm"
                    >
                      Ridotto il tempo di caricamento del 28% ottimizzando componenti React e bundle.
                    </motion.p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Testing", "Accessibility"].map((skill) => (
                      <span key={skill} className="rounded-full bg-indigo-50 text-indigo-700 px-2 py-1 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {scanSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.12 }}
                    className="rounded-xl bg-white/5 border border-white/10 p-4"
                  >
                    <p className="text-zinc-500 text-xs mb-1">{step.label}</p>
                    <p className={`text-xl font-bold ${step.tone}`}>{step.value}</p>
                  </motion.div>
                ))}

                <div className="rounded-xl bg-black/25 border border-white/10 p-4 sm:col-span-3 lg:col-span-1">
                  <p className="text-zinc-400 text-sm mb-3">Keyword mancanti</p>
                  <div className="flex flex-wrap gap-2">
                    {["CI/CD", "WCAG", "Vite"].map((keyword) => (
                      <span key={keyword} className="rounded-full bg-red-500/15 text-red-300 px-2 py-1 text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-3xl mx-auto mt-12 sm:mt-16"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              <AnimatedCounter value={50} suffix="K+" />
            </div>
            <div className="text-sm text-zinc-500">{tHero.statsCV as string}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              <AnimatedCounter value={94} suffix="%" />
            </div>
            <div className="text-sm text-zinc-500">{tHero.statsOptimized as string}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              <AnimatedCounter value={4.9} decimals={1} />
            </div>
            <div className="text-sm text-zinc-500">{tHero.statsRating as string}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
