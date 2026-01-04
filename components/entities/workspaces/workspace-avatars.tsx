import { cn } from '@/lib/utils';
import { CreateWorkspaceFormValues } from '@/schemas/workspace/create-workspace-form-schema';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const workspaceAvatarImages = [
  { id: 1, url: '/images/workspaces/avatar/avatar_1.jpeg' },
  { id: 2, url: '/images/workspaces/avatar/avatar_2.jpeg' },
  { id: 3, url: '/images/workspaces/avatar/avatar_3.jpeg' },
  { id: 4, url: '/images/workspaces/avatar/avatar_4.jpeg' },
  { id: 5, url: '/images/workspaces/avatar/avatar_5.jpeg' },
  { id: 6, url: '/images/workspaces/avatar/avatar_6.jpeg' },
  { id: 7, url: '/images/workspaces/avatar/avatar_7.jpeg' },
  { id: 8, url: '/images/workspaces/avatar/avatar_8.jpeg' },
  { id: 9, url: '/images/workspaces/avatar/avatar_9.jpeg' },
  { id: 10, url: '/images/workspaces/avatar/avatar_10.jpeg' },
  { id: 11, url: '/images/workspaces/avatar/avatar_11.jpeg' },
  { id: 12, url: '/images/workspaces/avatar/avatar_12.jpeg' },
  { id: 13, url: '/images/workspaces/avatar/avatar_13.jpeg' },
  { id: 14, url: '/images/workspaces/avatar/avatar_14.jpeg' },
];

const WorkspaceAvatars = ({ className }: { className?: string }) => {
  const { setValue, watch } = useFormContext<CreateWorkspaceFormValues>();
  const selected = watch('avatarUrl');

  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});

  const handleSelect = (url: string) => {
    setValue('avatarUrl', url);
  };

  const handleImageLoaded = (id: number) => {
    setLoadedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className={cn('flex-1 min-h-0 h-full', className)}>
      <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
        {workspaceAvatarImages.map((a) => {
          const isActive = selected === a.url;
          const isLoaded = loadedMap[a.id];

          return (
            <button
              type="button"
              key={a.id}
              onClick={() => handleSelect(a.url)}
              className={cn(
                'w-20 h-20 rounded-lg overflow-hidden border transition',
                isActive && 'ring-2 ring-blue-500 border-blue-500'
              )}
            >
              <div className="relative w-full h-full">
                {!isLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}

                <Image
                  src={a.url}
                  alt="avatar"
                  fill
                  sizes="80px"
                  onLoadingComplete={() => handleImageLoaded(a.id)}
                  onError={() => handleImageLoaded(a.id)} // чтобы не висел вечный скелетон при ошибке
                  className={cn(
                    'w-full h-full object-cover transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceAvatars;
