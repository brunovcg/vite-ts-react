import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const visibleOptions = useMemo(() => options.filter((item) => !item.hide), [options]);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, close]);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const items = ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      items?.[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  function handleToggle() {
    if (open) {
      close();
    } else {
      setOpen(true);
    }
  }

  function handleOptionClick(option: DropdownMenuOption) {
    option.onClick();
    close();
  }

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Tab":
        case "ArrowDown": {
          e.preventDefault();
          const next = focusedIndex < visibleOptions.length - 1 ? focusedIndex + 1 : 0;
          setFocusedIndex(next);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = focusedIndex > 0 ? focusedIndex - 1 : visibleOptions.length - 1;
          setFocusedIndex(prev);
          break;
        }
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(visibleOptions.length - 1);
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [focusedIndex, visibleOptions.length, close],
  );

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (!open) {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(0);
        }
      }
      if (e.key === "Tab" && open) {
        e.preventDefault();
        setFocusedIndex(0);
      }
    },
    [open],
  );

  return (
    <div ref={ref} className={mergeClass({ "dropdown-open": open })} css={[css]} data-component='DropdownMenu' data-css='DropdownMenu' onKeyDown={handleMenuKeyDown}>
      {trigger?.label && !trigger?.custom && (
        <Button aria-label='dropdown-trigger' aria-expanded={open} aria-haspopup='menu' onClick={handleToggle} onKeyDown={handleTriggerKeyDown}>
          {trigger.icon && <Icon icon={trigger.icon} />}
          {trigger.label}
        </Button>
      )}
      {!trigger?.label && trigger?.icon && !trigger?.custom && (
        <ButtonIcon icon={trigger.icon} aria-label='dropdown-trigger' aria-expanded={open} aria-haspopup='menu' onClick={handleToggle} onKeyDown={handleTriggerKeyDown} />
      )}
      {trigger?.custom && (
        <button
          aria-label='dropdown-trigger'
          aria-expanded={open}
          aria-haspopup='menu'
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          css={["border-none", "background-transparent", "cursor-pointer"]}
        >
          {trigger.custom}
        </button>
      )}
      <div role='menu' aria-label='dropdown-options'>
        {visibleOptions.map((item, index) => (
          <Button
            key={item.label}
            role='menuitem'
            tabIndex={focusedIndex === index ? 0 : -1}
            disabled={item.disabled}
            onClick={() => handleOptionClick(item)}
            color={item.color ?? "primary"}
            css={["width-full", "display-flex", "justify-start"]}
          >
            <div css={["width-20px", "display-flex", "justify-center"]}> {item.icon && <Icon icon={item.icon} />}</div>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
