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
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import getFullName from '@/helpers/profile.ts/get-full-name';
import { STATUS_COLUMNS, TaskStatusDTO } from '@/const/tasks-status';

type TaskActionsProps = {
  disabled?: boolean;
  onMove: (sprintId: number | null, taskId: number) => void;
  onChangeStatus?: (taskId: number, status: TaskStatusDTO) => void;
  sprintsMap: Map<number, string>;
  onChangeAssignee?: (
    taskId: number,
    assigneeId: string | null,
    assignee?: MembershipSelectUserDTO['user']
  ) => void;
  onDelete?: (taskId: number) => void;

  members: MembershipSelectUserDTO[] | undefined;
  taskId: number;
};

const TaskActions = ({
  disabled,
  sprintsMap,
  onMove,
  onChangeStatus,
  onChangeAssignee,
  onDelete,

  members,
  taskId,
}: TaskActionsProps) => {
  const membersList = Array.isArray(members) ? members : [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-zinc-100 rounded-xs"
          disabled={disabled}
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/*-----------------------------------------*/}
        {/*---------------Moving----------------*/}
        {/*-----------------------------------------*/}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Переместить задачу</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60">
            {membersList !== undefined && (
              <>
                {sprintsMap.size === 0 && (
                  <DropdownMenuItem disabled>
                    Нет доступных спринтов
                  </DropdownMenuItem>
                )}
                {Array.from(sprintsMap.entries()).map(
                  ([sprintId, sprintName]) => (
                    <DropdownMenuItem
                      key={sprintId}
                      onClick={() => onMove(sprintId, taskId)}
                    >
                      {sprintName}
                    </DropdownMenuItem>
                  )
                )}
                <DropdownMenuItem onClick={() => onMove(null, taskId)}>
                  В бэклог
                </DropdownMenuItem>
              </>
            )}

            {membersList === undefined && <span>Ошибка</span>}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/*-----------------------------------------*/}
        {/*---------------Status----------------*/}
        {/*-----------------------------------------*/}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Изменить статус</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            {STATUS_COLUMNS.map((status) => (
              <DropdownMenuItem
                key={status.id}
                onClick={() => onChangeStatus?.(taskId, status.id)}
              >
                {status.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/*-----------------------------------------*/}
        {/*---------------Priority----------------*/}
        {/*-----------------------------------------*/}
        {/* <DropdownMenuItem onClick={onChangePriority}>
          Изменить приоритет
        </DropdownMenuItem> */}

        {/*-----------------------------------------*/}
        {/*---------------Assignee----------------*/}
        {/*-----------------------------------------*/}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Изменить исполнителя</DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-60">
            {membersList !== undefined && (
              <>
                {membersList.length === 0 && (
                  <DropdownMenuItem disabled>
                    Нет доступных участников
                  </DropdownMenuItem>
                )}
                {membersList.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() =>
                      onChangeAssignee?.(taskId, member.user.id, member.user)
                    }
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
              </>
            )}

            {membersList === undefined && <span>Ошибка</span>}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/*-----------------------------------------*/}
        {/*---------------Delete----------------*/}
        {/*-----------------------------------------*/}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete?.(taskId)}
        >
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActions;
