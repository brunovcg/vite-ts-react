import { useNavigate, type NavigateOptions } from "react-router-dom";
import type { RouterTypedPath } from "./router.types";

export { useLocation } from "react-router-dom";

export function useTypedNavigate() {
  const navigate = useNavigate();

  return (typedPath: RouterTypedPath, params?: NavigateOptions) => navigate(typedPath, params);
}
