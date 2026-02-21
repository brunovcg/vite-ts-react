import { useCallback, useId, useRef, useState } from "react";
import type { Css } from "@/runtime/css.types";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import "./Tooltip.component.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  css?: Css;
};

export function Tooltip({ children, content, position = "top", delay = 300, disabled = false, css }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const tooltipId = useId();

  const show = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay, disabled]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  return (
    <div
      className={mergeClass({ "tooltip-visible": visible })}
      css={[css]}
      data-component='Tooltip'
      data-css='Tooltip'
      data-position={position}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <div aria-describedby={visible ? tooltipId : undefined}>{children}</div>
      <div id={tooltipId} role='tooltip' aria-label='tooltip-content'>
        {content}
      </div>
    </div>
  );
}
