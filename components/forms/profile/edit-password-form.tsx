'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';

import {
  passwordChangeSchema,
  PasswordChangeSchemaDTO,
} from '@/schemas/auth/passwrod-change-schema';
import { useEditPassword } from '@/hooks/profile/use-edit-password';
import { SubmitButton } from '@/ui/button/submit-button';

const EditPasswordForm = ({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { mutate, isPending } = useEditPassword();
  const form = useForm<PasswordChangeSchemaDTO>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onFormSubmit = async (values: PasswordChangeSchemaDTO) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        setModalOpen(false);
        toast.success('Пароль успешно обновлен');
      },
      onError: (e) => {
        const message =
          e instanceof Error
            ? e.message
            : 'Произошла ошибка при обновлении пароля';
        toast.error(message);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            form.handleSubmit(onFormSubmit)();
          }
        }}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset>
          <legend className="sr-only">Изменить пароль</legend>
          <div className="flex flex-col gap-2 mb-4">
            <FormInput
              name="currentPassword"
              label="Текущий пароль"
              placeholder="Пароль"
              type="password"
            />
            <FormInput
              name="newPassword"
              label="Новый пароль"
              placeholder="Пароль"
              type="password"
            />
          </div>
          <SubmitButton text="Изменить" isLoading={isPending} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default EditPasswordForm;
