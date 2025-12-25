import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EditProjectActionProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const EditProjectAction = ({
  className,
  children,
  onClick,
  ...props
}: EditProjectActionProps) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className={cn(
      'w-full flex items-center justify-start gap-2 text-left',
      className
    )}
    {...props}
  >
    <Edit className="h-4 w-4" />
    <span>{children ?? 'Редактировать'}</span>
  </Button>
);

export { EditProjectAction };
