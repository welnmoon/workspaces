import { useForm } from 'react-hook-form';
import { editUserSchema, type EditUserSchemaType } from './schema';
import { useUpdateUserMutation } from '../api/user-edit.api';
import { zodResolver } from '@hookform/resolvers/zod';

type Params = {
  userId: string;
  initialValues?: EditUserSchemaType;
  onSuccess?: () => void;
};

export const useUserEdit = ({ userId, initialValues, onSuccess }: Params) => {
  const form = useForm<EditUserSchemaType>({
    defaultValues: initialValues,
    mode: 'onSubmit',
    resolver: zodResolver(editUserSchema),
  });

  const [updateUser, updateState] = useUpdateUserMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    await updateUser({ id: userId, body: values }).unwrap();
    onSuccess?.();
  });

  return {
    form,
    onSubmit,
    updateState,
  };
};
