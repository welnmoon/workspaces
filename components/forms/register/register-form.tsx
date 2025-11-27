'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { registerSchema, RegisterSchema } from './register-schema';
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import AuthFormLayout from '../oauth-form-layout';
import BaseLink from '@/components/base-link';
import { apiRoutes } from '@/lib/routes/api-routes';
import { clientRoutes } from '@/lib/routes/client-routes';
import { ProviderId, PROVIDERS } from '@/lib/providers';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import Divider from '@/components/divider';
import { Button } from '@/components/ui/button';

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <AuthFormLayout title="Регистрация">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterSubmit)}
            aria-label="Форма регистрации"
            className="mb-4 space-y-5 max-w-md w-full"
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
          <Divider />
          <section className="flex gap-2">
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
        </FormProvider>

        <p className="mt-4 text-sm text-slate-700">
          Уже есть аккаунт?{' '}
          <BaseLink href="/login" className="font-medium">
            Вход
          </BaseLink>
        </p>
      </AuthFormLayout>
    </main>
  );
};

export default RegisterForm;
