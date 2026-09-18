import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

  return {
    rules: [
      {
        // Allow all crawlers, including AI/LLM crawlers (GPTBot, PerplexityBot,
        // ClaudeBot, Google-Extended, etc.) so chatbots can discover the platform.
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/success"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
