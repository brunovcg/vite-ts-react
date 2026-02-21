import { Environment } from "@/utils/environment/Environment.util";
import { Icon } from "@/components/icon/Icon.component";
import "./DesignSystemButton.component.css";

import { useTypedNavigate, useLocation } from "@/router/Router.utils";

export function DesignSystemButton() {
  const navigate = useTypedNavigate();
  const location = useLocation();

  const isDesignSystemPage = location.pathname === "/design-system";

  if (!Environment.isDevelopment() && !Environment.isStaging()) {
    return null;
  }

  return (
    <button
      data-component='DesignSystemButton'
      data-css='DesignSystemButton'
      css={[
        "position-fixed",
        "bottom",
        "right",
        "margin-lg",
        "padding-md",
        "background-primary",
        "color-white",
        "border-none",
        "border-radius-circle",
        "cursor-pointer",
        "flex-center",
        {
          "display-flex": !isDesignSystemPage,
          "display-none": isDesignSystemPage,
        },
      ]}
      onClick={() => navigate("/design-system", { state: { returnTo: location.pathname } })}
      title='Open Design System'
    >
      <Icon icon='codeFrontend' size='lg' />
    </button>
  );
}
