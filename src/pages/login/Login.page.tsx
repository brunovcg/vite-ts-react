import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

import { loginLocale } from "./Login.locales";
import { useDictionary } from "@/locales";
import { Form } from "@/components/form/Form";
import { Icon } from "@/components/icon/Icon";

export function Login() {
  const dictionary = useDictionary(loginLocale);

  return (
    <div data-component='Login' css={["padding-xl", "display-flex", "flex-row", "height-full", "background-primary-gradient", "flex-wrap"]}>
      <div css={["flex-1", "display-flex", "flex-center", "align-center", "flex-column", "padding-3xl", "color-typeface-white"]}>
        <h1 css={["font-size-3xl", "text-left", "width-full"]}>{dictionary.pageTitle}</h1>
        <h2 css={["font-size-2xl", "text-left", "width-full"]}>{dictionary.companyName}</h2>
      </div>
      <div css={["flex-1", "display-flex", "flex-center", "align-center", "width-full"]}>
        <Form css={["display-flex", "flex-column", "gap-md", "border-radius-md", "padding-2xl", "border", "width-400px", "gap-2xl", "background-white"]}>
          <h2 css={["font-size-lg", "text-left", "width-full", "color-primary"]}>{dictionary.loginTitle}</h2>
          <Input name='email' id='email' label='Email' required type='email' />
          <Input name='password' id='password' label='Password' required type='password' />
          <Button variant='filled' type='submit'>
            <Icon icon='login' />
            {dictionary.buttonTitle}
          </Button>
        </Form>
      </div>
    </div>
  );
}
