import type { Metadata, Viewport } from "next";
import "../globals.css";
import AppShell from "@/components/AppShell";
import { siteName, siteUrl } from "@/lib/seo";

const description =
  "Create, optimize and tailor your resume with artificial intelligence. ATS resume checker, AI resume builder, bullet rewriting and interview prep in a single platform.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Build the Perfect Resume with AI`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  keywords: [
    "resume builder",
    "AI resume builder",
    "resume maker",
    "create a resume",
    "ATS resume checker",
    "ATS score",
    "resume optimizer",
    "best resume builder",
    "free resume builder",
    "resume tailoring",
    "AI CV generator",
    "job application resume",
    "interview preparation",
    "cover letter generator",
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
    canonical: "/en",
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
    locale: "en_US",
    alternateLocale: ["it_IT"],
    url: `${siteUrl}/en`,
    siteName,
    title: `${siteName} - Build the Perfect Resume with AI`,
    description,
    images: [
      {
        url: `${siteUrl}/en/og`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Build the Perfect Resume with AI`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Build the Perfect Resume with AI`,
    description,
    images: [`${siteUrl}/en/og`],
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

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <AppShell lang="en">{children}</AppShell>;
}
