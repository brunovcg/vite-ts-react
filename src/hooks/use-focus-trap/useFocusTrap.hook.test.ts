import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFocusTrap } from "./useFocusTrap.hook";
import { useRef } from "react";

function createFocusableContainer() {
  const container = document.createElement("div");

  const firstButton = document.createElement("button");
  firstButton.textContent = "First";
  const input = document.createElement("input");
  const lastButton = document.createElement("button");
  lastButton.textContent = "Last";

  container.appendChild(firstButton);
  container.appendChild(input);
  container.appendChild(lastButton);
  document.body.appendChild(container);

  return { container, firstButton, input, lastButton };
}

describe("hooks/useFocusTrap", () => {
  it("should focus the first focusable element when active", () => {
    const { container, firstButton } = createFocusableContainer();
    const focusSpy = vi.spyOn(firstButton, "focus");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    expect(focusSpy).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("should not focus any element when active is false", () => {
    const { container, firstButton } = createFocusableContainer();
    const focusSpy = vi.spyOn(firstButton, "focus");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: false });
    });

    expect(focusSpy).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("should trap focus by wrapping from last to first on Tab", () => {
    const { container, firstButton, lastButton } = createFocusableContainer();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    // Simulate focus on last element
    lastButton.focus();
    Object.defineProperty(document, "activeElement", { value: lastButton, writable: true, configurable: true });

    const focusSpy = vi.spyOn(firstButton, "focus");
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    const preventSpy = vi.spyOn(event, "preventDefault");

    container.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();

    // Clean up
    Object.defineProperty(document, "activeElement", { value: document.body, writable: true, configurable: true });
    document.body.removeChild(container);
  });

  it("should trap focus by wrapping from first to last on Shift+Tab", () => {
    const { container, firstButton, lastButton } = createFocusableContainer();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    // Simulate focus on first element
    firstButton.focus();
    Object.defineProperty(document, "activeElement", { value: firstButton, writable: true, configurable: true });

    const focusSpy = vi.spyOn(lastButton, "focus");
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    const preventSpy = vi.spyOn(event, "preventDefault");

    container.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();

    Object.defineProperty(document, "activeElement", { value: document.body, writable: true, configurable: true });
    document.body.removeChild(container);
  });

  it("should not prevent default for non-Tab keys", () => {
    const { container } = createFocusableContainer();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    const preventSpy = vi.spyOn(event, "preventDefault");

    container.dispatchEvent(event);

    expect(preventSpy).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("should skip disabled elements", () => {
    const container = document.createElement("div");
    const enabledButton = document.createElement("button");
    const disabledButton = document.createElement("button");
    disabledButton.disabled = true;
    container.appendChild(disabledButton);
    container.appendChild(enabledButton);
    document.body.appendChild(container);

    const focusSpy = vi.spyOn(enabledButton, "focus");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    expect(focusSpy).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("should clean up event listener on unmount", () => {
    const { container } = createFocusableContainer();
    const removeSpy = vi.spyOn(container, "removeEventListener");

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    document.body.removeChild(container);
  });

  it("should restore focus to the previously focused element on unmount", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open Dialog";
    document.body.appendChild(trigger);

    Object.defineProperty(document, "activeElement", { value: trigger, writable: true, configurable: true });

    const { container } = createFocusableContainer();

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useFocusTrap({ ref, active: true });
    });

    const focusSpy = vi.spyOn(trigger, "focus");
    unmount();

    expect(focusSpy).toHaveBeenCalled();

    Object.defineProperty(document, "activeElement", { value: document.body, writable: true, configurable: true });
    document.body.removeChild(container);
    document.body.removeChild(trigger);
  });
});
