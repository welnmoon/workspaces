'use client';

import { useState } from 'react';
import { Bell, Info, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useWorkspaceDelete } from '@/hooks/workspace/use-workspace-delete';
import { useWorkspaceChangeName } from '@/hooks/workspace/use-workspace-change-name';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';

type Props = {
  workspaceId: number;
  workspaceName: string;
  onNameChange: (name: string) => void;
};

const WorkspaceCardActions = ({
  workspaceId,
  workspaceName,

  onNameChange,
}: Props) => {
  const workspaceLabel = `${workspaceName} (#${workspaceId})`;
  const [openPopover, setOpenPopover] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const [newName, setNewName] = useState(workspaceName);

  const { mutate, isPending: isDeletePending, error } = useWorkspaceDelete();
  const {
    mutate: changeName,
    isPending: isRenamePending,
    error: renameError,
  } = useWorkspaceChangeName(workspaceId);

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

  const onRename = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error('Название не может быть пустым');
      return;
    }
    changeName(trimmed, {
      onSuccess: () => {
        onNameChange(trimmed);
        toast.success('Название обновлено');
        setOpenEditDialog(false);
      },
      onError: () => {
        console.error(renameError);
        toast.error('Не удалось изменить название');
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
              setOpenPopover(false);
              setNewName(workspaceName);
              setOpenEditDialog(true);
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

      {/* Notify dialog (пока заглушка) */}
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

      {/* Edit name dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать рабочее пространство</DialogTitle>
            <DialogDescription>
              Введите новое название для «{workspaceLabel}».
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditDialog(false)}
              disabled={isRenamePending}
            >
              Отмена
            </Button>
            <Button onClick={onRename} disabled={isRenamePending}>
              {isRenamePending ? <Spinner /> : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">
              Удалить рабочее пространство
            </DialogTitle>
            <DialogDescription>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Важно</AlertTitle>
                <AlertDescription>
                  После удаления рабочего пространства будет отправлено
                  уведомление участникам.
                </AlertDescription>
              </Alert>
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
              onClick={onDelete}
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
