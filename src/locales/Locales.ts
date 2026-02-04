import { languageConfig } from "./languages.config";
import type { DictionaryBase, LocaleFormat, LocaleBase, LocaleOptions, Replacements, Language } from "./locales.types";

class Locales<DefaultDictionary extends DictionaryBase> {
  private currentLanguage: Language = languageConfig.default;

  private readonly listeners = new Set<() => void>();

  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  setCurrentLanguage(language: Language) {
    this.currentLanguage = language;
    this.listeners.forEach((cb) => cb());
  }

  //! Get language string --------------------------------------------------------------------------------------------

  getCurrentLanguage = () => this.currentLanguage;

  getDefaultLanguage = () => languageConfig.default;

  getOtherLanguages = () => languageConfig.others;

  getAllLanguages = () => [languageConfig.default, ...languageConfig.others];

  //! Create Locale ------------------------------------------------------------------------------------------------

  createLocale<GenericDefaultDictionary extends DictionaryBase>(locale: LocaleBase<GenericDefaultDictionary>): LocaleBase<GenericDefaultDictionary> {
    return locale;
  }

  //! Data Formatting ----------------------------------------------------------------------------------------------

  private parseTemplate(template: string, values?: Replacements) {
    return values ? template.replace(/{{(.*?)}}/g, (_, key) => values[key]?.toString() || "") : template;
  }

  private resolveLocale(key: keyof DefaultDictionary, dictionary: DefaultDictionary, options?: { templates?: Replacements; format?: LocaleFormat }): string {
    let value = this.parseTemplate(dictionary[key], options?.templates);

    if (typeof value === "string") {
      switch (options?.format) {
        case "capitalize":
          value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          break;
        case "title":
          value = value.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
          break;
        case "lowercase":
          value = value.toLowerCase();
          break;
        case "uppercase":
          value = value.toUpperCase();
          break;
      }
    }
    return value;
  }

  //! Get Text and Dictionary --------------------------------------------------------------------------------------------

  getDictionary(locale: LocaleBase<DefaultDictionary>, currentLanguage: Language, options?: LocaleOptions) {
    const rawDictionary = (locale[currentLanguage] ?? locale[languageConfig.default]) as DefaultDictionary;

    return Object.keys(rawDictionary).reduce(
      (acc, key) => {
        acc[key as keyof DefaultDictionary] = this.resolveLocale(key, rawDictionary, options);
        return acc;
      },
      {} as Record<keyof DefaultDictionary, string>,
    );
  }

  getText<CurrentDictionary extends DictionaryBase>({
    key,
    locale,
    options,
    language,
  }: {
    key: keyof CurrentDictionary;
    options?: LocaleOptions;
    locale: LocaleBase<CurrentDictionary>;
    language?: Language;
  }) {
    const currentLanguage = language ?? (this.getCurrentLanguage() || languageConfig.default);

    const dictionary = (locale[currentLanguage as keyof typeof locale] ?? locale[languageConfig.default as keyof typeof locale]) as DefaultDictionary;
    return this.resolveLocale(key as string, dictionary, options);
  }
}

export const locales = new Locales();
