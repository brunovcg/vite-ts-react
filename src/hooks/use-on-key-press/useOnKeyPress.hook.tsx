import { useEffect, useCallback } from "react";

import type { KeyboardKey } from "@/constants/colors.constants";
import type { UseOnKeyPressProps } from "./useOnKeyPress.hook.types";
import { useIsHoldingKey } from "../use-is-holding-key/useIsHoldingKey.hook";

const preventBehavior = (event: KeyboardEvent, stopPropagation: boolean, preventDefault: boolean) => {
  if (stopPropagation) {
    event.stopPropagation();
  }
  if (preventDefault) {
    event.preventDefault();
  }
};

export function useOnKeyPress({ keys, target, handler, hold, ignoreHold, enabled = true, stopPropagation = false, preventDefault = false, type = "keydown" }: UseOnKeyPressProps) {
  const { isHolding } = useIsHoldingKey({
    key: hold ?? ignoreHold,
  });

  const keydownEvent = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key as KeyboardKey) && enabled) {
        preventBehavior(event, stopPropagation, preventDefault);

        if (hold && isHolding) {
          handler?.(event);
        }
        if (!hold && !isHolding) {
          handler?.(event);
        }
      }
    },
    [keys, enabled, stopPropagation, preventDefault, hold, isHolding, handler],
  );

  useEffect(() => {
    const element = target?.current;
    if (element) {
      element.addEventListener(type, keydownEvent as unknown as EventListenerOrEventListenerObject);
    } else {
      document.addEventListener(type, keydownEvent);
    }

    return () => {
      if (element) {
        element.removeEventListener(type, keydownEvent as unknown as EventListenerOrEventListenerObject);
      } else {
        document.removeEventListener(type, keydownEvent);
      }
    };
  }, [handler, enabled, target, type, keydownEvent]);
}
