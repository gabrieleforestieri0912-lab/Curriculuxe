import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app"
).replace(/\/+$/, "");

export const siteName = "Curriculuxe";

export const supportEmail = "gabriele.forestieri0912@gmail.com";

export const socialProfiles = {
  github: "https://github.com/gabrieleforestieri0912-lab",
};

export type SiteLang = "it" | "en";

export const siteLangs: SiteLang[] = ["it", "en"];

export const ogLocales: Record<SiteLang, string> = {
  it: "it_IT",
  en: "en_US",
};

export const htmlLang: Record<SiteLang, string> = {
  it: "it",
  en: "en",
};

export const ogImage = {
  url: `${siteUrl}/og`,
  width: 1200,
  height: 630,
  alt: "Curriculuxe - Crea il Curriculum Perfetto con l'AI",
};

export const ogImageEn = {
  url: `${siteUrl}/en/og`,
  width: 1200,
  height: 630,
  alt: "Curriculuxe - Build the Perfect Resume with AI",
};

export function imageFor(lang: SiteLang) {
  return lang === "en" ? ogImageEn : ogImage;
}

export function absUrl(path: string): string {
  if (!path) return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * L'italiano vive sugli URL canonici senza prefisso (`/pricing`), l'inglese
 * sotto `/en`. Cosi' i link gia' condivisi continuano a valere e le due
 * versioni non si cannibalizzano.
 */
export function localizedPath(lang: SiteLang, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (lang === "it") return clean || "/";
  return clean ? `/en${clean}` : "/en";
}

export function alternatesFor(path: string) {
  // Dichiarare hreflang verso una pagina che non esiste e' un errore che
  // fa ignorare l'intero set di alternates: qui lo emettiamo solo quando
  // la versione inglese e' reale.
  return {
    canonical: localizedPath("it", path),
    languages: hasEnglishVersion(path)
      ? {
          it: localizedPath("it", path),
          en: localizedPath("en", path),
          "x-default": localizedPath("it", path),
        }
      : { "x-default": localizedPath("it", path) },
  };
}

export function alternatesForLang(lang: SiteLang, path: string) {
  const base = alternatesFor(path);
  return {
    canonical: localizedPath(lang, path),
    languages: base.languages,
  };
}

type BuildMetadataArgs = {
  lang: SiteLang;
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function buildMetadata({
  lang,
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}: BuildMetadataArgs): Metadata {
  const url = absUrl(localizedPath(lang, path));
  const image = imageFor(lang);

  return {
    title,
    description,
    keywords,
    alternates: alternatesForLang(lang, path),
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 },
        },
    openGraph: {
      type,
      locale: ogLocales[lang],
      url,
      siteName,
      title,
      description,
      images: [{ url: image.url, width: image.width, height: image.height, alt: image.alt }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absUrl("/curriculuxe.png"),
      width: 512,
      height: 512,
    },
    image: absUrl("/curriculuxe.png"),
    description:
      "Curriculuxe e' la piattaforma AI per creare, ottimizzare e analizzare curriculum professionali: score ATS, generazione CV con AI e preparazione ai colloqui.",
    email: supportEmail,
    foundingDate: "2025",
    areaServed: ["IT", "EU", "US", "GB"],
    knowsLanguage: ["it", "en"],
    sameAs: [socialProfiles.github],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: supportEmail,
      availableLanguage: ["Italian", "English"],
      areaServed: ["IT", "EU"],
    },
  };
}

export function websiteSchema(lang: SiteLang) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    inLanguage: ogLocales[lang],
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function softwareApplicationSchema(lang: SiteLang, description: string) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: siteName,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Resume Builder",
    operatingSystem: "Web",
    url: siteUrl,
    description,
    inLanguage: ogLocales[lang],
    featureList: [
      "Generazione CV con AI",
      "Analisi e score ATS",
      "Ottimizzazione per sistemi di tracciamento",
      "Riscrittura dei bullet con AI",
      "Preparazione ai colloqui",
      "Career Market e offerte di lavoro",
    ],
    publisher: { "@id": `${siteUrl}/#organization` },
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Starter", price: "4.99", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Pro", price: "6.99", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Enterprise", price: "9.99", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    ],
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(lang: SiteLang, path: string, trail: { name: string; path: string }[]) {
  const items = trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: absUrl(localizedPath(lang, crumb.path)),
  }));
  return {
    "@type": "BreadcrumbList",
    "@id": `${absUrl(localizedPath(lang, path))}#breadcrumb`,
    itemListElement: items,
  };
}

export function collectionPageSchema(
  lang: SiteLang,
  path: string,
  name: string,
  description: string,
  items: { name: string; path: string }[]
) {
  return {
    "@type": "CollectionPage",
    "@id": `${absUrl(localizedPath(lang, path))}#collection`,
    url: absUrl(localizedPath(lang, path)),
    name,
    description,
    inLanguage: ogLocales[lang],
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absUrl(localizedPath(lang, item.path)),
      })),
    },
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Pagine con una versione inglese. Gli altri contenuti (guide, Career
 * Market, salari, roadmap, progetti) esistono solo in italiano: non li
 * duplico sotto /en per non creare pagine gemelle, quindi i link restano
 * sui URL italiani.
 */
const englishPaths = new Set([
  "/",
  "/pricing",
  "/resume-score",
  "/templates",
  "/mcp",
  "/about",
  "/register",
  "/login",
]);

/** True solo se la pagina ha davvero una versione inglese sotto /en. */
export function hasEnglishVersion(path: string): boolean {
  const clean = path === "" ? "/" : path;
  return englishPaths.has(clean);
}

export function navHref(lang: string | undefined, path: string): string {
  if (lang !== "en") return path;
  if (path.includes("#") || path.startsWith("mailto:") || path.startsWith("http")) {
    return path;
  }
  const clean = path === "/" ? "/" : path.replace(/\/$/, "");
  if (!englishPaths.has(clean)) return path;
  return clean === "/" ? "/en" : `/en${clean}`;
}
