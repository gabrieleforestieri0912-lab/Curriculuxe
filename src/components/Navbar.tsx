"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sparkles, 
  MessageSquare, 
  LayoutTemplate, 
  Cpu, 
  LogOut, 
  LayoutDashboard,
  FileText,
  ChevronDown
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

interface NavChild {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavLink {
  label: string;
  href: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const tNav = t.nav as Record<string, string>;
  const [user, setUser] = useState<UserData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
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
      // best effort: anche se la chiamata fallisce, puliamo il localStorage
    }
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    setIsMobileOpen(false);
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

  // Per gli utenti non loggati, i link delle aree di azione passano ?next= in modo
  // che dopo il login si venga reindirizzati alla dashboard o all'area voluta.
  const loginWithNext = (path: string) => `/login?next=${encodeURIComponent(path)}`;

  const navLinks: NavLink[] = [
    { label: tNav.features as string, href: "/#features" },
    { label: tNav.howItWorks as string, href: "/#how-it-works" },
    {
      label: tNav.templates as string,
      href: user ? "/dashboard/create" : loginWithNext("/dashboard/create"),
      badge: "PRO",
      icon: LayoutTemplate,
      children: [
        { label: tNav.templatesCreateManual as string, href: user ? "/dashboard/create?mode=manual" : loginWithNext("/dashboard/create?mode=manual"), icon: FileText },
        { label: tNav.templatesGenerateAI as string, href: user ? "/dashboard/create?mode=ai" : loginWithNext("/dashboard/create?mode=ai"), icon: Sparkles },
        { label: tNav.templatesMyCVs as string, href: user ? "/dashboard/cvs" : loginWithNext("/dashboard/cvs"), icon: LayoutDashboard },
      ],
    },
    {
      label: tNav.aiAnalyzer as string,
      href: user ? "/analyze" : loginWithNext("/analyze"),
      badge: "AI",
      icon: Cpu,
      children: [
        { label: tNav.aiAnalyze as string, href: user ? "/analyze" : loginWithNext("/analyze"), icon: Cpu },
        { label: tNav.aiGenerate as string, href: user ? "/dashboard/create?mode=ai" : loginWithNext("/dashboard/create?mode=ai"), icon: Sparkles },
        { label: tNav.aiInterview as string, href: user ? "/dashboard/interview" : loginWithNext("/dashboard/interview"), icon: MessageSquare },
        { label: tNav.aiFeedback as string, href: user ? "/dashboard/feedback" : loginWithNext("/dashboard/feedback"), icon: MessageSquare },
      ],
    },
    { label: tNav.pricing as string, href: "/#pricing" },
  ];

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
        <p style={{ color: "#a1a1aa", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "4px" }}>{user?.email}</p>
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
        href={user ? "/dashboard/cvs" : "/login"} 
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
        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-lg shadow-black/30 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-w-0">
            <span className="text-lg sm:text-xl font-bold text-white tracking-wide transition-all group-hover:text-fuchsia-400">
              Curriculuxe
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/8 rounded-full p-1 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              if (link.children?.length) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-all hover:bg-white/5 group cursor-pointer"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-fuchsia-400 transition-colors" />}
                      {link.label}
                      {link.badge && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                          link.badge === "AI" 
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                        }`}>
                          {link.badge}
                        </span>
                      )}
                      <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                        >
                          <div className="min-w-[220px] rounded-2xl border border-white/10 bg-[#18181b]/95 backdrop-blur-xl shadow-lg shadow-black/30 p-2">
                            {link.children.map((child) => {
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-all hover:bg-white/5"
                                >
                                  {ChildIcon && <ChildIcon className="w-4 h-4 text-zinc-500" />}
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-all hover:bg-white/5 group"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-fuchsia-400 transition-colors" />}
                  {link.label}
                  {link.badge && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      link.badge === "AI" 
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right action area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {user.credits !== undefined && (
                  <Link 
                    href="/dashboard"
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
                    className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-fuchsia-500/40 transition-colors cursor-pointer flex items-center justify-center bg-zinc-800"
                  >
                    {user.picture ? (
                      <Image src={user.picture} alt={user.name || "User"} width={32} height={32} style={{ objectFit: "cover" }} />
                    ) : (
                      <span className="text-white text-xs font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2">
                  {tNav.login as string}
                </Link>
                <Link href="/register" className="btn-primary text-xs sm:text-sm text-white px-4 sm:px-5 py-2.5 rounded-full font-bold shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 transition-all scale-100 hover:scale-[1.02]">
                  {tNav.register as string}
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/8 text-zinc-400 hover:text-white transition-all"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div className="max-w-6xl mx-auto mt-2 lg:hidden">
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-lg shadow-black/30 overflow-hidden"
              >
              <div className="px-6 py-6 space-y-4">
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    if (link.children?.length) {
                      const isOpen = openMobile === link.label;
                      return (
                        <div key={link.label}>
                          <button
                            onClick={() => setOpenMobile(isOpen ? null : link.label)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {Icon && <Icon className="w-4 h-4 text-zinc-400" />}
                              <span className="font-medium text-sm">{link.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {link.badge && (
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  link.badge === "AI" 
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                }`}>
                                  {link.badge}
                                </span>
                              )}
                              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-3 pl-3 border-l border-white/10 space-y-1 mt-1">
                                  {link.children.map((child) => {
                                    const ChildIcon = child.icon;
                                    return (
                                      <Link
                                        key={child.label}
                                        href={child.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                                      >
                                        {ChildIcon && <ChildIcon className="w-4 h-4 text-zinc-500" />}
                                        <span className="font-medium text-sm">{child.label}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="w-4 h-4 text-zinc-400" />}
                          <span className="font-medium text-sm">{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            link.badge === "AI" 
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {user && (
                  <div className="border-t border-white/5 pt-4 mt-2 space-y-3">
                    <div className="flex items-center justify-between px-3">
                      <div>
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-zinc-500 text-xs">{user.email}</p>
                      </div>
                      {user.credits !== undefined && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] text-fuchsia-300 font-bold">
                          <Sparkles className="w-3 h-3" />
                          {user.credits} {tNav.credits as string}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        {tNav.dashboard as string}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {tNav.logout as string}
                      </button>
                    </div>
                  </div>
                )}
                {!user && (
                  <div className="border-t border-white/5 pt-4 mt-2 grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-zinc-300 hover:text-white"
                    >
                      {tNav.login as string}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-center p-3 rounded-xl btn-primary text-sm font-bold text-white"
                    >
                      {tNav.register as string}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </nav>

      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
