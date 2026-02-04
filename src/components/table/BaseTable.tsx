import { type ReactNode } from "react";
import { Input } from "../input/Input";
import { Icon } from "../icon/Icon";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import { ButtonIcon } from "../button-icon/ButtonIcon";
import { DownloadUtils } from "@/utils/download/Download.util";

export type CellProps<Row extends Record<string, unknown>> = {
  column: BaseTableProps<Row>["columns"][number];
  row: Row;
  rows: Row[];
};

export type Cell<Row extends Record<string, unknown>> = (props: CellProps<Row>) => ReactNode;

type ColumnFilter =
  | { type: "text" | "number" | "date" | "range" }
  | { type: "select"; options: string[] };

type CustomCellRender<Row extends Record<string, unknown>> =
  | { cell: Cell<Row>; accessor?: never }
  | { cell?: never; accessor: keyof Row };

export type Column<Row extends Record<string, unknown>> = {
  header: string;
  sortable?: boolean;
  filter?: ColumnFilter;
} & CustomCellRender<Row>;

export interface BaseTableProps<Row extends Record<string, unknown>> {
  columns: Column<Row>[];
  data: Row[];
  primaryKey: keyof Row;
  loading?: boolean;
  downloadable?: boolean;

  // Pagination props
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  // Sorting props
  sorting: { column: string; direction: "asc" | "desc" }[];
  onSortChange: (sorting: { column: string; direction: "asc" | "desc" }[]) => void;

  // Filter props
  filters: Record<string, string>;
  onFilterChange: (header: string, value: string) => void;
}

export function BaseTable<Row extends Record<string, unknown>>({
  columns,
  data,
  primaryKey,
  loading = false,
  downloadable = false,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortChange,
  filters,
  onFilterChange,
}: BaseTableProps<Row>) {
  const hasFilters = columns.some((column) => column.filter);
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (columnHeader: string) => {
    const existing = sorting.find((s) => s.column === columnHeader);
    if (!existing) {
      onSortChange([...sorting, { column: columnHeader, direction: "asc" }]);
    } else if (existing.direction === "asc") {
      onSortChange(
        sorting.map((s) => (s.column === columnHeader ? { ...s, direction: "desc" } : s)),
      );
    } else {
      onSortChange(sorting.filter((s) => s.column !== columnHeader));
    }
  };

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
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
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
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className='btn btn-secondary'
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className='btn btn-secondary'
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div data-component='BaseTable' className='display-flex flex-column gap-md'>
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
                      onChange={(e) => onFilterChange(column.header, e.target.value)}
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
                        : String(row[column.accessor!] ?? "")}
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
