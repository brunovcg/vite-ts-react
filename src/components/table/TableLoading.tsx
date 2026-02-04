import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";

interface TableLoadingProps {
  loading: boolean;
}

export function TableLoading({ loading }: TableLoadingProps) {
  if (!loading) return null;

  return (
    <div className='position-absolute display-flex justify-center align-center background-backdrop-light'>
      <LoadingSpinner />
    </div>
  );
}
