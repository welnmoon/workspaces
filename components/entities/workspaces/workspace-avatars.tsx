import { cn } from '@/lib/utils';
import { CreateWorkspaceFormValues } from '@/schemas/workspace/create-workspace-form-schema';
import { useFormContext } from 'react-hook-form';

const workspaceAvatarImages = [
  { id: 1, url: '/images/workspaces/avatar/avatar_1.jpeg' },
  { id: 2, url: '/images/workspaces/avatar/avatar_2.jpeg' },
  { id: 3, url: '/images/workspaces/avatar/avatar_3.jpeg' },
  { id: 4, url: '/images/workspaces/avatar/avatar_4.jpeg' },
  { id: 5, url: '/images/workspaces/avatar/avatar_5.jpeg' },
  { id: 6, url: '/images/workspaces/avatar/avatar_6.jpeg' },
  //   { id: 1, url: '/images/workspaces/avatar/avatar_1.jpeg' },
  //   { id: 2, url: '/images/workspaces/avatar/avatar_2.jpeg' },
  //   { id: 3, url: '/images/workspaces/avatar/avatar_3.jpeg' },
  //   { id: 4, url: '/images/workspaces/avatar/avatar_4.jpeg' },
  //   { id: 5, url: '/images/workspaces/avatar/avatar_5.jpeg' },
  //   { id: 6, url: '/images/workspaces/avatar/avatar_6.jpeg' },
  //   { id: 5, url: '/images/workspaces/avatar/avatar_5.jpeg' },
  //   { id: 6, url: '/images/workspaces/avatar/avatar_6.jpeg' },
  //   { id: 1, url: '/images/workspaces/avatar/avatar_1.jpeg' },
  //   { id: 2, url: '/images/workspaces/avatar/avatar_2.jpeg' },
  //   { id: 3, url: '/images/workspaces/avatar/avatar_3.jpeg' },
  //   { id: 4, url: '/images/workspaces/avatar/avatar_4.jpeg' },
  //   { id: 5, url: '/images/workspaces/avatar/avatar_5.jpeg' },
  //   { id: 6, url: '/images/workspaces/avatar/avatar_6.jpeg' },
  // {id: 7, url: "/images/workspaces/avatar/avatar_7.jpeg"},
  // {id: 8, url: "/images/workspaces/avatar/avatar_8.jpeg"},
  // {id: 9, url: "/images/workspaces/avatar/avatar_9.jpeg"},
  // {id: 10, url: "/images/workspaces/avatar/avatar_10.jpeg"},
];

const WorkspaceAvatars = ({ className }: { className?: string }) => {
  const { setValue, watch } = useFormContext<CreateWorkspaceFormValues>();
  const selected = watch('avatarUrl');
  const handleSelect = (url: string) => {
    setValue('avatarUrl', url);
  };
  return (
    <div className={cn(`flex-1 min-h-0 h-full`, className)}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 overflow-y-auto h-full">
        {workspaceAvatarImages.map((a) => {
          const isActive = selected === a.url;
          return (
            <button
              type="button"
              className={`w-20 h-20 rounded-lg overflow-hidden border transition
              ${isActive ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
              key={a.id}
              onClick={() => handleSelect(a.url)}
            >
              <img
                src={a.url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceAvatars;
