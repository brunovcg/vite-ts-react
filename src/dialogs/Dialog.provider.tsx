import { type ComponentType, Fragment, useEffect, useSyncExternalStore } from "react";
import { dialogController } from "./Dialog.controller";
import { dialogs } from "./dialog.register";
import { Portal } from "../components/portal/Portal";

import { UrlUtils } from "@/utils/url/Url.utils";
import {
  CreateComponent,
  type AttributesOptionalChildren,
} from "@/components/create-component/CreateComponent";

import type { DialogId, ConditionalProps } from "./dialog.types";

export function DialogProvider() {
  const openedDialogs = useSyncExternalStore(
    dialogController.subscribe,
    dialogController.getSnapshot,
  );

  // Open dialog detailed on query params
  useEffect(() => {
    try {
      const params = UrlUtils.get("dialog");

      if (params) {
        // Format: id:prop1=val1&prop2=val2|id2:prop3=val3
        const items = params.split("|");
        items.forEach((item) => {
          const [id, query] = item.split(":");

          let props: Record<string, unknown> = {};
          if (query) {
            const searchParams = new URLSearchParams(query);
            props = Object.fromEntries(searchParams.entries());
          }

          // Re-casting to conform to open method signature which expects specific props
          // We assume URL params match expected props
          dialogController.open(id as DialogId, { props } as unknown as ConditionalProps<DialogId>);
        });
      }
    } catch {
      return;
    }
  }, []);

  return (
    <Portal targetId='dialog-root'>
      {openedDialogs.map((item) => {
        const dialogComponent = dialogs[item.id as keyof typeof dialogs];

        return (
          <Fragment key={item.id}>
            <CreateComponent
              component={dialogComponent as unknown as ComponentType<AttributesOptionalChildren>}
              props={item.props as unknown as AttributesOptionalChildren}
            />
          </Fragment>
        );
      })}
    </Portal>
  );
}
