export const languageConfig = {
  default: "ptBR",
  others: ["enUS"],
} as const;

type AllLanguages = (typeof languageConfig)["default"] | (typeof languageConfig)["others"][number];

export const languages: Record<AllLanguages, string> = {
  ptBR: "Português",
  enUS: "English",
};
