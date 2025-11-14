'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import CreateWorkspaceForm from '../forms/w/create-w-form';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import WorkspaceAvatars from '../entities/workspaces/workspace-avatars';
import { Heading } from '../ui/heading';

import { CreateTaskFormValues } from '@/schemas/tasks/create-task-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { apiRoutes } from '@/lib/routes/api-routes';
import { useRouter } from 'next/navigation';
import {
  createWorkspaceFormSchema,
  CreateWorkspaceFormValues,
} from '@/schemas/workspace/create-workspace-form-schema';
import SubmitBtn from '../buttons/submit-btn';

const CreateWorkspaceDialog = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      avatarUrl: '',
    },
  });

  const nameValue = form.watch('name');
  const firstStepEnded = nameValue.trim() !== '';

  const goNext = () => {
    const valid = form.trigger(['name', 'description']);
    if (!valid) return;
    setStep(2);
  };

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
    <Dialog>
      <DialogTrigger asChild>
        <MainBtn text="Создать воркспейс" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Heading>Вы создаете вокрспейс</Heading>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onFormSubmit)}>
            {step === 1 && (
              <div className="flex flex-col gap-2 items-end">
                <CreateWorkspaceForm />
                <Button disabled={!firstStepEnded} onClick={() => goNext()}>
                  Далее
                </Button>
              </div>
            )}
            {step === 2 && (
              <div>
                <Heading level={3} className="mb-4 text-zinc-700">
                  Выберите аватар воркспейса
                </Heading>
                <WorkspaceAvatars />
                <Button onClick={() => setStep(1)}>Назад</Button>
                <SubmitBtn
                  text="Создать вокрспейс"
                  isLoading={form.formState.isSubmitting}
                />
              </div>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
