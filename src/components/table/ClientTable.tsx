import { useMemo, useState } from "react";
import { BaseTable, type Column } from "./BaseTable";

export interface ClientTableProps<Row extends Record<string, unknown>> {
  columns: Column<Row>[];
  primaryKey: keyof Row;
  rows: Row[];
  downloadable?: boolean;
}

export function ClientTable<Row extends Record<string, unknown>>({ columns, primaryKey, rows, downloadable }: ClientTableProps<Row>) {
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Process rows using useMemo to avoid cascading renders
  const { data, total } = useMemo(() => {
    let processed = [...rows];

    // Filter
    if (Object.keys(filters).length > 0) {
      processed = processed.filter((row) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          // Find which accessor maps to this header key
          const col = columns.find((c) => c.header === key);
          if (col && col.accessor) {
            const rowValue = String(row[col.accessor]).toLowerCase();
            return rowValue.includes(value.toLowerCase());
          }
          return true;
        });
      });
    }

    // Sort
    if (sorting.length > 0) {
      processed.sort((a, b) => {
        for (const sort of sorting) {
          const col = columns.find((c) => c.header === sort.column);
          if (!col || !col.accessor) continue;

          const valA = a[col.accessor];
          const valB = b[col.accessor];

          if (valA === valB) continue;

          const comparison = valA! > valB! ? 1 : -1;
          return sort.direction === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    }

    const totalCount = processed.length;

    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = processed.slice(start, end);

    return { data: paginatedData, total: totalCount };
  }, [rows, page, pageSize, sorting, filters, columns]);

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
    setPage(1); // Reset to first page on filter change
  };

  return (
    <BaseTable
      columns={columns}
      data={data}
      primaryKey={primaryKey}
      loading={false}
      downloadable={downloadable}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      sorting={sorting}
      onSortChange={setSorting}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
