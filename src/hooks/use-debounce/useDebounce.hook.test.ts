import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce.hook";

describe("hooks/useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce({ value: "hello", delay: 300 }));

    expect(result.current.debouncedValue).toBe("hello");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce({ value, delay: 300 }), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });

    // Value shouldn't have changed yet
    expect(result.current.debouncedValue).toBe("hello");

    // Advance past the delay
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe("world");
  });

  it("should reset timeout on rapid value changes", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce({ value, delay: 300 }), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abc" });
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Should still be the initial value since timeout keeps resetting
    expect(result.current.debouncedValue).toBe("a");

    // Advance past the delay from last change
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe("abc");
  });

  it("should not debounce when active is false", async () => {
    const { result } = renderHook(({ value, active }) => useDebounce({ value, delay: 300, active }), {
      initialProps: { value: "hello", active: false },
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isDebouncing).toBe(false);
  });

  it("should call onDebounceChange when debounced value changes", async () => {
    const onDebounceChange = vi.fn();

    const { rerender } = renderHook(({ value }) => useDebounce({ value, delay: 300, onDebounceChange }), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(onDebounceChange).toHaveBeenCalledWith("world");
  });
});
