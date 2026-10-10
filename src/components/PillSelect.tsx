"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface PillSelectOption {
  value: string;
  label: string;
}

interface PillSelectProps {
  value: string;
  options: PillSelectOption[];
  onChange: (value: string) => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  align?: "left" | "right";
}

/**
 * Select a pillola disegnato da noi.
 *
 * Il `<select>` nativo non e' stilabile: su Windows Chrome le `<option>`
 * vengono colorate dal sistema e ignorano il CSS, quindi l'elenco appare
 * con lo sfondo bianco di default e stacca dal tema scuro.
 */
export default function PillSelect({
  value,
  options,
  onChange,
  label,
  icon: Icon,
  align = "left",
}: PillSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const commit = (option: PillSelectOption) => {
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(options[activeIndex]);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={`inline-flex items-center gap-1.5 rounded-full bg-white/5 border pl-3 pr-8 py-2 text-xs font-medium text-zinc-200 transition-all outline-none cursor-pointer max-w-[160px] sm:max-w-none hover:bg-white/[0.08] hover:border-white/25 hover:text-white focus-visible:border-fuchsia-400/60 focus-visible:ring-2 focus-visible:ring-fuchsia-500/25 ${
          open ? "bg-white/[0.08] border-fuchsia-400/50 text-white" : "border-white/10"
        }`}
      >
        {Icon && (
          <Icon className={`w-3.5 h-3.5 shrink-0 ${open ? "text-fuchsia-400" : "text-zinc-500"}`} />
        )}
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
            open ? "rotate-180 text-fuchsia-400" : "text-zinc-500"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={`absolute top-full mt-2 z-50 min-w-full max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#18181b]/95 backdrop-blur-xl shadow-xl shadow-black/50 p-1.5 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-medium text-left transition-colors ${
                    index === activeIndex ? "bg-white/[0.07]" : ""
                  } ${
                    isSelected ? "text-white" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-fuchsia-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
