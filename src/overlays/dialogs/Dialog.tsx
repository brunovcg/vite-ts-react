import { useCallback, useRef, type DialogHTMLAttributes, type PropsWithChildren } from "react";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { DialogId } from "./dialog.types";
import { dialogController } from "./Dialog.controller";
import "./Dialog.css";
import { ButtonIcon } from "@/components/button-icon/ButtonIcon.component";
import { Button, type ButtonProps } from "@/components/button/Button.component";
import type { MouseEvent } from "react";
import { EVENTS } from "@/events/events";
import { useOnKeyPress } from "@/hooks/use-on-key-press/useOnKeyPress.hook";
import { useOnClickOutside } from "@/hooks/use-on-click-outside/useOnClickOutside.hook";
import { useListenEvent } from "@/hooks/use-listen-event/useListenEvent.hook";
import { useFocusTrap } from "@/hooks/use-focus-trap/useFocusTrap.hook";
import type { PropsWithCss } from "@/runtime/css.types";
import { useDictionary } from "@/locales";
import { dialogLocale } from "./Dialog.locales";

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
    <section className={ClassNames.merge("display-flex flex-column gap-2xl padding-lg overflow-y-auto flex-1")} data-component='DialogContent'>
      {children}
    </section>
  );
}

function DialogCloseButton({ onClick, children, css, ...props }: PropsWithCss<ButtonProps>) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.dispatchEvent(new CustomEvent(EVENTS.CLOSE_DIALOG, { bubbles: true }));
    onClick?.(e);
  };

  return (
    <Button color='error' {...props} css={[css]} onClick={handleClick} data-component='DialogCloseButton'>
      {children}
    </Button>
  );
}

function DialogFooter({ children, css }: PropsWithCss<PropsWithChildren>) {
  return (
    <section data-component='DialogFooter' css={["padding-lg", "display-flex", "justify-end", css]}>
      {children}
    </section>
  );
}

export function Dialog({ dialogId, heading, className, children, width, allowXButton = true, closeOnEscape = true, css, ...rest }: DialogProps) {
  const dictionary = useDictionary(dialogLocale);
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

  useFocusTrap({
    ref: dialogRef,
    active: true,
  });

  return (
    <dialog
      ref={dialogRef}
      id={`dialog-${dialogId}`}
      aria-labelledby={`dialog-title-${dialogId}`}
      data-component='Dialog'
      data-css='Dialog'
      css={["position-fixed", "top", "left", "width-full", "height-full", "display-flex", "flex-center", "background-dialog-opacity", "border-none", "animate-backdrop-fade-in"]}
      className={ClassNames.merge(
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
      <div className='dialog-content' css={["display-flex", "flex-column", "background-white", "border-radius-lg", "animate-dialog-slide-up", css]}>
        {(heading || allowXButton) && (
          <section className={"dialog-header"} css={["display-flex", "justify-between", "align-center", "border-bottom", "padding-lg"]}>
            <h2 id={`dialog-title-${dialogId}`} css={["width-full", "text-ellipsis"]}>
              {heading}
            </h2>
            {allowXButton && <ButtonIcon icon='close' onClick={handleCloseDialog} aria-label={dictionary.closeDialog} />}
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
