'use client';

import SubmitBtn from '@/components/buttons/submit-btn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { apiRoutes } from '@/lib/routes/api-routes';
import {
  inviteUserFormSchema,
  InviteUserFormValues,
} from '@/schemas/invitations/invite-user-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormInput from '../form-input';

type InviteUserFormProps = {
  workspaceId: number;
  onSuccess?: () => void;
};

const InviteUserForm = ({ workspaceId, onSuccess }: InviteUserFormProps) => {
  const router = useRouter();
  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: {
      email: '',
      role: Role.MEMBER,
      expiresInHours: '',
    },
  });

  const handleSubmit = async (values: InviteUserFormValues) => {
    try {
      const res = await fetch(apiRoutes.createInvitation(workspaceId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          email: values.email,
          newUserRole: values.role,
          expiresInHours: values.expiresInHours
            ? Number(values.expiresInHours)
            : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || 'Не удалось отправить приглашение. Попробуйте позже'
        );
      }

      toast.success('Приглашение отправлено');
      onSuccess?.();
      form.reset({
        email: '',
        role: values.role,
        expiresInHours: '',
      });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить приглашение'
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          name="email"
          label="E-mail"
          placeholder="user@email.com"
          required
          type="email"
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Роль приглашенного</Label>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <FormInput
          name="expiresInHours"
          label="Срок действия (часов)"
          placeholder="Например, 72"
          type="number"
        />

        <SubmitBtn
          className="px-2"
          isLoading={form.formState.isSubmitting}
          text="Отправить приглашение"
        />
      </form>
    </FormProvider>
  );
};

export default InviteUserForm;
