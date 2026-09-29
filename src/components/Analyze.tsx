"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cvTemplates, getTemplateById } from "@/lib/templates/cvTemplates";
import TemplatePreview from "@/components/TemplatePreview";
import { exportToTxt, exportToDoc, exportToPdf } from "@/lib/exportUtils";
import type { AnalysisResult } from "@/lib/supabase/types";
import { useLanguage } from "@/context/LanguageContext";

interface Result {
  score: number;
  overall?: string;
  review?: string;
  isFallback?: boolean;
  atsScore: number;
  contentScore?: number;
  writingScore?: number;
  readinessScore?: number;
  jobMatchScore?: number;
  strengths: string[];
  improvements: Array<{ area: string; impact: string; description: string }>;
  atsChecks?: Array<{ label: string; passed: boolean; fix?: string }>;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  rewrittenBullets?: string[];
  suggestedSkills?: string[];
  marketGuidance?: string[];
  market?: string;
  detectedRole?: string;
  coverLetter?: string;
  applicationEmail?: string;
  [key: string]: unknown;
}

interface AnalyzeProps {
  initialResult?: Result | null;
  embedded?: boolean;
}

export default function Analyze({ initialResult = null, embedded = false }: AnalyzeProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(initialResult);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("moderno");
  const [showTemplates, setShowTemplates] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [targetMarket, setTargetMarket] = useState("italia");
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const { t, lang } = useLanguage();
  const tA = t.analyze as Record<string, string>;
  const tNav = t.nav as Record<string, string>;
  const tInterview = t.interview as Record<string, string>;
  const titleWords = String(tA.title).split(" ");
  const titleLast = titleWords.pop() || "";
  const titleFirst = titleWords.join(" ");
  const matchedWord = String(tA.matchedKeywords).toLowerCase();

  useEffect(() => {
    const checkAuth = async () => {
      const cachedData = localStorage.getItem("user");
      if (cachedData) {
        setUser(JSON.parse(cachedData));
      }
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            window.dispatchEvent(new Event("user-updated"));
          }
        }
      } catch {
        // ignore
      }
    };
    checkAuth();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const copyText = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    showToast(String(tA.copied));
  };

  useEffect(() => {
    const savedJobDescription = sessionStorage.getItem("curriculuxe:jobDescription");
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
      sessionStorage.removeItem("curriculuxe:jobDescription");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const validExtensions = [".pdf", ".docx"];
      const fileExtension = droppedFile.name.toLowerCase().slice(droppedFile.name.lastIndexOf("."));

      if (validTypes.includes(droppedFile.type) || validExtensions.includes(fileExtension)) {
        setFile(droppedFile);
        setResult(null);
      }
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    setAnalysisError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);
      formData.append("template", selectedTemplate);
      formData.append("market", targetMarket);

      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setAnalysisError(data.error || String(tA.errorGeneric));
        return;
      }

      setResult(data);
      showToast(`${data.matchedKeywords?.length || 0} ${matchedWord}`);

      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            localStorage.setItem("user", JSON.stringify(meData.user));
            setUser(meData.user);
            window.dispatchEvent(new Event("user-updated"));
          }
        }
      } catch {
        console.error("Failed to refresh user credits");
      }
    } catch {
      console.error("Analysis error");
      setAnalysisError(String(tA.errorGeneric));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section className={embedded ? "relative" : "gradient-bg-animated relative min-h-screen overflow-hidden"}>
      {toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed top-24 left-4 right-4 sm:left-auto sm:right-6 z-[80] rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200 backdrop-blur"
        >
          {toast}
        </motion.div>
      )}
      {!embedded && (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Curriculuxe</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/register" className="btn-primary text-sm text-white px-5 py-2.5 rounded-full font-medium">
                {tNav.register}
              </Link>
            </div>
          </div>
        </nav>
      )}

      <div className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {titleFirst} <span className="text-gradient">{titleLast}</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg">
              {tA.subtitle}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!result && !analyzing && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
                className={`glass-card rounded-2xl p-5 sm:p-8 glow-border mb-10 sm:mb-12 transition-all ${isDragging ? "border-purple-400 bg-purple-500/10 scale-[1.02]" : ""
                  }`}
              >
                <div className="flex flex-col items-center justify-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all ${isDragging ? "bg-purple-500/20" : "bg-white/5"
                      }`}
                  >
                    {isDragging ? (
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    )}
                  </motion.div>

                  <div className="text-center">
                    <label className="cursor-pointer">
                      <span className="text-white font-medium mb-2 block">
                        {file ? file.name : String(tA.uploadArea)}
                      </span>
                      <span className="text-zinc-500 text-sm">
                        {isDragging ? String(tA.analyzing) : String(tA.uploadFormats)}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-2xl space-y-4"
                    >
                      <label className="block text-left text-sm font-medium text-zinc-300 mb-2">
                        {tA.jobDescription}
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                        placeholder={String(tA.jobDescriptionPlaceholder)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none h-32 resize-none"
                      />
                      <p className="text-left text-sm font-medium text-zinc-300 mb-2 mt-4">
                        {tA.market}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "italia", label: String(tA.marketItalia) },
                          { id: "europa", label: String(tA.marketEuropa) },
                          { id: "usa", label: String(tA.marketUSA) },
                        ].map((market) => (
                          <button
                            key={market.id}
                            type="button"
                            onClick={() => setTargetMarket(market.id)}
                            className={`rounded-xl px-3 py-2 text-sm transition-all ${targetMarket === market.id
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                              }`}
                          >
                            {market.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={analyzeResume}
                        className="btn-primary w-full sm:w-auto text-white px-6 sm:px-8 py-3 rounded-full font-semibold glow-border flex items-center justify-center gap-2 mx-auto"
                      >
                        {tA.analyzeButton}
                      </button>
                      {analysisError && (
                        <p className="text-red-400 text-sm text-center">{analysisError}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                key="analyzing"
                role="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-12"
              >
                <div className="glass-card rounded-2xl p-8 inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-white font-medium">{tA.analyzing}</span>
                  </motion.div>
                  <p className="text-zinc-500 text-sm">{tA.analyzingDesc}</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-5 sm:p-8 glow-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <h2 className="text-xl font-bold text-white">{tA.results}</h2>
                    <span className="text-sm text-zinc-500">
                      {result.isFallback ? String(tA.fallbackLabel) : "Powered by AI"}
                    </span>
                  </div>

                  {result.isFallback && (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <strong>{tA.noCredits}</strong><br />
                        {tA.fallbackLabel}.{" "}
                        <Link href="/#pricing" className="underline font-medium text-yellow-300 hover:text-yellow-200">
                          {tInterview.viewPricing}
                        </Link>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 mb-8"
                  >
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(result.score / 100) * 352} 352`}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 352" }}
                          animate={{ strokeDasharray: `${(result.score / 100) * 352} 352` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#e879f9" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="text-4xl font-bold text-white">{result.score}</span>
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg mb-2">{result.overall}</p>
                      <p className="text-zinc-400 text-sm">{result.review}</p>
                    </div>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {[
                        { label: String(tA.overallScore), value: result.score, fill: "from-white via-zinc-300 to-zinc-500", text: "text-white", glow: "shadow-[0_2px_12px_rgba(255,255,255,0.25)]" },
                        { label: String(tA.atsScore), value: result.atsScore, fill: "from-emerald-300 via-emerald-500 to-emerald-700", text: "text-emerald-400", glow: "shadow-[0_2px_12px_rgba(52,211,153,0.45)]" },
                        { label: String(tA.contentScore), value: result.contentScore, fill: "from-sky-300 via-sky-500 to-sky-700", text: "text-sky-400", glow: "shadow-[0_2px_12px_rgba(56,189,248,0.45)]" },
                        { label: String(tA.writingScore), value: result.writingScore, fill: "from-amber-300 via-amber-500 to-amber-700", text: "text-amber-400", glow: "shadow-[0_2px_12px_rgba(251,191,36,0.45)]" },
                        { label: String(tA.jobMatchScore), value: result.jobMatchScore, fill: "from-indigo-300 via-indigo-500 to-indigo-700", text: "text-indigo-300", glow: "shadow-[0_2px_12px_rgba(129,140,248,0.45)]" },
                        { label: String(tA.readinessScore), value: result.readinessScore, fill: "from-fuchsia-300 via-fuchsia-500 to-fuchsia-700", text: "text-fuchsia-300", glow: "shadow-[0_2px_12px_rgba(232,121,249,0.45)]" },
                      ].map((bar, bi) => {
                        const pct = typeof bar.value === "number" ? Math.max(0, Math.min(100, bar.value)) : 0;
                        return (
                          <div key={bar.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <p className="text-zinc-400 text-xs font-medium">{bar.label}</p>
                              <p className={`text-lg font-bold tabular-nums ${bar.text}`}>
                                {typeof bar.value === "number" ? `${bar.value}` : "--"}
                                <span className="text-xs text-zinc-500 font-medium">/100</span>
                              </p>
                            </div>
                            <div className="h-3.5 rounded-full bg-black/50 border border-white/10 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 + bi * 0.12 }}
                                className={`h-full rounded-full bg-gradient-to-b ${bar.fill} ${bar.glow} relative overflow-hidden`}
                              >
                                <div className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/50 to-white/0" />
                                <motion.div
                                  animate={{ x: ["-120%", "520%"] }}
                                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: bi * 0.3 }}
                                  className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                />
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-green-500/10 rounded-xl p-5 border border-green-500/20"
                    >
                      <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {tA.strengths}
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths.map((s: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="text-zinc-300 text-sm flex items-start gap-2"
                          >
                            <span className="text-green-400 mt-1">{"\u2022"}</span>
                            {s}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-4 relative"
                    >
                      <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {tA.improvements}
                      </h3>
                      <div className={!user ? "blur-md pointer-events-none select-none opacity-60" : ""}>
                        {result.improvements.map((imp: { area: string; impact: string; description: string }, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="bg-white/5 rounded-xl p-4 mb-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium text-sm">{imp.area}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${imp.impact === "Alto"
                                    ? "bg-red-500/20 text-red-400"
                                    : imp.impact === "Medio"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-blue-500/20 text-blue-400"
                                  }`}
                              >
                                {imp.impact === "Alto" ? tA.high : imp.impact === "Medio" ? tA.medium : imp.impact === "Basso" ? tA.low : imp.impact}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-sm">{imp.description}</p>
                          </motion.div>
                        ))}
                      </div>

                      {!user && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 rounded-xl backdrop-blur-[2px]">
                          <svg className="w-8 h-8 text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <p className="text-white font-medium mb-3">{tA.loginToUnlock}</p>
                          <Link href="/register" className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
                            {tNav.register}
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <h3 className="text-indigo-300 font-semibold mb-3">{tA.atsChecks}</h3>
                      <div className="space-y-3">
                        {result.atsChecks?.map((check: { label: string; passed: boolean; fix?: string }, i: number) => (
                          <div key={i} className="text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-white">{check.label}</span>
                              <span className={check.passed ? "text-emerald-400" : "text-red-400"}>
                                {check.passed ? String(tA.pass) : String(tA.fail)}
                              </span>
                            </div>
                            {!check.passed && <p className="text-zinc-500 mt-1">{check.fix}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <h3 className="text-indigo-300 font-semibold mb-3">{tA.keywords}</h3>
                      <p className="text-zinc-500 text-xs mb-2">{tA.missingKeywords}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(result.missingKeywords || []).slice(0, 12).map((keyword: string) => (
                          <span key={keyword} className="px-2 py-1 rounded-full bg-red-500/15 text-red-300 text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <p className="text-zinc-500 text-xs mb-2">{tA.matchedKeywords}</p>
                      <div className="flex flex-wrap gap-2">
                        {(result.matchedKeywords || []).slice(0, 12).map((keyword: string) => (
                          <span key={keyword} className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {result.rewrittenBullets && result.rewrittenBullets.length > 0 && (
                    <div className="mt-6 bg-white/5 rounded-xl p-5 border border-white/10">
                      <h3 className="text-indigo-300 font-semibold mb-3">{tA.rewrittenBullets}</h3>
                      <ul className="space-y-2">
                        {result.rewrittenBullets.slice(0, 6).map((bullet: string, i: number) => (
                          <li key={i} className="text-zinc-300 text-sm flex gap-2 items-start">
                            <button
                              type="button"
                              onClick={() => copyText(bullet)}
                              className="mt-0.5 rounded bg-indigo-500/15 px-2 py-1 text-[10px] text-indigo-300 hover:bg-indigo-500/25"
                            >
                              {tA.copy}
                            </button>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <h3 className="text-indigo-300 font-semibold mb-3">{tA.suggestedSkills}</h3>
                      <p className="text-zinc-500 text-xs mb-3">
                        {tA.detectedRole} {result.detectedRole || "general"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(result.suggestedSkills || []).map((skill: string) => (
                          <span key={skill} className="px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <h3 className="text-indigo-300 font-semibold mb-3">{tA.marketRules} {result.market}</h3>
                      <ul className="space-y-2">
                        {(result.marketGuidance || []).map((tip: string) => (
                          <li key={tip} className="text-zinc-300 text-sm flex gap-2">
                            <span className="text-indigo-300">{"\u2022"}</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {(result.coverLetter || result.applicationEmail) && (
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h3 className="text-indigo-300 font-semibold">{tA.coverLetter}</h3>
                          <button
                            type="button"
                            onClick={() => copyText(result.coverLetter || "")}
                            className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                          >
                            {tA.copy}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-zinc-300 text-sm font-sans">
                          {result.coverLetter}
                        </pre>
                      </div>
                      <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h3 className="text-indigo-300 font-semibold">{tA.applicationEmail}</h3>
                          <button
                            type="button"
                            onClick={() => copyText(result.applicationEmail || "")}
                            className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                          >
                            {tA.copy}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-zinc-300 text-sm font-sans">
                          {result.applicationEmail}
                        </pre>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400 text-sm">{tA.exportLabel}</p>
                      <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        {tA.templates}
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 rounded-xl bg-white/5 border border-white/10 p-4">
                      <div>
                        <p className="text-zinc-500 text-xs">{tA.formatLabel}</p>
                        <p className="text-white text-sm">TXT, DOC, PDF</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs">{tA.templates}</p>
                        <p className="text-white text-sm">{getTemplateById(selectedTemplate).name}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs">ATS-safe</p>
                        <p className="text-white text-sm">{result.atsScore >= 80 ? (lang === "it" ? "Sì" : "Yes") : String(tA.fail)}</p>
                      </div>
                    </div>

                    {showTemplates && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {cvTemplates.map((t: { id: string; name: string }) => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTemplate(t.id)}
                              className={`rounded-lg overflow-hidden transition-all ${
                                selectedTemplate === t.id
                                  ? "ring-2 ring-indigo-500"
                                  : "hover:ring-1 hover:ring-white/20"
                              }`}
                            >
                              <TemplatePreview templateId={t.id} size="sm" />
                              <p className="text-xs text-center py-1 bg-slate-800 text-white font-medium">
                                {t.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={() => exportToTxt(result as unknown as AnalysisResult, selectedTemplate, file, setIsExporting)}
                        disabled={isExporting || !user}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border border-white/10 ${!user ? 'opacity-50 cursor-not-allowed bg-white/5 text-zinc-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {tA.exportTxt}
                      </button>
                      <button
                        onClick={() => exportToDoc(result as unknown as AnalysisResult, selectedTemplate, file, setIsExporting)}
                        disabled={isExporting || !user}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${!user ? 'opacity-50 cursor-not-allowed bg-blue-900/50 text-blue-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {tA.exportDoc}
                      </button>
                      <button
                        onClick={() => exportToPdf(result as unknown as AnalysisResult, selectedTemplate, file, setIsExporting, showToast)}
                        disabled={isExporting || !user}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${!user ? 'opacity-50 cursor-not-allowed bg-red-900/50 text-red-300' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {tA.exportPdf}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                      }}
                      className="btn-secondary w-full text-white py-3 rounded-full font-medium mt-4"
                    >
                      {tA.uploadAnother}
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
