import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnKeyPress } from "./useOnKeyPress.hook";

describe("hooks/useOnKeyPress", () => {
  it("should call handler when specified key is pressed", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(handler).toHaveBeenCalledOnce();
  });

  it("should not call handler for unrelated keys", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not call handler when enabled is false", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler, enabled: false }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should support multiple keys", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter", " "], handler }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(handler).toHaveBeenCalledOnce();
  });

  it("should support keyup event type", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler, type: "keyup" }));

    // keydown should not trigger
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    expect(handler).not.toHaveBeenCalled();

    // keyup should trigger
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
    });
    expect(handler).toHaveBeenCalledOnce();
  });

  it("should stop propagation when stopPropagation is true", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler, stopPropagation: true }));

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    const stopSpy = vi.spyOn(event, "stopPropagation");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(stopSpy).toHaveBeenCalledOnce();
  });

  it("should prevent default when preventDefault is true", () => {
    const handler = vi.fn();
    renderHook(() => useOnKeyPress({ keys: ["Enter"], handler, preventDefault: true }));

    const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
    const preventSpy = vi.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventSpy).toHaveBeenCalledOnce();
  });

  it("should clean up event listeners on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useOnKeyPress({ keys: ["Enter"], handler }));

    unmount();

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
