import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnClickOutside } from "./useOnClickOutside.hook";
import { useRef } from "react";

describe("hooks/useOnClickOutside", () => {
  it("should call handler when clicking outside the ref element", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useOnClickOutside({ ref, handler, active: true });
      return ref;
    });

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(div);
  });

  it("should not call handler when clicking inside the ref element", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useOnClickOutside({ ref, handler, active: true });
      return ref;
    });

    act(() => {
      div.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it("should not call handler when active is false", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useOnClickOutside({ ref, handler, active: false });
      return ref;
    });

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it("should support array of refs", () => {
    const handler = vi.fn();
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    renderHook(() => {
      const ref1 = useRef<HTMLDivElement>(div1);
      const ref2 = useRef<HTMLDivElement>(div2);
      useOnClickOutside({ ref: [ref1, ref2], handler, active: true });
    });

    // Click inside first ref - should not trigger
    act(() => {
      div1.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(handler).not.toHaveBeenCalled();

    // Click inside second ref - should not trigger
    act(() => {
      div2.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(handler).not.toHaveBeenCalled();

    // Click outside both - should trigger
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });

  it("should listen to touchstart events", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useOnClickOutside({ ref, handler, active: true });
    });

    act(() => {
      document.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(div);
  });
});
