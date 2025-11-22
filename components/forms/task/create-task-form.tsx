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
import { useCreateTask } from '@/hooks/tasks/use-create-task';

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
  const { mutate, isPending, isSuccess, isError, error } = useCreateTask(
    workspaceId,
    projectId
  );

  const onFormSubmit = (values: CreateTaskFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success('Задача успешно создана');
        onSuccess?.();
        form.reset();
        router.refresh();
      },
      onError: () => {
        toast.error('Не удалось создать задачу');
      },
    });
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
        <SubmitBtn text="Создать задачу" isLoading={isPending} />
      </form>
    </FormProvider>
  );
};

export default CreateTaskForm;
