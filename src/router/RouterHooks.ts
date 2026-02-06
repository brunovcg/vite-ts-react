import { useNavigate, type NavigateOptions } from "react-router-dom";
import type { DASHBOARD_ROUTES } from "./routes/dashboard-routes/dashboard.routes";
import type { OPEN_ROUTES } from "./routes/open-routes/openRoutes";

export { useLocation } from "react-router-dom";

type ExtractFullPath<T> = T extends readonly (infer U)[] ? (U extends { handle: { fullPath: infer P } } ? P : never) : never;

export type TypedPath = ExtractFullPath<typeof OPEN_ROUTES> | ExtractFullPath<typeof DASHBOARD_ROUTES>;

export function useTypedNavigate() {
  const navigate = useNavigate();

  return (typePath: TypedPath, params?: NavigateOptions) => navigate(typePath, params);
}
