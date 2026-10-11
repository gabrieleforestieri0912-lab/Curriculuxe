"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getTranslations, defaultLanguage, supportedLanguages } from "@/lib/i18n";

export const LANG_COOKIE = "curriculuxe-lang";
const LANG_STORAGE_KEY = "curriculuxe:lang";

interface LanguageContextValue {
  lang: string;
  changeLanguage: (newLang: string) => void;
  t: Record<string, unknown>;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function isSupportedLanguage(lang: unknown): lang is string {
  return typeof lang === "string" && (supportedLanguages as string[]).includes(lang);
}

/** Lingua salvata in precedenza (cookie -> localStorage -> oggetto utente). */
export function getSavedLanguage(): string | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)curriculuxe-lang=([a-z]{2})/i);
    if (match && isSupportedLanguage(match[1])) return match[1];
  } catch (_e) {
    // ignore
  }
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isSupportedLanguage(stored)) return stored;
  } catch (_e) {
    // ignore
  }
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (isSupportedLanguage(user.language)) return user.language;
    }
  } catch (_e) {
    // ignore
  }
  return null;
}

/**
 * Rileva la lingua dal browser e dalla zona di accesso:
 * 1. lingua del browser (navigator.language): "it" -> italiano, "en" -> inglese;
 * 2. fallback geografico via timezone: fuori Europa -> inglese (visitatori esteri),
 *    Europa -> italiano (prodotto IT-first);
 * 3. default italiano.
 */
export function detectLanguageFromBrowser(): string {
  if (typeof window === "undefined") return defaultLanguage;
  const nav = (
    navigator.language ||
    (navigator as unknown as { userLanguage?: string }).userLanguage ||
    ""
  ).toLowerCase();
  if (nav.startsWith("it")) return "it";
  if (nav.startsWith("en")) return "en";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz && !tz.startsWith("Europe/")) return "en";
    if (tz.startsWith("Europe/")) return "it";
  } catch (_e) {
    // ignore
  }
  return defaultLanguage;
}

function persistLanguage(newLang: string) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  } catch (_e) {
    // ignore
  }
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      user.language = newLang;
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("user-updated"));
    }
  } catch (_e) {
    // ignore
  }
  try {
    document.cookie = `${LANG_COOKIE}=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (_e) {
    // ignore
  }
  try {
    document.documentElement.lang = newLang;
  } catch (_e) {
    // ignore
  }
}

/**
 * Porta alla pagina equivalente nell'altra lingua: `/en/pricing` <-> `/pricing`.
 * Serve perche' la lingua delle URL e' quella renderizzata dal server, quindi
 * cambiare lingua senza spostarsi lascerebbe HTML e URL in disaccordo.
 */
export function swapLanguagePath(pathname: string, targetLang: string): string {
  const withoutPrefix = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (targetLang === "en") return withoutPrefix === "/" ? "/en" : `/en${withoutPrefix}`;
  return withoutPrefix;
}

export function LanguageProvider({
  children,
  lang: fixedLang,
}: {
  children: ReactNode;
  lang?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Con `lang` la pagina vive sotto un URL localizzato (`/en/...`): la lingua
  // arriva dal server, niente auto-detect, cosi' il crawler vede l'HTML giusto.
  const [lang, setLang] = useState<string>(fixedLang || defaultLanguage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      // Applica la preferenza "Riduci animazioni" salvata nelle impostazioni.
      if (localStorage.getItem("curriculuxe:reduce-motion") === "1") {
        document.documentElement.classList.add("reduce-motion");
      }
    } catch (_e) {
      // ignore
    }
    if (fixedLang) {
      setReady(true);
      return;
    }
    const saved = getSavedLanguage();
    const next = saved || detectLanguageFromBrowser();
    if (next !== defaultLanguage) setLang(next);
    try {
      document.documentElement.lang = next;
    } catch (_e) {
      // ignore
    }
    setReady(true);
  }, [fixedLang]);

  const changeLanguage = useCallback(
    (newLang: string) => {
      if (!isSupportedLanguage(newLang)) return;
      persistLanguage(newLang);
      if (fixedLang && newLang !== fixedLang) {
        router.push(swapLanguagePath(pathname || "/", newLang));
        return;
      }
      setLang(newLang);
      fetch("/api/auth/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      }).catch(() => {});
    },
    [fixedLang, pathname, router]
  );

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
