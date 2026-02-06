import { useLocation } from "react-router-dom";
import "./Drawer.layout.css";
import { DrawerUtils } from "./drawer.utils";
import { Button } from "@/components/button/Button";
import { Icon } from "@/components/icon/Icon";
import { useDashboardRoutes } from "@/router/routes/dashboard-routes/useDashboardRoutes";
import type { AppRouteHandle, RouterTypedPath } from "@/router/router.types";
import { useTypedNavigate } from "@/router/Router.utils";

export function Drawer() {
  const navigate = useTypedNavigate();
  const location = useLocation();

  const dashboardRoutes = useDashboardRoutes();

  return (
    <>
      <label htmlFor='drawer-toggle' className='drawer-backdrop' />

      <aside css={["display-flex", "flex-column", "height-full", "border-right", "padding-block-lg", "align-center"]} data-component='Drawer'>
        <nav css={["display-flex", "flex-column", "gap-sm"]}>
          {dashboardRoutes.filterMap(
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              return !handle?.hide;
            },
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              const path = (route.path || "") as RouterTypedPath;
              const icon = handle?.icon;

              return (
                <Button
                  variant={location.pathname === `/dashboard/${path}` ? "filled" : "regular"}
                  css={["display-flex", "justify-start", "gap-md", "width-150px"]}
                  key={path}
                  onClick={() => {
                    navigate(path);
                    DrawerUtils.toggle(false);
                  }}
                >
                  {icon && <Icon icon={icon} />}
                  <p>{handle?.title || path}</p>
                </Button>
              );
            },
          )}
        </nav>
      </aside>
    </>
  );
}
