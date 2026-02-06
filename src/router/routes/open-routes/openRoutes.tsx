import { lazy } from "react";
import { Login } from "@/pages/login/Login.page";

import type { AppRoute } from "@/router/router.types";
import { RouterPageLoading } from "@/router/router-layouts/router-page-loading/RouterPageLoading";

const DesignSystem = lazy(() => import("@/pages/design-system/DesignSystem.page").then((module) => ({ default: module.DesignSystem })));

export const OPEN_ROUTES = [
  {
    path: "/",
    element: <Login />,
    handle: {
      hide: false,
      title: "Login",
      icon: "home" as const,
      fullPath: "/" as const,
      fallbackPath: null,
    },
  },
  {
    path: "/design-system",
    element: (
      <RouterPageLoading>
        <DesignSystem />
      </RouterPageLoading>
    ),
    handle: {
      hide: false,
      title: "Design System",
      icon: "codeFrontend" as const,
      fullPath: "/design-system" as const,
      fallbackPath: null,
    },
  },
] as const satisfies readonly AppRoute[];
