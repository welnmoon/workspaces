import { Button, type ButtonProps } from '../ui/button';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

type MainBtnProps = ButtonProps & {
  text?: string;
  children?: React.ReactNode;
};

const MainBtn = forwardRef<HTMLButtonElement, MainBtnProps>(
  ({ text, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('bg-zinc-800 hover:bg-zinc-900', className)}
        {...props}
      >
        <PlusCircle className='text-white' size={20}/>
        {text} {children}
      </Button>
    );
  }
);

MainBtn.displayName = 'MainBtn';

export default MainBtn;
