import { describe, it, expect } from "vitest";
import { ClassNames } from "./ClassNames.util";

describe("utils/ClassNames", () => {
  describe("merge", () => {
    it("should join string arguments", () => {
      expect(ClassNames.merge("foo", "bar")).toBe("foo bar");
    });

    it("should handle object arguments", () => {
      expect(ClassNames.merge({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("should handle mixed arguments", () => {
      expect(ClassNames.merge("foo", { bar: true })).toBe("foo bar");
    });

    it("should ignore null and undefined", () => {
      expect(ClassNames.merge("foo", null, undefined, "bar")).toBe("foo bar");
    });

    it("should flatten string arrays", () => {
      expect(ClassNames.merge(["foo", "bar"])).toBe("foo bar");

      expect(ClassNames.merge("foo", ["bar", "baz"])).toBe("foo bar baz");
    });

    it("should handle mixed argument types", () => {
      expect(ClassNames.merge("foo", ["bar"], { baz: true })).toBe("foo bar baz");
      expect(ClassNames.merge("a", [""], "b")).toBe("a b");
    });

    it("should handle empty strings", () => {
      expect(ClassNames.merge("foo", "", "bar")).toBe("foo bar");
    });
  });
});
