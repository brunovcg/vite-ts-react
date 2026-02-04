export type UseDebounceProps<Value> = {
  value: Value;
  delay: number;
  active?: boolean;
  onDebounceChange?: (value: Value) => void;
};
