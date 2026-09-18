"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const { t } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const pathname = usePathname();

  const links = [
    { label: tDash.overview as string, href: "/dashboard", match: (p: string) => p === "/dashboard" },
    { label: tDash.myCVs as string, href: "/dashboard/cvs", match: (p: string) => p.startsWith("/dashboard/cvs") },
    { label: tDash.analyze as string, href: "/dashboard/analyze", match: (p: string) => p.startsWith("/dashboard/analyze") },
    { label: tDash.generate as string, href: "/dashboard/create?mode=ai", match: (p: string) => p.startsWith("/dashboard/create") || p.startsWith("/dashboard/generate") },
    { label: tDash.interview as string, href: "/dashboard/interview", match: (p: string) => p.startsWith("/dashboard/interview") },
    { label: tDash.discover as string, href: "/dashboard/discover", match: (p: string) => p.startsWith("/dashboard/discover") },
    { label: tDash.jobSearch as string, href: "/dashboard/job-search", match: (p: string) => p.startsWith("/dashboard/job-search") },
    { label: tDash.feedback as string, href: "/dashboard/feedback", match: (p: string) => p.startsWith("/dashboard/feedback") },
  ];

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const active = link.match(pathname || "");
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`block rounded-xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "bg-indigo-500/15 text-white font-medium border border-indigo-500/30"
                : "text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
