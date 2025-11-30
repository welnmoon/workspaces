'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  sendNotificationToWMembersSchema,
  SendNotificationToWMembersSchema,
} from '@/schemas/notification/send-notification-to-w-members-schema';
import FormInput from '../form-input';

type Props = {
  onSubmit: (values: SendNotificationToWMembersSchema) => void;
  isSubmitting?: boolean;
  className?: string;
  setOpenNotifyDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const SendWMembersNotificationForm = ({
  onSubmit,
  isSubmitting = false,
  className,
  setOpenNotifyDialog,
}: Props) => {
  const form = useForm<SendNotificationToWMembersSchema>({
    resolver: zodResolver(sendNotificationToWMembersSchema),
    defaultValues: {
      title: '',
      body: '',
      sendAt: '',
    },
  });

  const handleSubmit = (values: SendNotificationToWMembersSchema) => {
    onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-4', className)}
      >
        <FormInput
          name="title"
          label="Заголовок уведомления"
          placeholder="Введите заголовок"
        />

        <FormInput
          name="body"
          label="Текст уведомления"
          placeholder="Введите текст"
          isTextarea
        />

        <FormInput
          name="sendAt"
          label="Дата и время отправки"
          type="datetime-local"
          placeholder=""
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Отправляем...' : 'Отправить уведомление'}
        </Button>
        <Button variant="outline" onClick={() => setOpenNotifyDialog(false)}>
          Отмена
        </Button>
      </form>
    </FormProvider>
  );
};

export default SendWMembersNotificationForm;
