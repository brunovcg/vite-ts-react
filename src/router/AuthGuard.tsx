import { Navigate, Outlet, useMatches } from "react-router-dom";
import type { AppRouteHandle } from "./router.types";

export function AuthGuard() {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as AppRouteHandle | undefined;

  if (handle?.hide) {
    return <Navigate to={handle.fallbackPath || "/"} replace />;
  }

  return <Outlet />;
}
