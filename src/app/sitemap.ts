import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

  // Solo route pubbliche: le pagine /dashboard/* sono protette dal login
  // e non devono comparire nella sitemap.
  const routes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/analyze", priority: 0.8, changeFrequency: "monthly" },
    { path: "/resume-score", priority: 0.85, changeFrequency: "monthly" },
    { path: "/career-market", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" },
    { path: "/mcp", priority: 0.7, changeFrequency: "monthly" },
    { path: "/templates", priority: 0.7, changeFrequency: "monthly" },
    { path: "/roadmaps", priority: 0.7, changeFrequency: "monthly" },
    { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.6, changeFrequency: "monthly" },
    { path: "/salaries", priority: 0.6, changeFrequency: "monthly" },
    { path: "/compare", priority: 0.5, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
    { path: "/register", priority: 0.6, changeFrequency: "monthly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/success", priority: 0.3, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
