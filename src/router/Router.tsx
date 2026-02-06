import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "@/pages/dashboard/Dashboard.page";
import { AuthGuard } from "./AuthGuard";
import { NotFound } from "@/pages/not-found/NotFound.page";
import { useMemo } from "react";
import { GlobalLayout } from "./GlobalLayout";
import { RouterErrorBoundary } from "./RouterErrorBoundary";
import { useDashboardRoutes } from "./routes/dashboard-routes/useDashboardRoutes";
import { OPEN_ROUTES } from "./routes/open-routes/openRoutes";

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
              element: <AuthGuard />,
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
