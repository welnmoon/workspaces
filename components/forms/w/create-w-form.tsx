'use client';

import FormInput from '../form-input';

const CreateWorkspaceForm = () => {
                                                              

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
