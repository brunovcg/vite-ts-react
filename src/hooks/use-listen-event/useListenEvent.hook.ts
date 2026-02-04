import { EVENTS } from "@/events/events";
import { useEffect, type RefObject } from "react";

interface UseListenEventProps<T extends HTMLElement> {
  ref: RefObject<T | null>;
  event: keyof typeof EVENTS;
  handler: () => void;
  enabled?: boolean;
}

export function useListenEvent({ ref, event, handler, enabled = true }: UseListenEventProps<HTMLElement>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = ref.current;
    element?.addEventListener(event, handler);
    return () => {
      element?.removeEventListener(EVENTS[event], handler);
    };
  }, [handler, enabled, ref, event]);
}
