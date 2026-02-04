import type { DialogHTMLAttributes, PropsWithChildren } from "react";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { DialogId } from "./dialog.types";
import { dialogController } from "./Dialog.controller";
import "./Dialog.css";
import { ButtonIcon } from "@/components/button-icon/ButtonIcon";

type DialogProps = PropsWithChildren &
  DialogHTMLAttributes<HTMLDialogElement> & {
    className?: string;
    dialogId: DialogId;
    heading: string;
    width?: "sm" | "md" | "lg" | "full";
    allowXButton?: boolean;
  };

function DialogContent({ children }: PropsWithChildren) {
  return (
    <section className={ClassNames.merge("display-flex column gap-2xl padding-sm overflow-y-auto")}>
      {children}
    </section>
  );
}

function DialogFooter({ children }: PropsWithChildren) {
  return <section>{children}</section>;
}

export function Dialog({
  dialogId,
  heading,
  className,
  children,
  width,
  allowXButton = true,
  ...rest
}: DialogProps) {
  const handleCloseDialog = () => {
    dialogController.close(dialogId);
  };

  return (
    <dialog
      id={`dialog-${dialogId}`}
      data-component='Dialog'
      className={ClassNames.merge(
        "dialog position fixed top left width-full height-full display-flex center background-dialog-opacity border-none",
        {
          "dialog-sm": width === "sm",
          "dialog-md": width === "md",
          "dialog-lg": width === "lg",
          "dialog-full-screen": width === "full",
        },
        className,
      )}
      open
      {...rest}
    >
      <div
        className={
          "dialog-content display-flex column padding-lg gap-lg background-white border-radius-sm"
        }
        style={{
          width: width ? `${width}px` : "400px",
        }}
      >
        <div className={"display-flex space-between align-center"}>
          <h2>{heading}</h2>
          {allowXButton && <ButtonIcon icon='close' onClick={handleCloseDialog} />}
        </div>
        {children}
      </div>
    </dialog>
  );
}

Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
