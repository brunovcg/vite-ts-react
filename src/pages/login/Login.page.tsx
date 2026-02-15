import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

import { loginLocale } from "./Login.locales";
import { useDictionary } from "@/locales";
import { Form, type SubmitFormArgs } from "@/components/form/Form";
import { Icon } from "@/components/icon/Icon";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { useState } from "react";
import { useSession } from "@/context/session-context/useSession";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dictionary = useDictionary(loginLocale);

  const { login } = useSession();

  const handleSubmit = ({ data }: SubmitFormArgs<{ email: string }>) => {
    login({ email: data.email });
  };

  const handleShowPassword = () => setShowPassword((state) => !state);

  return (
    <div data-component='Login' css={["padding-xl", "display-flex", "flex-row", "height-full", "background-primary-gradient", "flex-wrap"]}>
      <div css={["flex-1", "display-flex", "flex-center", "align-center", "flex-column", "padding-3xl", "color-typeface-white"]}>
        <h1 css={["font-size-3xl", "text-left", "width-full"]}>{dictionary.pageTitle}</h1>
        <h2 css={["font-size-2xl", "text-left", "width-full"]}>{dictionary.companyName}</h2>
      </div>
      <div css={["flex-1", "display-flex", "flex-center", "align-center", "width-full"]}>
        <Form onSubmit={handleSubmit} css={["display-flex", "flex-column", "gap-md", "border-radius-md", "padding-2xl", "border", "width-400px", "gap-2xl", "background-white"]}>
          <h2 css={["font-size-lg", "text-left", "width-full", "color-primary"]}>{dictionary.loginTitle}</h2>
          <Input name='email' id='email' label='Email' required type='email' />
          <div css={["display-flex", "flex-column", "gap-md"]}>
            <Input name='password' id='password' label='Password' required type={showPassword ? "text" : "password"} />
            <Checkbox label={dictionary.showPassword} checked={showPassword} onChange={handleShowPassword} />
          </div>
          <Button variant='filled' type='submit'>
            <Icon icon='login' />
            {dictionary.buttonTitle}
          </Button>
        </Form>
      </div>
    </div>
  );
}
