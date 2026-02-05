import { DesignSystemButton } from "@/components/design-system-button/DesignSystemButton";
import { DialogProvider } from "@/dialogs/Dialog.provider";
import { Outlet } from "react-router-dom";

export function GlobalLayout() {
  return (
    <>
      <Outlet />
      <DesignSystemButton />
      <DialogProvider />
    </>
  );
}
