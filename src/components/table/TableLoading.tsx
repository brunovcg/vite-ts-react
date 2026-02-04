import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";

interface TableLoadingProps {
  loading: boolean;
}

export function TableLoading({ loading }: TableLoadingProps) {
  if (!loading) return null;

  return (
    <div
      className='position-absolute width-full height-full display-flex justify-center align-center'
      style={{ backgroundColor: "rgba(255,255,255,0.5)", zIndex: 10 }}
    >
      <LoadingSpinner />
    </div>
  );
}
