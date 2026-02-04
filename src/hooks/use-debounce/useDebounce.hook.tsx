import { useEffect, useRef, useState } from "react";
import type { UseDebounceProps } from "./useDebounce.hook.types";

/**
 * Provides a value that only changes when the parameter didn't
 * change after the specified delay. Useful to avoid useEffects
 * to run too much when the dependencies are bound to the user
 * input.
 *
 * @param {unknown} value state that changes should be debounced.
 * @param {number} delay delay to update the debounced value.
 * @returns a value that only changes after waiting the delayed
 * time and no new change on the value was made.
 */
export function useDebounce<Value>({ value, delay, onDebounceChange, active = true }: UseDebounceProps<Value>) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      // Clear any pending timeout when inactive
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Use a microtask to update state after the effect completes
      Promise.resolve().then(() => setIsDebouncing(false));
      return;
    }

    // Use a microtask to update state after the effect completes
    Promise.resolve().then(() => setIsDebouncing(true));

    const handle = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
      setIsDebouncing(false);
    }, delay);

    timeoutRef.current = handle;

    return () => {
      clearTimeout(handle);
    };
  }, [active, delay, value]);

  useEffect(() => {
    onDebounceChange?.(debouncedValue);
  }, [debouncedValue, onDebounceChange]);

  return { isDebouncing, debouncedValue };
}
