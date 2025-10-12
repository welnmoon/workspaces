'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod'; // npm install @hookform/resolvers
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { loginSchema, LoginSchema } from './login-schema';
import { Heading } from '@/components/ui/heading';

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onRegisterSubmit = async () => {
    try {
      const { email, password } = form.getValues();
      signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
      });

      toast.success('Вы успешно зарегистрировались');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <main>
      <Heading level={2}>Войти</Heading>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onRegisterSubmit)}>
          <FormInput name="firstName" label="Имя" placeholder="Введите имя" />
          <FormInput
            name="lastName"
            label="Фамилия"
            placeholder="Введите фамилию"
          />
          <FormInput name="email" label="Email" placeholder="Введите email" />
          <FormInput
            name="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
          />
          <SubmitBtn isLoading={form.formState.isSubmitting} />
        </form>
      </FormProvider>
    </main>
  );
};

export default LoginForm;
