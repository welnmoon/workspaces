import { forwardRef } from 'react';
import { TiUserAdd } from 'react-icons/ti';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CreateInvitationAction = forwardRef<
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
    <TiUserAdd className="w-5 h-5" />
    <span>{children ?? 'Пригласить'}</span>
  </Button>
));

CreateInvitationAction.displayName = 'CreateInvitationAction';

export { CreateInvitationAction };
