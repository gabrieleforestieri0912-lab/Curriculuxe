"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardLoading from "@/components/DashboardLoading";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const { t } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  // Chiudi la drawer mobile con Esc e ripristina il focus sul trigger.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  // Auth verificato una sola volta per sessione: niente più check duplicati
  // in ogni singola pagina (causa principale dei caricamenti lenti).
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        if (!cancelled) setAuthReady(true);
        return;
      }
      try {
        const res = await fetch("/api/auth/me");
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              setAuthReady(true);
              return;
            }
          }
          router.replace("/login");
        }
      } catch {
        if (!cancelled) router.replace("/login");
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authReady) {
    return (
      <>
        <div aria-hidden="true" className="fixed inset-0 subtle-grid opacity-35 pointer-events-none" />
        <div className="relative z-10">
          <DashboardLoading />
        </div>
      </>
    );
  }

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 subtle-grid opacity-35 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header della dashboard (fisso, al posto della navbar) */}
        <DashboardHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarOpen(true)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 bg-[#0d0d12]/60 backdrop-blur-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar desktop: parte del flusso della pagina, collassabile */}
            <aside
              data-tour="sidebar"
              className={`${
                sidebarCollapsed ? "lg:hidden" : "hidden lg:block"
              } lg:w-64 shrink-0 pt-24 px-5 pb-8 border-r border-white/10 bg-white/[0.02] transition-all`}
            >
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">
                {tDash.workspace as string}
              </p>
              <DashboardSidebar />
            </aside>

            {/* Contenuto della pagina */}
            <main id="main-content" className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>

      {/* Sidebar mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Chiudi menu"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            className="absolute left-0 top-0 bottom-0 w-72 glass-card rounded-none border-r border-white/10 p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                {tDash.workspace as string}
              </p>
              <button
                ref={drawerCloseRef}
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Chiudi menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
