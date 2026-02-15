import { describe, it, expect, beforeEach } from "vitest";
import { UrlUtils } from "./Url.utils";

describe("utils/UrlUtils", () => {
  beforeEach(() => {
    // Reset URL to base
    window.history.replaceState({}, "", window.location.origin);
  });

  describe("set", () => {
    it("should set a URL search param", () => {
      UrlUtils.set("dialog", "test-dialog");

      const url = new URL(window.location.href);
      expect(url.searchParams.get("dialog")).toBe("test-dialog");
    });

    it("should update existing param value", () => {
      UrlUtils.set("dialog", "first");
      UrlUtils.set("dialog", "second");

      const url = new URL(window.location.href);
      expect(url.searchParams.get("dialog")).toBe("second");
    });
  });

  describe("get", () => {
    it("should retrieve a URL search param", () => {
      UrlUtils.set("dialog", "my-dialog");
      expect(UrlUtils.get("dialog")).toBe("my-dialog");
    });

    it("should return null for non-existent params", () => {
      expect(UrlUtils.get("dialog")).toBeNull();
    });
  });

  describe("clear", () => {
    it("should remove a URL search param", () => {
      UrlUtils.set("dialog", "my-dialog");
      UrlUtils.clear("dialog");
      expect(UrlUtils.get("dialog")).toBeNull();
    });
  });
});
