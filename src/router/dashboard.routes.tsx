import type { IconName } from "@/components/icon/Icon.types";
import { useMemo } from "react";
import type { RouteObject } from "react-router-dom";

export type AppRouteHandle = {
  hide?: boolean;
  title?: string;
  icon?: IconName;
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
          icon: "home",
        } as AppRouteHandle,
      },
      {
        path: "reports",
        element: <div>Reports Content</div>,
        handle: {
          hide: false,
          title: "Reports",
          icon: "file",
        } as AppRouteHandle,
      },
      {
        path: "internal",
        element: <div>Internal Hidden Page</div>,
        handle: {
          hide: true,
          title: "Internal",
          icon: "file",
        } as AppRouteHandle,
      },
    ],
    [],
  );
}
