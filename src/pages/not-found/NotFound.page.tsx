import { css } from "@/utils/class-names/ClassNames.util";

export function NotFound() {
  return (
    <div data-component='NotFound' className={css("justify-center", "width-full", "display-flex", "align-center", "height-full", "text-bold", "font-size-lg")}>
      Page not found...
    </div>
  );
}
