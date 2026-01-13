import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';

import type { UserDTO } from '../../../types/DTO/user';
import { useNavigate } from 'react-router-dom';

const UserEditDropdownMenu = ({ user }: { user: UserDTO }) => {
  const navigate = useNavigate();
  const useDropdownItems = [
    {
      title: 'Edit',
      onClick: (userId: string) => {
        navigate(`/users/${userId}`);
      },
    },
    {
      title: 'Remove',
      onClick: () => {},
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ padding: '10px' }}
        className="w-40 h-full p-3 card"
      >
        {useDropdownItems.map((item) => (
          <DropdownMenuItem
            style={{ padding: '2px 6px' }}
            className="px-2 py-1"
            onClick={() => item.onClick(user.id)}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserEditDropdownMenu;
