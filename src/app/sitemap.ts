import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { jobCatalog } from "@/lib/jobs";
import { absUrl } from "@/lib/seo";

const lastModified = new Date("2026-10-08");

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

const staticRoutes: Entry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/resume-score", priority: 0.9, changeFrequency: "weekly" },
  { path: "/analyze", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.85, changeFrequency: "weekly" },
  { path: "/career-market", priority: 0.85, changeFrequency: "daily" },
  { path: "/templates", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
  { path: "/mcp", priority: 0.7, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
  { path: "/roadmaps", priority: 0.7, changeFrequency: "monthly" },
  { path: "/salaries", priority: 0.7, changeFrequency: "monthly" },
  { path: "/register", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

/** Pagine con versione inglese: vietato duplicare contenuto italiano sotto /en. */
const englishRoutes: Entry[] = [
  { path: "", priority: 0.9, changeFrequency: "weekly" },
  { path: "/resume-score", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mcp", priority: 0.7, changeFrequency: "monthly" },
  { path: "/register", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
];

function withHreflang(path: string, lang: "it" | "en") {
  const clean = path === "" ? "/" : path;
  const enPath = clean === "/" ? "/en" : `/en${clean}`;
  return {
    languages: {
      it: absUrl(clean),
      en: absUrl(enPath),
      "x-default": absUrl(clean),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const clean = route.path === "" ? "/" : route.path;
    entries.push({
      url: absUrl(clean),
      lastModified: route.lastModified || lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: { ...withHreflang(route.path, "it").languages } },
    });
  }

  for (const route of englishRoutes) {
    const clean = route.path === "" ? "/en" : `/en${route.path}`;
    entries.push({
      url: absUrl(clean),
      lastModified: route.lastModified || lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: { ...withHreflang(route.path, "en").languages } },
    });
  }

  for (const guide of guides) {
    entries.push({
      url: absUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const job of jobCatalog) {
    entries.push({
      url: absUrl(`/career-market/${job.id}`),
      lastModified: new Date(job.postedAt),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}

export const dynamic = "force-static";
