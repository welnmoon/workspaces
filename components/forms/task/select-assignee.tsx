import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import getFullName from '@/helpers/profile.ts/get-full-name';
import { cn } from '@/lib/utils';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { Controller } from 'react-hook-form';

const SelectAssignee = ({
  members,
  control,
  name,
  label = 'Исполнитель',
  required,
  className,
}: {
  members: MembershipSelectUserDTO[];
  control: any;
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}) => {
  return (
    <>
      {label && (
        <Label className={cn('text-md font-medium mb-1', className)}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Исполнитель" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {members.map((member) => (
                <SelectItem
                  className="flex gap-2"
                  key={member.id}
                  value={String(member.user.id)}
                >
                  <span>
                    {getFullName({
                      firstName: member.user.firstName,
                      lastName: member.user.lastName,
                    })}
                  </span>
                  <span>
                    {member.user.email ? ` (${member.user.email})` : ''}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </>
  );
};

export default SelectAssignee;
