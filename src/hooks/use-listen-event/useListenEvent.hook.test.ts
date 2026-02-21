import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useListenEvent } from "./useListenEvent.hook";
import { useRef } from "react";
import { EVENTS } from "@/events/events";

describe("hooks/useListenEvent", () => {
  it("should call handler when the custom event is dispatched", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useListenEvent({ ref, event: "CLOSE_DIALOG", handler });
    });

    div.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG));

    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(div);
  });

  it("should not call handler when enabled is false", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useListenEvent({ ref, event: "CLOSE_DIALOG", handler, enabled: false });
    });

    div.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it("should clean up event listener on unmount", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useListenEvent({ ref, event: "CLOSE_DIALOG", handler });
    });

    unmount();

    div.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it("should default enabled to true", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useListenEvent({ ref, event: "CLOSE_DIALOG", handler });
    });

    div.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG));

    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(div);
  });
});
