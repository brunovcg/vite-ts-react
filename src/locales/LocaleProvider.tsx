import { useMemo, useSyncExternalStore } from "react";
import { locales } from "./Locales";
import type { LocaleProviderProps } from "./locales.types";
import { LocaleContext } from "./Locale.context";

export function LocaleProvider({ children }: Readonly<LocaleProviderProps>) {
  const currentLanguage = useSyncExternalStore(locales.subscribe, locales.getCurrentLanguage);

  const value = useMemo(() => ({ currentLanguage }), [currentLanguage]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
