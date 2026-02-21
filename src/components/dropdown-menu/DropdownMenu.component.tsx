import { useEffect, useRef, useState } from "react";
import type { Css } from "@/runtime/css.types";
import type { IconName } from "../icon/Icon.component.types";
import { Button } from "../button/Button.component";
import { ButtonIcon } from "../button-icon/ButtonIcon.component";
import { Icon } from "../icon/Icon.component";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import "./DropdownMenu.component.css";

type CustomTrigger =
  | {
      icon: IconName;
      label: string;
      custom?: never;
    }
  | { icon: IconName; label?: string; custom?: never }
  | { icon?: IconName; label: string; custom?: never }
  | { icon?: never; label?: never; custom: React.ReactNode };

interface DropdownMenuOption {
  label: string;
  onClick: VoidFunction;
  icon?: IconName;
  disabled?: boolean;
  hide?: boolean;
  color?: "primary" | "error";
}

type DropdownMenuProps = {
  options: DropdownMenuOption[];
  css?: Css;
  trigger: CustomTrigger;
};

export function DropdownMenu({ options, css, trigger }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  function handleOptionClick(option: DropdownMenuOption) {
    option.onClick();
    setOpen(false);
  }

  return (
    <div ref={ref} className={mergeClass({ "dropdown-open": open })} css={[css]} data-component='DropdownMenu' data-css='DropdownMenu'>
      {trigger?.label && !trigger?.custom && (
        <Button aria-label='dropdown-trigger' aria-expanded={open} aria-haspopup='menu' onClick={handleToggle}>
          {trigger.icon && <Icon icon={trigger.icon} />}
          {trigger.label}
        </Button>
      )}
      {!trigger?.label && trigger?.icon && !trigger?.custom && <ButtonIcon icon={trigger.icon} aria-label='dropdown-trigger' aria-expanded={open} aria-haspopup='menu' onClick={handleToggle} />}
      {trigger?.custom && (
        <button aria-label='dropdown-trigger' aria-expanded={open} aria-haspopup='menu' onClick={handleToggle} css={["border-none", "background-transparent", "cursor-pointer"]}>
          {trigger.custom}
        </button>
      )}
      <div role='menu' aria-label='dropdown-options'>
        {options.filterMap(
          (item) => !item.hide,
          (item) => (
            <Button
              key={item.label}
              role='menuitem'
              disabled={item.disabled}
              onClick={() => handleOptionClick(item)}
              color={item.color ?? "primary"}
              css={["width-full", "display-flex", "justify-start"]}
            >
              <div css={["width-20px", "display-flex", "justify-center"]}> {item.icon && <Icon icon={item.icon} />}</div>
              {item.label}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
