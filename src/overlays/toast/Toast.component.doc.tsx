import { Toast } from "./ToastControler";
import { Button } from "@/components/button/Button.component";
import type { ComponentDoc } from "@/types/component-doc.types";

function ToastDemo() {
  return (
    <div css={["display-flex", "flex-column", "gap-lg"]}>
      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Basic Usage</h3>
        <p css={["font-size-sm", "color-grey-dark"]}>
          Toasts are triggered via the static <code>Toast</code> class. No wrapping provider needed — just call the method.
        </p>
        <pre css={["background-grey-light", "padding-md", "border-radius-md", "font-size-sm"]}>
          {`import { Toast } from "@/overlays/toast/ToastControler";

// Variant shortcuts
Toast.success("Operation completed!");
Toast.error("Something went wrong.");
Toast.warning("Check your input.");
Toast.info("New version available.");

// Custom duration (ms)
Toast.success("Saved!", { duration: 3000 });

// With unique ID (prevents duplicates)
Toast.info("Loading...", { id: "loading-toast", duration: 10000 });`}
        </pre>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Live Examples</h3>
        <div css={["display-flex", "gap-md", "flex-wrap"]}>
          <Button variant='filled' onClick={() => Toast.success("Item saved successfully!")}>
            Success
          </Button>
          <Button variant='filled' color='error' onClick={() => Toast.error("Failed to save item.")}>
            Error
          </Button>
          <Button variant='outlined' onClick={() => Toast.warning("This action cannot be undone.")}>
            Warning
          </Button>
          <Button onClick={() => Toast.info("You have 3 unread messages.")}>Info</Button>
        </div>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Features</h3>
        <ul css={["font-size-sm", "display-flex", "flex-column", "gap-sm"]}>
          <li>Auto-closes after duration (default 5000ms)</li>
          <li>Progress bar shows remaining time</li>
          <li>Pause on hover — timer resumes on mouse leave</li>
          <li>Manual close via X button</li>
          <li>Deduplication via unique ID</li>
          <li>Custom Web Component (extends HTMLDialogElement)</li>
        </ul>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>API Reference</h3>
        <table css={["font-size-sm"]}>
          <thead>
            <tr>
              <th css={["padding-sm", "text-left"]}>Method</th>
              <th css={["padding-sm", "text-left"]}>Params</th>
              <th css={["padding-sm", "text-left"]}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td css={["padding-sm"]}>
                <code>Toast.success(text, config?)</code>
              </td>
              <td css={["padding-sm"]}>text: string, config?: ToastConfig</td>
              <td css={["padding-sm"]}>Shows a green success toast</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>Toast.error(text, config?)</code>
              </td>
              <td css={["padding-sm"]}>text: string, config?: ToastConfig</td>
              <td css={["padding-sm"]}>Shows a red error toast</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>Toast.warning(text, config?)</code>
              </td>
              <td css={["padding-sm"]}>text: string, config?: ToastConfig</td>
              <td css={["padding-sm"]}>Shows a yellow warning toast</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>Toast.info(text, config?)</code>
              </td>
              <td css={["padding-sm"]}>text: string, config?: ToastConfig</td>
              <td css={["padding-sm"]}>Shows a blue info toast</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>Toast.open(text, config?)</code>
              </td>
              <td css={["padding-sm"]}>text: string, config?: ToastConfig</td>
              <td css={["padding-sm"]}>Base method — defaults to info variant</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>ToastConfig</h3>
        <pre css={["background-grey-light", "padding-md", "border-radius-md", "font-size-sm"]}>
          {`interface ToastConfig {
  duration?: number;    // Auto-close time in ms (default: 5000)
  variant?: "info" | "error" | "warning" | "success";
  id?: string;          // Unique ID to prevent duplicate toasts
}`}
        </pre>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Accessibility</h3>
        <ul css={["font-size-sm", "display-flex", "flex-column", "gap-sm"]}>
          <li>
            <code>role="status"</code> with <code>aria-live="polite"</code> for screen reader announcements
          </li>
          <li>Close button has localized aria-label</li>
          <li>Rendered as a native HTMLDialogElement custom element</li>
        </ul>
      </section>
    </div>
  );
}

export const toastDoc: ComponentDoc<Record<string, never>> = {
  id: "toast",
  name: "Toast",
  description: "A notification toast system with variants (success, error, warning, info), auto-close with progress bar, and hover-to-pause.",
  component: ToastDemo,
  args: {},
  argTypes: {},
};
