import type { Column } from "@/components/table/instances/base-table/BaseTable.component";

export class DownloadUtils {
  static csv(csvContent: string, fileName: string) {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static tableCSV<Row extends object>({ data, columns, fileName }: { data: Row[]; columns: Column<Row>[]; fileName: string }) {
    const headers = columns.map((col) => col.header).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          if (col.accessor) return row[col.accessor as keyof Row];
          return ""; // Cannot export custom cells easily
        })
        .join(","),
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    DownloadUtils.csv(csvContent, fileName);
  }
}
