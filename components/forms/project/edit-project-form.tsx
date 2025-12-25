'use client';

import {
  CreateProjectFormValues,
  createProjectFormSchema,
} from '@/schemas/projects/create-project-form-schemas';
import FormInput from '@/components/forms/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useEditProject } from '@/hooks/project/use-edit-project';
import { SubmitButton } from '@/ui/button/submit-button';

type EditProjectFormProps = {
  workspaceId: number;
  projectId: number;
  defaultValues: {
    name: string;
    description?: string | null;
  };
  onSuccess?: () => void;
};

const EditProjectForm = ({
  workspaceId,
  projectId,
  defaultValues,
  onSuccess,
}: EditProjectFormProps) => {
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description ?? '',
    },
  });
  const { mutate: editProject, isPending: isEditPending } = useEditProject(
    workspaceId,
    projectId
  );

  const onSubmit = async (values: CreateProjectFormValues) => {
    editProject(values, {
      onSuccess: () => {
        toast.success('Проект обновлен');
        onSuccess?.();
      },
      onError: () => {
        toast.error('Не удалось обновить проект');
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormInput
          name="name"
          label="Название проекта"
          placeholder="Например, внутренний портал"
          required
        />
        <FormInput
          name="description"
          label="Описание"
          placeholder="Кратко опишите цели и задачи"
        />
        <div className="pt-2">
          <SubmitButton text="Сохранить" isLoading={isEditPending} />
        </div>
      </form>
    </FormProvider>
  );
};

export default EditProjectForm;
