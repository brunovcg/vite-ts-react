import { useNavigate, useLocation } from "react-router-dom";
import { useDashboardRoutes } from "@/router/dashboard.routes";
import type { AppRouteHandle } from "@/router/dashboard.routes";
import { dialogController } from "@/dialogs/Dialog.controller";
import "./Drawer.layout.css";

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
        <nav className='display-flex column gap-lg'>
          {dashboardRoutes.filterMap(
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              return !handle?.hide;
            },
            (route) => {
              const handle = route.handle as AppRouteHandle | undefined;
              const path = route.path || "";

              const isCurrent = location.pathname === `/${path}`;

              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: isCurrent ? "rgba(100, 108, 255, 0.15)" : "transparent",
                    color: isCurrent ? "#646cff" : "#a1a1aa",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    fontWeight: isCurrent ? 600 : 500,
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = isCurrent ? "#646cff" : "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isCurrent
                      ? "rgba(100, 108, 255, 0.15)"
                      : "transparent";
                    e.currentTarget.style.color = isCurrent ? "#646cff" : "#a1a1aa";
                  }}
                >
                  {handle?.title || path}
                </button>
              );
            },
          )}
          <button onClick={() => dialogController.open("TestDialog", { props: { body: "Test" } })}>
            Test
          </button>
        </nav>
      </aside>
    </>
  );
}
