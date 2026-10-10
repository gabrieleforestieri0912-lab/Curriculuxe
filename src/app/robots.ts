import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/analyze/",
          "/success",
          "/login",
          "/en/login",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "anthropic-ai",
          "Bytespider",
          "Amazonbot",
          "FacebookBot",
          "Meta-ExternalAgent",
        ],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/analyze/", "/success", "/login"],
      },
      {
        userAgent: ["Google-Extended", "PerplexityBot", "ClaudeBot", "Applebot-Extended"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/analyze/", "/success"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: absUrl("/"),
  };
}
