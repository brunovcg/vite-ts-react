import { dialogController } from "./Dialog.controller";
import { Button } from "@/components/button/Button.component";
import type { ComponentDoc } from "@/types/component-doc.types";

function DialogDemo() {
  return (
    <div css={["display-flex", "flex-column", "gap-lg"]}>
      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Basic Usage</h3>
        <p css={["font-size-sm", "color-grey-dark"]}>
          Dialogs are managed via the <code>dialogController</code> singleton. Register your dialog in <code>dialog.register.ts</code>, then open it from anywhere.
        </p>
        <pre css={["background-grey-light", "padding-md", "border-radius-md", "font-size-sm"]}>
          {`// 1. Register your dialog in dialog.register.ts
import { MyDialog } from "./components/MyDialog";

export const dialogs = {
  MyDialog,
};

// 2. Open from anywhere
import { dialogController } from "@/overlays/dialogs/Dialog.controller";

dialogController.open("MyDialog");
dialogController.open("MyDialog", { props: { userId: "123" } });

// 3. Close programmatically
dialogController.close("MyDialog");`}
        </pre>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Dialog Component Structure</h3>
        <pre css={["background-grey-light", "padding-md", "border-radius-md", "font-size-sm"]}>
          {`// Compound component pattern
function MyDialog({ userId }: { userId: string }) {
  return (
    <Dialog dialogId="MyDialog" heading="Edit User" width="md">
      <Dialog.Content>
        <p>Dialog body content goes here.</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Close>Cancel</Dialog.Close>
        <Button variant="filled" onClick={handleSave}>
          Save
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}`}
        </pre>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Width Variants</h3>
        <div css={["display-flex", "gap-md", "flex-wrap"]}>
          <Button onClick={() => dialogController.open("UserPreferencesDialog")}>Open sm dialog</Button>
        </div>
        <pre css={["background-grey-light", "padding-md", "border-radius-md", "font-size-sm"]}>
          {`// Available widths: "sm" | "md" | "lg" | "full"
<Dialog dialogId="my-dialog" heading="Title" width="md">
  ...
</Dialog>`}
        </pre>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Props Reference</h3>
        <table css={["font-size-sm"]}>
          <thead>
            <tr>
              <th css={["padding-sm", "text-left"]}>Prop</th>
              <th css={["padding-sm", "text-left"]}>Type</th>
              <th css={["padding-sm", "text-left"]}>Default</th>
              <th css={["padding-sm", "text-left"]}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td css={["padding-sm"]}>
                <code>dialogId</code>
              </td>
              <td css={["padding-sm"]}>DialogId</td>
              <td css={["padding-sm"]}>required</td>
              <td css={["padding-sm"]}>Unique dialog identifier (must be registered)</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>heading</code>
              </td>
              <td css={["padding-sm"]}>string</td>
              <td css={["padding-sm"]}>required</td>
              <td css={["padding-sm"]}>Dialog title displayed in the header</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>width</code>
              </td>
              <td css={["padding-sm"]}>{`"sm" | "md" | "lg" | "full"`}</td>
              <td css={["padding-sm"]}>-</td>
              <td css={["padding-sm"]}>Controls dialog width</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>allowXButton</code>
              </td>
              <td css={["padding-sm"]}>boolean</td>
              <td css={["padding-sm"]}>true</td>
              <td css={["padding-sm"]}>Shows close (X) button in header</td>
            </tr>
            <tr>
              <td css={["padding-sm"]}>
                <code>closeOnEscape</code>
              </td>
              <td css={["padding-sm"]}>boolean</td>
              <td css={["padding-sm"]}>true</td>
              <td css={["padding-sm"]}>Closes dialog on Escape key or click outside</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section css={["display-flex", "flex-column", "gap-md"]}>
        <h3>Accessibility</h3>
        <ul css={["font-size-sm", "display-flex", "flex-column", "gap-sm"]}>
          <li>
            Focus is trapped inside the dialog via <code>useFocusTrap</code>
          </li>
          <li>
            <code>aria-labelledby</code> connects the dialog to its heading
          </li>
          <li>Escape key closes the dialog (configurable)</li>
          <li>Click outside closes the dialog (configurable)</li>
          <li>Rendered via React Portal into #dialog-root</li>
        </ul>
      </section>
    </div>
  );
}

export const dialogDoc: ComponentDoc<Record<string, never>> = {
  id: "dialog",
  name: "Dialog",
  description: "A modal dialog overlay with focus trapping, Escape key handling, and compound components (Content, Footer, Close).",
  component: DialogDemo,
  args: {},
  argTypes: {},
};
