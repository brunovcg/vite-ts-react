import type { KeyboardKey } from "@/constants/keyboard.constants";
import type { RefObject } from "react";

export type HoldActions =
  | {
      hold?: KeyboardKey;
      ignoreHold?: never;
    }
  | {
      hold?: never;
      ignoreHold?: KeyboardKey;
    };

export type UseOnKeyPressProps = HoldActions & {
  keys: KeyboardKey[];
  handler: (e?: KeyboardEvent) => void;
  enabled?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  target?: RefObject<Element | null> | null;
  type?: "keydown" | "keyup";
};
