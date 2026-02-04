import { useEffect, type RefObject } from "react";

type Event = MouseEvent | TouchEvent;

interface UseOnClickOutsideProps<T extends HTMLElement> {
  ref: RefObject<T | null> | RefObject<T | null>[];
  handler: (event: Event) => void;
  active?: boolean;
}

export function useOnClickOutside<T extends HTMLElement = HTMLElement>({
  ref,
  handler,
  active,
}: UseOnClickOutsideProps<T>) {
  useEffect(() => {
    if (active) {
      const listener = (event: Event) => {
        const node = event?.target as Node;
        if (Array.isArray(ref)) {
          const elements = ref.map((element) => element.current);

          if (!elements.some((element) => element?.contains(node))) {
            handler(event);
          }
        } else {
          const element = ref?.current;

          if (!element?.contains(node)) {
            handler(event);
          }
        }
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }
  }, [ref, handler, active]);
}
