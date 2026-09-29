"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Paperclip, ArrowUp, ChevronDown, X, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cvTemplates } from "@/lib/templates/cvTemplates";

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
  const [composerText, setComposerText] = useState("");
  const [composerMode, setComposerMode] = useState<"analyze" | "generate" | "interview">("analyze");
  const [composerTemplate, setComposerTemplate] = useState("moderno");
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number }>>([]);

  const handleAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (files.length === 0) return;
    setAttachedFiles((prev) =>
      [...prev, ...files.map((f) => ({ name: f.name, size: f.size }))].slice(0, 3)
    );
    event.target.value = "";
  };

  const removeAttached = (name: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleComposerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = composerText.trim();
    if (!text && attachedFiles.length === 0) return;

    try {
      if (text) {
        sessionStorage.setItem("curriculuxe:composerText", text);
        sessionStorage.setItem("curriculuxe:jobDescription", text);
        sessionStorage.setItem("curriculuxe:interviewRole", text);
      }
      sessionStorage.setItem("curriculuxe:template", composerTemplate);
      sessionStorage.setItem("curriculuxe:attachedFiles", JSON.stringify(attachedFiles.map((f) => f.name)));
    } catch {
      // storage non disponibile: si prosegue senza prefill
    }

    if (composerMode === "generate") router.push("/dashboard/create?mode=ai");
    else if (composerMode === "interview") router.push("/dashboard/interview");
    else router.push("/analyze");
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
            onSubmit={handleComposerSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="glass-card rounded-3xl p-3 sm:p-4 mb-8 border border-white/10 max-w-4xl mx-auto text-left shadow-2xl shadow-black/40"
          >
            <textarea
              value={composerText}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComposerText(event.target.value)}
              placeholder={tHero.composerPlaceholder as string}
              rows={3}
              className="w-full min-h-28 rounded-2xl bg-black/25 border border-transparent px-4 py-3 text-left text-white placeholder:text-zinc-500 outline-none focus:border-indigo-400/60 resize-none text-sm sm:text-base"
            />

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1 pt-2">
                {attachedFiles.map((file) => (
                  <span
                    key={file.name}
                    className="inline-flex items-center gap-1.5 max-w-full rounded-full bg-indigo-500/15 border border-indigo-500/30 pl-2.5 pr-1.5 py-1 text-xs text-indigo-200"
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[160px] sm:max-w-[220px]">{file.name}</span>
                    <span className="text-indigo-300/70">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                    <button
                      type="button"
                      onClick={() => removeAttached(file.name)}
                      aria-label={`Rimuovi ${file.name}`}
                      className="rounded-full p-0.5 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 px-1 pt-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/25 transition-all"
              >
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline">{tHero.composerAttach as string}</span>
              </button>

              <div className="relative">
                <select
                  value={composerMode}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setComposerMode(event.target.value as "analyze" | "generate" | "interview")
                  }
                  aria-label={tHero.composerMode as string}
                  className="appearance-none rounded-full bg-white/5 border border-white/10 pl-3 pr-8 py-2 text-xs font-medium text-zinc-200 outline-none focus:border-indigo-400/60 cursor-pointer"
                >
                  <option value="analyze" className="bg-zinc-900">{tHero.composerModeAnalyze as string}</option>
                  <option value="generate" className="bg-zinc-900">{tHero.composerModeGenerate as string}</option>
                  <option value="interview" className="bg-zinc-900">{tHero.composerModeInterview as string}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={composerTemplate}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setComposerTemplate(event.target.value)}
                  aria-label={tHero.composerTemplate as string}
                  className="appearance-none rounded-full bg-white/5 border border-white/10 pl-3 pr-8 py-2 text-xs font-medium text-zinc-200 outline-none focus:border-indigo-400/60 cursor-pointer max-w-[140px] sm:max-w-none"
                >
                  {cvTemplates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id} className="bg-zinc-900">
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex-1" />

              <button
                type="submit"
                disabled={!composerText.trim() && attachedFiles.length === 0}
                aria-label={tHero.composerSend as string}
                className="flex items-center justify-center w-10 h-10 rounded-full btn-primary text-white glow-border transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              multiple
              className="hidden"
              onChange={handleAttach}
            />
            {attachedFiles.length > 0 && (
              <p className="text-zinc-500 text-xs text-left mt-2 px-1">
                {tHero.composerAttachedNote as string}
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
