import { useCallback, useEffect, useState } from "react";
import { BaseTable, type Column } from "./BaseTable";

interface TablePagination {
  page: number;
  pageSize: number;
  filters?: Record<string, string>;
  sorting?: { column: string; direction: "asc" | "desc" }[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
}

export interface ServerTableProps<Row extends object> {
  columns: Column<Row>[];
  primaryKey: keyof Row;
  service: (pagination: TablePagination) => Promise<Paginated<Row>>;
  downloadable?: boolean;
}

export function ServerTable<Row extends object>({ columns, primaryKey, service, downloadable }: ServerTableProps<Row>) {
  const [data, setData] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await service({
        page,
        pageSize,
        filters,
        sorting,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [service, page, pageSize, filters, sorting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
    setPage(1); // Reset to first page on filter change
  };

  return (
    <BaseTable
      columns={columns}
      data={data}
      primaryKey={primaryKey}
      loading={loading}
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
