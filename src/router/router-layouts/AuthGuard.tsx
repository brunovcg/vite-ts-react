import { Navigate, Outlet, useLocation, useMatches } from "react-router-dom";
import type { AppRouteHandle } from "../router.types";
import { useSession } from "@/context/session-context/useSession";

export function AuthGuard() {
  const matches = useMatches();
  const { user } = useSession();

  const location = useLocation();

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as AppRouteHandle | undefined;

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  if (!user.isAuthenticated && isDashboardRoute) {
    return <Navigate to='/' />;
  }

  if (handle?.hide) {
    return <Navigate to={handle.fallbackPath || "/"} replace />;
  }

  return <Outlet />;
}
