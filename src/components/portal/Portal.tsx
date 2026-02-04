import { useLayoutEffect, useState } from "react";
import type { PortalProps } from "./Portal.types";
import { createPortal } from "react-dom";

export function Portal({ children, className, targetId }: PortalProps) {
  // Lazily initialize to avoid re-render if element already exists
  const [container, setContainer] = useState<Element | null>(() => (typeof document !== "undefined" ? document.getElementById(targetId) : null));

  useLayoutEffect(() => {
    const element = document.getElementById(targetId);
    if (element !== container) {
      // eslint-disable-next-line
      setContainer(element);
    }
  }, [targetId, container]);

  if (!container) {
    return null;
  }

  if (className) {
    return createPortal(<div className={className}>{children}</div>, container);
  }

  return createPortal(children, container);
}
