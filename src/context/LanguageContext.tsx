"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { getTranslations, defaultLanguage } from "@/lib/i18n";

interface LanguageContextValue {
  lang: string;
  changeLanguage: (newLang: string) => void;
  t: Record<string, unknown>;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(defaultLanguage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.language && ["it", "en"].includes(user.language)) {
          setLang(user.language);
        }
      } catch (_e) {
        // ignore
      }
    }
    setReady(true);
  }, []);

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
