"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const highlights = [
  { value: "91/100", label: "Score ATS medio", tone: "text-emerald-300" },
  { value: "< 2 min", label: "Per un CV ottimizzato", tone: "text-indigo-300" },
  { value: "16", label: "Template ATS-safe", tone: "text-fuchsia-300" },
];

const trustPoints = ["Gratis per iniziare", "Nessuna carta richiesta", "Export PDF incluso"];

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
    <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(232,121,249,0.18),transparent_34%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
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
            className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            {tHero.subtitle}
          </motion.p>

          {/* Due CTA principali per incominciare */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
          >
            <Link href="/register" className="btn-primary text-white px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg w-full sm:w-auto glow-border text-center">
              {tHero.ctaCreate as string}
            </Link>
            <Link href="/analyze" className="btn-secondary text-white px-6 sm:px-8 py-4 rounded-full font-medium text-base sm:text-lg w-full sm:w-auto text-center bg-white/5 backdrop-blur">
              {tHero.ctaAnalyze as string}
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 text-xs sm:text-sm text-zinc-300"
          >
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.form
            onSubmit={handleAnalyze}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="glass-card rounded-2xl p-3 mb-8 border border-white/10 max-w-4xl mx-auto text-left"
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
        </div>

        {/* Striscia compatta di prova sociale — l'esempio reale completo è nella sezione demo qui sotto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl px-4 sm:px-6 py-5 glow-border border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.12 }}
                >
                  <p className={`text-2xl sm:text-3xl font-bold ${item.tone}`}>{item.value}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-zinc-500 text-xs mt-4">
              {tHero.jobMatchTitle as string} · <Link href="#demo-reale" className="text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-4">guarda l&apos;esempio reale qui sotto</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
