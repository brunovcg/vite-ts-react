import { LoadingSpinner } from "../../loading-spinner/LoadingSpinner.component";
import { tableLocale } from "../Table.component.locales";
import { useDictionary } from "@/locales";

interface TableLoadingProps {
  loading: boolean;
}

export function TableLoading({ loading }: TableLoadingProps) {
  const dictionary = useDictionary(tableLocale);
  if (!loading) return null;

  return (
    <div role='status' aria-label={dictionary.loadingTableData} className='position-absolute display-flex justify-center align-center background-backdrop-light'>
      <LoadingSpinner />
    </div>
  );
}
