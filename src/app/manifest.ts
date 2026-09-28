import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Curriculuxe - AI CV Builder",
    short_name: "Curriculuxe",
    description: "Crea, ottimizza e analizza il tuo curriculum con l'AI",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1b4b",
    theme_color: "#4c1d95",
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
  };
}
