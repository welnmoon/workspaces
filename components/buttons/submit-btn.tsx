'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const SubmitBtn = ({
  isLoading,
  text,
  className,
}: {
  isLoading: boolean;
  text?: string;
  className?: string;
}) => {
  return (
    <Button
      // className="cursor-pointer bg-primary-600 text-primary-50 hover:bg-primary-500"
      className={cn('w-40', className)}
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

export default SubmitBtn;
