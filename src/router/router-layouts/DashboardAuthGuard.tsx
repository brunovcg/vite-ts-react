import { Navigate, Outlet, useLocation, useMatches } from "react-router-dom";
import type { AppRouteHandle } from "../router.types";

import { LocalStorageUtil } from "@/utils/local-storage/LocalStorage.util";
import { useSession } from "@/context/session-context/useSession";

export function DashboardAuthGuard() {
  const matches = useMatches();
  const { user } = useSession();

  const location = useLocation();

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as AppRouteHandle | undefined;

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const hasToken = LocalStorageUtil.get("vida-token");

  if (user && !hasToken && isDashboardRoute) {
    return <Navigate to='/' />;
  }

  if (handle?.hide) {
    return <Navigate to={handle.fallbackPath || "/"} replace />;
  }

  return <Outlet />;
}
