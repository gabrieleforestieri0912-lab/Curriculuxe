"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, CheckCheck } from "lucide-react";
import Link from "next/link";
import { MINI_CHAT_NAME } from "@/lib/miniChat";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  applied?: boolean;
}

interface CvSideChatProps {
  cvId: string;
  lang?: string;
  onCvUpdated?: (cv: Record<string, unknown>) => void;
}

const SUGGESTIONS_IT = [
  "Rendi il summary più incisivo",
  "Aggiungi metriche alle esperienze",
  "Ottimizza le skill per l'ATS",
  "Rendi i bullet più orientati ai risultati",
];

const SUGGESTIONS_EN = [
  "Make the summary punchier",
  "Add metrics to my experience",
  "Optimize skills for ATS",
  "Make bullets more result-oriented",
];

/**
 * Mini-chat laterale per modificare il CV appena generato con l'AI (Atlas).
 * Le modifiche restituite dall'API sono già salvate sul CV: il componente
 * notifica l'applicazione e aggiorna l'anteprima via `onCvUpdated`.
 */
export default function CvSideChat({ cvId, lang = "it", onCvUpdated }: CvSideChatProps) {
  const en = lang === "en";
  const suggestions = en ? SUGGESTIONS_EN : SUGGESTIONS_IT;
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [noCredits, setNoCredits] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const res = await fetch("/api/cv/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvId,
          message: content,
          history: next.slice(-11, -1),
          lang,
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setNoCredits(true);
        setMessages(next);
        return;
      }
      if (!res.ok) throw new Error(data.error || (en ? "Could not send the message." : "Impossibile inviare il messaggio."));
      const applied =
        data.updates && typeof data.updates === "object" && Object.keys(data.updates).length > 0;
      setMessages([...next, { role: "assistant" as const, content: data.reply as string, applied }]);
      if (data.cv && onCvUpdated) onCvUpdated(data.cv as Record<string, unknown>);
      if (typeof data.credits === "number") {
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
      setMessages([...next, { role: "assistant" as const, content: `${MINI_CHAT_NAME}: ${(err as Error).message}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.03]">
        <span className="relative flex w-9 h-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shrink-0">
          <Sparkles className="w-4 h-4" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d12]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            {MINI_CHAT_NAME}
            <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30 rounded-full px-2 py-0.5">
              Mini-chat
            </span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
            {en ? "Edit this CV with AI" : "Modifica questo CV con l'AI"}
          </p>
        </div>
      </div>

      <div className="p-5">
        {messages.length === 0 && !sending && (
          <div className="mb-4">
            <p className="text-zinc-400 text-sm mb-3">
              {en
                ? "Ask for any change: the preview updates automatically."
                : "Chiedi qualsiasi modifica: l'anteprima si aggiorna da sola."}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-fuchsia-500/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div ref={scrollRef} className="space-y-3 overflow-y-auto max-h-72 pr-1 mb-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                      m.role === "user"
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-white text-sm"
                        : "bg-white/5 border border-white/10 text-zinc-200 text-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {m.applied && (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                        <CheckCheck className="w-3.5 h-3.5" />
                        {en ? "Applied to your CV" : "Applicata al tuo CV"}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {en ? "Atlas is writing..." : "Atlas sta scrivendo..."}
                </div>
              </div>
            )}
          </div>
        )}

        {noCredits && (
          <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-sm text-amber-200 flex items-center justify-between gap-2">
            <span>{en ? "Out of credits for chat." : "Crediti esauriti per la chat."}</span>
            <Link href="/#pricing" className="font-semibold underline underline-offset-2 shrink-0">
              {en ? "Upgrade" : "Ricarica"}
            </Link>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={sending}
                title={s}
                className="shrink-0 max-w-[220px] truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-fuchsia-500/40 hover:text-white transition-all disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 pl-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={en ? "Describe the change..." : "Descrivi la modifica..."}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-zinc-600 max-h-28 py-2"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label={en ? "Send" : "Invia"}
            className="btn-primary w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[11px] text-zinc-600">
          {en ? "1 credit per message · Shift + Enter for new line" : "1 credito a messaggio · Shift + Invio per andare a capo"}
        </p>
      </div>
    </div>
  );
}
