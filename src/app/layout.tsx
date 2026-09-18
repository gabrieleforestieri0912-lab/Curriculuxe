import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Curriculuxe - Crea il Curriculum Perfetto con l'AI",
    template: "%s | Curriculuxe",
  },
  description:
    "Crea, ottimizza e perfeziona il tuo curriculum con l'intelligenza artificiale. Curriculuxe ti aiuta a distinguerti e conquistare il lavoro dei tuoi sogni.",
  applicationName: "Curriculuxe",
  authors: [{ name: "Curriculuxe", url: baseUrl }],
  creator: "Curriculuxe",
  publisher: "Curriculuxe",
  category: "technology",
  keywords: [
    "curriculum",
    "CV",
    "AI CV builder",
    "creatore di curriculum online",
    "analisi ATS",
    "ottimizzazione curriculum",
    "score ATS",
    "generazione CV con AI",
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
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: baseUrl,
    siteName: "Curriculuxe",
    title: "Curriculuxe - Crea il Curriculum Perfetto con l'AI",
    description:
      "Analisi ATS, generazione CV con AI, riscrittura bullet e preparazione ai colloqui. Tutto in un'unica piattaforma.",
    images: [
      {
        url: `${baseUrl}/icon.png`,
        width: 512,
        height: 512,
        alt: "Curriculuxe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curriculuxe - Crea il Curriculum Perfetto con l'AI",
    description:
      "Analisi ATS, generazione CV con AI, riscrittura bullet e preparazione ai colloqui. Tutto in un'unica piattaforma.",
    images: [`${baseUrl}/icon.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Curriculuxe",
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description:
      "Piattaforma AI-powered per creare, ottimizzare e monitorare curriculum professionali con analisi ATS e preparazione ai colloqui.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "gabriele.forestieri0912@gmail.com",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Curriculuxe",
    inLanguage: "it",
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [organizationSchema, websiteSchema],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:font-semibold"
        >
          Salta al contenuto
        </a>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
