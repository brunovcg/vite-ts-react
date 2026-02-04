import { createContext } from "react";
import { languageConfig } from "./languages.config";
import type { LocaleContextProps } from "./locales.types";

export const LocaleContext = createContext<LocaleContextProps>({
  currentLanguage: languageConfig.default,
});
