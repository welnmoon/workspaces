import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

const EditProjectButton = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <Button
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

export default EditProjectButton;
