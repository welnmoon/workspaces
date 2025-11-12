import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import { forwardRef } from 'react';
import { Button } from '../ui/button';

const EditWorkspaceButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      'w-full flex items-center justify-start gap-2 text-left',
      className
    )}
    {...props}
  >
    <Edit className="w-5 h-5" />
    <span>{children ?? 'Редактировать'}</span>
  </Button>
));

EditWorkspaceButton.displayName = 'EditWorkspaceButton';

export default EditWorkspaceButton;
