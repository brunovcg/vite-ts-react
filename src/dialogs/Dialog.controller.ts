import type { RefObject } from "react";
import type { ConditionalProps, DialogItem, DialogListener, DialogId } from "./dialog.types";
import { UrlUtils } from "@/utils/url/Url.utils";

/**
 * In-memory dialog state manager.
 *
 * Keeps an ordered snapshot of currently opened dialogs, allows subscribers
 * to listen to state changes, and mirrors state to the URL by setting/clearing
 * the `dialog` query parameter.
 *
 * URL side-effects:
 * - On `open()`: UrlUtils.set("dialog", "id:prop=val&prop2=val2|id2:...")
 * - On `close()`: UrlUtils.clear("dialog") (if empty) or update string
 */
class DialogController {
  private readonly listeners = new Set<DialogListener<DialogId, unknown>>();

  private openedDialogs: DialogItem<DialogId, unknown>[] = [];

  /**
   * Subscribes to dialog state changes.
   *
   * The listener receives the full snapshot of opened dialogs on every change.
   *
   * @param listener - Callback invoked with the current snapshot.
   * @returns Unsubscribe function that removes the listener and returns `true` if it was present.
   */
  subscribe = (listener: DialogListener<DialogId, unknown>): (() => boolean) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Returns the current ordered list of opened dialogs (snapshot).
   */
  getSnapshot = (): DialogItem<DialogId, unknown>[] => this.openedDialogs;

  /**
   * Notifies all listeners with the latest snapshot (internal).
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.openedDialogs));
  }

  /**
   * Opens (or replaces) a dialog by `id`.
   *
   * If a dialog with the same `id` already exists, it is replaced (de-duped)
   * so the snapshot contains at most one entry per `id`.
   * After updating state, all listeners are notified and the URL `dialog`
   * query parameter is updated.
   *
   * @typeParam CurrentDialogId - A valid dialog identifier.
   * @typeParam ComponentRef - Optional component ref type associated with the dialog.
   * @param id - Dialog identifier.
   * @param options - Dialog options containing props and optional ref.
   */
  open<CurrentDialogId extends DialogId, ComponentRef>(
    id: CurrentDialogId,
    options: {
      ref?: RefObject<ComponentRef>;
    } & ConditionalProps<CurrentDialogId>,
  ): void {
    this.openedDialogs = [...this.openedDialogs.filter((item) => item.id !== id), { id, ...options } as DialogItem<DialogId, ComponentRef>];
    this.notify();
    this.syncUrl();
  }

  /**
   * Closes the dialog with the given `id`, notifies listeners, and updates the
   * `dialog` query parameter in the URL.
   *
   * @param id - Dialog identifier to close.
   */
  close(id: DialogId): void {
    this.openedDialogs = this.openedDialogs.filter((item) => item.id !== id);
    this.notify();
    this.syncUrl();
  }

  private syncUrl() {
    if (this.openedDialogs.length === 0) {
      UrlUtils.clear("dialog");
      return;
    }

    // Format: id:prop1=val1&prop2=val2|id2:prop3=val3
    const serialized = this.openedDialogs
      .map(({ id, props }) => {
        let params = "";
        if (props && typeof props === "object" && Object.keys(props).length > 0) {
          // Filter out undefined/null and convert to string
          const safeProps = Object.entries(props).reduce(
            (acc, [key, value]) => {
              if (value !== undefined && value !== null) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>,
          );
          const searchParams = new URLSearchParams(safeProps);
          const query = searchParams.toString();
          if (query) {
            params = `:${query}`;
          }
        }
        return `${id}${params}`;
      })
      .join("|");

    UrlUtils.set("dialog", serialized);
  }
}

export const dialogController = new DialogController();
