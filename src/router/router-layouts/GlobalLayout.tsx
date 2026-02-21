import { DesignSystemButton } from "@/components/design-system-button/DesignSystemButton.component";
import { GlobalContext } from "@/context/Global.context";
import { DialogProvider } from "@/overlays/dialogs/Dialog.provider";
import { Outlet } from "react-router-dom";

export function GlobalLayout() {
  return (
    <GlobalContext>
      <Outlet />
      <DesignSystemButton />
      <DialogProvider />
    </GlobalContext>
  );
}
