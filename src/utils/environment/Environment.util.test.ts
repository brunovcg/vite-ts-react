import { describe, it, expect, vi, afterEach } from "vitest";
import { Environment } from "./Environment.util";

describe("utils/Environment", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getEnv", () => {
    it("should return the value of an environment variable", () => {
      const result = Environment.getEnv("MODE");
      expect(typeof result).toBe("string");
    });
  });

  describe("isDevelopment", () => {
    it("should return true when hostname is localhost", () => {
      expect(Environment.isDevelopment()).toBe(true);
    });
  });

  describe("isProduction", () => {
    it("should return false in test environment", () => {
      expect(Environment.isProduction()).toBe(false);
    });
  });

  describe("isStaging", () => {
    it("should return false in test environment", () => {
      expect(Environment.isStaging()).toBe(false);
    });
  });
});
