import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsHoldingKey } from "./useIsHoldingKey.hook";

describe("hooks/useIsHoldingKey", () => {
  it("should initialize with isHolding as false", () => {
    const { result } = renderHook(() => useIsHoldingKey({ key: "Shift" }));
    expect(result.current.isHolding).toBe(false);
  });

  it("should set isHolding to true on keydown", () => {
    const { result } = renderHook(() => useIsHoldingKey({ key: "Shift" }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
    });

    expect(result.current.isHolding).toBe(true);
  });

  it("should set isHolding to false on keyup", () => {
    const { result } = renderHook(() => useIsHoldingKey({ key: "Shift" }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
    });
    expect(result.current.isHolding).toBe(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keyup", { key: "Shift" }));
    });
    expect(result.current.isHolding).toBe(false);
  });

  it("should not respond to unrelated keys", () => {
    const { result } = renderHook(() => useIsHoldingKey({ key: "Shift" }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(result.current.isHolding).toBe(false);
  });

  it("should call handler on key hold state changes", () => {
    const handler = vi.fn();
    renderHook(() => useIsHoldingKey({ key: "Control", handler }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Control" }));
    });
    expect(handler).toHaveBeenCalledWith(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keyup", { key: "Control" }));
    });
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("should not attach listeners when key is undefined", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    renderHook(() => useIsHoldingKey({}));

    // Should not add keydown/keyup listeners (only React internal ones)
    const keydownCalls = addSpy.mock.calls.filter((call) => call[0] === "keydown");
    expect(keydownCalls).toHaveLength(0);

    addSpy.mockRestore();
  });

  it("should clean up listeners on unmount", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useIsHoldingKey({ key: "Shift" }));

    unmount();

    const keydownCalls = removeSpy.mock.calls.filter((call) => call[0] === "keydown");
    const keyupCalls = removeSpy.mock.calls.filter((call) => call[0] === "keyup");
    expect(keydownCalls.length).toBeGreaterThan(0);
    expect(keyupCalls.length).toBeGreaterThan(0);

    removeSpy.mockRestore();
  });
});
