import { TaskStatusDTO } from '@/const/tasks-status';
import { apiRoutes } from '@/lib/routes/api-routes';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const updateTaskStatusRequest = async (
  taskId: number,
  destStatus: TaskStatusDTO
) => {
  const res = await fetch(apiRoutes.updateTaskStatus(taskId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: destStatus }),
  });

  if (!res.ok) {
    let message = 'Не удалось обновить статус задачи';
    try {
      const payload = await res.json();
      message = payload?.message || message;
    } catch {
    }
    throw new Error(message);
  }
};

type ChangeStatusArgs = {
  taskId: number;
  destStatus: TaskStatusDTO;
};

type UseTaskStatusChangeOptions = {
  setBoardTasks: Dispatch<SetStateAction<TaskWithAssigneeDTO[]>>;
  syncCache?: (tasks: TaskWithAssigneeDTO[]) => void;
};

export const useTaskStatusChange = ({
  setBoardTasks,
  syncCache,
}: UseTaskStatusChangeOptions) => {
  const mutation = useMutation({
    mutationFn: ({ taskId, destStatus }: ChangeStatusArgs) =>
      updateTaskStatusRequest(taskId, destStatus),

    onMutate: async ({ taskId, destStatus }) => {
      let prevSnapshot: TaskWithAssigneeDTO[] = [];
      let nextTasks: TaskWithAssigneeDTO[] = [];

      setBoardTasks((prev) => {
        prevSnapshot = prev;
        nextTasks = prev.map((t) =>
          t.id === taskId ? { ...t, status: destStatus } : t
        );
        return nextTasks;
      });

      if (syncCache && nextTasks.length > 0) {
        syncCache(nextTasks);
      }

      return { prevSnapshot };
    },

    onError: (error, _vars, context) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось обновить статус задачи';

      toast.error(message);

      if (context?.prevSnapshot) {
        setBoardTasks(context.prevSnapshot);
        if (syncCache) syncCache(context.prevSnapshot);
      }
    },
  });

  const changeStatus = (taskId: number, destStatus: TaskStatusDTO) => {
    mutation.mutate({ taskId, destStatus });
  };

  return {
    changeStatus,
    isPending: mutation.isPending,
  };
};
