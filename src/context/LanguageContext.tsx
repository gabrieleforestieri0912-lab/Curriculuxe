"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getTranslations, defaultLanguage } from "@/lib/i18n";

interface LanguageContextValue {
  lang: string;
  changeLanguage: (newLang: string) => void;
  t: Record<string, unknown>;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): string {
  if (typeof window === "undefined") return defaultLanguage;
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.language && ["it", "en"].includes(user.language)) {
        return user.language;
      }
    }
  } catch (_e) {
    // ignore
  }
  return defaultLanguage;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(getInitialLanguage);
  const ready = true;

  const changeLanguage = useCallback((newLang: string) => {
    setLang(newLang);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        user.language = newLang;
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("user-updated"));
      } catch (_e) {
        // ignore
      }

      fetch("/api/auth/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      }).catch(() => {});
    }
  }, []);

  const t = getTranslations(lang);

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
