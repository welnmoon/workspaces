"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
}

const defaultDescription = 'Все несохранённые данные могут быть потеряны.';

export const LogoutConfirmDialog = ({
  open,
  onOpenChange,
  description = defaultDescription,
}: LogoutConfirmDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await signOut({ callbackUrl: '/' });
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выйти из аккаунта?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            variant="secondary"
            className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-200 dark:hover:bg-rose-900/40"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
