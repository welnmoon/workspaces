import { forwardRef } from 'react';
import { PlusCircle } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MainButtonProps = ButtonProps & {
  text?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const MainButton = forwardRef<HTMLButtonElement, MainButtonProps>(
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

MainButton.displayName = 'MainButton';

export default MainButton;
export { MainButton, type MainButtonProps };
