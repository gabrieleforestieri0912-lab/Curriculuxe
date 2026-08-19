import { describe, it, expect } from "vitest";
import {
  jobCatalog,
  scoreJobForProfile,
  buildDailyDigest,
  getJobById,
  formatSalary,
  formatEuro,
} from "@/lib/jobs";

const PROFILE =
  "Senior Full Stack Developer con 7 anni di esperienza. Competenze: React, TypeScript, Node.js, PostgreSQL, Docker, AWS, Kubernetes, CI/CD. Ho architettato piattaforme SaaS usate da 50.000 utenti riducendo i tempi di risposta del 40%.";

describe("jobCatalog", () => {
  it("contiene almeno 20 offerte tra le aziende tech", () => {
    expect(jobCatalog.length).toBeGreaterThanOrEqual(20);
  });

  it("ogni offerta ha id, azienda, ruolo e seniority", () => {
    for (const job of jobCatalog) {
      expect(job.id).toBeTruthy();
      expect(job.company).toBeTruthy();
      expect(job.role).toBeTruthy();
      expect(["junior", "mid", "senior"]).toContain(job.seniority);
      expect(job.salaryMax).toBeGreaterThan(job.salaryMin);
    }
  });

  it("getJobById trova un'offerta esistente", () => {
    const job = getJobById(jobCatalog[0].id);
    expect(job?.id).toBe(jobCatalog[0].id);
  });

  it("getJobById restituisce undefined per id inesistente", () => {
    expect(getJobById("non-esiste")).toBeUndefined();
  });
});

describe("scoreJobForProfile", () => {
  it("restituisce uno score tra 0 e 100", () => {
    const scored = scoreJobForProfile(jobCatalog[0], PROFILE);
    expect(scored.score).toBeGreaterThanOrEqual(0);
    expect(scored.score).toBeLessThanOrEqual(100);
  });

  it("elenca keyword in match e mancanti", () => {
    const scored = scoreJobForProfile(jobCatalog[0], PROFILE);
    expect(Array.isArray(scored.matchedKeywords)).toBe(true);
    expect(Array.isArray(scored.missingKeywords)).toBe(true);
    expect(scored.matchedKeywords.length + scored.missingKeywords.length).toBe(
      scored.keywords.length
    );
  });

  it("ha almeno una reason di match", () => {
    const scored = scoreJobForProfile(jobCatalog[0], PROFILE);
    expect(scored.reasons.length).toBeGreaterThan(0);
  });

  it("assegna highlight coerente con lo score", () => {
    const scored = scoreJobForProfile(jobCatalog[0], PROFILE);
    if (scored.score >= 70) expect(scored.highlight).toBe("alta");
    else if (scored.score >= 45) expect(scored.highlight).toBe("buona");
    else expect(scored.highlight).toBe("media");
  });

  it("un profilo disallineato ottiene uno score più basso", () => {
    const weakProfile = "Esperto di contabilità e fatturazione elettronica, amministrazione";
    const strong = scoreJobForProfile(jobCatalog[0], PROFILE).score;
    const weak = scoreJobForProfile(jobCatalog[0], weakProfile).score;
    expect(weak).toBeLessThan(strong);
  });
});

describe("buildDailyDigest", () => {
  it("restituisce tra 5 e 10 offerte ordinate per score", () => {
    const digest = buildDailyDigest(PROFILE, { limit: 8 });
    expect(digest.length).toBeGreaterThanOrEqual(5);
    expect(digest.length).toBeLessThanOrEqual(10);
    const scores = digest.map((job) => job.score);
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores).toEqual(sorted);
  });

  it("filtra per mercato", () => {
    const digest = buildDailyDigest(PROFILE, { market: "italia" });
    expect(digest.length).toBeGreaterThan(0);
    expect(digest.every((job) => job.market === "italia")).toBe(true);
  });

  it("rispetta un limite esplicito", () => {
    const digest = buildDailyDigest(PROFILE, { limit: 6 });
    expect(digest.length).toBeLessThanOrEqual(6);
  });
});

describe("formatSalary", () => {
  it("formatta un range in euro", () => {
    expect(formatSalary(40000, 60000)).toContain("€");
  });
});

describe("formatEuro", () => {
  it("formatta con migliaia e valuta", () => {
    expect(formatEuro(45000)).toContain("45");
    expect(formatEuro(45000)).toContain("€");
  });
});