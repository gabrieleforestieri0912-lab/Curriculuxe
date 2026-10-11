"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Blocco di testo copiabile: le checklist delle guide servono anche fuori
 * dal sito, quindi il pulsante copia e' il modo naturale per portarsele via.
 */
export default function CopyBox({
  title,
  content,
  copyLabel = "Copia",
  copiedLabel = "Copiato",
}: {
  title: string;
  content: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-white font-bold">{title}</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <ul className="space-y-1.5">
        {content
          .split("\n")
          .filter(Boolean)
          .map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm text-zinc-300">
              <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400/80 shrink-0" />
              <span>{line.replace(/^\[\s?\] /, "")}</span>
            </li>
          ))}
      </ul>
    </section>
  );
}