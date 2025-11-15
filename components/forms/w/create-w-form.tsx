'use client';

import { useFormContext } from 'react-hook-form';
import FormInput from '../form-input';

import { CreateWorkspaceFormValues } from '@/schemas/workspace/create-workspace-form-schema';

const CreateWorkspaceForm = ({}: {}) => {
  const form = useFormContext<CreateWorkspaceFormValues>();

  return (
    <fieldset className="flex flex-col gap-1 w-full">
      <legend className="sr-only ">Create Project Form</legend>
      <FormInput
        name="name"
        label="Название воркспейса"
        placeholder="Название воркспейса"
        required
      />
      <FormInput
        name="description"
        label="Описание"
        placeholder="Описание воркспейса"
      />
    </fieldset>
  );
};

export default CreateWorkspaceForm;
