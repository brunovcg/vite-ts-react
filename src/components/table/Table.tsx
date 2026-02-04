import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Input } from "../input/Input";
import { Icon } from "../icon/Icon";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import { ButtonIcon } from "../button-icon/ButtonIcon";
import { DownloadUtils } from "@/utils/download/Download.util";

type Cell<Row extends Record<string, unknown>> = (props: {
  column: TableProps<Row>["columns"][number];
  row: Row;
  rows: Row[];
}) => ReactNode;

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

type ColumnFilter =
  | { type: "text" | "number" | "date" | "range" }
  | { type: "select"; options: string[] };

type CustomCellRender<Row extends Record<string, unknown>> =
  | { cell: Cell<Row>; acessor?: never }
  | { cell?: never; acessor: keyof Row };

type CustomRowBuilder<Row extends Record<string, unknown>> =
  | { rows: Row[]; service?: never }
  | { rows?: never; service: (pagination: TablePagination) => Promise<Paginated<Row>> };

export type Column<Row extends Record<string, unknown>> = {
  header: string;
  sortable?: boolean;
  filter?: ColumnFilter;
} & CustomCellRender<Row>;

type TableProps<Row extends Record<string, unknown>> = CustomRowBuilder<Row> & {
  columns: Column<Row>[];
  primaryKey: keyof Row;
  downloadable?: boolean;
};

export function Table<Row extends Record<string, unknown>>({
  columns,
  rows,
  service,
  primaryKey,
  downloadable,
}: TableProps<Row>) {
  const [data, setData] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const hasFilters = useMemo(() => columns.some((column) => column.filter), [columns]);

  const fetchData = useCallback(async () => {
    if (!service) return;
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

  const processRows = useCallback(() => {
    if (!rows) return;

    let processed = [...rows];

    // Filter
    if (Object.keys(filters).length > 0) {
      processed = processed.filter((row) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          // Find which accessor maps to this header key (assuming key names match header names for simplicity or we need a mapping)
          // The current design uses `header` as key in filters.
          // We need to find the column definition to get the accessor
          const col = columns.find((c) => c.header === key);
          if (col && col.acessor) {
            const rowValue = String(row[col.acessor]).toLowerCase();
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
          if (!col || !col.acessor) continue;

          const valA = a[col.acessor];
          const valB = b[col.acessor];

          if (valA === valB) continue;

          const comparison = valA! > valB! ? 1 : -1;
          return sort.direction === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    }

    setTotal(processed.length);

    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setData(processed.slice(start, end));
  }, [rows, page, pageSize, sorting, filters, columns]);

  useEffect(() => {
    if (service) {
      fetchData();
    } else {
      processRows();
    }
  }, [fetchData, processRows, service]);

  const handleSort = (columnHeader: string) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.column === columnHeader);
      if (!existing) {
        return [...prev, { column: columnHeader, direction: "asc" }];
      }
      if (existing.direction === "asc") {
        return prev.map((s) => (s.column === columnHeader ? { ...s, direction: "desc" } : s));
      }
      return prev.filter((s) => s.column !== columnHeader);
    });
  };

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const totalPages = Math.ceil(total / pageSize);

  const getSortIcon = (header: string) => {
    const sort = sorting.find((s) => s.column === header);
    if (!sort) return "sort";
    return sort.direction === "asc" ? "sortAsc" : "sortDesc";
  };

  const renderPagination = () => {
    if (total === 0) return null;

    return (
      <div className='display-flex justify-content-between align-items-center margin-top-md'>
        <div className='display-flex align-items-center gap-md'>
          <span>
            Page {page} of {totalPages || 1} ({total} items)
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className='input padding-xs border-radius-sm border-light'
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        <div className='display-flex gap-sm'>
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className='btn btn-secondary'
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className='btn btn-secondary'
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div data-component='Table' className='display-flex flex-column gap-md'>
      <div className='display-flex justify-content-between align-items-center'>
        {hasFilters && (
          <div className='display-flex flex-wrap gap-md flex-grow-1'>
            {columns.map((column) => {
              if (column.filter) {
                return (
                  <div key={column.header} className='flex-grow-1' style={{ maxWidth: "200px" }}>
                    <Input
                      id={`filter-${column.header}`}
                      name={column.header}
                      label={column.header}
                      debounce={300}
                      onChange={(e) => handleFilterChange(column.header, e.target.value)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        {downloadable && (
          <ButtonIcon
            icon='download'
            onClick={() => DownloadUtils.tableCSV({ data, columns, fileName: "table_export.csv" })}
            disabled={data.length === 0 || loading}
          />
        )}
      </div>

      <div className='position-relative'>
        {loading && (
          <div
            className='position-absolute width-100 height-100 display-flex justify-content-center align-items-center'
            style={{ backgroundColor: "rgba(255,255,255,0.5)", zIndex: 10 }}
          >
            <LoadingSpinner />
          </div>
        )}

        <table className='width-100 border-collapse'>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header} className='padding-sm text-left border-bottom'>
                  <div
                    className={ClassNames.merge("display-flex align-items-center gap-xs", {
                      "cursor-pointer select-none": !!column.sortable,
                    })}
                    onClick={() => column.sortable && handleSort(column.header)}
                  >
                    {column.header}
                    {column.sortable && <Icon icon={getSortIcon(column.header)} size='xs' />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50" : ""}>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={String(row[primaryKey])} className='border-bottom hover-bg-light'>
                  {columns.map((column) => (
                    <td key={column.header} className='padding-sm'>
                      {column.cell
                        ? column.cell({ column, row, rows: data })
                        : String(row[column.acessor!] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='padding-xl text-center text-muted'>
                  {loading
                    ? "Loading..."
                    : Object.keys(filters).length > 0
                      ? "No results found matching your filters."
                      : "No data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
}
