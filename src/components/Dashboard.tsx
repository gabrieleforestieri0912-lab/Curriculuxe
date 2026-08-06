"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const tNav = (t as Record<string, Record<string, string>>).nav as Record<string, string>;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const quickActions = [
    { href: "/analyze", title: tDash.loadCV as string, desc: tDash.loadCVDesc as string, tone: "emerald" },
    { href: "/dashboard/create?mode=ai", title: tDash.generateFromOffer as string, desc: tDash.generateFromOfferDesc as string, tone: "indigo" },
    { href: "/dashboard/create?mode=manual", title: tDash.createFromScratch as string, desc: tDash.createFromScratchDesc as string, tone: "fuchsia" },
    { href: "/dashboard/interview", title: tDash.interview as string, desc: tDash.interviewDesc as string, tone: "pink" },
    { href: "/dashboard/job-search", title: tDash.jobSearch as string, desc: tDash.jobSearchDesc as string, tone: "emerald" },
  ];
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    const checkAuth = async () => {
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
          }
        } else if (!cachedData) {
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch {
        console.log("Auth check failed");
      } finally {
        setLoading(false);
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

    checkAuth().then(() => {
      fetchHistory();
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

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

  if (loading) return <DashboardSkeleton />;

  return (
    <section className="gradient-bg-animated relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-35" />
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-label="Applimix" className="h-7 w-7 bg-contain bg-center bg-no-repeat shrink-0" style={{ backgroundImage: "url(/applimix.png)" } as React.CSSProperties} />
            <span className="text-lg font-bold text-white">Applimix</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/8 text-zinc-400 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-white px-4 py-2">
              {tNav.logout as string}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto workspace-shell gap-6">
          <aside className={`glass-card rounded-2xl p-5 h-fit lg:sticky lg:top-28 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">{tDash.workspace as string}</p>
            <div className="space-y-2">
              {([
                [tDash.overview as string, "/dashboard"],
                [tDash.myCVs as string, "/dashboard/cvs"],
                [tDash.analyze as string, "/analyze"],
                [tDash.generate as string, "/dashboard/create?mode=ai"],
                [tDash.interview as string, "/dashboard/interview"],
                [tDash.jobSearch as string, "/dashboard/job-search"],
                [tDash.feedback as string, "/dashboard/feedback"],
              ] as const).map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {tDash.title as string} <span className="text-gradient">{tDash.titleHighlight as string}</span>
                </h1>
                <p className="text-zinc-400 text-lg">{tDash.welcome as string}, {(user?.name as string) || "utente"}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/create?mode=ai" className="btn-primary px-6 py-3 rounded-full font-semibold glow-border flex items-center gap-2 whitespace-nowrap">
                  {tDash.generateAI as string}
                </Link>
                <Link href="/dashboard/create?mode=manual" className="btn-secondary px-6 py-3 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap">
                  {tDash.manual as string}
                </Link>
              </div>
            </motion.div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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
                    <Link href="/analyze" className="btn-primary px-6 py-3 rounded-xl text-center font-semibold">
                      {tDash.openAnalysis as string}
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
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
                            <Link href={`/analyze/${item._id as string}`} className="text-indigo-400 text-sm hover:underline">{tDash.see as string}</Link>
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
                className="glass-card rounded-2xl p-6 h-fit xl:sticky xl:top-28"
              >
                <h2 className="text-lg font-semibold text-white mb-5">{tDash.progressPanel as string}</h2>
                <div className="space-y-5">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-purple-300 text-sm font-medium">{tDash.aiCredits as string}</p>
                      <span className="text-purple-300 text-lg font-bold">{(user?.credits as number) ?? 0}</span>
                    </div>
                    <button 
                      onClick={handleBuyCredits} 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2.5 rounded-lg font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                    >
                      {tDash.reload as string} (10 {tDash.creditsDesc as string}) - 9.99€
                    </button>
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
    </section>
  );
}
