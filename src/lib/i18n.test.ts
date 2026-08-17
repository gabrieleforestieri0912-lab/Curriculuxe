import { describe, it, expect } from "vitest";
import { getTranslations, defaultLanguage, languages, translations } from "@/lib/i18n";

function collectKeys(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (obj === null || obj === undefined) {
    out.push(prefix);
    return out;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      out.push(prefix);
      return out;
    }
    obj.forEach((item, i) => collectKeys(item, prefix ? `${prefix}[${i}]` : `[${i}]`, out));
    return out;
  }
  if (typeof obj !== "object") {
    out.push(prefix);
    return out;
  }
  for (const [key, value] of Object.entries(obj)) {
    collectKeys(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

describe("i18n", () => {
  it("esporta lingue it ed en", () => {
    expect(languages.it).toBeTruthy();
    expect(languages.en).toBeTruthy();
  });

  it("defaultLanguage è 'it'", () => {
    expect(defaultLanguage).toBe("it");
  });

  it("getTranslations con lingua nota restituisce le traduzioni", () => {
    expect(getTranslations("it")).toBe(translations.it);
    expect(getTranslations("en")).toBe(translations.en);
  });

  it("fallback su defaultLanguage per lingua sconosciuta", () => {
    expect(getTranslations("fr")).toBe(translations[defaultLanguage]);
    expect(getTranslations("")).toBe(translations[defaultLanguage]);
  });

  it("it ed en hanno la stessa struttura di chiavi top-level", () => {
    const itKeys = Object.keys(translations.it).sort();
    const enKeys = Object.keys(translations.en).sort();
    expect(itKeys).toEqual(enKeys);
  });

  it("it ed en hanno la stessa struttura profonda di chiavi", () => {
    const itKeys = collectKeys(translations.it).sort();
    const enKeys = collectKeys(translations.en).sort();
    expect(itKeys).toEqual(enKeys);
  });

  it("it ed en hanno array di lunghezza equivalente nelle liste", () => {
    const it = translations.it;
    const en = translations.en;
    for (const key of Object.keys(it)) {
      const itVal = it[key];
      const enVal = en[key];
      if (Array.isArray(itVal)) {
        expect(Array.isArray(enVal), `chiave '${key}' deve essere array in entrambe`).toBe(true);
        expect((enVal as unknown[]).length, `array '${key}' con stessa lunghezza`).toBe(itVal.length);
      }
    }
  });
});