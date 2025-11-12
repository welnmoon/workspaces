import { Badge } from '../../ui/badge';

const ProjectCardBadge = ({ text, value }: { text: string; value: number }) => {
  return (
    <Badge variant={'outline'} className="font-light">
      {text}: <b>{value}</b>
    </Badge>
  );
};

export default ProjectCardBadge;
