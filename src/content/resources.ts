import type { Difficulty, ResourceMeta } from "./types";

/**
 * Le cinque risorse pubbliche. Le etichette qui sono la fonte di verita':
 * le usano il menu Risorse, il footer e le tab del hub, cosi' non possono
 * divergere ("Roadmap" vs "Roadmap di carriera").
 */
export const resources: ResourceMeta[] = [
  {
    slug: "guides",
    href: "/guides",
    label: "Guide",
    navLabel: "Guide",
    description: "Guide operative per CV, ATS, cover letter, colloqui e negoziazione.",
  },
  {
    slug: "roadmaps",
    href: "/roadmaps",
    label: "Roadmap di carriera",
    navLabel: "Roadmap di carriera",
    description: "Percorsi per ruolo con tappe, progetti e criteri di verifica.",
  },
  {
    slug: "projects",
    href: "/projects",
    label: "Progetti da portfolio",
    navLabel: "Progetti da portfolio",
    description: "Progetti da costruire per dimostrare una skill nel CV.",
  },
  {
    slug: "salaries",
    href: "/salaries",
    label: "Stipendi tech",
    navLabel: "Stipendi tech",
    description: "Fasce salariali dagli annunci verificati del Career Market.",
  },
  {
    slug: "compare",
    href: "/compare",
    label: "Confronto",
    navLabel: "Confronto",
    description: "Cosa Curriculuxe fa, cosa no, e cosa fanno i builder generici.",
  },
  {
    slug: "about",
    href: "/about",
    label: "Chi siamo",
    navLabel: "Chi siamo",
    description: "Missione, principi e come trattiamo i tuoi dati.",
  },
];

export function getResource(slug: string): ResourceMeta | undefined {
  return resources.find((resource) => resource.slug === slug);
}

export const guideCategories: { slug: string; label: string }[] = [
  { slug: "cv", label: "CV" },
  { slug: "ats", label: "ATS" },
  { slug: "cover-letter", label: "Cover letter" },
  { slug: "colloqui", label: "Colloqui" },
  { slug: "stipendi", label: "Stipendi" },
];

export const roadmapLevels = [
  "Junior → Mid",
  "Mid → Senior",
  "Mid",
  "Senior",
] as const;

export const projectDifficulties: { slug: Difficulty; label: string }[] = [
  { slug: "principiante", label: "Principiante" },
  { slug: "intermedio", label: "Intermedio" },
  { slug: "avanzato", label: "Avanzato" },
];