import { useMemo } from "react";
import type { RouteObject } from "react-router-dom";

export type AppRouteHandle = {
  hide?: boolean;
  title?: string;
};

export function useDashboardRoutes(): RouteObject[] {
  return useMemo(
    () => [
      {
        path: "overview",
        element: <div>Overview Content</div>,
        handle: {
          hide: false,
          title: "Overview",
        } as AppRouteHandle,
      },
      {
        path: "reports",
        element: <div>Reports Content</div>,
        handle: {
          hide: false,
          title: "Reports",
        } as AppRouteHandle,
      },
      {
        path: "internal",
        element: <div>Internal Hidden Page</div>,
        handle: {
          hide: true,
          title: "Internal",
        } as AppRouteHandle,
      },
    ],
    [],
  );
}
