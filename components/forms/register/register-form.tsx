'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from './register-schema';
import { zodResolver } from '@hookform/resolvers/zod'; // npm install @hookform/resolvers
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AuthFormLayout from '../oauth-form-layout';
import BaseLink from '@/components/base-link';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useState } from 'react';
import { clientRoutes } from '@/lib/routes/client-routes';
import { signIn } from 'next-auth/react';

const RegisterForm = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });
  const router = useRouter();
  const [sended, setSended] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const onRegisterSubmit = async () => {
    const { email, password, firstName, lastName } = form.getValues();

    const res = await fetch(apiRoutes.register(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => {});
      const msg = payload?.error || res.statusText || 'Ошибка регистрации';
      toast.error(msg);
      form.setError('email', { message: msg });
      return;
    }

    // const loginRes = await signIn('credentials', {
    //   email,
    //   password,
    //   callbackUrl: '/',
    //   redirect: false,
    // });
    setSubmittedEmail(form.getValues().email);
    setSended(true);
    toast.success(
      'Мы отправили вам ссылку на почту, чтобы подтвердить аккаунт'
    );
    // signIn('credentials', { email, password });
    router.push(clientRoutes.authLoginPage());
  };

  return (
    <main>
      <AuthFormLayout title="Регистрация">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterSubmit)}
            aria-label="Форма регистрации"
            className="mb-4"
          >
            <fieldset
              className="flex flex-col gap-5"
              disabled={form.formState.isSubmitting}
            >
              <legend className="sr-only">Регистрация</legend>
              <FormInput
                name="firstName"
                label="Имя"
                placeholder="Введите имя"
              />
              <FormInput
                name="lastName"
                label="Фамилия"
                placeholder="Введите фамилию"
              />
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
                text="Зарегистрироваться"
                isLoading={form.formState.isSubmitting}
              />
            </fieldset>
          </form>
          {sended && (
            <p className="bg-success/10 rounded-2xl text-success px-4 py-2">
              Мы отправили вам ссылку на почту
              <span className="font-medium underline ">{submittedEmail}</span>,
              но Resend не позволяет отправлять в тест моде, поэтому
              верифицируем вас сразу. Это исправится в будущем.
            </p>
          )}
        </FormProvider>
        <p className="mt-4">
          Уже есть аккаунт? <BaseLink href="/login">Вход</BaseLink>
        </p>
      </AuthFormLayout>
    </main>
  );
};

export default RegisterForm;
