import { describe, it, expect } from "vitest";
import { translations } from "@/i18n/translations";

const languages = Object.keys(translations) as Array<keyof typeof translations>;
const enKeys = Object.keys(translations.en);

describe("translations", () => {
  it("defines every supported language", () => {
    expect(languages.sort()).toEqual(["de", "en", "es", "fr", "it", "pt", "ru"]);
  });

  // Every language must provide every key, otherwise the app silently falls
  // back to English for the missing strings (the bug this guards against).
  it.each(languages)("'%s' has the same keys as 'en' (no missing, no extras)", (lang) => {
    const langKeys = Object.keys(translations[lang]);
    const missing = enKeys.filter((k) => !(k in translations[lang]));
    const extras = langKeys.filter((k) => !(k in translations.en));
    expect({ lang, missing, extras }).toEqual({ lang, missing: [], extras: [] });
    expect(langKeys.length).toBe(enKeys.length);
  });

  // A handful of keys that were previously English-only across the 5 locales:
  // assert they now resolve to a non-English value in every non-English locale.
  const sentinelKeys = [
    "atvFilters.title",
    "countries.germany",
    "transmission.automatic",
    "translate",
  ] as const;

  it.each(["de", "es", "fr", "it", "pt"] as const)(
    "'%s' does not fall back to English for sentinel keys",
    (lang) => {
      for (const key of sentinelKeys) {
        const value = translations[lang][key as keyof (typeof translations)[typeof lang]];
        expect(value, `${lang}.${key} is empty`).toBeTruthy();
        expect(
          value,
          `${lang}.${key} still equals the English string "${value}"`,
        ).not.toBe(translations.en[key as keyof typeof translations.en]);
      }
    },
  );
});
