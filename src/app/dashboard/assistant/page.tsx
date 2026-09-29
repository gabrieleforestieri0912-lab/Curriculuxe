"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Sparkles, RotateCcw, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuizData {
  title: string;
  questions: Array<{ q: string; options: string[]; answer: number; explain?: string }>;
}

function boldize(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") && p.length > 4 ? (
      <strong key={`${keyPrefix}-${i}`} className="text-white font-semibold">{p.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{p}</span>
    )
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;

  const flush = () => {
    if (list.length === 0) return;
    const items = list;
    list = [];
    const ListTag = ordered ? "ol" : "ul";
    blocks.push(
      <ListTag key={`l-${blocks.length}`} className={`space-y-1 my-2 ${ordered ? "list-decimal list-inside" : ""}`}>
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-300 leading-relaxed">
            {!ordered && <span className="text-fuchsia-400 shrink-0">•</span>}
            <span>{boldize(it.replace(/^([-*]|\d+\.)\s*/, ""), `li-${blocks.length}-${i}`)}</span>
          </li>
        ))}
      </ListTag>
    );
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (/^([-*])\s+/.test(trimmed)) {
      if (ordered || list.length === 0) { flush(); ordered = false; }
      list.push(trimmed);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (!ordered || list.length === 0) { flush(); ordered = true; }
      list.push(trimmed);
    } else {
      flush();
      if (trimmed) {
        blocks.push(
          <p key={`p-${i}`} className="text-sm text-zinc-300 leading-relaxed my-1.5">
            {boldize(trimmed, `p-${i}`)}
          </p>
        );
      }
    }
  });
  flush();
  return <>{blocks}</>;
}

function parseQuizBlocks(content: string): Array<{ type: "text"; text: string } | { type: "quiz"; quiz: QuizData }> {
  const parts: Array<{ type: "text"; text: string } | { type: "quiz"; quiz: QuizData }> = [];
  const re = /```quiz([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) parts.push({ type: "text", text: content.slice(last, m.index).trim() });
    try {
      const quiz = JSON.parse(m[1].trim()) as QuizData;
      if (quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
        parts.push({ type: "quiz", quiz });
      } else {
        parts.push({ type: "text", text: m[0] });
      }
    } catch {
      parts.push({ type: "text", text: m[0] });
    }
    last = m.index + m[0].length;
  }
  if (last < content.length) parts.push({ type: "text", text: content.slice(last).trim() });
  return parts.filter((p) => p.type === "quiz" || (p.type === "text" && p.text));
}

function QuizBlock({ quiz, t }: { quiz: QuizData; t: Record<string, unknown> }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const total = quiz.questions.length;
  const answered = Object.keys(picked).length;
  const correct = quiz.questions.filter((q, i) => picked[i] === q.answer).length;
  const done = answered === total;
  const T = (k: string) => t[k] as string;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.07] p-4 sm:p-5 my-2">
      <p className="text-white font-bold text-sm mb-1">{quiz.title}</p>
      <p className="text-xs text-zinc-500 mb-4">
        {answered} {T("quizOf")} {total} · {T("quizScore")}: {correct}/{total}
      </p>
      <div className="space-y-4">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="rounded-xl bg-black/30 border border-white/10 p-3.5">
            <p className="text-sm text-white font-medium mb-2.5">
              <span className="text-zinc-500 font-bold mr-1.5">{qi + 1}.</span>
              {q.q}
            </p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const chosen = picked[qi] === oi;
                const isRight = q.answer === oi;
                const revealed = picked[qi] !== undefined;
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className={`w-full text-left text-xs rounded-lg border px-3 py-2 transition-all ${
                      revealed && isRight
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-200"
                        : revealed && chosen
                        ? "bg-red-500/15 border-red-500/50 text-red-200"
                        : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white disabled:cursor-default"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {picked[qi] !== undefined && (
              <p className={`text-xs mt-2 ${picked[qi] === q.answer ? "text-emerald-300" : "text-red-300"}`}>
                {picked[qi] === q.answer ? T("quizCorrect") : T("quizWrong")}
                {q.explain && <span className="text-zinc-400"> — {q.explain}</span>}
              </p>
            )}
          </div>
        ))}
      </div>
      {done && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
          <p className="text-sm font-bold text-white">
            {T("quizScore")}: {correct}/{total}
          </p>
          <button
            onClick={() => setPicked({})}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {T("quizRetry")}
          </button>
        </div>
      )}
    </div>
  );
}

