'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { apiRoutes } from '@/lib/routes/api-routes';
import { cn } from '@/lib/utils';

type DeleteProjectActionProps = {
  workspaceId: number;
  projectId: number;
  className?: string;
  children?: React.ReactNode;
};

const DeleteProjectAction = ({
  workspaceId,
  projectId,
  className,
  children,
}: DeleteProjectActionProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(apiRoutes.someProject(workspaceId, projectId), {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Не удалось удалить проект');
      }

      toast.success('Проект удалён');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось удалить проект'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        'w-full flex items-center justify-start gap-2 text-left text-destructive',
        className
      )}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span>{children ?? 'Удалить'}</span>
    </Button>
  );
};

export { DeleteProjectAction };
