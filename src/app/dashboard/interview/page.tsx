"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface Questions {
  [key: string]: string[];
}

const commonQuestions: Questions = {
  it: [
    "Parlami di te.",
    "Perch\u00e9 vuoi lavorare qui?",
    "Quali sono i tuoi punti di forza e di debolezza?",
    "Dove ti vedi tra 5 anni?",
    "Parlami di un conflitto sul lavoro e come l'hai risolto.",
    "Descrivi un progetto di cui sei particolarmente orgoglioso.",
    "Perch\u00e9 dovremmo assumerti?",
    "Qual \u00e8 la tua pi\u00f9 grande realizzazione professionale?",
    "Come gestisci lo stress e le scadenze?",
    "Che stipendio ti aspetti?",
  ],
  en: [
    "Tell me about yourself.",
    "Why do you want to work here?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Tell me about a conflict at work and how you resolved it.",
    "Describe a project you're particularly proud of.",
    "Why should we hire you?",
    "What is your greatest professional achievement?",
    "How do you handle stress and deadlines?",
    "What salary are you expecting?",
  ],
};

export default function InterviewPage() {
  const { t, lang } = useLanguage();
  const tNav = (t as Record<string, Record<string, string>>).nav;
  const tInterview = t.interview as Record<string, string>;
  const router = useRouter();
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    }
  }, [router]);

  const questions = commonQuestions[lang] || commonQuestions.it;

  const startSimulation = () => {
    if (!role.trim()) return;
    setStarted(true);
    setCurrentQuestion(0);
    setAnswer("");
    setFeedback(null);
    setHistory([]);
    setShowTips(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQuestion],
          answer: answer,
          role: role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        let feedbackText = "";
        if (data.score) feedbackText += `**Score: ${data.score}/10**\n\n`;
        if (data.strengths?.length) feedbackText += `\u2705 Punti di forza:\n${data.strengths.map((s: string) => `\u2022 ${s}`).join("\n")}\n\n`;
        if (data.improvements?.length) feedbackText += `\uD83D\uDCA1 Aree di miglioramento:\n${data.improvements.map((s: string) => `\u2022 ${s}`).join("\n")}\n\n`;
        if (data.starSuggestion) feedbackText += `\uD83D\uDCCC Metodo STAR:\n${data.starSuggestion}\n\n`;
        if (data.improvedAnswer) feedbackText += `\u270D\uFE0F Versione migliorata:\n${data.improvedAnswer}`;
        setFeedback(feedbackText || "Good answer! Consider using the STAR method for more impact.");
      } else {
        setFeedback("Try structuring your answer with the STAR method: Situation, Task, Action, Result.");
      }
    } catch {
      setFeedback("Focus on concrete examples and quantify your results when possible.");
    }

    setHistory((prev) => [...prev, { q: questions[currentQuestion], a: answer }]);
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
    }
    setAnswer("");
    setFeedback(null);
  };

  return (
    <section className="gradient-bg relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-35" />
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white font-medium">{tNav.backDashboard}</span>
          </Link>
          <h1 className="text-white font-bold text-lg">{tInterview.title}</h1>
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {!started ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{tInterview.title}</h1>
                  <p className="text-zinc-400">{tInterview.subtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{tInterview.roleLabel}</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                    placeholder={tInterview.rolePlaceholder}
                    className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-5">
                  <h3 className="text-pink-300 font-semibold mb-3">{tInterview.tipsTitle}</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">{"\u2022"}</span>
                      <span>{tInterview.tip1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">{"\u2022"}</span>
                      <span>{tInterview.tip2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">{"\u2022"}</span>
                      <span>{tInterview.tip3}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">{"\u2022"}</span>
                      <span>{tInterview.tip4}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={startSimulation}
                  disabled={!role.trim()}
                  className="w-full btn-primary py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tInterview.startSimulation}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-zinc-500">
                    {tInterview.question} {currentQuestion + 1}/{questions.length}
                  </span>
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className="text-xs text-pink-400 hover:text-pink-300"
                  >
                    {tInterview.tipsTitle}
                  </button>
                </div>

                <AnimatePresence>
                  {showTips && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-4 mb-6 overflow-hidden"
                    >
                      <ul className="space-y-1.5 text-sm text-zinc-400">
                        <li><span className="text-pink-400">{"\u2022"}</span> {tInterview.tip1}</li>
                        <li><span className="text-pink-400">{"\u2022"}</span> {tInterview.tip2}</li>
                        <li><span className="text-pink-400">{"\u2022"}</span> {tInterview.tip3}</li>
                        <li><span className="text-pink-400">{"\u2022"}</span> {tInterview.tip4}</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h2 className="text-xl font-bold text-white mb-6">{questions[currentQuestion]}</h2>

                <textarea
                  rows={5}
                  value={answer}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
                  placeholder={tInterview.answerPlaceholder}
                  className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-y mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={submitAnswer}
                    disabled={loading || !answer.trim()}
                    className="flex-1 btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {tInterview.submitAnswer}
                      </span>
                    ) : tInterview.submitAnswer}
                  </button>
                </div>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-pink-500/10 border border-pink-500/20 rounded-xl p-5"
                  >
                    <h3 className="text-pink-300 font-semibold mb-2">{tInterview.feedback}</h3>
                    <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{feedback}</div>
                  </motion.div>
                )}
              </motion.div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={nextQuestion}
                    className="flex-1 btn-secondary py-3 rounded-xl font-semibold"
                  >
                    {tInterview.nextQuestion}
                  </button>
                  <button
                    onClick={() => setStarted(false)}
                    className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                  >
                    {tInterview.startOver}
                  </button>
                </motion.div>
              )}

              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-white font-semibold mb-4">{tInterview.commonQuestions}</h3>
                  <div className="space-y-3">
                    {history.map((item, i) => (
                      <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-pink-300 text-sm font-medium mb-1">{item.q}</p>
                        <p className="text-zinc-400 text-sm line-clamp-2">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
