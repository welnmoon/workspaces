'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { registerSchema, RegisterSchema } from './register-schema';
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import BaseLink from '@/components/base-link';
import { apiRoutes } from '@/lib/routes/api-routes';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProviderId, PROVIDERS } from '@/lib/providers';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import Divider from '@/components/divider';
import Image from 'next/image';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';

const RegisterForm = () => {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onRegisterSubmit = async (values: RegisterSchema) => {
    try {
      const res = await fetch(apiRoutes.register(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const msg =
          payload?.error ||
          res.statusText ||
          'Ошибка регистрации. Попробуйте ещё раз.';

        toast.error(msg);
        form.setError('email', { message: msg });
        return;
      }

      setSubmittedEmail(values.email);
      toast.success(
        'Мы отправили вам ссылку на почту, чтобы подтвердить аккаунт'
      );

      router.push(clientRoutes.authLoginPage());
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Произошла непредвиденная ошибка';
      toast.error(message);
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen flex bg-slate-50">
      <section className="relative hidden lg:flex w-1/2 min-h-screen overflow-hidden">
        <Image
          src="/images/auth/register-bg.jpeg"
          alt="Работа в команде"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-slate-900/70" />
        <div className="relative z-10 flex flex-col gap-4 p-12 text-white max-w-xl">
          <WorkspaceLogo className="text-white" />
          <h1 className="text-3xl font-semibold leading-tight">
            Создавайте рабочие пространства и подключайте команду за минуты
          </h1>
          <p className="text-emerald-50">
            Регистрация откроет доступ к проектам, задачам, уведомлениям и
            отчётам. Соберите всё важное в одном месте.
          </p>
          <ul className="space-y-2 text-emerald-50">
            <li className="flex gap-2 items-start">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
              Мгновенное приглашение коллег в рабочие пространства
            </li>
            <li className="flex gap-2 items-start">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
              Уведомления о задачах, событиях и изменениях
            </li>
            <li className="flex gap-2 items-start">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
              Отчёты и аналитика по завершённым задачам
            </li>
          </ul>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col gap-2">
            <WorkspaceLogo className="text-primary" />
            <h2 className="text-2xl font-semibold">Регистрация</h2>
            <p className="text-sm text-slate-500">
              Создайте аккаунт, чтобы начать работу с вашей командой.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onRegisterSubmit)}
              aria-label="Форма регистрации"
              className="space-y-5"
            >
              <fieldset
                className="flex flex-col gap-4"
                disabled={form.formState.isSubmitting}
              >
                <legend className="sr-only">Регистрация</legend>

                <FormInput
                  name="firstName"
                  label="Имя"
                  placeholder="Введите имя"
                  required
                />
                <FormInput
                  name="lastName"
                  label="Фамилия"
                  placeholder="Введите фамилию"
                  required
                />
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Введите email"
                  required
                />
                <FormInput
                  name="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  isPassword
                  required
                />

                <SubmitBtn
                  text="Зарегистрироваться"
                  isLoading={form.formState.isSubmitting}
                  className="w-full mt-1"
                />
              </fieldset>
            </form>
          </FormProvider>

          <Divider />
          <section className="flex gap-2 flex-wrap">
            {PROVIDERS.map((p) => (
              <LoginOauthButton key={p.id} provider={p.id} />
            ))}
          </section>

          {submittedEmail && (
            <p className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-2 text-sm">
              Мы отправили ссылку на почту{' '}
              <span className="font-medium underline">{submittedEmail}</span>,
              чтобы подтвердить ваш аккаунт.
            </p>
          )}

          <p className="text-sm text-slate-700 flex justify-between">
            <span>Уже есть аккаунт?</span>
            <BaseLink href="/login" className="font-medium">
              Вход
            </BaseLink>
          </p>
        </div>
      </section>
    </main>
  );
};

export default RegisterForm;
