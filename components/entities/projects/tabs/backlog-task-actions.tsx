import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import getFullName from '@/helpers/profile.ts/get-full-name';

type BacklogTaskActionsProps = {
  disabled?: boolean;
  onMove?: () => void;
  onChangeStatus?: () => void;
  onChangePriority?: () => void;
  onChangeAssignee?: (id: number) => void;
  onDelete?: () => void;

  members: MembershipSelectUserDTO[];
};

const BacklogTaskActions = ({
  disabled,
  onMove,
  onChangeStatus,
  onChangePriority,
  onChangeAssignee,
  onDelete,

  members,
}: BacklogTaskActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-zinc-100"
          disabled={disabled}
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onMove}>Переместить задачу</DropdownMenuItem>
        <DropdownMenuItem onClick={onChangeStatus}>
          Изменить статус
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChangePriority}>
          Изменить приоритет
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Изменить исполнителя</DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-60">
            {members.length === 0 && (
              <DropdownMenuItem disabled>
                Нет доступных участников
              </DropdownMenuItem>
            )}

            {members.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => onChangeAssignee?.(member.id)}
              >
                {/* <div className="flex items-center gap-2"> */}
                {/* <Avatar className="h-6 w-6">
                    {member.user.ava && <AvatarImage src={member.avatarUrl} />}
                    <AvatarFallback>
                      {member.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar> */}
                <span>
                  {getFullName({
                    firstName: member.user.firstName,
                    lastName: member.user.lastName,
                  })}
                </span>
                {/* </div> */}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BacklogTaskActions;
