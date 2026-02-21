import { useLocation, useNavigate, type NavigateOptions } from "react-router-dom";
import type { AppRouteHandle, RouterTypedPath } from "./router.types";
import { useDashboardRoutes } from "./routes/dashboard-routes/dashboard.routes";

export { useLocation } from "react-router-dom";

export function useTypedNavigate() {
  const navigate = useNavigate();

  return (typedPath: RouterTypedPath, params?: NavigateOptions) => navigate(typedPath, params);
}

export function useRouteTitle() {
  const location = useLocation();
  const dashboardRoutes = useDashboardRoutes();
  const currentRoute = dashboardRoutes.find((r) => location.pathname === `/dashboard/${r.path}`);

  return (currentRoute?.handle as AppRouteHandle)?.title;
}
