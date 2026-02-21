import { useLocation } from "react-router-dom";
import "./Drawer.layout.css";
import { DrawerUtils } from "./drawer.layout.utils";
import { Icon } from "@/components/icon/Icon.component";
import type { AppRouteHandle, RouterTypedPath } from "@/router/router.types";
import { useTypedNavigate } from "@/router/Router.utils";
import { useDashboardRoutes } from "@/router/routes/dashboard-routes/dashboard.routes";
import { useDictionary } from "@/locales";
import { drawerLocale } from "./Drawer.layout.locales";

export function Drawer() {
  const navigate = useTypedNavigate();
  const location = useLocation();
  const dictionary = useDictionary(drawerLocale);

  const dashboardRoutes = useDashboardRoutes();

  return (
    <>
      <label htmlFor='drawer-toggle' className='drawer-backdrop' />

      <aside css={["display-flex", "flex-column", "height-full", "border-right", "padding-block-lg", "align-center"]} data-component='Drawer' data-css='Drawer'>
        <nav aria-label={dictionary.mainNavigation} css={["display-flex", "flex-column", "gap-sm", "flex-1"]}>
          {dashboardRoutes.filterMap(
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              return !handle?.hide;
            },
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              const path = (route.path || "") as RouterTypedPath;
              const icon = handle?.icon;

              const isActive = location.pathname === `/dashboard/${path}`;

              return (
                <button
                  className='drawer-nav-item'
                  aria-current={isActive ? "page" : undefined}
                  key={path}
                  onClick={() => {
                    navigate(path);
                    DrawerUtils.toggle(false);
                  }}
                >
                  {icon && <Icon icon={icon} size='md' />}
                  <span className='drawer-nav-label'>{handle?.title || path}</span>
                </button>
              );
            },
          )}
        </nav>
      </aside>
    </>
  );
}
