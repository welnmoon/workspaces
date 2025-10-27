'use client';

import {
  createTaskFormSchema,
  CreateTaskFormValues,
} from '@/schemas/tasks/create-task-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import SubmitBtn from '../../buttons/submit-btn';
import toast from 'react-hot-toast';
import { apiRoutes } from '@/lib/api-routes';
import { DueDateField } from './due-date-field';
import { useRouter } from 'next/navigation';

const CreateTaskForm = ({
  projectId,
  workspaceId,
}: {
  projectId: number;
  workspaceId: number;
}) => {
  const router = useRouter();
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date().toISOString().slice(0, 10),
    },
  });

  const onFormSubmit = async (values: CreateTaskFormValues) => {
    console.log('Submitting form with values:', values);
    try {
      const res = await fetch(apiRoutes.createTask(workspaceId, projectId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dueDate: values.dueDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => {});
        toast.error(
          data.error || res.statusText || 'Не удалось создать задачу'
        );
        return;
      }

      const data = await res.json();

      if (data.data) {
        form.reset();
        toast.success('Задача успешно создана');
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
            name="title"
            label="Task title"
            placeholder="Task title"
            required
          />
          <FormInput
            name="description"
            label="Description"
            placeholder="Description"
          />
          <DueDateField control={form.control} name="dueDate" />
          <SubmitBtn
            text="Create Task"
            isLoading={form.formState.isSubmitting}
          />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default CreateTaskForm;
