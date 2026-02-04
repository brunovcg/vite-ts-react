import { useCallback, useRef, type DialogHTMLAttributes, type PropsWithChildren } from "react";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { DialogId } from "./dialog.types";
import { dialogController } from "./Dialog.controller";
import "./Dialog.css";
import { ButtonIcon } from "@/components/button-icon/ButtonIcon";
import { Button, type ButtonProps } from "@/components/button/Button";
import type { MouseEvent } from "react";
import { EVENTS } from "@/events/events";
import { useOnKeyPress } from "@/hooks/use-on-key-press/useOnKeyPress.hook";
import { useOnClickOutside } from "@/hooks/use-on-click-outside/useOnClickOutside.hook";
import { useListenEvent } from "@/hooks/use-listen-event/useListenEvent.hook";

type DialogProps = PropsWithChildren &
  DialogHTMLAttributes<HTMLDialogElement> & {
    className?: string;
    dialogId: DialogId;
    heading: string;
    width?: "sm" | "md" | "lg" | "full";
    allowXButton?: boolean;
    closeOnEscape?: boolean;
  };

function DialogContent({ children }: PropsWithChildren) {
  return (
    <section
      className={ClassNames.merge("display-flex column gap-2xl padding-lg overflow-y-auto flex-1")}
      data-component='DialogContent'
    >
      {children}
    </section>
  );
}

function DialogCloseButton({ onClick, children, ...props }: ButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG, { bubbles: true }));
    onClick?.(e);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}

function DialogFooter({ children }: PropsWithChildren) {
  return (
    <section data-component='DialogFooter' className='padding-lg'>
      {children}
    </section>
  );
}

export function Dialog({
  dialogId,
  heading,
  className,
  children,
  width,
  allowXButton = true,
  closeOnEscape = true,
  ...rest
}: DialogProps) {
  const handleCloseDialog = useCallback(() => {
    dialogController.close(dialogId);
  }, [dialogId]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useOnKeyPress({
    keys: ["Escape"],
    target: dialogRef,
    enabled: closeOnEscape,
    handler: handleCloseDialog,
  });

  useOnClickOutside({
    ref: dialogRef,
    handler: handleCloseDialog,
    active: closeOnEscape,
  });

  useListenEvent({
    ref: dialogRef,
    event: "CLOSE_DIALOG",
    handler: handleCloseDialog,
    enabled: closeOnEscape,
  });

  return (
    <dialog
      ref={dialogRef}
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
        className={"dialog-content display-flex column gap-lg background-white border-radius-sm"}
        style={{
          width: width ? `${width}px` : "400px",
        }}
      >
        {(heading || allowXButton) && (
          <section
            className={
              "dialog-header display-flex space-between align-center border-bottom padding-lg"
            }
          >
            <h2 className='typography width-full ellipsis'>{heading}</h2>
            {allowXButton && <ButtonIcon icon='close' onClick={handleCloseDialog} />}
          </section>
        )}
        {children}
      </div>
    </dialog>
  );
}

Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogCloseButton;
