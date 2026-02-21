import { useDictionary } from "@/locales";
import { loadingSpinnerLocale } from "./LoadingSpinner.component.locales";
import { Icon } from "../icon/Icon.component";
import type { PropsWithCss } from "@/runtime/css.types";

import type { IconSize } from "../icon/Icon.component.types";

interface LoadingSpinnerProps extends PropsWithCss {
  size?: IconSize;
}

export function LoadingSpinner({ css, size = "sm" }: LoadingSpinnerProps) {
  const dictionary = useDictionary(loadingSpinnerLocale);
  return (
    <div
      css={["background-white", "padding-xs", "display-flex", "align-center", "justify-center", "width-fit", "border-radius-circle", css]}
      data-component='LoadingSpinner'
      data-css='LoadingSpinner'
      role='status'
      aria-live='polite'
    >
      <Icon css={["animate-rotate"]} icon='loading' size={size} aria-label={dictionary.loading} />
    </div>
  );
}
