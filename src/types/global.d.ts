declare global {
  /**
   * Helper type to enumerate numbers from 0 to N-1
   */
  type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

  /**
   * Generates a union type of numbers from Start to End (exclusive)
   * Uses recursion to build the range dynamically
   * @example NumberRange<1, 5> = 1 | 2 | 3 | 4
   * @example NumberRange<1, 11> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
   * @example NumberRange<0, 100> = 0 | 1 | 2 | ... | 99
   */
  type NumberRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> extends never ? never : Exclude<Enumerate<T>, Enumerate<F>>;

  /**
   * Valid number of lines for text truncation (1-10)
   * Matches the available CSS classes .text-max-lines-1 through .text-max-lines-10
   */
  type TextMaxLines = NumberRange<1, 11>;

  interface Array<T> {
    filterMap<U>(filterFn: (item: T, index: number, array: T[]) => boolean, mapFn: (item: T, index: number, array: T[]) => U): U[];
  }
}

export {};
