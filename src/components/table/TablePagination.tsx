import { ButtonIcon } from "../button-icon/ButtonIcon";

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
  if (total === 0) return null;

  const itemStart = (page - 1) * pageSize + 1;
  const itemEnd = Math.min(page * pageSize, total);

  return (
    <div className='display-flex justify-center align-center gap-md'>
      <div className='display-flex align-items-center gap-md'>
        <span className='display-flex align-center'>
          {itemStart}-{itemEnd} of {total}
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
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className='display-flex gap-sm'>
        <ButtonIcon disabled={page === 1 || loading} onClick={() => onPageChange(Math.max(1, page - 1))} icon='arrowBack' />
        <ButtonIcon icon='arrowForward' onClick={() => onPageChange(Math.max(1, page + 1))} disabled={page >= totalPages || loading} />
      </div>
    </div>
  );
}
