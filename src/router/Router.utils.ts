import { useMatches, useNavigate, type NavigateOptions } from "react-router-dom";
import type { AppRouteHandle, RouterTypedPath } from "./router.types";

export { useLocation } from "react-router-dom";

export function useTypedNavigate() {
  const navigate = useNavigate();

  return (typedPath: RouterTypedPath, params?: NavigateOptions) => navigate(typedPath, params);
}

export function useRouteTitle() {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  return (currentRoute?.handle as AppRouteHandle)?.title;
}
