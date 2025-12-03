'use client';

import SubmitBtn from '@/components/buttons/submit-btn';
import FormInput from '@/components/forms/form-input';
import { apiRoutes } from '@/lib/routes/api-routes';
import {
  CreateWorkspaceFormValues,
  createWorkspaceFormSchema,
} from '@/schemas/workspace/create-workspace-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type EditWorkspaceFormProps = {
  workspaceId: number;
  defaultValues: {
    name: string;
    description?: string | null;
  };
  onSuccess?: () => void;
};

const EditWorkspaceForm = ({
  workspaceId,
  defaultValues,
  onSuccess,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description ?? '',
    },
  });

  const handleSubmit = async (values: CreateWorkspaceFormValues) => {
    try {
      const res = await fetch(apiRoutes.updateWorkspace(workspaceId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || 'Не удалось обновить рабочее пространство'
        );
      }

      toast.success('Рабочее пространство обновлено');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Не удалось обновить рабочее пространство'
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            form.handleSubmit(handleSubmit)();
          }
        }}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormInput
          name="name"
          label="Название"
          placeholder="Введите название"
          required
        />
        <FormInput
          name="description"
          label="Описание"
          placeholder="Короткое описание"
        />
        <SubmitBtn
          isLoading={form.formState.isSubmitting}
          text="Сохранить"
        />
      </form>
    </FormProvider>
  );
};

export default EditWorkspaceForm;
