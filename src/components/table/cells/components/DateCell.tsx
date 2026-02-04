import { DateUtil } from "@/utils/date/Date.util";
import type { CellProps } from "../../BaseTable";

export function DateCell<Row extends Record<string, unknown>>(input: CellProps<Row> | string) {
  const value = typeof input === "string" ? input : input.row[input.column?.accessor as keyof typeof input.row];

  if (typeof value !== "string") return null;

  return DateUtil.renderFormat(value);
}
