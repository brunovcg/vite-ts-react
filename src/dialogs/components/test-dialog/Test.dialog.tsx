import { Input } from "@/components/input/Input";
import { Dialog } from "@/dialogs/Dialog";
import { Form } from "@/components/form/Form";
import { Button } from "@/components/button/Button";

type Props = {
  body: string;
};

export function TestDialog({ body }: Props) {
  return (
    <Dialog dialogId='TestDialog' heading='Test' width='md'>
      <Dialog.Content>
        body-{body}
        <Form>
          <Input id='test' name='test' required label='Label' />
          <Button variant='outlined' color='error' type='submit'>
            outlined
          </Button>
        </Form>
      </Dialog.Content>
      <Dialog.Footer></Dialog.Footer>
    </Dialog>
  );
}
