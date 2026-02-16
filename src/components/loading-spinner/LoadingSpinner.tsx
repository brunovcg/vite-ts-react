import { useDictionary } from "@/locales";
import { loadingSpinnerLocale } from "./LoadingSpinner.locales";
import { Icon } from "../icon/Icon";
import type { PropsWithCss } from "@/runtime/css.types";

import type { IconSize } from "../icon/Icon.types";

interface LoadingSpinnerProps extends PropsWithCss {
  size?: IconSize;
}

export function LoadingSpinner({ css, size = "sm" }: LoadingSpinnerProps) {
  const dictionary = useDictionary(loadingSpinnerLocale);
  return (
    <div css={["background-white", "padding-xs", "display-flex", "align-center", "justify-center", "width-fit", "border-radius-circle", css]} data-component='LoadingSpinner' data-css='LoadingSpinner'>
      <Icon css={["animate-rotate"]} icon='loading' size={size} aria-label={dictionary.loading} role='status' />
    </div>
  );
}
