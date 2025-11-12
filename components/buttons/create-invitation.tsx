import { Button } from '../ui/button';
import { TiUserAdd } from 'react-icons/ti';

const CreateInvitationButton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-start gap-2 text-left"
    >
      <TiUserAdd className="w-5 h-5" />
      <span>Пригласить</span>
    </Button>
  );
};

export default CreateInvitationButton;
