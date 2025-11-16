'use client';

import FormInput from '@/components/forms/form-input';
import SubmitBtn from '@/components/buttons/submit-btn';
import { apiRoutes } from '@/lib/routes/api-routes';
import {
  CreateProjectFormValues,
  createProjectFormSchema,
} from '@/schemas/projects/create-project-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const router = useRouter();
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description ?? '',
    },
  });

  const onSubmit = async (values: CreateProjectFormValues) => {
    try {
      const res = await fetch(apiRoutes.someProject(workspaceId, projectId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || 'Не удалось обновить информацию о проекте'
        );
      }

      toast.success('Проект обновлён');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось обновить проект'
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <SubmitBtn text="Сохранить" isLoading={form.formState.isSubmitting} />
        </div>
      </form>
    </FormProvider>
  );
};

export default EditProjectForm;
