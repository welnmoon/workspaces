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
import AuthFormLayout from '../oauth-form-layout';
import BaseLink from '@/components/base-link';
import Divider from '@/components/divider';
import { clientRoutes } from '@/lib/routes/client-routes';
import { loginSchema, LoginSchema } from './login-schema';

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <AuthFormLayout title="Авторизация">
        <div className="flex flex-col gap-6 max-w-md w-full">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onLoginSubmit)}
              className="space-y-5"
            >
              <fieldset className="flex flex-col gap-4">
                <legend className="sr-only">Авторизация</legend>

                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Введите email"
                  autoComplete="email"
                />

                {/* пароль с глазиком */}
                <FormInput
                  name="password"
                  label="Пароль"
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

          <Divider />

          <div className="flex gap-2">
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
      </AuthFormLayout>
    </main>
  );
};

export default LoginForm;
