import { DownloadUtils } from "@/utils/download/Download.util";
import { ButtonIcon } from "../button-icon/ButtonIcon";
import { TablePagination } from "./TablePagination";
import type { Column } from "./BaseTable";
import { Input } from "../input/Input";

interface TableHeaderProps<Row extends Record<string, unknown>> {
  columns: Column<Row>[];
  data: Row[];
  hasFilters: boolean;
  downloadable: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange: (header: string, value: string) => void;
  loading: boolean;
}

export function TableHeader<Row extends Record<string, unknown>>({
  columns,
  data,
  hasFilters,
  downloadable,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  loading,
}: TableHeaderProps<Row>) {
  return (
    <div className='display-flex justify-between align-center width-full'>
      <div className='display-flex flex-wrap gap-md flex-grow-1'>
        {hasFilters &&
          columns.map((column) => {
            if (column.filter) {
              return (
                <div key={column.header} className='flex-grow-1' style={{ maxWidth: "200px" }}>
                  <Input
                    id={`filter-${column.header}`}
                    name={column.header}
                    label={column.header}
                    debounce={300}
                    onChange={(e) => onFilterChange(column.header, e.target.value)}
                    type={column.filter.type}
                  />
                </div>
              );
            }
            return null;
          })}
      </div>
      <div className='display-flex gap-md'>
        {downloadable && (
          <ButtonIcon
            icon='fileDownload'
            onClick={() => DownloadUtils.tableCSV({ data, columns, fileName: "table_export.csv" })}
            disabled={data.length === 0 || loading}
          />
        )}
        <TablePagination
          total={total}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          loading={loading}
        />
      </div>
    </div>
  );
}
