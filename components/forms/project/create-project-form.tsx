'use client';

import {
  createProjectFormSchema,
  CreateProjectFormValues,
} from '@/schemas/projects/create-project-form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../form-input';
import SubmitBtn from '../../buttons/submit-btn';
import { createProject } from '@/lib/createProject';
import toast from 'react-hot-toast';
import { apiRoutes } from '@/lib/routes/api-routes';

const CreateProjectForm = ({ workspaceId }: { workspaceId: number }) => {
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onFormSubmit = async (values: CreateProjectFormValues) => {
    const res = await fetch(apiRoutes.createProject(workspaceId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      form.reset();
      toast.success('Project created successfully');
    } else {
      toast.error(res.statusText || 'Failed to create project');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
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
          <SubmitBtn text="Создать" isLoading={form.formState.isSubmitting} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default CreateProjectForm;
