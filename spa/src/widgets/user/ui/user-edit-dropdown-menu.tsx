import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserDeleteDialog from '../../../features/user-delete/ui/user-delete-dialog';
import type { UserDTO } from '../../../shared/types/DTO/user';

const UserEditDropdownMenu = ({ user }: { user: UserDTO }) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
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
      onClick: (userId: string) => setDeletingUserId(userId),
    },
  ];

  return (
    <>
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
      {deletingUserId && (
        <UserDeleteDialog
          open={Boolean(deletingUserId)}
          onClose={() => setDeletingUserId(null)}
          userId={deletingUserId}
        />
      )}
    </>
  );
};

export default UserEditDropdownMenu;
