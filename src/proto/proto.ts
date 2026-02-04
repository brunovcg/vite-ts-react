if (!Array.prototype.filterMap) {
  Object.defineProperty(Array.prototype, "filterMap", {
    value: function <T, U>(this: T[], filterFn: (item: T, index: number, array: T[]) => boolean, mapFn: (item: T, index: number, array: T[]) => U): U[] {
      const result: U[] = [];
      for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (filterFn(item, i, this)) {
          result.push(mapFn(item, i, this));
        }
      }
      return result;
    },
    writable: true,
    configurable: true,
  });
}

export {};
