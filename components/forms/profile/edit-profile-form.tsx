'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import SubmitBtn from '../../buttons/submit-btn';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { useEditProfile } from '@/hooks/profile/use-edit-profile';
import {
  editProfileSchema,
  EditProfileValue,
} from '@/schemas/profile/edit-profile-info';

const EditProfileForm = ({
  userId,
  setModalOpen,
  firstName,
  lastName,
  image,
}: {
  userId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  firstName: string;
  lastName: string;
  image: string;
}) => {
  const { mutate, isPending } = useEditProfile(userId);
  const form = useForm<EditProfileValue>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      image: image || '',
    },
  });

  const onFormSubmit = async (values: EditProfileValue) => {
    mutate(values, {
      onSuccess: () => {
        setModalOpen(false);
        toast.success('Профиль успешно обновлен');
      },
      onError: (e) => {
        toast.error(e.message ?? 'Произошла ошибка при обновлении профиля');
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
          <legend className="sr-only">Create Project Form</legend>
          <div className="flex flex-col gap-2 mb-4">
            <FormInput name="firstName" label="Имя" placeholder="Имя" />
            <FormInput name="lastName" label="Фамилия" placeholder="Фамилия" />
            <FormInput
              name="image"
              label="Аватар"
              placeholder="Ссылка на изображение"
            />
          </div>
          <SubmitBtn text="Сохранить" isLoading={isPending} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default EditProfileForm;
