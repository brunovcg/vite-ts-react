import type { CellProps } from "../../BaseTable.component";

export function TextCell<Row extends Record<string, unknown>>(input: CellProps<Row> | string, maxLines: TextMaxLines) {
  const value = typeof input === "string" ? input : input.row[input.column?.accessor as keyof typeof input.row];

  if (typeof value !== "string") return null;

  return <p className={`text-max-lines-${maxLines}`}>{value}</p>;
}
