import type { PropsWithChildren } from "react";
import { SessionProvider } from "./session-context/Session.context.provider";

export function GlobalContext({ children }: PropsWithChildren) {
  return <SessionProvider data-component='GlobalContext'>{children}</SessionProvider>;
}
