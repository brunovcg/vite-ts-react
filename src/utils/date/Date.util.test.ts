import { describe, it, expect } from "vitest";
import { DateUtil } from "./Date.util";

describe("utils/DateUtil", () => {
  describe("renderFormat", () => {
    it("should return '-' for null", () => {
      expect(DateUtil.renderFormat(null)).toBe("-");
    });

    it("should return '-' for undefined", () => {
      expect(DateUtil.renderFormat(undefined)).toBe("-");
    });

    it("should return '-' for empty string", () => {
      expect(DateUtil.renderFormat("")).toBe("-");
    });

    it("should return a locale string for a valid date", () => {
      const result = DateUtil.renderFormat("2024-01-15T10:30:00Z");
      expect(result).toBeTruthy();
      expect(result).not.toBe("-");
    });
  });

  describe("format", () => {
    it("should return empty string for invalid date", () => {
      expect(DateUtil.format("invalid-date", "YYYY-MM-dd")).toBe("");
    });

    it("should format full year with YYYY", () => {
      const result = DateUtil.format("2024-06-15", "YYYY");
      expect(result).toBe("2024");
    });

    it("should format full year with yyyy", () => {
      const result = DateUtil.format("2024-06-15", "yyyy");
      expect(result).toBe("2024");
    });

    it("should format 2-digit year with YY", () => {
      const result = DateUtil.format("2024-06-15", "YY");
      expect(result).toBe("24");
    });

    it("should format 2-digit month with MM", () => {
      const result = DateUtil.format("2024-01-15", "MM");
      expect(result).toBe("01");
    });

    it("should format 2-digit day with dd", () => {
      const result = DateUtil.format(new Date(2024, 5, 5), "dd");
      expect(result).toBe("05");
    });

    it("should format 2-digit day with DD", () => {
      const result = DateUtil.format(new Date(2024, 5, 5), "DD");
      expect(result).toBe("05");
    });

    it("should format hours, minutes, and seconds", () => {
      const result = DateUtil.format(new Date(2024, 5, 15, 14, 30, 59), "HH:mm:ss");
      expect(result).toBe("14:30:59");
    });

    it("should pad single-digit values with zeros", () => {
      const result = DateUtil.format(new Date(2024, 0, 5, 3, 7, 9), "MM/dd HH:mm:ss");
      expect(result).toBe("01/05 03:07:09");
    });

    it("should preserve non-token characters", () => {
      const result = DateUtil.format(new Date(2024, 5, 15), "YYYY/MM/dd");
      expect(result).toBe("2024/06/15");
    });

    it("should handle full date-time format", () => {
      const result = DateUtil.format(new Date(2024, 11, 25, 10, 0, 0), "YYYY-MM-dd HH:mm:ss");
      expect(result).toBe("2024-12-25 10:00:00");
    });

    it("should handle Date object input", () => {
      const date = new Date(2024, 5, 15);
      const result = DateUtil.format(date, "YYYY-MM-dd");
      expect(result).toBe("2024-06-15");
    });
  });
});
