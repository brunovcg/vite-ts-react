import type { KeyboardKey } from "@/constants/keyboard.constants";
import { useEffect, useState } from "react";

interface UseIsHoldingKeyProps {
  key?: KeyboardKey;
  handler?: (isHolding: boolean) => void;
}

export function useIsHoldingKey({ key, handler }: UseIsHoldingKeyProps) {
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (key) {
      const keydownEvent = (e: KeyboardEvent) => {
        if (e.key === key) {
          setIsHolding(true);
          handler?.(true);
        }
      };

      const keyupEvent = (e: KeyboardEvent) => {
        if (e.key === key) {
          setIsHolding(false);
          handler?.(false);
        }
      };

      document.addEventListener("keydown", keydownEvent);
      document.addEventListener("keyup", keyupEvent);

      return () => {
        document.removeEventListener("keydown", keydownEvent);
        document.removeEventListener("keyup", keyupEvent);
      };
    }
  }, [key, handler]);

  return {
    isHolding,
  };
}
