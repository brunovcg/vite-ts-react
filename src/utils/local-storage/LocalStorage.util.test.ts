import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageUtil } from "./LocalStorage.util";

describe("utils/LocalStorageUtil", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("set", () => {
    it("should store a value with the environment prefix", () => {
      LocalStorageUtil.set("vida-token", "my-token");

      const keys = Object.keys(localStorage);
      const matchingKey = keys.find((key) => key.endsWith("vida-token"));
      expect(matchingKey).toBeTruthy();
      expect(localStorage.getItem(matchingKey!)).toBe("my-token");
    });
  });

  describe("get", () => {
    it("should retrieve a stored value", () => {
      LocalStorageUtil.set("vida-token", "test-value");
      expect(LocalStorageUtil.get("vida-token")).toBe("test-value");
    });

    it("should return null for non-existent keys", () => {
      expect(LocalStorageUtil.get("vida-token")).toBeNull();
    });
  });

  describe("remove", () => {
    it("should remove a stored value", () => {
      LocalStorageUtil.set("vida-token", "test-value");
      LocalStorageUtil.remove("vida-token");
      expect(LocalStorageUtil.get("vida-token")).toBeNull();
    });
  });

  describe("clear", () => {
    it("should remove all keys matching the environment prefix", () => {
      LocalStorageUtil.set("vida-token", "test-value");
      LocalStorageUtil.clear();
      expect(LocalStorageUtil.get("vida-token")).toBeNull();
    });

    it("should not remove keys from other environments", () => {
      localStorage.setItem("other-app-key", "other-value");
      LocalStorageUtil.set("vida-token", "test-value");

      LocalStorageUtil.clear();

      expect(localStorage.getItem("other-app-key")).toBe("other-value");
    });
  });
});
