import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import getFullName from '@/helpers/profile.ts/get-full-name';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import { Controller } from 'react-hook-form';

const SelectAssignee = ({
  members,
  control,
  name,
}: {
  members: MembershipSelectUserDTO[];
  control: any;
  name: string;
}) => {
  return (
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
  );
};

export default SelectAssignee;
