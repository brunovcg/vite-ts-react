import { ButtonIcon } from "../button-icon/ButtonIcon";
import { tableLocale } from "./Table.locales";
import { useDictionary } from "@/locales";

interface TablePaginationProps {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  onPageSizeChange: (number: number) => void;
  onPageChange: (number: number) => void;
  loading: boolean;
}

export function TablePagination({ total, totalPages, page, pageSize, loading, onPageSizeChange, onPageChange }: TablePaginationProps) {
  const dictionary = useDictionary(tableLocale);
  if (total === 0) return null;

  const itemStart = (page - 1) * pageSize + 1;
  const itemEnd = Math.min(page * pageSize, total);

  return (
    <div className='display-flex justify-center align-center gap-md'>
      <div className='display-flex align-items-center gap-md'>
        <span className='display-flex align-center'>
          {itemStart}-{itemEnd} {dictionary.of} {total}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className='input padding-xs border-radius-sm border-light'
          aria-label={dictionary.rowsPerPage}
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className='display-flex gap-sm'>
        <ButtonIcon disabled={page === 1 || loading} onClick={() => onPageChange(Math.max(1, page - 1))} icon='arrowBack' aria-label={dictionary.previousPage} />
        <ButtonIcon icon='arrowForward' onClick={() => onPageChange(Math.max(1, page + 1))} disabled={page >= totalPages || loading} aria-label={dictionary.nextPage} />
      </div>
    </div>
  );
}
