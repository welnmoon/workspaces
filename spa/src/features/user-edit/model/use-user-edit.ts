import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editUserSchema,
  type EditUserSchemaType,
} from '../../../entities/user/model/schema';
import { useUpdateUserMutation } from '../../../entities/user/api/user.api';

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
