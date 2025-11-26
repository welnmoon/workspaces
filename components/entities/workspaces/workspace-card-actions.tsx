'use client';

import { useState } from 'react';
import { Bell, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FullRoleDTO } from '@/types/prisma/DTO/role';
import { useWorkspaceDelete } from '@/hooks/workspace/use-workspace-delete';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  workspaceId: number;
  workspaceName: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingText: React.Dispatch<React.SetStateAction<string>>;
  role: FullRoleDTO | null;
  editing: boolean;
  editingText: string;
};

const WorkspaceCardActions = ({
  workspaceId,
  workspaceName,
  setEditing,
  setEditingText,
  role,
  editing,
  editingText,
}: Props) => {
  const workspaceLabel = `${workspaceName} (#${workspaceId})`;
  const [openPopover, setOpenPopover] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const {
    mutate,
    isPending: isDeletePending,
    isError,
    error,
  } = useWorkspaceDelete();

  const onDelete = () => {
    mutate(workspaceId, {
      onSuccess: () => {
        toast.success('Рабочее пространство успешно удалено');
      },
      onError: () => {
        toast.error('Не удалось удалить рабочее пространство');
        console.error(error);
      },
    });
  };

  const closeDialogs = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenNotifyDialog(false);
  };

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Действия с рабочим пространством</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 py-2 px-1 flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              // setOpenEditDialog(true);
              setOpenPopover(false);
              setEditing(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            Редактировать
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpenNotifyDialog(true);
              setOpenPopover(false);
            }}
          >
            <Bell className="h-4 w-4" />
            Отправить уведомление
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive"
            onClick={() => {
              setOpenDeleteDialog(true);
              setOpenPopover(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </Button>
        </PopoverContent>
      </Popover>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать рабочее пространство</DialogTitle>
            <DialogDescription>
              Здесь будет форма редактирования для «{workspaceLabel}».
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Отмена
            </Button>
            <Button onClick={closeDialogs}>Сохранить (пока без логики)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openNotifyDialog} onOpenChange={setOpenNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Уведомить участников</DialogTitle>
            <DialogDescription>
              Здесь появится форма отправки уведомления всем участникам рабочего
              пространства «{workspaceLabel}».
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenNotifyDialog(false)}
            >
              Отмена
            </Button>
            <Button onClick={closeDialogs}>Отправить (пока без логики)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить рабочее пространство</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить рабочее пространство «
              {workspaceLabel}»?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
              }}
              disabled={isDeletePending}
            >
              {isDeletePending ? <Spinner /> : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkspaceCardActions;
