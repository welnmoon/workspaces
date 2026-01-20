'use client';

import {
  createProjectFormSchema,
  CreateProjectFormValues,
} from '@/schemas/projects/create-project-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { useCreateProject } from '@/hooks/project/use-create-project';
import { AppError } from '@/lib/errors';
import { SubmitButton } from '@/ui/button/submit-button';

const CreateProjectForm = ({
  workspaceId,
  setOpenModal,
}: {
  workspaceId: number;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { mutate, isPending } = useCreateProject(workspaceId);
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onFormSubmit = async (values: CreateProjectFormValues) => {
                                                                      
                        
                                                         
                                      
          
                    
                      
                                                       
                          
                             
               
                                                              
                        
                                                    
                            
                                      
                              
        
    mutate(values, {
      onSuccess: () => {
        form.reset();
        toast.success('Проект успешно создан');

        setOpenModal(false);
      },
      onError: (error: unknown) => {
        let message = 'Не удалось создать проект';

        if (error instanceof AppError) {
          message = error.message;
        } else if (typeof error === 'object' && error !== null) {
          const err = error as { message: string; error?: string };
          message = err.message ?? err.error ?? message;
        }
        toast.error(message);
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
            <FormInput
              name="name"
              label="Project Name"
              placeholder="Project name"
              required
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Description"
            />
          </div>
          <SubmitButton text="Создать" isLoading={isPending} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default CreateProjectForm;
