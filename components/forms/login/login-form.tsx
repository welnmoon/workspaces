'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod'; // npm install @hookform/resolvers
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { loginSchema, LoginSchema } from './login-schema';
import { Heading } from '@/components/ui/heading';
import { URLS } from '@/lib/urls';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import { PROVIDERS } from '@/lib/providers';
import AuthFormLayout from '../oauth-form-layout';
import BaseLink from '@/components/base-link';
import Divider from '@/components/divider';

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = async () => {
    try {
      const { email, password } = form.getValues();
      const loginRes = await signIn('credentials', {
        email,
        password,
        callbackUrl: URLS.LOGIN_CALLBACK,
        redirect: false,
      });

      if (!loginRes?.ok) {
        toast.error(
          loginRes?.error || 'Вход не выполнен. Пожалуйста попробуйте ещё раз.'
        );
        return;
      }

      toast.success('Вы успешно вошли в систему');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <main>
      <AuthFormLayout title="Авторизация">
        <div className="flex flex-col gap-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onLoginSubmit)}>
              <fieldset className="flex flex-col gap-4">
                <legend className="sr-only">Авторизация</legend>
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Введите email"
                />
                <FormInput
                  name="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  type="password"
                />
                <SubmitBtn
                  text="Войти"
                  isLoading={form.formState.isSubmitting}
                />
              </fieldset>
            </form>
          </FormProvider>

          <Divider />
          <div className="grid grid-cols-4 gap-1">
            {PROVIDERS.map((p) => (
              <LoginOauthButton provider={p.id} />
            ))}
          </div>
          <div>
            <span>Нету аккаунта?</span>
            <BaseLink className="" href="/register">
              Регистрация
            </BaseLink>
          </div>
        </div>
      </AuthFormLayout>
    </main>
  );
};

export default LoginForm;
