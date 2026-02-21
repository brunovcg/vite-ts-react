import type { IconName } from "@/components/icon/Icon.component.types";
import type { RouteObject } from "react-router-dom";
import type { OPEN_ROUTES } from "./routes/open-routes/open.routes";
import type { useDashboardRoutes } from "./routes/dashboard-routes/dashboard.routes";

type ExtractFullPath<T> = T extends readonly (infer U)[] ? (U extends { handle: { fullPath: infer P } } ? P : never) : never;

export type RouterTypedPath = ExtractFullPath<typeof OPEN_ROUTES> | ExtractFullPath<ReturnType<typeof useDashboardRoutes>>;

export type AppRouteHandle = {
  hide: boolean;
  title: string;
  icon: IconName;
  fullPath: string;
  fallbackPath: string | null;
};

export type AppRoute = RouteObject & {
  handle: AppRouteHandle;
};
