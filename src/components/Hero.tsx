"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutTemplate, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { navHref } from "@/lib/seo";
import { cvTemplates } from "@/lib/templates/cvTemplates";
import CvComposer from "@/components/CvComposer";
import PillSelect from "@/components/PillSelect";

const highlights = [
  { value: "91/100", label: "Score ATS medio", tone: "text-emerald-300" },
  { value: "< 2 min", label: "Per un CV ottimizzato", tone: "text-indigo-300" },
  { value: "16", label: "Template ATS-safe", tone: "text-fuchsia-300" },
];

const trustPoints = ["Gratis per iniziare", "Nessuna carta richiesta", "Export PDF incluso"];

export default function Hero() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const tHero = t.hero as Record<string, string>;
  const [composerText, setComposerText] = useState("");
  const [composerMode, setComposerMode] = useState<"analyze" | "generate" | "interview">("analyze");
  const [composerTemplate, setComposerTemplate] = useState("moderno");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleComposerSubmit = () => {
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
      <div className="absolute inset-0 subtle-grid pointer-events-none" aria-hidden="true" />
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
            <Link href={navHref(lang, "/register")} className="btn-primary text-white px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg w-full sm:w-auto glow-border text-center">
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

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <CvComposer
              text={composerText}
              onTextChange={setComposerText}
              files={attachedFiles}
              onFilesChange={setAttachedFiles}
              onSubmit={handleComposerSubmit}
              placeholder={tHero.composerPlaceholder as string}
              attachLabel={tHero.composerAttach as string}
              sendLabel={tHero.composerSend as string}
              note={attachedFiles.length > 0 ? (tHero.composerAttachedNote as string) : undefined}
              multiple
              maxFiles={3}
            >
              <PillSelect
                value={composerMode}
                onChange={(next) => setComposerMode(next as "analyze" | "generate" | "interview")}
                label={tHero.composerMode as string}
                icon={Sparkles}
                options={[
                  { value: "analyze", label: tHero.composerModeAnalyze as string },
                  { value: "generate", label: tHero.composerModeGenerate as string },
                  { value: "interview", label: tHero.composerModeInterview as string },
                ]}
              />

              <PillSelect
                value={composerTemplate}
                onChange={setComposerTemplate}
                label={tHero.composerTemplate as string}
                icon={LayoutTemplate}
                options={cvTemplates.map((tpl) => ({ value: tpl.id, label: tpl.name }))}
              />
            </CvComposer>
          </motion.div>
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
