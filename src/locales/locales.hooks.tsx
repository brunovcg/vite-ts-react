import { useCallback, useMemo } from "react";
import type { DictionaryBase, LocaleBase, LocaleTemplates } from "./locales.types";
import { locales } from "./Locales";
import { useLocaleContext } from ".";

export interface UseLocaleProps<DefaultDictionary extends DictionaryBase> {
  locale: LocaleBase<DefaultDictionary>;
}

export function useText<DefaultDictionary extends DictionaryBase>(locale: LocaleBase<DefaultDictionary>) {
  const { currentLanguage } = useLocaleContext();

  return useCallback((key: keyof DefaultDictionary, templates?: LocaleTemplates) => locales.getText({ key: key as string, templates, language: currentLanguage, locale }), [currentLanguage, locale]);
}

export function useDictionary<DefaultDictionary extends DictionaryBase>(locale: LocaleBase<DefaultDictionary>, options?: LocaleTemplates): DefaultDictionary {
  const { currentLanguage } = useLocaleContext();

  return useMemo(() => locales.getDictionary(locale, currentLanguage, options) as DefaultDictionary, [currentLanguage, locale, options]);
}
