import { Form } from "./Form";
import type { ComponentDoc } from "@/types/component-doc.types";
import { Button } from "../button/Button";
import { Input } from "../input/Input";

// Wrapper to demonstrate Form usage with children
function FormDemo(props: React.ComponentProps<typeof Form>) {
  return (
    <Form {...props} css={["display-flex", "flex-column", "gap-md", "width-300px"]}>
      <Input id='form-demo-input' name='demo' label='Demo Input' required />
      <Button type='submit'>Submit Form</Button>
    </Form>
  );
}

export const formDoc: ComponentDoc<React.ComponentProps<typeof Form>> = {
  id: "form",
  name: "Form",
  description: "A wrapper around HTML form that handles submit events.",
  component: FormDemo as React.ComponentType<React.ComponentProps<typeof Form>>,
  args: {
    onSubmit: console.log,
  },
  argTypes: {},
};
