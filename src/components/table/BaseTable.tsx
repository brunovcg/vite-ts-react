import { type ReactNode } from "react";
import { Icon } from "../icon/Icon";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import { TableHeader } from "./TableHeader";
import { TableLoading } from "./TableLoading";

export type CellProps<Row extends Record<string, unknown>> = {
  column: BaseTableProps<Row>["columns"][number];
  row: Row;
  rows: Row[];
  value: Row[keyof Row] | undefined;
};

export type Cell<Row extends Record<string, unknown>> = (props: CellProps<Row>) => ReactNode;

type ColumnFilter = { type: "text" | "number" | "date" | "range" } | { type: "select"; options: string[] };

type CustomCellRender<Row extends Record<string, unknown>> =
  | { cell: Cell<Row>; accessor?: keyof Row }
  | { cell?: Cell<Row>; accessor: keyof Row }
  | { cell: Cell<Row>; accessor: keyof Row };

export type Column<Row extends Record<string, unknown>> = {
  header: string;
  sortable?: boolean;
  filter?: ColumnFilter;
  alignCell?: "left" | "center" | "right";
  alignHeader?: "left" | "center" | "right";
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
      onSortChange(sorting.map((s) => (s.column === columnHeader ? { ...s, direction: "desc" } : s)));
    } else {
      onSortChange(sorting.filter((s) => s.column !== columnHeader));
    }
  };

  const getSortIcon = (header: string) => {
    const sort = sorting.find((s) => s.column === header);
    if (!sort) return "sort";
    return sort.direction === "asc" ? "sortAsc" : "sortDesc";
  };

  return (
    <div data-component='BaseTable' className='display-flex flex-column gap-md width-full'>
      <TableHeader
        columns={columns}
        data={data}
        hasFilters={hasFilters}
        downloadable={downloadable}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onFilterChange={onFilterChange}
        loading={loading}
      />
      <div className='position-relative overflow-x-auto width-full'>
        <TableLoading loading={loading} />

        <table className='border-collapse width-full'>
          <thead>
            <tr>
              {columns.map((column) => {
                const headerAlign = column.alignHeader || "left";
                return (
                  <th
                    key={column.header}
                    className={ClassNames.merge("padding-sm border-bottom", {
                      "text-left": headerAlign === "left",
                      "text-center": headerAlign === "center",
                      "text-right": headerAlign === "right",
                    })}
                  >
                    <div
                      className={ClassNames.merge("display-flex align-items-center gap-xs", {
                        "cursor-pointer select-none": !!column.sortable,
                        "justify-start": headerAlign === "left",
                        "justify-center": headerAlign === "center",
                        "justify-end": headerAlign === "right",
                      })}
                      onClick={() => column.sortable && handleSort(column.header)}
                    >
                      {column.header}
                      {column.sortable && <Icon icon={getSortIcon(column.header)} size='xs' />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50" : ""}>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={String(row[primaryKey])} className='border-bottom hover-bg-light'>
                  {columns.map((column) => {
                    const cellAlign = column.alignCell || column.alignHeader || "left";
                    return (
                      <td key={column.header} className='padding-sm'>
                        <div
                          className={ClassNames.merge("display-flex align-center", {
                            "justify-start": cellAlign === "left",
                            "justify-center": cellAlign === "center",
                            "justify-end": cellAlign === "right",
                          })}
                        >
                          {column.cell
                            ? column.cell({
                                column,
                                row,
                                rows: data,
                                value: row[column.accessor as unknown as keyof Row],
                              })
                            : String(row[column.accessor!] ?? "")}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='padding-xl text-center text-muted'>
                  {loading ? "Loading..." : Object.keys(filters).length > 0 ? "No results found matching your filters." : "No data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
