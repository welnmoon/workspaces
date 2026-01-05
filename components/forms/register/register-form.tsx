'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { registerSchema, RegisterSchema } from './register-schema';
import FormInput from '../form-input';
import BaseLink from '@/components/base-link';
import { apiRoutes } from '@/lib/routes/api-routes';
import { PROVIDERS } from '@/lib/providers';
import LoginOauthButton from '@/components/buttons/auth/login-oauth-btn';
import DividerWithText from '@/components/divider-with-text';
import { SubmitButton } from '@/ui/button/submit-button';

const RegisterForm = () => {
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  form.handleSubmit(onRegisterSubmit)();
                }
              }}
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

                <SubmitButton
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
  );
};

export default RegisterForm;
