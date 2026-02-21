import { useEffect } from "react";

interface UseFocusTrapProps {
  ref: React.RefObject<HTMLElement | null>;
  active: boolean;
}

export function useFocusTrap({ ref, active }: UseFocusTrapProps) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    element.addEventListener("keydown", handleTab);
    return () => {
      element.removeEventListener("keydown", handleTab);
      previouslyFocusedElement?.focus();
    };
  }, [ref, active]);
}
