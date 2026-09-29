"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import DashboardTour from "@/components/DashboardTour";
import type { TourStep } from "@/components/DashboardTour";
import { getTranslations } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

export default function Dashboard() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const tTour = (t.dashboard as Record<string, unknown>).tour as Record<string, unknown>;

  // I passi del tour: contenuti da i18n, selettori sugli elementi da evidenziare.
  const tourSteps = useMemo<TourStep[]>(() => {
    const tTourForLang = (getTranslations(lang).dashboard as Record<string, unknown>).tour as Record<string, unknown>;
    const steps = (tTourForLang?.steps as Array<Record<string, string>>) ?? [];
    return [
      { targets: ["[data-tour='sidebar']", "[data-tour='mobile-nav']"], title: steps[0]?.title ?? "", description: steps[0]?.description ?? "" },
      { targets: ["[data-tour='generate-ai']"], title: steps[1]?.title ?? "", description: steps[1]?.description ?? "" },
      { targets: ["[data-tour='quick-actions']"], title: steps[2]?.title ?? "", description: steps[2]?.description ?? "" },
      { targets: ["[data-tour='analyze-bar']"], title: steps[3]?.title ?? "", description: steps[3]?.description ?? "" },
      { targets: ["[data-tour='credits']"], title: steps[4]?.title ?? "", description: steps[4]?.description ?? "" },
      { targets: ["[data-tour='recent']"], title: steps[5]?.title ?? "", description: steps[5]?.description ?? "" },
    ];
  }, [lang]);

  const tourLabels = {
    next: (tTour?.next as string) || "Avanti",
    prev: (tTour?.prev as string) || "Indietro",
    skip: (tTour?.skip as string) || "Salta",
    finish: (tTour?.finish as string) || "Inizia",
  };

  const quickActions = [
    { href: "/dashboard/discover", title: tDash.discover as string, desc: tDash.discoverDesc as string, tone: "emerald" },
    { href: "/dashboard/analyze", title: tDash.loadCV as string, desc: tDash.loadCVDesc as string, tone: "emerald" },
    { href: "/dashboard/create?mode=ai", title: tDash.generateFromOffer as string, desc: tDash.generateFromOfferDesc as string, tone: "indigo" },
    { href: "/dashboard/create?mode=manual", title: tDash.createFromScratch as string, desc: tDash.createFromScratchDesc as string, tone: "fuchsia" },
    { href: "/dashboard/interview", title: tDash.interview as string, desc: tDash.interviewDesc as string, tone: "pink" },
    { href: "/dashboard/job-search", title: tDash.jobSearch as string, desc: tDash.jobSearchDesc as string, tone: "emerald" },
  ];
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    // L'autenticazione è già garantita dal layout dashboard.
    // Qui carichiamo solo i dati utente (crediti) per la UI.
    const loadUser = async () => {
      const cachedData = localStorage.getItem("user");
      if (cachedData) {
        setUser(JSON.parse(cachedData));
        setLoading(false);
      }

      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            window.dispatchEvent(new Event("user-updated"));
            // Onboarding: al primo accesso senza profilo completato si va al wizard.
            checkOnboarding(String(data.user.id));
          }
        }
      } catch {
        console.log("Auth check failed");
      } finally {
        setLoading(false);
      }
    };

    const checkOnboarding = async (userId: string) => {
      try {
        const raw = localStorage.getItem(`curriculuxe:onboarding:${userId}`);
        if (raw && JSON.parse(raw).completed) return;
      } catch {
        // si verifica lato server
      }
      try {
        const res = await fetch("/api/onboarding/status");
        if (res.ok) {
          const data = await res.json();
          if (!data.completed) router.push("/dashboard/onboarding");
        }
      } catch {
        // offline: resta in dashboard
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/cv/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.analyses || []);
        }
      } catch {
        console.error("Failed to fetch history");
      }
    };

    loadUser().then(() => {
      fetchHistory();
    });
  }, []);

  // Tour guidato: si apre una volta per sessione all'accesso alla dashboard.
  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      try {
        if (!sessionStorage.getItem("curriculuxe_tour_seen")) {
          sessionStorage.setItem("curriculuxe_tour_seen", "1");
          setTourOpen(true);
        }
      } catch {
        // storage non disponibile: non aprire il tour
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [loading]);

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/checkout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "credits10" })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to buy credits");
    }
  };

  const handleSubscribeStarter = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter", billingCycle: "monthly" })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to subscribe to Starter");
    }
  };

  if (loading) return <DashboardSkeleton />;

  const userPlan = (user?.plan as string) || null;
  const userCredits = (user?.credits as number) ?? 0;
  const outOfCredits = userCredits === 0;
  const planName =
    userPlan === "starter" ? "Starter"
    : userPlan === "pro" ? "Pro"
    : userPlan === "enterprise" ? "Enterprise"
    : "Free";

  return (
    <section className="relative min-h-screen overflow-hidden">

      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {tDash.title as string} <span className="text-gradient">{tDash.titleHighlight as string}</span>
                </h1>
                <p className="text-zinc-400 text-lg">{tDash.welcome as string}, {(user?.name as string) || "utente"}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  data-tour="generate-ai"
                  href="/dashboard/create?mode=ai"
                  className="btn-primary px-6 py-3 rounded-full font-semibold glow-border flex items-center gap-2 whitespace-nowrap"
                >
                  {tDash.generateAI as string}
                </Link>
                <Link href="/dashboard/create?mode=manual" className="btn-secondary px-6 py-3 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap">
                  {tDash.manual as string}
                </Link>
                <button
                  onClick={() => setTourOpen(true)}
                  className="btn-secondary px-6 py-3 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  <Play className="w-4 h-4" />
                  {tDash.replayTour as string}
                </button>
              </div>
            </motion.div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  data-tour="quick-actions"
                  className="grid md:grid-cols-3 gap-4"
                >
                  {quickActions.map((action) => (
                    <Link key={action.href} href={action.href} className="glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 transition-all">
                      <p className="text-white font-semibold mb-1">{action.title}</p>
                      <p className="text-zinc-500 text-sm">{action.desc}</p>
                    </Link>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  data-tour="analyze-bar"
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{tDash.jobCommandBar as string}</h2>
                    <span className="text-xs text-zinc-500">{tDash.quickStart as string}</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-zinc-500">
                      {tDash.jobCommandPlaceholder as string}
                    </div>
                    <Link href="/dashboard/discover" className="btn-primary px-6 py-3 rounded-xl text-center font-semibold">
                      {tDash.discover as string}
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                  data-tour="recent"
                  className="glass-card rounded-2xl p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-6">{tDash.recentAnalyses as string}</h2>
                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer">
                          <div>
                            <p className="text-white font-medium">{item.fileName as string || "CV Analizzato"}</p>
                            <p className="text-zinc-500 text-xs">{new Date(item.createdAt as string).toLocaleDateString('it-IT')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold ${Number(item.score) >= 80 ? 'text-emerald-400' : Number(item.score) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {item.score as number}/100
                            </span>
                            <Link href={`/dashboard/analyze/${(item as Record<string, unknown>).id as string}`} className="text-indigo-400 text-sm hover:underline">{tDash.see as string}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-4 gap-3">
                      {([
                        { label: tDash.drafts as string, key: "draft" },
                        { label: tDash.sent as string, key: "sent" },
                        { label: tDash.interviewStatus as string, key: "interview" },
                        { label: tDash.followUp as string, key: "offer" },
                      ] as const).map((stage, index) => (
                        <Link
                          key={stage.key}
                          href="/dashboard/cvs"
                          className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-400" />
                            <p className="text-white text-sm font-medium">{stage.label}</p>
                          </div>
                          <p className="text-zinc-500 text-xs">{tDash.noApplication as string}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                data-tour="credits"
                className="glass-card rounded-2xl p-6 h-fit xl:sticky xl:top-28"
              >
                <h2 className="text-lg font-semibold text-white mb-5">{tDash.progressPanel as string}</h2>
                <div className="space-y-5">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-purple-300 text-sm font-medium">{tDash.aiCredits as string}</p>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white">
                        {tDash.planLabel as string} {planName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-300 text-lg font-bold">{userCredits}</span>
                      <span className="text-purple-300/70 text-xs">{tDash.creditsDesc as string}</span>
                    </div>

                    {outOfCredits ? (
                      <div className="space-y-2">
                        <p className="text-amber-300 text-xs">
                          {tDash.outOfCredits as string}. {tDash.starterSuggestion as string}.
                        </p>
                        <button
                          onClick={handleSubscribeStarter}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2.5 rounded-lg font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                        >
                          {tDash.subscribeStarter as string} - {tDash.starterPrice as string}
                        </button>
                        <button
                          onClick={handleBuyCredits}
                          className="w-full bg-white/10 hover:bg-white/15 text-white text-xs py-2.5 rounded-lg font-semibold transition-colors border border-white/10"
                        >
                          {tDash.reload as string} (10 {tDash.creditsDesc as string}) - 9.99€
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleBuyCredits}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2.5 rounded-lg font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                      >
                        {tDash.reload as string} (10 {tDash.creditsDesc as string}) - 9.99€
                      </button>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400 text-sm">{tDash.cvScore as string}</span>
                      <span className="text-emerald-300 text-sm">{(user?.score as number) || 0}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((user?.score as number) || 0, 100)}%` }}
                        transition={{ duration: 0.9 }}
                        className="h-full bg-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                      <p className="text-zinc-500 text-xs mb-1">{tDash.cvCreated as string}</p>
                      <p className="text-2xl font-bold text-indigo-300">
                        <AnimatedCounter value={(user?.cvCount as number) || 0} />
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                      <p className="text-zinc-500 text-xs mb-1">{tDash.keywords as string}</p>
                      <p className="text-2xl font-bold text-fuchsia-300">
                        <AnimatedCounter value={(user?.keywordCount as number) || 0} />
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
                    <p className="text-indigo-300 text-sm font-medium mb-1">{tDash.nextAction as string}</p>
                    <p className="text-zinc-400 text-sm">{tDash.nextActionDesc as string}</p>
                  </div>
                </div>
              </motion.aside>
            </div>
          </main>
        </div>
      </div>

      <DashboardTour
        steps={tourSteps}
        open={tourOpen}
        labels={tourLabels}
        onClose={() => setTourOpen(false)}
      />
    </section>
  );
}
