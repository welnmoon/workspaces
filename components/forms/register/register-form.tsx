import { FormProvider, useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from './register-schema';
import { zodResolver } from '@hookform/resolvers/zod'; // npm install @hookform/resolvers
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Heading } from '@/components/ui/heading';
import { useRouter } from 'next/navigation';
import AuthFormLayout from '../oauth-form-layout';
import BaseLink from '@/components/base-link';

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

  const onRegisterSubmit = async () => {
    const { email, password, firstName, lastName } = form.getValues();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => {}); // здесь мы пытаемся распарсить JSON, но если это не получится, то payload будет undefined
      const msg = payload?.error || res.statusText || 'Ошибка регистрации';
      toast.error(msg);
      throw new Error(res.statusText);
    }

    const loginRes = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
      redirect: false,
    });

    if (!loginRes?.ok) {
      toast.error(
        loginRes?.error ||
          'Регистрация прошла, но вход не выполнен. Пожалуйста попробуйте ещё раз.'
      );
      return;
    }

    toast.success('Вы успешно зарегистрировались');
    router.replace(loginRes?.url || '/profile');
  };

  return (
    <main>
      <AuthFormLayout title="Регистрация">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterSubmit)}
            aria-label="Форма регистрации"
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
        </FormProvider>
        <p className="mt-4">
          Уже есть аккаунт? <BaseLink href="/login">Вход</BaseLink>
        </p>
      </AuthFormLayout>
    </main>
  );
};

export default RegisterForm;
