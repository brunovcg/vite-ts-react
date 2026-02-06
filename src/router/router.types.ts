import type { IconName } from "@/components/icon/Icon.types";
import type { RouteObject } from "react-router-dom";

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
