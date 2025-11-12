import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Button } from '../ui/button';
import { TiUserAdd } from 'react-icons/ti';

const CreateInvitationButton = forwardRef<
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

CreateInvitationButton.displayName = 'CreateInvitationButton';

export default CreateInvitationButton;
