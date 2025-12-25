'use client';
import Image from 'next/image';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { RootHeading } from '@/components/root/root-heading';
import RegisterForm from '@/components/forms/register/register-form';

// sign up - это регистрация

const RegisterPage = () => {
  return (
    <main className="min-h-screen flex bg-slate-50">
      <section className="relative hidden lg:flex w-1/2 min-h-screen rounded-xl overflow-hidden">
        <div className="absolute w-full inset-0 p-4 pr-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/images/auth/login-bg.jpeg"
              alt="Workflows preview"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0px"
              className="object-cover"
            />
            <div className="absolute w-full inset-0 bg-gradient-to-br from-indigo-900/60 via-indigo-800/50 to-slate-900/40 pointer-events-none" />

            <div className="absolute inset-0 z-10 flex flex-col p-8 text-white">
              <WorkspaceLogo className="text-white" />

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <RootHeading
                  level={3}
                  className="font-semibold leading-tight max-w-2xl"
                >
                  Создавайте рабочие пространства и подключайте команду за
                  минуты
                </RootHeading>
                <p className="mt-4 text-indigo-100 max-w-2xl">
                  Управляйте проектами, задачами и уведомлениями в одном месте.
                  Все инструменты для совместной работы — сразу после
                  регистрации.
                </p>
              </div>

              <div className="text-slate-100 text-sm italic mt-auto">
                <p>
                  «Лучшая структура не гарантирует результаты, но неправильная
                  структура — это гарантия неудачи».
                </p>
                <p className="mt-1">— Питер Друкер</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
