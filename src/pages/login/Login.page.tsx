import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

import { loginLocale } from "./Login.locales";
import { useDictionary } from "@/locales";
import { Form, type SubmitFormArgs } from "@/components/form/Form";
import { Icon } from "@/components/icon/Icon";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { useState } from "react";
import { useSession } from "@/context/session-context/useSession";

import "./Login.css";

function LoginIllustration() {
  return (
    <svg className='login-illustration' viewBox='0 0 400 320' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect x='80' y='40' width='240' height='160' rx='12' fill='var(--color-primary)' opacity='0.1' />
      <rect x='100' y='60' width='200' height='120' rx='8' fill='var(--background-white)' stroke='var(--color-border)' strokeWidth='1.5' />
      <rect x='120' y='85' width='120' height='10' rx='5' fill='var(--color-primary)' opacity='0.3' />
      <rect x='120' y='105' width='80' height='10' rx='5' fill='var(--color-primary)' opacity='0.15' />
      <rect x='120' y='135' width='160' height='30' rx='6' fill='var(--color-primary)' stroke='var(--color-primary)' strokeWidth='1' opacity='0.2' />
      <circle cx='200' cy='250' r='40' fill='var(--color-primary)' opacity='0.08' />
      <circle cx='200' cy='250' r='24' fill='var(--color-primary)' opacity='0.15' />
      <path d='M192 250 L198 256 L210 244' stroke='var(--color-primary)' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
      <circle cx='320' cy='80' r='6' fill='var(--color-primary)' opacity='0.2' />
      <circle cx='340' cy='120' r='4' fill='var(--color-primary)' opacity='0.15' />
      <circle cx='60' cy='100' r='5' fill='var(--color-primary)' opacity='0.2' />
      <circle cx='75' cy='180' r='3' fill='var(--color-primary)' opacity='0.1' />
      <path d='M50 260 Q100 230 150 260 Q200 290 250 260 Q300 230 350 260' stroke='var(--color-primary)' strokeWidth='1.5' opacity='0.1' fill='none' />
    </svg>
  );
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dictionary = useDictionary(loginLocale);

  const { login } = useSession();

  const handleSubmit = ({ data }: SubmitFormArgs<{ email: string }>) => {
    login({ email: data.email });
  };

  const handleShowPassword = () => setShowPassword((state) => !state);

  return (
    <div data-component='Login' css={["display-flex", "flex-row", "height-full", "flex-wrap"]}>
      {/* Left side - Branding */}
      <div className='login-hero' css={["flex-1", "display-flex", "flex-center", "align-center", "flex-column", "padding-3xl", "background-primary-gradient", "gap-xl"]}>
        <div css={["display-flex", "flex-column", "align-center", "gap-lg"]}>
          <div className='login-brand-icon'>
            <Icon icon='security' size='lg' />
          </div>
          <div css={["display-flex", "flex-column", "align-center", "gap-sm"]}>
            <h1 css={["font-size-3xl", "text-center", "color-typeface-white", "text-bold"]}>{dictionary.companyName}</h1>
            <p css={["font-size-lg", "text-center", "color-typeface-white"]} style={{ opacity: 0.85 }}>
              {dictionary.pageSubtitle}
            </p>
          </div>
        </div>
        <LoginIllustration />
      </div>

      {/* Right side - Login form */}
      <div css={["flex-1", "display-flex", "flex-center", "align-center", "width-full", "padding-xl", "background-white"]}>
        <Form onSubmit={handleSubmit} className='login-card' css={["display-flex", "flex-column", "gap-2xl", "border-radius-lg", "padding-2xl", "border"]}>
          <div css={["display-flex", "flex-column", "gap-sm"]}>
            <h2 css={["font-size-2xl", "text-left", "width-full", "color-typeface-dark", "text-bold"]}>{dictionary.loginTitle}</h2>
            <p css={["font-size-sm", "color-typeface-light"]}>{dictionary.loginSubtitle}</p>
          </div>

          <div css={["display-flex", "flex-column", "gap-lg"]}>
            <Input name='email' id='email' label='Email' required type='email' placeholder={dictionary.emailPlaceholder} />
            <div css={["display-flex", "flex-column", "gap-md"]}>
              <Input name='password' id='password' label={dictionary.passwordLabel} required type={showPassword ? "text" : "password"} placeholder={dictionary.passwordPlaceholder} />
              <Checkbox label={dictionary.showPassword} checked={showPassword} onChange={handleShowPassword} />
            </div>
          </div>

          <div css={["display-flex", "flex-column", "gap-lg"]}>
            <Button variant='filled' type='submit'>
              <Icon icon='login' />
              {dictionary.buttonTitle}
            </Button>

            <div className='login-divider' />

            <p className='login-footer-text' css={["text-center"]}>
              {dictionary.footerText}
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
