"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";

/**
 * Guscio di tutte le pagine /dashboard/*: stesso sfondo della landing,
 * header e sidebar statici nel flusso (niente fixed). Le pagine figlie
 * usano padding superiore ridotto. Su mobile la sidebar diventa drawer.
 */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="page-bg relative min-h-screen flex flex-col">
      <DashboardHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setMobileOpen((open) => !open)}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      <div className="flex-1 w-full flex items-start gap-4 px-4 sm:px-6 pb-10">
        {/* Sidebar desktop */}
        <aside
          data-tour="sidebar"
          className={`hidden lg:block w-64 shrink-0 self-start sticky top-4 rounded-2xl border border-white/10 bg-[#0b0b14]/80 backdrop-blur-xl p-4 mt-4 max-h-[calc(100vh-2rem)] overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? "lg:hidden" : ""
          }`}
        >
          <DashboardSidebar />
        </aside>

        <main className="flex-1 min-w-0 pt-4">{children}</main>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-72 max-w-[85vw] border-r border-white/10 bg-[#0b0b14] p-4 pt-5 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-white">Curriculuxe</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Chiudi menu"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
