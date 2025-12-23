import { forwardRef } from 'react';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const EditWorkspaceAction = forwardRef<
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

EditWorkspaceAction.displayName = 'EditWorkspaceAction';

export { EditWorkspaceAction };
