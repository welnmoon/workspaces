'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSendNotificationToWMembers } from '@/hooks/notifications/use-send-notif-to-w-members';
import { SendNotificationToWMembersSchema } from '@/schemas/notification/send-notification-to-w-members-schema';
import SendWMembersNotificationForm from '@/components/forms/notifications/send-w-members-notification-form';

type Props = {
  workspaceId: number;
  userId: string;
};

const WorkspaceNotifyButton = ({ workspaceId, userId }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSendNotificationToWMembers(
    userId,
    workspaceId
  );

  const onSend = (values: SendNotificationToWMembersSchema) => {
    mutate(values, {
      onSuccess: () => {
        toast.success('Уведомление успешно отправлено');
        setOpen(false);
      },
      onError: () => {
        toast.error('Не удалось отправить уведомление');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 text-left">
          <Bell className="h-5 w-5" />
          <span>Уведомить участников</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Уведомить участников</DialogTitle>
          <DialogDescription>
            Отправьте письмо всем участникам этого рабочего пространства.
          </DialogDescription>
        </DialogHeader>
        <SendWMembersNotificationForm
          onSubmit={onSend}
          isSubmitting={isPending}
          setOpenNotifyDialog={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceNotifyButton;
