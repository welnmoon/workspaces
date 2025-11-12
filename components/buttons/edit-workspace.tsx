import { Edit } from 'lucide-react';
import { Button } from '../ui/button';

const EditWorkspaceButton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-start gap-2 text-left"
    >
      <Edit className="w-5 h-5" />
      <span>Редактировать</span>
    </Button>
  );
};

export default EditWorkspaceButton;
