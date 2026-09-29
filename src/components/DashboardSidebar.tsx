"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Cpu,
  Sparkles,
  MessageSquare,
  Compass,
  Briefcase,
  Target,
  Bot,
  BookOpen,
  Map,
  FolderKanban,
  Banknote,
  GitCompare,
  Plug,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match: (p: string) => boolean;
}

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const { t } = useLanguage();
  const tDash = t.dashboard as Record<string, string>;
  const tNav = t.nav as Record<string, string>;
  const pathname = usePathname();

  // L'area di lavoro è l'unico punto di navigazione post-login: qui vivono
  // sia gli strumenti CV sia tutte le risorse, senza dover tornare alla
  // navbar pubblica. Ogni gruppo ha la sua intestazione.
  const groups: Array<{ title: string; items: SidebarItem[] }> = [
    {
      title: (tDash.workspace as string) || "Workspace",
      items: [
        { label: (tDash.overview as string) || "Panoramica", href: "/dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" },
        { label: (tDash.myCVs as string) || "I miei CV", href: "/dashboard/cvs", icon: FileText, match: (p) => p.startsWith("/dashboard/cvs") || p.startsWith("/dashboard/cv/") },
        { label: (tDash.analyze as string) || "Analizza", href: "/dashboard/analyze", icon: Cpu, match: (p) => p.startsWith("/dashboard/analyze") },
        { label: (tDash.generate as string) || "Genera CV", href: "/dashboard/create?mode=ai", icon: Sparkles, match: (p) => p.startsWith("/dashboard/create") || p.startsWith("/dashboard/generate") },
        { label: (tDash.interview as string) || "Colloqui", href: "/dashboard/interview", icon: MessageSquare, match: (p) => p.startsWith("/dashboard/interview") },
      ],
    },
    {
      title: (tDash.career as string) || "Ricerca lavoro",
      items: [
        { label: (tDash.discover as string) || "Discover", href: "/dashboard/discover", icon: Compass, match: (p) => p.startsWith("/dashboard/discover") },
        { label: (tDash.jobSearch as string) || "Ricerca e negoziazione", href: "/dashboard/job-search", icon: Briefcase, match: (p) => p.startsWith("/dashboard/job-search") },
        { label: (tDash.targets as string) || "Aziende target", href: "/dashboard/targets", icon: Target, match: (p) => p.startsWith("/dashboard/targets") },
        { label: (tDash.assistant as string) || "Assistente AI", href: "/dashboard/assistant", icon: Bot, match: (p) => p.startsWith("/dashboard/assistant") },
      ],
    },
    {
      title: (tNav.resources as string) || "Risorse",
      items: [
        { label: (tNav.careerMarket as string) || "Career Market", href: "/career-market", icon: Briefcase, match: (p) => p.startsWith("/career-market") },
        { label: (tNav.templates as string) || "Template CV", href: "/templates", icon: FileText, match: (p) => p.startsWith("/templates") },
        { label: "Guide", href: "/guides", icon: BookOpen, match: (p) => p.startsWith("/guides") },
        { label: "Roadmap", href: "/roadmaps", icon: Map, match: (p) => p.startsWith("/roadmaps") },
        { label: "Progetti", href: "/projects", icon: FolderKanban, match: (p) => p.startsWith("/projects") },
        { label: "Salaries", href: "/salaries", icon: Banknote, match: (p) => p.startsWith("/salaries") },
        { label: (tNav.compare as string) || "Confronta", href: "/compare", icon: GitCompare, match: (p) => p.startsWith("/compare") },
        { label: (tNav.mcp as string) || "Connect AI", href: "/mcp", icon: Plug, match: (p) => p.startsWith("/mcp") },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2 px-3">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = item.match(pathname || "");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  title={item.label}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-indigo-500/15 text-white font-medium border border-indigo-500/30"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-indigo-300" : "text-zinc-500"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2 px-3">
          {(tNav.account as string) || "Account"}
        </p>
        <div className="space-y-1">
          {[
            {
              label: (tNav.settings as string) || "Impostazioni",
              href: "/dashboard/settings",
              icon: Settings,
              active: !!pathname?.startsWith("/dashboard/settings"),
            },
            {
              label: (tDash.feedback as string) || "Feedback",
              href: "/dashboard/feedback",
              icon: MessageSquare,
              active: !!pathname?.startsWith("/dashboard/feedback"),
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={onNavigate}
                aria-current={item.active ? "page" : undefined}
                title={item.label}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  item.active
                    ? "bg-indigo-500/15 text-white font-medium border border-indigo-500/30"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.active ? "text-indigo-300" : "text-zinc-500"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
