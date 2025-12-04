import { Button, type ButtonProps } from '../ui/button';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

type MainBtnProps = ButtonProps & {
  text?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const MainBtn = forwardRef<HTMLButtonElement, MainBtnProps>(
  ({ text, icon, className, children, ...props }, ref) => {
    const Icon = icon ?? <PlusCircle className="text-white" size={20} />;

    return (
      <Button
        ref={ref}
        className={cn(
          'bg-zinc-800 hover:bg-zinc-900 inline-flex items-center gap-2',
          className
        )}
        {...props}
      >
        {Icon}
        {text} {children}
      </Button>
    );
  }
);

MainBtn.displayName = 'MainBtn';

export default MainBtn;
