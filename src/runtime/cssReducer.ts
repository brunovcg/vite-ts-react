export function cssReducer(...args: unknown[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cssReducer(...arg);
        if (inner) classes.push(inner);
      }
    } else if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg as Record<string, unknown>)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
