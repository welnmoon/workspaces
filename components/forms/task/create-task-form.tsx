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
import { apiRoutes } from '@/lib/routes/api-routes';
import { DueDateField } from './due-date-field';
import { useRouter } from 'next/navigation';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import SelectAssignee from './select-assignee';
import SelectPriority from './select-priority';

const CreateTaskForm = ({
  projectId,
  workspaceId,
  onSuccess,
  members,
}: {
  projectId: number;
  workspaceId: number;
  onSuccess?: () => void;
  members: MembershipSelectUserDTO[];
}) => {
  const router = useRouter();
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date().toISOString().slice(0, 10),
      assigneeId: undefined,
      priority: 'LOW',
    },
  });

  const onFormSubmit = async (values: CreateTaskFormValues) => {
    try {
      const res = await fetch(apiRoutes.createTask(workspaceId, projectId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          assigneeId: values.assigneeId,
          priority: values.priority,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => {});
        toast.error(
          data.error || res.statusText || 'Не удалось создать задачу'
        );
        return;
      }
      onSuccess?.();
      form.reset();
      toast.success('Задача успешно создана');
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
        <fieldset className="mb-4 space-y-2">
          <legend className="sr-only">Вы создаете задачу</legend>
          <FormInput
            name="title"
            label="Название задачи"
            placeholder="Например, подготовить презентацию"
            required
          />
          <FormInput
            name="description"
            label="Описание"
            placeholder="Уточните детали"
          />
          <SelectAssignee
            control={form.control}
            name="assigneeId"
            members={members}
          />
          <SelectPriority required control={form.control} name="priority" />

          <DueDateField control={form.control} name="dueDate" />
        </fieldset>
        <SubmitBtn
          text="Создать задачу"
          isLoading={form.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
};

export default CreateTaskForm;
