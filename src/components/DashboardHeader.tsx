"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  LogOut,
  LayoutDashboard,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface UserData {
  name?: string;
  email?: string;
  picture?: string;
  credits?: number;
  _id?: string;
  id?: string;
}

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
}

export default function DashboardHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onToggleCollapse,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const tNav = t.nav as Record<string, string>;
  const [user, setUser] = useState<UserData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    const checkUser = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
          }
        }
      } catch {
        // ignore silently
      }
    };
    checkUser();

    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-updated", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best effort
    }
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    router.push("/login");
  };

  const handleToggleMenu = () => {
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setShowMenu(!showMenu);
  };

  const menuContent = showMenu ? (
    <div
      ref={menuRef}
      style={{
        position: "fixed" as const,
        top: menuPos.top,
        right: menuPos.right,
        width: "240px",
        backgroundColor: "#18181b",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "8px 0",
        zIndex: 99999,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 0 40px rgba(232, 121, 249, 0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <p style={{ color: "white", fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.name || "Utente"}
        </p>
        <p style={{ color: "#a1a1aa", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "4px" }}>
          {user?.email}
        </p>
        {user?.credits !== undefined && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] text-fuchsia-300 font-semibold">
            <Sparkles className="w-2.5 h-2.5 text-fuchsia-400" />
            {user.credits} {tNav.credits as string}
          </div>
        )}
      </div>

      <Link
        href="/dashboard"
        onClick={() => setShowMenu(false)}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
        {tNav.dashboard as string}
      </Link>
      <Link
        href="/dashboard/cvs"
        onClick={() => setShowMenu(false)}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <FileText className="w-4 h-4 text-zinc-400" />
        {tNav.myCVs as string}
      </Link>
      <Link
        href="/dashboard/settings"
        onClick={() => setShowMenu(false)}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {(tNav.settings as string) || "Impostazioni"}
      </Link>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border-t border-white/5 mt-1"
      >
        <LogOut className="w-4 h-4" />
        {tNav.logout as string}
      </button>
    </div>
  ) : null;

  // Titolo della sezione corrente per l'header
  const sectionTitle = (() => {
    const tDash = t.dashboard as Record<string, string>;
    if (pathname === "/dashboard") return (tDash.overview as string) || "Dashboard";
    if (pathname?.startsWith("/dashboard/cvs")) return (tDash.myCVs as string) || "CV";
    if (pathname?.startsWith("/dashboard/analyze")) return (tDash.analyze as string) || "Analizza";
    if (pathname?.startsWith("/dashboard/create") || pathname?.startsWith("/dashboard/generate"))
      return (tDash.generate as string) || "Genera";
    if (pathname?.startsWith("/dashboard/interview")) return (tDash.interview as string) || "Colloqui";
    if (pathname?.startsWith("/dashboard/job-search")) return (tDash.jobSearch as string) || "Job Search";
    if (pathname?.startsWith("/dashboard/feedback")) return (tDash.feedback as string) || "Feedback";
    if (pathname?.startsWith("/dashboard/settings")) return (tNav.settings as string) || "Impostazioni";
    return "Dashboard";
  })();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto mt-3 rounded-2xl border border-white/10 bg-[#0d0d12]/80 backdrop-blur-xl shadow-lg shadow-black/30 px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
          {/* Sinistra: toggle sidebar + logo + titolo */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              data-tour="mobile-nav"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              aria-label="Apri menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              aria-label="Mostra o nascondi sidebar"
              title={sidebarCollapsed ? "Mostra sidebar" : "Nascondi sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
              <Image
                src="/curriculuxe.png"
                alt="Logo Curriculuxe"
                width={34}
                height={34}
                className="rounded-xl shrink-0"
              />
              <span className="text-xl font-bold text-white tracking-wide transition-all group-hover:text-fuchsia-400">
                Curriculuxe
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 min-w-0">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-600 -rotate-90 shrink-0" />
              <span className="text-sm font-medium text-zinc-300 truncate">{sectionTitle}</span>
            </div>
          </div>

          {/* Destra: crediti + avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {user?.credits !== undefined && (
              <Link
                href="/dashboard/settings"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                <span>{user.credits} {tNav.credits as string}</span>
              </Link>
            )}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleToggleMenu}
                aria-haspopup="menu"
                aria-expanded={showMenu}
                aria-label={user?.name ? `Menu utente di ${user.name}` : "Menu utente"}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-fuchsia-500/40 transition-colors cursor-pointer flex items-center justify-center bg-zinc-800"
              >
                {user?.picture ? (
                  <Image src={user.picture} alt={user.name || "User"} width={32} height={32} style={{ objectFit: "cover" }} />
                ) : (
                  <span className="text-white text-xs font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
