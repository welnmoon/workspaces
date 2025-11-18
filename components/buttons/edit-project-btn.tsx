import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

const EditButton = ({
  className,
  children,
  onClick,
  ...props
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => (
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

export default EditButton;
