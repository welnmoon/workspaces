import { FormProvider, useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from './register-schema';
import { zodResolver } from '@hookform/resolvers/zod'; // npm install @hookform/resolvers
import FormInput from '../form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Heading } from '@/components/ui/heading';

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

  const onRegisterSubmit = async () => {
    try {
      const { email, password, firstName, lastName } = form.getValues();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

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
      <Heading level={2}>Регистрация</Heading>
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

export default RegisterForm;