function buildProgressSummary(): string {
  try {
    const cached = localStorage.getItem("user");
    const me = cached ? JSON.parse(cached) : null;
    if (!me?.id) return "";
    const raw = localStorage.getItem(`curriculuxe:onboarding:${me.id}`);
    if (!raw) return "";
    const ob = JSON.parse(raw);
    const plan = ob.plan as {
      headline?: string;
      roadmap?: Array<{ phase?: string; actions?: string[] }>;
    } | null;
    if (!plan?.roadmap) return "";
    const progRaw = Object.keys(localStorage)
      .filter((k) => k.startsWith(`curriculuxe:plan-progress:${me.id}:`))
      .map((k) => { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; } })
      .reduce((acc, o) => ({ ...acc, ...o }), {} as Record<string, boolean>);
    const lines = (plan.roadmap || []).map((ph, i) => {
      const total = (ph.actions || []).length;
      const done = (ph.actions || []).filter((_, j) => progRaw[`${i}:${j}`]).length;
      return `Fase ${i + 1} (${ph.phase}): ${done}/${total} azioni completate`;
    });
    return `Piano: ${plan.headline || ""}. ${lines.join(" ")}`;
  } catch {
    return "";
  }
}

export default function AssistantPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const tA = t.assistant as Record<string, unknown>;
  const T = (k: string) => tA[k] as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [noCredits, setNoCredits] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("user");
      if (cached) {
        const u = JSON.parse(cached);
        if (typeof u.credits === "number") setCredits(u.credits);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput("");
    setNoCredits(false);
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setSending(true);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: next.slice(-11, -1),
          lang,
          progress: buildProgressSummary(),
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setNoCredits(true);
        setMessages(next);
        return;
      }
      if (!res.ok || !data.reply) throw new Error(data.error || T("errorSend"));
      setMessages([...next, { role: "assistant" as const, content: data.reply as string }]);
      if (typeof data.credits === "number") {
        setCredits(data.credits);
        try {
          const cached = localStorage.getItem("user");
          if (cached) {
            const u = JSON.parse(cached);
            u.credits = data.credits;
            localStorage.setItem("user", JSON.stringify(u));
            window.dispatchEvent(new Event("user-updated"));
          }
        } catch { /* ignore */ }
      }
    } catch (err) {
      setMessages([...next, { role: "assistant" as const, content: `Atlas: ${(err as Error).message}` }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = (tA.suggestions as string[]) || [];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-28">
      <div className="max-w-3xl mx-auto flex flex-col" style={{ minHeight: "calc(100vh - 14rem)" }}>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            Atlas
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{T("title")}</h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">{T("subtitle")}</p>
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-zinc-500">
            {credits !== null && (
              <span>{credits} crediti · {T("creditNote")}</span>
            )}
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <Plus className="w-3.5 h-3.5" />
                {T("newChat")}
              </button>
            )}
          </div>
        </div>

        {messages.length === 0 && !sending && (
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-white mb-1">{T("emptyTitle")}</p>
            <p className="text-sm text-zinc-500 mb-4">{T("emptyDesc")}</p>
            <div className="grid sm:grid-cols-2 gap-2.5 text-left">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:border-fuchsia-500/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto max-h-[52vh] pr-1">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "bg-indigo-500/20 border border-indigo-500/30 text-white text-sm"
                      : "glass-card border border-white/10 w-full"
                  }`}
                >
                  {m.role === "assistant" ? (
                    parseQuizBlocks(m.content).map((part, j) =>
                      part.type === "quiz" ? (
                        <QuizBlock key={j} quiz={part.quiz} t={tA} />
                      ) : (
                        <RichText key={j} text={part.text} />
                      )
                    )
                  ) : (
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {sending && (
            <div className="flex justify-start">
              <div className="glass-card border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                {T("thinking")}
              </div>
            </div>
          )}
        </div>

        {noCredits && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-center justify-between gap-3">
            <span>{T("noCredits")}</span>
            <Link href="/#pricing" className="font-semibold underline underline-offset-2 shrink-0">
              {T("noCreditsCta")}
            </Link>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="mt-4 flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 pl-4 backdrop-blur-xl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={T("placeholder")}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-zinc-600 max-h-32 py-2"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label={T("send")}
            className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <X className="w-3 h-3" />
            {T("hintEnter")}
          </span>
          <button onClick={() => router.push("/dashboard")} className="hover:text-zinc-300 transition-colors">
            {T("backDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}
