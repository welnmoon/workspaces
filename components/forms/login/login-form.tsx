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
import Divider from '@/components/divider';
import { clientRoutes } from '@/lib/routes/client-routes';
import { loginSchema, LoginSchema } from './login-schema';
import Image from 'next/image';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import DividerWithText from '@/components/divider-with-text';

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
      <section className="relative hidden lg:flex w-1/2 min-h-screen overflow-hidden">
        <Image
          src="/images/auth/login-bg.jpeg"
          alt="Workflows preview"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/70 to-slate-900/70" />

        <div className="flex flex-col justify-between">
          <div className="relative z-10 flex flex-col gap-4 p-12 text-white max-w-xl">
            <WorkspaceLogo className="text-white" />
            <h1 className="text-3xl font-semibold leading-tight">
              Управляйте задачами, проектами и командами в одном месте
            </h1>
            <p className="text-indigo-100">
              Отслеживайте прогресс, распределяйте работу и получайте отчёты без
              лишних действий. Все ваши рабочие пространства под рукой.
            </p>
            <ul className="space-y-2 text-indigo-100">
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Быстрый доступ к рабочим пространствам и проектам
              </li>
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Гибкие фильтры и уведомления для команды
              </li>
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                PDF-отчёты и аналитика по задачам
              </li>
            </ul>
          </div>
          <div className="max-w-xl  z-10  pl-12 pr-12 pb-12 text-slate-100">
            <p className="text-sm italic">
              «Нет ничего бесполезнее, чем эффективно делать то, что вообще не
              должно было быть сделано.»
            </p>
            <p className="mt-2 text-sm ">— Питер Друкер</p>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md  p-8 space-y-6 ">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold ">Добро пожаловать!</h2>
            <p className="text-sm text-slate-500 text">
              Войдите, чтобы продолжить работу.
            </p>
          </div>

          <FormProvider {...form}>
            <form
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

          <DividerWithText text='Или продолжите с'/>

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
