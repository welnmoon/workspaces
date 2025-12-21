'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import { PROVIDERS } from '@/lib/providers';
import BaseLink from '@/components/base-link';
import { clientRoutes } from '@/lib/routes/client-routes';
import { loginSchema, LoginSchema } from './login-schema';
import Image from 'next/image';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import DividerWithText from '@/components/divider-with-text';
import { RootHeading } from '@/components/root/root-heading';

const LoginForm = () => {
  const router = useRouter();

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
        callbackUrl: clientRoutes.workspacesPage(),
        redirect: false,
      });

      if (!loginRes?.ok) {
        toast.error(
          loginRes?.error || 'Вход не выполнен. Пожалуйста, попробуйте ещё раз.'
        );
        return;
      }

      toast.success('Вы успешно вошли в систему');
      router.push(clientRoutes.workspacesPage());
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold">Добро пожаловать!</h2>
          <p className="text-sm text-slate-500">
            Войдите, чтобы продолжить работу.
          </p>
        </div>

        <FormProvider {...form}>
          <form
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                form.handleSubmit(onLoginSubmit)();
              }
            }}
            onSubmit={form.handleSubmit(onLoginSubmit)}
            className="space-y-5"
          >
            <fieldset className="flex flex-col gap-4">
              <legend className="sr-only">Авторизация</legend>

              <FormInput
                name="email"
                placeholder="Введите email"
                autoComplete="email"
              />

              <FormInput
                name="password"
                placeholder="Введите пароль"
                type="password"
                autoComplete="current-password"
                isPassword
              />

              <SubmitBtn
                text="Войти"
                isLoading={form.formState.isSubmitting}
                className="mt-2 w-full"
              />
            </fieldset>
          </form>
        </FormProvider>

        <DividerWithText text="Или продолжите с" />

        <div className="flex gap-2 flex-wrap">
          {PROVIDERS.map((p) => (
            <LoginOauthButton key={p.id} provider={p.id} />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Нет аккаунта?</span>
          <BaseLink href="/register" className="font-medium">
            Регистрация
          </BaseLink>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
