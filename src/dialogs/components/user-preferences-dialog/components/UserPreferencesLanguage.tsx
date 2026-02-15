import { Select } from "@/components/select/Select";
import { locales, useDictionary } from "@/locales";
import { languages } from "@/locales/languages.config";
import type { Language } from "@/locales/locales.types";
import { userPreferencesDialogLocale } from "../UserPreferences.dialog.locales";

export function UserPreferencesLanguage() {
  const handleChange = (language: Language) => locales.setCurrentLanguage(language);
  const dictionary = useDictionary(userPreferencesDialogLocale);

  return (
    <div css={["flex-1", "display-flex"]}>
      <Select
        onChange={(e) => handleChange(e.target.value as Language)}
        options={Object.entries(languages).map(([key, value]) => ({ label: value, value: key }))}
        id='UserPreferences-language-select'
        name='language-select'
        label={dictionary.selectLanguage}
        value={locales.getCurrentLanguage()}
        css={["width-300px"]}
      />
    </div>
  );
}
