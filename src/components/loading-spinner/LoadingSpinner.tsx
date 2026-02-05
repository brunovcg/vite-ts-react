import { useDictionary } from "@/locales";
import { loadingSpinnerLocale } from "./LoadingSpinner.locales";
import { Icon } from "../icon/Icon";

export function LoadingSpinner() {
  const dictionary = useDictionary(loadingSpinnerLocale);
  return (
    <div css={["background-white", "padding-xs", "display-flex", "align-center", "justify-center", "width-fit", "border-radius-circle"]} data-component='LoadingSpinner'>
      <Icon css={["animate-rotate"]} icon='loading' aria-label={dictionary.loading} role='status' />
    </div>
  );
}
