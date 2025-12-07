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
    <main className="min-h-screen flex bg-slate-50">
      {/* Левая половина с картинкой */}
      <section className="relative hidden lg:flex w-1/2 min-h-screen rounded-xl overflow-hidden">
        <div className="absolute w-full inset-0 p-4 pr-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/images/auth/login-astro.jpeg"
              alt="Workflows preview"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0px"
              className="object-cover"
            />

            <div className="absolute w-full inset-0 bg-gradient-to-br from-indigo-900/40 via-indigo-800/30 to-slate-900/20 pointer-events-none" />

            <div className="absolute inset-0 z-10 flex flex-col p-8 text-white">
              {/* Лого сверху */}
              <WorkspaceLogo className="text-white" />

              {/* Контейнер для заголовка и цитаты */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <RootHeading
                  level={3}
                  className="font-semibold leading-tight w-2/3"
                >
                  Управляйте задачами, проектами и командами в одном месте
                </RootHeading>
              </div>

              {/* Цитата снизу */}
              <div className="text-slate-100 text-sm italic mt-auto">
                <p>
                  «Нет ничего бесполезнее, чем эффективно делать то, что вообще
                  не должно было быть сделано.»
                </p>
                <p className="mt-1">— Питер Друкер</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Правая половина с формой */}
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
    </main>
  );
};

export default LoginForm;
