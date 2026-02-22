import { useCallback, useState, type RefObject } from "react";

interface DropdownPosition {
  openAbove: boolean;
  openLeft: boolean;
}

interface UseDropdownPositionProps<T extends HTMLElement> {
  ref: RefObject<T | null>;
  estimatedHeight?: number;
  estimatedWidth?: number;
}

export function useDropdownPosition<T extends HTMLElement = HTMLElement>({ ref, estimatedHeight = 250, estimatedWidth = 200 }: UseDropdownPositionProps<T>) {
  const [position, setPosition] = useState<DropdownPosition>({ openAbove: false, openLeft: false });

  const computePosition = useCallback(() => {
    if (!ref.current) return { openAbove: false, openLeft: false };

    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.right;

    const openAbove = spaceBelow < estimatedHeight && rect.top > estimatedHeight;
    const openLeft = spaceRight < estimatedWidth && rect.left > estimatedWidth;

    const next = { openAbove, openLeft };
    setPosition(next);
    return next;
  }, [ref, estimatedHeight, estimatedWidth]);

  const reset = useCallback(() => {
    setPosition({ openAbove: false, openLeft: false });
  }, []);

  return { position, computePosition, reset };
}
