import { lazy, useMemo } from "react";
import type { AppRoute } from "../../router.types";
import { OverviewPage } from "@/pages/dashboard/overview/Overview.page";
import { RouterPageLoading } from "@/router/router-layouts/router-page-loading/RouterPageLoading";
import { useDictionary } from "@/locales";
import { dashboardRoutesLocale } from "./dashboard.routes.locales";

const ReportsPage = lazy(() => import("@/pages/dashboard/reports/Reports.page").then((module) => ({ default: module.ReportsPage })));
const InternalPage = lazy(() => import("@/pages/dashboard/internal/Internal.page").then((module) => ({ default: module.InternalPage })));

export function useDashboardRoutes() {
  const dictionary = useDictionary(dashboardRoutesLocale);

  const DASHBOARD_ROUTES = useMemo(
    () =>
      [
        {
          path: "overview",
          element: <OverviewPage />,
          handle: {
            hide: false,
            title: dictionary.overview,
            icon: "home",
            fullPath: "/dashboard/overview",
            fallbackPath: "/",
          },
        },
        {
          path: "reports",
          element: (
            <RouterPageLoading>
              <ReportsPage />
            </RouterPageLoading>
          ),
          handle: {
            hide: false,
            title: dictionary.reports,
            icon: "file",
            fullPath: "/dashboard/reports",
            fallbackPath: "/dashboard/overview",
          },
        },
        {
          path: "internal",
          element: (
            <RouterPageLoading>
              <InternalPage />
            </RouterPageLoading>
          ),
          handle: {
            hide: true,
            title: "Internal",
            icon: "file",
            fullPath: "/dashboard/internal",
            fallbackPath: "/dashboard/overview",
          },
        },
      ] satisfies AppRoute[],
    [dictionary],
  );

  return DASHBOARD_ROUTES;
}
