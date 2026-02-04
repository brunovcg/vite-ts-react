import { ReactNode } from "react";
import { languageConfig } from "./languages.config";

export type DictionaryBase = Record<string, string>;

export type Replacements = Record<string, string | number | JSX.Element>;

export type DefaultLanguage = (typeof languageConfig)["default"];
export type OtherLanguage = (typeof languageConfig)["others"][number];

export type Language = DefaultLanguage | OtherLanguage;

export type LocaleBase<DefaultDictionary extends DictionaryBase> = {
  [key in DefaultLanguage]: DefaultDictionary;
} & {
  [K in OtherLanguage]?: Record<keyof DefaultDictionary, string>;
};

export type LocaleFormat = "capitalize" | "title" | "lowercase" | "uppercase";

export type LocaleOptions = { templates?: Replacements; format?: LocaleFormat };

export type LocaleContextProps = {
  currentLanguage: Language;
};

export type LocaleProviderProps = {
  children: ReactNode;
};
