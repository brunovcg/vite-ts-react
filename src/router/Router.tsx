import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "@/pages/login/Login.page";
import { DesignSystem } from "@/pages/design-system/DesignSystem.page";
import { Dashboard } from "@/pages/dashboard/Dashboard.page";
import { AuthGuard } from "./AuthGuard";
import { NotFound } from "@/pages/not-found/NotFound.page";
import { useDashboardRoutes } from "./dashboard.routes";
import { useMemo } from "react";
import { GlobalLayout } from "./GlobalLayout";
import { RouterErrorBoundary } from "./RouterErrorBoundary";

export function Router() {
  const dashboardRoutes = useDashboardRoutes();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <GlobalLayout />,
          errorElement: <RouterErrorBoundary />,
          children: [
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/design-system",
              element: <DesignSystem />,
            },
            {
              path: "/",
              element: <AuthGuard />,
              children: [
                {
                  path: "/",
                  element: <Dashboard />,
                  children: dashboardRoutes,
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
    [dashboardRoutes],
  );

  return <RouterProvider router={router} data-component='RouterProvider' />;
}
