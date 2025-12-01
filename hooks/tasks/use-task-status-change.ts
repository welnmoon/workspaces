import { TaskStatusDTO } from '@/const/tasks-status';
import { apiRoutes } from '@/lib/routes/api-routes';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

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
    } catch {}
    throw new Error(message);
  }
};

type ChangeStatusArgs = {
  taskId: number;
  destStatus: TaskStatusDTO;
};

type UseTaskStatusChangeOptions = {
  setBoardTasks: Dispatch<SetStateAction<TaskWithAssigneeDTO[]>>;
  queryKey: QueryKey;
};

export const useTaskStatusChange = ({
  setBoardTasks,
  queryKey,
}: UseTaskStatusChangeOptions) => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ taskId, destStatus }: ChangeStatusArgs) =>
      updateTaskStatusRequest(taskId, destStatus),

    onMutate: async ({ taskId, destStatus }) => {
      await qc.cancelQueries({ queryKey });

      const prevCache =
        (qc.getQueryData<TaskWithAssigneeDTO[]>(queryKey) as
          | TaskWithAssigneeDTO[]
          | undefined) ?? [];
      let prevSnapshot: TaskWithAssigneeDTO[] = [];
      let nextTasks: TaskWithAssigneeDTO[] = [];

      setBoardTasks((prev) => {
        prevSnapshot = prev;
        nextTasks = prev.map((t) =>
          t.id === taskId ? { ...t, status: destStatus } : t
        );
        return nextTasks;
      });

      if (nextTasks.length > 0) {
        qc.setQueryData(queryKey, nextTasks);
      }

      return { prevSnapshot, prevCache };
    },

    onError: (error, _vars, context) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось обновить статус задачи';

      toast.error(message);

      if (context?.prevSnapshot) {
        setBoardTasks(context.prevSnapshot);
      }
      if (context?.prevCache) {
        qc.setQueryData(queryKey, context.prevCache);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
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
