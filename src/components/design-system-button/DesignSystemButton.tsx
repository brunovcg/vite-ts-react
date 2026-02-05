import { useNavigate } from "react-router-dom";
import { Environment } from "@/utils/environment/Environment.util";
import { Icon } from "@/components/icon/Icon";
import "./DesignSystemButton.css";

export function DesignSystemButton() {
  const navigate = useNavigate();

  if (!Environment.isDevelopment() && !Environment.isStaging()) {
    return null;
  }

  return (
    <button
      className='design-system-button'
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
        "display-flex",
        "flex-center",
      ]}
      onClick={() => navigate("/design-system")}
      title='Open Design System'
    >
      <Icon icon='codeFrontend' size='lg' />
    </button>
  );
}
