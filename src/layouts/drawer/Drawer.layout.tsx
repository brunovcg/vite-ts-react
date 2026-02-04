import { useNavigate, useLocation } from "react-router-dom";
import { useDashboardRoutes } from "@/router/dashboard.routes";
import type { AppRouteHandle } from "@/router/dashboard.routes";
import "./Drawer.layout.css";
import { DrawerUtils } from "./drawer.utils";
import { Button } from "@/components/button/Button";
import { Icon } from "@/components/icon/Icon";

export function Drawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const dashboardRoutes = useDashboardRoutes();

  return (
    <>
      <label htmlFor='drawer-toggle' className='drawer-backdrop' />

      <aside
        className='display-flex column height-full padding-2xl border-right'
        data-component='Drawer'
      >
        <nav className='display-flex column gap-sm'>
          {dashboardRoutes.filterMap(
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              return !handle?.hide;
            },
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              const path = route.path || "";
              const icon = handle?.icon;

              return (
                <Button
                  variant={location.pathname === `/${path}` ? "filled" : "regular"}
                  className='display-flex align-center gap-md'
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
