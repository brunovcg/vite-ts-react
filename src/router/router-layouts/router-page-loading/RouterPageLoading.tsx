import { LoadingSpinner } from "@/components/loading-spinner/LoadingSpinner";
import { useDictionary } from "@/locales";
import { pageLoadingLocale } from "./RouterPageLoading.locales";
import { Suspense, type PropsWithChildren } from "react";

export function RouterPageLoading({ children }: PropsWithChildren) {
  const dictionary = useDictionary(pageLoadingLocale);
  return (
    <Suspense
      fallback={
        <div
          data-component='PageLoading'
          css={["display-flex", "flex-center", "width-full", "height-full", "flex-column", "gap-lg", "padding-2xl", "animate-fade-in", "min-height-400px"]}
          className='page-loading'
        >
          <LoadingSpinner />
          <span css={["text-bold", "font-size-lg", "color-primary"]}>{dictionary.loading}</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
