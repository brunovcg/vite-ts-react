import { Select } from "@/components/select/Select.component";
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
        onChange={(value) => handleChange(value)}
        options={Object.typedEntries(languages).map(([value, label]) => ({ label, value }))}
        id='UserPreferences-language-select'
        name='language-select'
        label={dictionary.selectLanguage}
        value={locales.getCurrentLanguage()}
        css={["width-300px"]}
      />
    </div>
  );
}
