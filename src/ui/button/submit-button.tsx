'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
  isLoading: boolean;
  text?: string;
  className?: string;
};

const SubmitButton = ({ isLoading, text, className }: SubmitButtonProps) => {
  return (
    <Button
      className={cn('w-40 bg-zinc-900', className)}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : text ? (
        text
      ) : (
        'Отправить'
      )}
    </Button>
  );
};

export default SubmitButton;
export { SubmitButton, type SubmitButtonProps };
