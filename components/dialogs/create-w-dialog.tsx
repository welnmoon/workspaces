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
import { useState } from 'react';
import { Button } from '../ui/button';
import WorkspaceAvatars from '../entities/workspaces/workspace-avatars';
import { Heading } from '../ui/heading';

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
  const [open, setOpen] = useState(false);

  const nameValue = form.watch('name');
  const firstStepEnded = nameValue.trim() !== '';

  const goNext = async () => {
    const valid = await form.trigger(['name', 'description'], {
      shouldFocus: true,
    });
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
        setOpen(false);
        setStep(1);
        router.refresh();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(message);
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MainBtn text="Создать воркспейс" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            <Heading>Вы создаете вокрспейс</Heading>
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className="w-full h-full flex flex-col"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (step === 1) {
                  goNext();
                } else {
                  form.handleSubmit(onFormSubmit)();
                }
              }
            }}
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            {step === 1 && (
              <div className="flex flex-col gap-2 items-end w-full">
                <CreateWorkspaceForm />
                <Button
                  type="button"
                  disabled={!firstStepEnded}
                  onClick={() => goNext()}
                >
                  Далее
                </Button>
                <div className="w-full flex justify-center">
                  <img
                    className="max-w-full max-h-70 object-contain"
                    alt="chill-time"
                    src="/images/workspaces/chill-time-no-bg.png"
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col h-full items-end ">
                <Heading level={3} className="mb-4 text-zinc-700 w-full">
                  Выберите аватар воркспейса
                </Heading>
                <WorkspaceAvatars className="flex-1 w-full mb-10 " />
                <div className="flex gap-2">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      form.setValue('avatarUrl', '');
                    }}
                    type="submit"
                  >
                    Пропустить
                  </Button>
                  <Button variant={'outline'} onClick={() => setStep(1)}>
                    Назад
                  </Button>
                  <SubmitBtn
                    text="Создать вокрспейс"
                    isLoading={form.formState.isSubmitting}
                  />
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
