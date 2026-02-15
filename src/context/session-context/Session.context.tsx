import { createContext } from "react";
import type { SessionContext, User } from "./Session.context.types";

export const sessionContextInitialUser: User = { name: "", email: "", username: "", isAuthenticated: false } as const;

export const SectionContext = createContext<SessionContext>({ user: sessionContextInitialUser, login: () => {}, logout: () => {} });
