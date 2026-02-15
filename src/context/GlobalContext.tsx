import type { PropsWithChildren } from "react";
import { SessionProvider } from "./session-context/Session.provider";

export function GlobalContext({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
