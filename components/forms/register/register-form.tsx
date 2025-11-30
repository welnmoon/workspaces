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
import { PROVIDERS } from '@/lib/providers';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import Image from 'next/image';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import DividerWithText from '@/components/divider-with-text';

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

      // router.push(clientRoutes.authLoginPage()); // TODO - пока уберу так как нету подвтерждение почты
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
              Создавайте рабочие пространства и подключайте команду за минуты
            </h1>
            <p className="text-indigo-100">
              Управляйте проектами, задачами и уведомлениями в одном месте.
              Все инструменты для совместной работы — сразу после регистрации.
            </p>
            <ul className="space-y-2 text-indigo-100">
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Приглашайте коллег и распределяйте роли
              </li>
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Получайте уведомления о задачах и событиях
              </li>
              <li className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Скачивайте отчёты и отслеживайте прогресс
              </li>
            </ul>
          </div>
          <div className="max-w-xl z-10 pl-12 pr-12 pb-12 text-slate-100">
            <p className="text-sm italic">
              «Лучшая структура не гарантирует результаты, но неправильная
              структура — это гарантия неудачи».
            </p>
            <p className="mt-2 text-sm">— Питер Друкер</p>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold">Создайте аккаунт</h2>
            <p className="text-sm text-slate-500">
              Регистрация займёт минуту — и вы сможете пригласить команду.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onRegisterSubmit)}
              aria-label="Форма регистрации"
              className="space-y-5"
            >
              <fieldset className="flex flex-col gap-4">
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

          <DividerWithText text="Или продолжите с" />
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
