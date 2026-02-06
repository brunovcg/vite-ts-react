import { Login } from "@/pages/login/Login.page";
import { DesignSystem } from "@/pages/design-system/DesignSystem.page";
import type { AppRoute } from "@/router/router.types";

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
    element: <DesignSystem />,
    handle: {
      hide: false,
      title: "Design System",
      icon: "codeFrontend" as const,
      fullPath: "/design-system" as const,
      fallbackPath: null,
    },
  },
] as const satisfies readonly AppRoute[];
