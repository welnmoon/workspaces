import SubmitBtn from '@/components/buttons/submit-btn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RolesWithoutOwner } from '@/const/roles';
import { apiRoutes } from '@/lib/routes/api-routes';
import { editMemberFormDefaultValues } from '@/schemas/member/member';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditMemberForm = ({
  setOpen,
  memberRole,
  memberId,
}: {
  memberRole: RoleWithoutOwnerDTO;
  memberId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<editMemberFormDefaultValues>({
    defaultValues: {
      role: memberRole,
    },
  });
  const router = useRouter();

  const handleSubmit = async (data: editMemberFormDefaultValues) => {
    try {
      const { role } = data;
      if (memberRole === role) {
        toast.error('Роль не изменилась');
        return;
      }

      const res = await fetch(apiRoutes.editMember(memberId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error('Не удалось обновить роль участника');
        return;
      }

      toast.success('Роль участника успешно обновлена');
      router.refresh();
      setOpen(false);
    } catch (e) {
      toast.error('Произошла ошибка при обновлении роли участника');
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Роль участника</Label>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select
                defaultValue={memberRole}
                value={field.value}
                onValueChange={(value) =>
                  field.onChange(value as RoleWithoutOwnerDTO)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {RolesWithoutOwner.map((role) => (
                    <SelectItem
                      disabled={role === memberRole}
                      key={role}
                      value={role}
                      className="flex gap-2 justify-between"
                    >
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <SubmitBtn isLoading={form.formState.isSubmitting} text="Обновить" />
      </form>
    </FormProvider>
  );
};

export default EditMemberForm;
