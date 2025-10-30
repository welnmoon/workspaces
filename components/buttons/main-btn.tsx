import { Button, type ButtonProps } from '../ui/button';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type MainBtnProps = ButtonProps & {
  text: string;
};

const MainBtn = forwardRef<HTMLButtonElement, MainBtnProps>(
  ({ text, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('bg-primary-500 hover:bg-primary-600', className)}
        {...props}
      >
        {text}
      </Button>
    );
  }
);

MainBtn.displayName = 'MainBtn';

export default MainBtn;
