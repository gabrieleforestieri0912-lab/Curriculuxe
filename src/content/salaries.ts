import type { Market } from "./types";
import { jobCatalog, type Job } from "@/lib/jobs";

export interface DerivedSalaryBand {
  key: string;
  market: Market;
  roleGroup: string;
  seniority: string;
  currency: "EUR" | "USD";
  min: number;
  median: number;
  max: number;
  postings: number;
  jobIds: string[];
  latestPostedAt: string;
  locations: string[];
}

/**
 * Raggruppa gli annunci del Career Market per ruolo e mercato.
 *
 * I valori non sono un benchmark di mercato: sono la distribuzione dei
 * trattamenti dichiarati dagli annunci pubblicati sul Career Market, che
 * Curriculuxe verifica e datati. Ogni fascia porta con se' il numero di
 * annunci da cui deriva e i link alle singole offerte, cosi' il dato e'
 * ispezionabile invece che dichiarato.
 */
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

const ROLE_GROUPS: { key: string; label: string; match: (job: Job) => boolean }[] = [
  {
    key: "frontend",
    label: "Frontend",
    match: (job) => /frontend|front[- ]?end/i.test(job.role),
  },
  {
    key: "backend",
    label: "Backend",
    match: (job) => /backend|platform|site reliability/i.test(job.role),
  },
  {
    key: "fullstack",
    label: "Full stack",
    match: (job) => /full\s?stack/i.test(job.role),
  },
  {
    key: "data",
    label: "Data e ML",
    match: (job) => /data|machine learning|ml engineer/i.test(job.role),
  },
  {
    key: "product",
    label: "Product e Design",
    match: (job) => /product|ux|ui designer/i.test(job.role),
  },
  {
    key: "growth",
    label: "Marketing e Growth",
    match: (job) => /marketing|growth|seo/i.test(job.role),
  },
  {
    key: "sales",
    label: "Sales e Account",
    match: (job) => /sales|account|customer success/i.test(job.role),
  },
  {
    key: "platform",
    label: "DevOps e Platform",
    match: (job) => /devops|sre|site reliability|qa/i.test(job.role),
  },
  {
    key: "mobile",
    label: "Mobile",
    match: (job) => /mobile|ios|android/i.test(job.role),
  },
  {
    key: "security",
    label: "Security",
    match: (job) => /security|cyber/i.test(job.role),
  },
];

export function getRoleGroups() {
  return ROLE_GROUPS.map(({ key, label }) => ({ key, label }));
}

export function buildSalaryBands(catalog: Job[] = jobCatalog): DerivedSalaryBand[] {
  const bands: DerivedSalaryBand[] = [];

  for (const { key, label } of ROLE_GROUPS) {
    const groupJobs = catalog.filter((job) => {
      const group = ROLE_GROUPS.find((g) => g.key === key);
      return group ? group.match(job) : false;
    });

    for (const market of ["italia", "europa", "usa"] as Market[]) {
      const marketJobs = groupJobs.filter((job) => job.market === market);
      if (marketJobs.length === 0) continue;

      const mids = marketJobs.map((job) => job.salaryMin);
      const maxes = marketJobs.map((job) => job.salaryMax);
      const currency = market === "usa" ? "USD" : "EUR";
      const latest = marketJobs
        .map((job) => job.postedAt)
        .sort((a, b) => b.localeCompare(a))[0];

      bands.push({
        key: `${key}-${market}`,
        market,
        roleGroup: label,
        seniority: [...new Set(marketJobs.map((job) => job.seniority))].join(", "),
        currency,
        min: Math.min(...mids),
        median: Math.round(median(mids.concat(maxes))),
        max: Math.max(...maxes),
        postings: marketJobs.length,
        jobIds: marketJobs.map((job) => job.id),
        latestPostedAt: latest,
        locations: [...new Set(marketJobs.map((job) => job.location))],
      });
    }
  }

  return bands.sort(
    (a, b) => b.postings - a.postings || a.roleGroup.localeCompare(b.roleGroup)
  );
}

export function formatBandValue(value: number, currency: "EUR" | "USD"): string {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export const marketLabels: Record<Market, string> = {
  italia: "Italia",
  europa: "Europa",
  usa: "USA",
};

export const seniorityLabels: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
};