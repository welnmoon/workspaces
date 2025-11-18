import SubmitBtn from '@/components/buttons/submit-btn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { editMemberFormDefaultValues } from '@/schemas/member/member';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { Role } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditMemberForm = ({
  memberRole,
}: {
  memberRole: RoleWithoutOwnerDTO;
}) => {
  const form = useForm<editMemberFormDefaultValues>({
    defaultValues: {
      role: memberRole,
    },
  });
  const ableRoles = memberRole === Role.ADMIN ? [Role.MEMBER] : [Role.ADMIN];

  const handleSubmit = (data: editMemberFormDefaultValues) => {
    const { role } = data;
    if (memberRole === role) {
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Label className="text-sm font-medium">Роль приглашенного</Label>
        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <Select
              defaultValue={memberRole}
              value={field.value}
              onValueChange={(value) => field.onChange(value as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                {ableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <SubmitBtn isLoading={form.formState.isSubmitting} text="Обновить" />
      </form>
    </FormProvider>
  );
};

export default EditMemberForm;
