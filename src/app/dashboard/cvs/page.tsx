"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface StatusConfig {
  [key: string]: { label: string; color: string; icon: string };
}

const statusConfig: StatusConfig = {
  draft: { label: "Bozza", color: "bg-yellow-500/20 text-yellow-400", icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" },
  sent: { label: "Inviato", color: "bg-blue-500/20 text-blue-400", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  interview: { label: "Colloquio", color: "bg-purple-500/20 text-purple-400", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  offer: { label: "Offerta", color: "bg-emerald-500/20 text-emerald-400", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  rejected: { label: "Rifiutato", color: "bg-red-500/20 text-red-400", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
  accepted: { label: "Accettato", color: "bg-green-500/20 text-green-500", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
};

interface CVItem {
  _id?: string;
  id?: string;
  name?: string;
  template?: string;
  createdAt?: string;
  applicationStatus?: string;
}

export default function CVListPage() {
  const { t } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const [cvs, setCvs] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // L'autenticazione è già garantita dal layout dashboard.
    // Il server ricava l'utente dal cookie di sessione.
    const fetchCVs = async () => {
      try {
        const res = await fetch("/api/cv");
        if (res.ok) {
          const data = await res.json();
          setCvs(data);
        } else {
          setCvs([]);
        }
      } catch (err) {
        console.error("Error fetching CVs:", err);
        setError("Errore nel caricamento dei CV");
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handleStatusChange = async (cvId: string, newStatus: string) => {
    setUpdatingId(cvId);
    try {
      const res = await fetch(`/api/cv/${cvId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes: "" }),
      });

      if (res.ok) {
        setCvs(cvs.map(cv =>
          cv._id === cvId || cv.id === cvId
            ? { ...cv, applicationStatus: newStatus }
            : cv
        ));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm(tDash.confirmDelete)) return;

    try {
      const res = await fetch(`/api/cv/${cvId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCvs(cvs.filter(cv => cv._id !== cvId));
      }
    } catch (err) {
      console.error("Error deleting CV:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{tDash.myCVs}</h1>
              <p className="text-zinc-400">{tDash.emptyStateDesc}</p>
            </div>
            <Link
              href="/dashboard/create"
              className="btn-primary px-6 py-3 rounded-full font-medium whitespace-nowrap"
            >
              + {tDash.createNew}
            </Link>
          </motion.div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {cvs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tDash.noCVs}</h3>
              <p className="text-zinc-400 mb-8">{tDash.noCVsDesc}</p>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                {([
                  { href: "/dashboard/analyze", title: tDash.loadCV, desc: tDash.loadCVDesc },
                  { href: "/dashboard/create", title: tDash.createFromScratch, desc: tDash.createFromScratchDesc },
                  { href: "/dashboard/generate", title: tDash.generateFromOffer, desc: tDash.generateFromOfferDesc },
                ] as const).map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-xl bg-white/5 border border-white/10 p-5 hover:border-indigo-500/30 transition-all">
                    <p className="text-white font-semibold mb-2">{item.title}</p>
                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {cvs.map((cv, index) => {
                const currentStatus = cv.applicationStatus || "draft";
                const status = statusConfig[currentStatus] || statusConfig.draft;

                return (
                  <motion.div
                    key={cv._id || cv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-6 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${status.color} flex items-center justify-center`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={status.icon} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {cv.name || tDash.withoutName}
                          </h3>
                          <p className="text-zinc-500 text-sm">
                            {new Date(cv.createdAt || Date.now()).toLocaleDateString("it-IT")} &middot; Template: {cv.template || "moderno"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={currentStatus}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(cv._id || cv.id as string, e.target.value)}
                          disabled={updatingId === (cv._id || cv.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border bg-black/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-white`}
                        >
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <option key={key} value={key} className="bg-zinc-900 text-white">
                              {cfg.label}
                            </option>
                          ))}
                        </select>

                        <Link
                          href={`/dashboard/cv/${cv._id || cv.id}`}
                          className="px-4 py-1.5 text-sm text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        >
                          {tDash.view}
                        </Link>
                        <button
                          onClick={() => handleDelete(cv._id || cv.id as string)}
                          className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
