import { DesignSystemButton } from "@/components/design-system-button/DesignSystemButton";
import { GlobalContext } from "@/context/GlobalContext";
import { DialogProvider } from "@/dialogs/Dialog.provider";
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
