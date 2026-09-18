"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Register() {
  const { t } = useLanguage();
  const tAuth = t.auth as Record<string, string>;
  const tNav = (t as Record<string, Record<string, string>>).nav;
  const router = useRouter();
  const [formData, setFormData] = useState<{ name: string; email: string; password: string }>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Dopo la registrazione si torna alla dashboard, oppure all'area di azione
  // da cui si è arrivati (es. una pagina protetta visitata da non loggato).
  const getNext = (): string => {
    if (typeof window === "undefined") return "/dashboard";
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    return "/dashboard";
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const next = getNext();
      const res = await fetch(`/api/auth/supabase-google?next=${encodeURIComponent(next)}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL OAuth non ricevuto");
      }
    } catch (err) {
      setError((err as Error).message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!formData.name.trim()) {
      errs.name = "Inserisci il tuo nome";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Inserisci un indirizzo email valido";
    }
    if (formData.password.length < 8) {
      errs.password = "La password deve avere almeno 8 caratteri";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (tAuth.errorGeneric as string));
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(getNext());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-indigo-900 text-white">
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {tNav.backHome}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <div className="glass-card rounded-xl p-8 shadow-lg w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">{tAuth.registerTitle}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-zinc-300 mb-1"
              >
                {tAuth.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none ${fieldErrors.name ? "border-red-500/60" : "border-white/10"}`}
                placeholder="Mario Rossi"
              />
              {fieldErrors.name && (
                <p id="name-error" role="alert" className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-zinc-300 mb-1"
              >
                {tAuth.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none ${fieldErrors.email ? "border-red-500/60" : "border-white/10"}`}
                placeholder="la.tua@email.com"
              />
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-zinc-300 mb-1"
              >
                {tAuth.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none pr-12 ${fieldErrors.password ? "border-red-500/60" : "border-white/10"}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                    {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                  </svg>
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" role="alert" className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>
            {error && (
              <p role="alert" className="text-red-400 text-sm text-center">{error}</p>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold text-sm transition-all glow-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrazione in corso..." : tAuth.registerButton}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-purple-900 px-3 text-zinc-400">
                o continua con
              </span>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.17-4.53H2.18v2.84C3.96 20.3 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.83 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.38 8.55 1 10.22 1 12s.38 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l2.83-2.84C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.7 2.18 7.0l2.85 2.84C6.71 5.31 9.11 4.75 12 4.75z"
              />
            </svg>
            {googleLoading
              ? "Registrazione con Google..."
              : tAuth.registerGoogle}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
