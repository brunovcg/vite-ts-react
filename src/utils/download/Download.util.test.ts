import { describe, it, expect, vi, beforeEach } from "vitest";
import { DownloadUtils } from "./Download.util";

describe("utils/DownloadUtils", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("csv", () => {
    it("should create a link element, trigger download, and remove it", () => {
      const clickMock = vi.fn();
      const createElementSpy = vi.spyOn(document, "createElement").mockReturnValue({
        setAttribute: vi.fn(),
        click: clickMock,
      } as unknown as HTMLAnchorElement);
      const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
      const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

      DownloadUtils.csv("data:text/csv;charset=utf-8,a,b,c", "test.csv");

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(clickMock).toHaveBeenCalledOnce();
      expect(appendChildSpy).toHaveBeenCalledOnce();
      expect(removeChildSpy).toHaveBeenCalledOnce();
    });
  });

  describe("tableCSV", () => {
    it("should generate CSV from table data", () => {
      const csvSpy = vi.spyOn(DownloadUtils, "csv").mockImplementation(() => {});

      const data = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ];
      const columns = [
        { header: "Name", accessor: "name" as const },
        { header: "Age", accessor: "age" as const },
      ];

      DownloadUtils.tableCSV({ data, columns, fileName: "test.csv" });

      expect(csvSpy).toHaveBeenCalledOnce();
      const csvContent = csvSpy.mock.calls[0][0];
      expect(csvContent).toContain("Name,Age");
      expect(csvContent).toContain("Alice,30");
      expect(csvContent).toContain("Bob,25");
    });

    it("should handle columns without accessor", () => {
      const csvSpy = vi.spyOn(DownloadUtils, "csv").mockImplementation(() => {});

      const data = [{ name: "Alice" }];
      const columns = [
        { header: "Name", accessor: "name" as const },
        { header: "Action", cell: () => null },
      ];

      DownloadUtils.tableCSV({ data, columns: columns as never, fileName: "test.csv" });

      expect(csvSpy).toHaveBeenCalledOnce();
      const csvContent = csvSpy.mock.calls[0][0];
      expect(csvContent).toContain("Name,Action");
    });
  });
});
