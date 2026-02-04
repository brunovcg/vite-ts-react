import type { CellProps } from "../../BaseTable";

export function TextCell<Row extends Record<string, unknown>>(
  cell: CellProps<Row> | string,
  maxLines: TextMaxLines,
) {
  const value =
    typeof cell === "string" ? cell : cell.row[cell.column?.accessor as keyof typeof cell.row];

  if (typeof value !== "string") return null;

  return <p className={`text-max-lines-${maxLines}`}>{value}</p>;
}
