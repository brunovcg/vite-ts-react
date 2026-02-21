import { type ReactNode } from "react";
import { useDictionary, useText } from "@/locales";
import { TableLoading } from "../../components/TableLoading.component";
import { TableHeader } from "../../components/TableHeader.component";
import { tableLocale } from "../../Table.component.locales";
import { Icon } from "@/components/icon/Icon.component";

export type CellProps<Row extends object> = {
  column: BaseTableProps<Row>["columns"][number];
  row: Row;
  rows: Row[];
  value: Row[keyof Row] | undefined;
};

export type Cell<Row extends object> = (props: CellProps<Row>) => ReactNode;

type ColumnFilter = { type: "text" | "number" | "date" | "range" } | { type: "select"; options: string[] };

type CustomCellRender<Row extends object> = { cell: Cell<Row>; accessor?: keyof Row } | { cell?: Cell<Row>; accessor: keyof Row } | { cell: Cell<Row>; accessor: keyof Row };

export type Column<Row extends object> = {
  header: string;
  sortable?: boolean;
  filter?: ColumnFilter;
  alignCell?: "left" | "center" | "right";
  alignHeader?: "left" | "center" | "right";
} & CustomCellRender<Row>;

export interface BaseTableProps<Row extends object> {
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

export function BaseTable<Row extends object>({
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
  const dictionary = useDictionary(tableLocale);
  const getText = useText(tableLocale);
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
    <div data-component='BaseTable' data-css='BaseTable' css={["display-flex", "flex-column", "gap-md", "width-full"]}>
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
      <div css={["position-relative", "overflow-x-auto", "width-full"]}>
        <TableLoading loading={loading} />

        <table className={"border-collapse"} css={["width-full"]}>
          <thead>
            <tr>
              {columns.map((column) => {
                const headerAlign = column.alignHeader || "left";
                const isSortable = !!column.sortable;
                const sortDirection = sorting.find((s) => s.column === column.header)?.direction;
                const ariaSort = sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none";

                return (
                  <th
                    key={column.header}
                    scope='col'
                    aria-sort={isSortable ? ariaSort : undefined}
                    css={["padding-sm", "border-bottom", { "text-left": headerAlign === "left", "text-center": headerAlign === "center", "text-right": headerAlign === "right" }]}
                  >
                    {isSortable ? (
                      <button
                        type='button'
                        aria-label={getText("sortBy", { column: column.header })}
                        onClick={() => handleSort(column.header)}
                        css={[
                          "display-flex",
                          "align-center",
                          "gap-xs",
                          "background-transparent",
                          "border-none",
                          "cursor-pointer",
                          "width-full",
                          {
                            "justify-start": headerAlign === "left",
                            "justify-center": headerAlign === "center",
                            "justify-end": headerAlign === "right",
                          },
                        ]}
                        style={{ font: "inherit", color: "inherit" }}
                      >
                        {column.header}
                        <Icon icon={getSortIcon(column.header)} size='xs' />
                      </button>
                    ) : (
                      <div
                        css={[
                          "display-flex",
                          "align-center",
                          "gap-xs",
                          {
                            "justify-start": headerAlign === "left",
                            "justify-center": headerAlign === "center",
                            "justify-end": headerAlign === "right",
                          },
                        ]}
                      >
                        {column.header}
                      </div>
                    )}
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
                      <td key={column.header} css={["padding-sm"]}>
                        <div
                          css={[
                            "display-flex",
                            "align-center",
                            {
                              "justify-start": cellAlign === "left",
                              "justify-center": cellAlign === "center",
                              "justify-end": cellAlign === "right",
                            },
                          ]}
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
                <td colSpan={columns.length} css={["padding-xl", "text-center"]}>
                  {loading ? dictionary.loading : Object.keys(filters).length > 0 ? dictionary.noResults : dictionary.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
