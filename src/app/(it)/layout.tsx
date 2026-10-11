import type { Metadata, Viewport } from "next";
import "../globals.css";
import AppShell from "@/components/AppShell";
import { siteName, siteUrl } from "@/lib/seo";

const description =
  "Crea, ottimizza e perfeziona il tuo curriculum con l'intelligenza artificiale. Analisi ATS, generazione CV con AI, riscrittura dei bullet e preparazione ai colloqui: tutto in un'unica piattaforma.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Crea il Curriculum Perfetto con l'AI`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  keywords: [
    "curriculum",
    "curriculum con AI",
    "creare curriculum",
    "creatore di curriculum online",
    "CV con intelligenza artificiale",
    "AI CV builder",
    "generatore di CV",
    "analisi ATS",
    "score ATS",
    "ottimizzazione curriculum",
    "ATS checker",
    "curriculum per aziende",
    "curriculum da zero",
    "preparazione colloqui",
    "curriculum professionale",
    "curriculuxe",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { it: "/", en: "/en", "x-default": "/" },
  },
  icons: {
    icon: [{ url: "/curriculuxe.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/curriculuxe.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/curriculuxe.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName,
    title: `${siteName} - Crea il Curriculum Perfetto con l'AI`,
    description,
    images: [
      {
        url: `${siteUrl}/og`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Crea il Curriculum Perfetto con l'AI`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Crea il Curriculum Perfetto con l'AI`,
    description,
    images: [`${siteUrl}/og`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4c1d95",
  colorScheme: "dark",
};

export default function ItalianLayout({ children }: { children: React.ReactNode }) {
  return <AppShell lang="it">{children}</AppShell>;
}
