export class DateUtil {
  static renderFormat(date: string | null | undefined): string {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  }

  /**
   * Formats a date according to the given format string.
   * Supported tokens:
   * - YYYY/yyyy: Full Year (e.g., 2024)
   * - YY: 2-digit Year (e.g., 24)
   * - MMMM: Full Month Name (e.g., January)
   * - MMM: Short Month Name (e.g., Jan)
   * - MM: 2-digit Month (e.g., 01)
   * - dd: 2-digit Day (e.g., 01)
   * - HH: 2-digit Hour (e.g., 14)
   * - mm: 2-digit Minute (e.g., 30)
   * - ss: 2-digit Second (e.g., 59)
   * Any other characters (like separators) are preserved.
   *
   * @param date - The date object or string to format.
   * @param format - The target format string (e.g., "YYYY-MM-dd").
   * @returns The formatted date string, or an empty string if the date is invalid.
   */
  static format(date: string | Date, format: string): string {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return "";
    }

    const map: Record<string, string> = {
      YYYY: d.getFullYear().toString(),
      yyyy: d.getFullYear().toString(),
      YY: d.getFullYear().toString().slice(-2),
      MMMM: d.toLocaleString("default", { month: "long" }),
      MMM: d.toLocaleString("default", { month: "short" }),
      MM: String(d.getMonth() + 1).padStart(2, "0"),
      DD: String(d.getDate()).padStart(2, "0"),
      dd: String(d.getDate()).padStart(2, "0"),
      HH: String(d.getHours()).padStart(2, "0"),
      mm: String(d.getMinutes()).padStart(2, "0"),
      ss: String(d.getSeconds()).padStart(2, "0"),
    };

    return format.replace(/YYYY|yyyy|YY|MMMM|MMM|MM|dd|DD|HH|mm|ss/g, (key) => map[key]);
  }
}
