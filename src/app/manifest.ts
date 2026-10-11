import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Curriculuxe - AI CV Builder",
    short_name: "Curriculuxe",
    description:
      "Crea, ottimizza e analizza il tuo curriculum con l'AI: score ATS, generazione CV e preparazione ai colloqui.",
    lang: "it",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#07070d",
    theme_color: "#4c1d95",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/curriculuxe.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/curriculuxe.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Analizza il CV",
        short_name: "Analizza",
        url: "/resume-score",
      },
      {
        name: "Career Market",
        short_name: "Offerte",
        url: "/career-market",
      },
      {
        name: "I miei CV",
        short_name: "Dashboard",
        url: "/dashboard",
      },
    ],
  };
}
