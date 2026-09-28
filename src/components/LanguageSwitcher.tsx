"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const entries = Object.entries(
    languages as Record<string, { label: string; flag: string }>
  );
  const current =
    (languages as Record<string, { label: string; flag: string }>)[lang] ??
    (languages as Record<string, { label: string; flag: string }>).it;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/20 transition-all"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wide">{current.flag}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl z-[9999] min-w-[140px]">
          {entries.map(([code, l]) => (
            <button
              key={code}
              onClick={() => { changeLanguage(code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-all hover:bg-white/5 ${
                lang === code ? "text-indigo-300 bg-indigo-500/10" : "text-zinc-300"
              }`}
            >
              <span className="text-xs font-bold uppercase text-zinc-500 w-6">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
