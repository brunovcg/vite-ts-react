import { describe, it, expect } from "vitest";
import { EVENTS } from "./events";

describe("events", () => {
  it("should export CLOSE_DIALOG event", () => {
    expect(EVENTS.CLOSE_DIALOG).toBe("close-dialog");
  });

  it("should be a const object", () => {
    expect(typeof EVENTS).toBe("object");
    expect(Object.keys(EVENTS)).toContain("CLOSE_DIALOG");
  });
});
