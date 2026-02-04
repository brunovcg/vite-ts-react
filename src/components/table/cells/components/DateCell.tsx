import { DateUtil } from "@/utils/date/Date.util";
import type { CellProps } from "../../BaseTable";

export function DateCell<Row extends Record<string, unknown>>(cell: CellProps<Row> | string) {
  const value =
    typeof cell === "string" ? cell : cell.row[cell.column?.accessor as keyof typeof cell.row];

  if (typeof value !== "string") return null;

  return DateUtil.renderFormat(value);
}
