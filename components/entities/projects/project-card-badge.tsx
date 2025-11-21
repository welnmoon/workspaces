import { cn } from '@/lib/utils';
import { Badge } from '../../ui/badge';

const ProjectCardBadge = ({
  text,
  value,
  variant,
}: {
  text: string;
  value: number;
  variant:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'info'
    | 'destructive'
    | 'outline'
    | null
    | undefined;
}) => {
  return (
    <Badge
      variant={variant}
      className={cn('font-light', value === 0 && 'hidden')}
    >
      {text}: <b>{value}</b>
    </Badge>
  );
};

export default ProjectCardBadge;
