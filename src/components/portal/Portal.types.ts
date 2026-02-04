import type { PropsWithChildren } from "react";

export type PortalProps = PropsWithChildren<{
  className?: string;
  targetId: string;
}>;
