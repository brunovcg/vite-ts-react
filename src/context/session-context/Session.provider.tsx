import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { SectionContext, sessionContextInitialUser } from "./Session.context";
import type { User } from "./Session.context.types";
import { useTypedNavigate } from "@/router/Router.utils";

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>(sessionContextInitialUser);

  const navigate = useTypedNavigate();

  const login = useCallback(
    (args: { email: string }) => {
      setUser({ name: args.email, email: args.email, username: args.email, isAuthenticated: true });
      navigate("/dashboard/overview");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    console.log("aqui");
    setUser(sessionContextInitialUser);
  }, [setUser]);

  console.log(user);

  const value = useMemo(() => ({ user, logout, login }), [user, logout, login]);

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}
