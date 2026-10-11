"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, LogOut, Trash2, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/lib/i18n";

interface JobPrefs {
  market: string;
  seniority: string;
  remoteOnly: boolean;
}

const JOB_PREFS_KEY = "curriculuxe:job-prefs";
const REDUCE_MOTION_KEY = "curriculuxe:reduce-motion";

function readJobPrefs(): JobPrefs {
  try {
    const raw = localStorage.getItem(JOB_PREFS_KEY);
    if (!raw) return { market: "", seniority: "", remoteOnly: false };
    const parsed = JSON.parse(raw) as Partial<JobPrefs>;
    return {
      market: typeof parsed.market === "string" ? parsed.market : "",
      seniority: typeof parsed.seniority === "string" ? parsed.seniority : "",
      remoteOnly: parsed.remoteOnly === true,
    };
  } catch {
    return { market: "", seniority: "", remoteOnly: false };
  }
}

export default function SettingsPage() {
  const { t, lang, changeLanguage } = useLanguage();
  const tSettings = t.settings as Record<string, string>;
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [prefs, setPrefs] = useState<JobPrefs>({ market: "", seniority: "", remoteOnly: false });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        setUser(parsed);
        setName(typeof parsed.name === "string" ? parsed.name : "");
      }
    } catch {
      // cache illeggibile
    }
    setPrefs(readJobPrefs());
    try {
      setReduceMotion(localStorage.getItem(REDUCE_MOTION_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      setNotice("");
    }, 2500);
  };

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    flash(tSettings.saved as string);
  };

  const handleNameSave = async () => {
    setNameError("");
    const clean = name.trim();
    if (!clean) {
      setNameError(tSettings.nameError as string);
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      const data = (await res.json().catch(() => null)) as { name?: string; error?: string } | null;
      if (!res.ok || !data?.name) {
        setNameError((data?.error as string) || (tSettings.serverError as string));
        return;
      }
      setName(data.name);
      setUser((prev) => {
        const next = { ...(prev ?? {}), name: data.name };
        try {
          localStorage.setItem("user", JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      window.dispatchEvent(new Event("user-updated"));
      flash(tSettings.nameSaved as string);
    } catch {
      setNameError(tSettings.serverError as string);
    }
  };

  const handlePrefsChange = (next: JobPrefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(JOB_PREFS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    flash(tSettings.saved as string);
  };

  const handleReduceMotion = (on: boolean) => {
    setReduceMotion(on);
    try {
      if (on) {
        localStorage.setItem(REDUCE_MOTION_KEY, "1");
        document.documentElement.classList.add("reduce-motion");
      } else {
        localStorage.removeItem(REDUCE_MOTION_KEY);
        document.documentElement.classList.remove("reduce-motion");
      }
    } catch {
      // ignore
    }
    flash(tSettings.saved as string);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const get = async (path: string) => {
        try {
          const res = await fetch(path);
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };
      const [me, cvs, history, targets, onboarding] = await Promise.all([
        get("/api/auth/me"),
        get("/api/cv"),
        get("/api/cv/history"),
        get("/api/targets"),
        get("/api/onboarding/status"),
      ]);
      const local: Record<string, string | null> = {};
      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && key.startsWith("curriculuxe:")) {
            local[key] = localStorage.getItem(key);
          }
        }
      } catch {
        // ignore
      }
      const blob = new Blob(
        [JSON.stringify({ exportedAt: new Date().toISOString(), me, cvs, history, targets, onboarding, local }, null, 2)],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "curriculuxe-dati.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      flash(tSettings.saved as string);
    } finally {
      setExporting(false);
    }
  };

  const handleClearLocal = () => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith("curriculuxe:")) keys.push(key);
      }
      keys.forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }
    flash(tSettings.clearLocalDone as string);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best effort
    }
    try {
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    router.push("/login");
  };

  const plan = (user?.plan as string) || "Free";
  const credits = typeof user?.credits === "number" ? user.credits : 0;

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pb-10">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-8"
          >
            {tSettings.title}
          </motion.h1>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200"
            >
              {notice || tSettings.saved}
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Profilo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                <UserRound className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
                {tSettings.profile}
              </h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.profileDesc}</p>

              <label htmlFor="settings-name" className="block text-sm text-zinc-300 mb-1.5">
                {tSettings.nameLabel}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus-visible:border-fuchsia-400/60"
                  placeholder={tSettings.nameLabel as string}
                />
                <button
                  type="button"
                  onClick={handleNameSave}
                  className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                >
                  {tSettings.save}
                </button>
              </div>
              {nameError && (
                <p role="alert" className="mt-2 text-sm text-red-400">
                  {nameError}
                </p>
              )}

              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-zinc-500">{tSettings.emailLabel}</p>
                  <p className="text-white truncate mt-0.5">{(user?.email as string) || "—"}</p>
                  <p className="text-[11px] text-zinc-600 mt-1">{tSettings.emailLocked}</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-xs text-zinc-500">
                    {tSettings.planLabel} · {tSettings.creditsLabel}
                  </p>
                  <p className="text-white mt-0.5">
                    {plan} · <span className="font-bold text-fuchsia-300">{credits}</span>
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block mt-1 text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300"
                  >
                    {tSettings.managePlan} →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Lingua */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.language}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.languageDesc}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(languages as Record<string, { label: string; flag: string }>).map(([code, l]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    aria-pressed={lang === code}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      lang === code
                        ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                        : "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase text-zinc-500">{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === code && (
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Ricerca lavoro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.jobPrefs}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.jobPrefsDesc}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="settings-market" className="block text-sm text-zinc-300 mb-1.5">
                    {tSettings.marketLabel}
                  </label>
                  <select
                    id="settings-market"
                    value={prefs.market}
                    onChange={(e) => handlePrefsChange({ ...prefs, market: e.target.value })}
                    className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus-visible:border-fuchsia-400/60"
                  >
                    <option value="" className="bg-zinc-900">{tSettings.marketAny}</option>
                    <option value="italia" className="bg-zinc-900">Italia</option>
                    <option value="europa" className="bg-zinc-900">Europa</option>
                    <option value="usa" className="bg-zinc-900">USA</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="settings-seniority" className="block text-sm text-zinc-300 mb-1.5">
                    {tSettings.seniorityLabel}
                  </label>
                  <select
                    id="settings-seniority"
                    value={prefs.seniority}
                    onChange={(e) => handlePrefsChange({ ...prefs, seniority: e.target.value })}
                    className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus-visible:border-fuchsia-400/60"
                  >
                    <option value="" className="bg-zinc-900">{tSettings.seniorityAny}</option>
                    <option value="junior" className="bg-zinc-900">Junior</option>
                    <option value="mid" className="bg-zinc-900">Mid</option>
                    <option value="senior" className="bg-zinc-900">Senior</option>
                  </select>
                </div>
              </div>
              <label className="mt-4 flex items-start gap-3 cursor-pointer rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={prefs.remoteOnly}
                  onChange={(e) => handlePrefsChange({ ...prefs, remoteOnly: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-fuchsia-500"
                />
                <span>
                  <span className="block text-sm text-white font-medium">{tSettings.remoteOnly}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">{tSettings.remoteOnlyDesc}</span>
                </span>
              </label>
            </motion.div>

            {/* Accessibilità */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.accessibility}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.accessibilityDesc}</p>
              <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => handleReduceMotion(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-fuchsia-500"
                />
                <span>
                  <span className="block text-sm text-white font-medium">{tSettings.reduceMotion}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">{tSettings.reduceMotionDesc}</span>
                </span>
              </label>
            </motion.div>

            {/* Privacy e dati */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.privacy}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.privacyDesc}</p>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{tSettings.exportData}</p>
                    <p className="text-xs text-zinc-500">{tSettings.exportDataDesc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={exporting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {exporting ? tSettings.exporting : tSettings.exportData}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{tSettings.clearLocal}</p>
                    <p className="text-xs text-zinc-500">{tSettings.clearLocalDesc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearLocal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    {tSettings.clearLocal}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{tSettings.deleteAccount}</p>
                    <p className="text-xs text-zinc-500">{tSettings.deleteAccountDesc}</p>
                  </div>
                  <Link
                    href="/contatti"
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                  >
                    {tSettings.deleteAccount}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sessione */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.session}</h2>
              <p className="text-sm text-zinc-400 mb-4">{tSettings.sessionDesc}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {tSettings.logout}
              </button>
            </motion.div>

            {/* Account (legacy, testo informativo) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{tSettings.account}</h2>
              <p className="text-sm text-zinc-400">{tSettings.accountDesc}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
