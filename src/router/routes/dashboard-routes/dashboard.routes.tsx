import type { AppRoute } from "../../router.types";

export const DASHBOARD_ROUTES = [
  {
    path: "overview",
    element: <div>Overview Content</div>,
    handle: {
      hide: false,
      title: "Overview",
      icon: "home" as const,
      fullPath: "/dashboard/overview" as const,
      fallbackPath: "/",
    },
  },
  {
    path: "reports",
    element: <div>Reports Content</div>,
    handle: {
      hide: false,
      title: "Reports",
      icon: "file" as const,
      fullPath: "/dashboard/reports" as const,
      fallbackPath: "/dashbaord/overview",
    },
  },
  {
    path: "internal",
    element: <div>Internal Hidden Page</div>,
    handle: {
      hide: true,
      title: "Internal",
      icon: "file" as const,
      fullPath: "/dashboard/internal" as const,
      fallbackPath: "/dashbaord/overview",
    },
  },
] as const satisfies readonly AppRoute[];
