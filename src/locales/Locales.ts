import { languageConfig } from "./languages.config";
import type { DictionaryBase, LocaleBase, LocaleTemplates, Language, GetTextArgs } from "./locales.types";

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

  create<GenericDefaultDictionary extends DictionaryBase>(locale: LocaleBase<GenericDefaultDictionary>): LocaleBase<GenericDefaultDictionary> {
    return locale;
  }

  //! Data Formatting ----------------------------------------------------------------------------------------------

  private parseTemplate(template: string, values?: LocaleTemplates) {
    return values ? template.replace(/{{(.*?)}}/g, (_, key) => values[key]?.toString() || "") : template;
  }

  //! Get Text and Dictionary --------------------------------------------------------------------------------------------

  getDictionary(locale: LocaleBase<DefaultDictionary>, currentLanguage: Language, templates?: LocaleTemplates) {
    const rawDictionary = (locale[currentLanguage] ?? locale[languageConfig.default]) as DefaultDictionary;

    return Object.keys(rawDictionary).reduce(
      (acc, key) => {
        acc[key as keyof DefaultDictionary] = this.parseTemplate(rawDictionary[key], templates);
        return acc;
      },
      {} as Record<keyof DefaultDictionary, string>,
    );
  }

  getText<CurrentDictionary extends DictionaryBase>({ key, locale, templates, language }: GetTextArgs<CurrentDictionary>) {
    const currentLanguage = language ?? (this.getCurrentLanguage() || languageConfig.default);

    const dictionary = (locale[currentLanguage as keyof typeof locale] ?? locale[languageConfig.default as keyof typeof locale]) as DefaultDictionary;
    return this.parseTemplate(dictionary[key as string], templates);
  }
}

export const locales = new Locales();
