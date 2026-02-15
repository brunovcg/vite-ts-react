import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "@/pages/dashboard/Dashboard.page";
import { DashboardAuthGuard } from "./router-layouts/DashboardAuthGuard";
import { NotFound } from "@/pages/not-found/NotFound.page";
import { useMemo } from "react";
import { GlobalLayout } from "./router-layouts/GlobalLayout";
import { RouterErrorBoundary } from "./router-layouts/router-error-boundary/RouterErrorBoundary";

import { OPEN_ROUTES } from "./routes/open-routes/open.routes";
import { useDashboardRoutes } from "./routes/dashboard-routes/dashboard.routes";

export function Router() {
  const DASHBOARD_ROUTES = useDashboardRoutes();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <GlobalLayout />,
          errorElement: <RouterErrorBoundary />,
          children: [
            ...OPEN_ROUTES,
            {
              path: "/",
              element: <DashboardAuthGuard />,
              children: [
                {
                  path: "/dashboard",
                  element: <Dashboard />,
                  children: DASHBOARD_ROUTES,
                },
              ],
            },
            {
              path: "*",
              element: <NotFound />,
            },
          ],
        },
      ]),
    [DASHBOARD_ROUTES],
  );

  return <RouterProvider router={router} data-component='RouterProvider' />;
}
