'use client';

import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const SubmitBtn = ({
  isLoading,
  text,
}: {
  isLoading: boolean;
  text?: string;
}) => {
  return (
    <Button
      className="cursor-pointer bg-primary-600 text-primary-50 hover:bg-primary-500"
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
