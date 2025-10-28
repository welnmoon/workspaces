'use client';

import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import SubmitBtn from '../../buttons/submit-btn';
import toast from 'react-hot-toast';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useRouter } from 'next/navigation';
import {
  createWorkspaceFormSchema,
  CreateWorkspaceFormValues,
} from '@/schemas/workspace/create-workspace-form-schema';

const CreateWorkspaceForm = ({}: {}) => {
  const router = useRouter();
  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onFormSubmit = async (values: CreateWorkspaceFormValues) => {
    console.log('Submitting form with values:', values);
    try {
      const res = await fetch(apiRoutes.createWorkspace(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => {});
        toast.error(
          data.error || res.statusText || 'Не удалось создать воркспейс'
        );
        return;
      }

      const data = await res.json();

      if (data.data) {
        form.reset();
        toast.success('Воркспейс успешно создан');
        router.refresh();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
        <fieldset>
          <legend className="sr-only">Create Project Form</legend>
          <FormInput
            name="name"
            label="Название воркспейса"
            placeholder="Название воркспейса"
            required
          />
          <FormInput
            name="description"
            label="Описание"
            placeholder="Описание воркспейса"
          />
          <SubmitBtn
            text="Создать вокрспейс"
            isLoading={form.formState.isSubmitting}
          />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default CreateWorkspaceForm;
