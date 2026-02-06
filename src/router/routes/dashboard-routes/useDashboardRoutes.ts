import type { RouteObject } from "react-router-dom";
import { DASHBOARD_ROUTES } from "./dashboard.routes";
import type { AppRoute } from "../../router.types";
import { useMemo } from "react";

export function useDashboardRoutes(): RouteObject[] {
  return useMemo((): AppRoute[] => DASHBOARD_ROUTES as unknown as AppRoute[], []);
}
