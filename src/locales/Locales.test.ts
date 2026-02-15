import { describe, it, expect, vi } from "vitest";
import { locales } from "./Locales";

describe("Locales", () => {
  const testLocale = {
    ptBR: {
      hello: "Olá",
      greeting: "Olá, {{name}}!",
      count: "Você tem {{count}} itens",
    },
    enUS: {
      hello: "Hello",
      greeting: "Hello, {{name}}!",
      count: "You have {{count}} items",
    },
  };

  describe("language management", () => {
    it("should return default language", () => {
      expect(locales.getDefaultLanguage()).toBe("ptBR");
    });

    it("should get current language", () => {
      expect(locales.getCurrentLanguage()).toBeTruthy();
    });

    it("should set current language", () => {
      const originalLanguage = locales.getCurrentLanguage();

      locales.setCurrentLanguage("enUS");
      expect(locales.getCurrentLanguage()).toBe("enUS");

      // Restore
      locales.setCurrentLanguage(originalLanguage);
    });

    it("should return other languages", () => {
      const others = locales.getOtherLanguages();
      expect(others).toContain("enUS");
    });

    it("should return all languages", () => {
      const all = locales.getAllLanguages();
      expect(all).toContain("ptBR");
      expect(all).toContain("enUS");
    });
  });

  describe("subscribe", () => {
    it("should notify subscribers on language change", () => {
      const callback = vi.fn();
      const unsubscribe = locales.subscribe(callback);
      const originalLanguage = locales.getCurrentLanguage();

      locales.setCurrentLanguage("enUS");
      expect(callback).toHaveBeenCalledOnce();

      // Restore and cleanup
      locales.setCurrentLanguage(originalLanguage);
      unsubscribe();
    });

    it("should return an unsubscribe function", () => {
      const callback = vi.fn();
      const unsubscribe = locales.subscribe(callback);
      const originalLanguage = locales.getCurrentLanguage();

      unsubscribe();
      locales.setCurrentLanguage("enUS");
      expect(callback).not.toHaveBeenCalled();

      // Restore
      locales.setCurrentLanguage(originalLanguage);
    });
  });

  describe("create", () => {
    it("should return the same locale object", () => {
      const result = locales.create(testLocale);
      expect(result).toBe(testLocale);
    });
  });

  describe("getDictionary", () => {
    it("should return dictionary for the current language", () => {
      const dict = locales.getDictionary(testLocale as never, "ptBR");
      expect(dict.hello).toBe("Olá");
    });

    it("should return dictionary for a different language", () => {
      const dict = locales.getDictionary(testLocale as never, "enUS");
      expect(dict.hello).toBe("Hello");
    });

    it("should fall back to default language for unknown language", () => {
      const dict = locales.getDictionary(testLocale as never, "frFR" as never);
      expect(dict.hello).toBe("Olá");
    });

    it("should parse template strings", () => {
      const dict = locales.getDictionary(testLocale as never, "enUS", { name: "World" });
      expect(dict.greeting).toBe("Hello, World!");
    });

    it("should parse multiple templates", () => {
      const dict = locales.getDictionary(testLocale as never, "enUS", { count: "5" });
      expect(dict.count).toBe("You have 5 items");
    });

    it("should preserve template placeholders when no templates provided", () => {
      const dict = locales.getDictionary(testLocale as never, "enUS");
      expect(dict.greeting).toBe("Hello, {{name}}!");
    });
  });

  describe("getText", () => {
    it("should get text for a specific key", () => {
      const text = locales.getText({
        key: "hello",
        locale: testLocale as never,
        language: "enUS",
      });
      expect(text).toBe("Hello");
    });

    it("should get text with template replacement", () => {
      const text = locales.getText({
        key: "greeting",
        locale: testLocale as never,
        language: "enUS",
        templates: { name: "World" },
      });
      expect(text).toBe("Hello, World!");
    });

    it("should fall back to default language when language not specified", () => {
      const originalLanguage = locales.getCurrentLanguage();
      locales.setCurrentLanguage("ptBR");

      const text = locales.getText({
        key: "hello",
        locale: testLocale as never,
      });
      expect(text).toBe("Olá");

      locales.setCurrentLanguage(originalLanguage);
    });
  });
});
