import { DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
import { reorder } from './reorder';
import { apiRoutes } from '@/lib/routes/api-routes';
import toast from 'react-hot-toast';
import { TaskFullDTO, TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';

export function createTasksBoardOnDragEnd(
  setBoardTasks: Dispatch<SetStateAction<TaskWithAssigneeDTO[]>>
) {
  return (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Если бросили за пределы любой колонки → ничего не делаем
    if (!destination) return;

    // Если перетащили в то же самое место → ничего не меняем
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    // Для отката
    let prevSnapshot: TaskWithAssigneeDTO[] = [];

    // Обновляем boardTasks — локальное состояние задач (оптимистично)
    setBoardTasks((prev) => {
      prevSnapshot = prev;
      // ID перетаскиваемой задачи
      const taskId = Number(draggableId);

      // Статус, из которого тащим (например, "TODO")
      const sourceStatus = source.droppableId as TaskStatus;

      // Статус, в который бросаем (например, "IN_PROGRESS")
      const destStatus = destination.droppableId as TaskStatus;

      // Находим саму задачу в массиве
      const movingTask = prev.find((t) => t.id === taskId);
      if (!movingTask) return prev; // если такого таска нет → ничего не меняем

      // ─────────────────────────────────────────────
      // 1) ПЕРЕСТАНОВКА ВНУТРИ ОДНОЙ КОЛОНКИ
      // ─────────────────────────────────────────────
      if (sourceStatus === destStatus) {
        /**
         * Берём все задачи в этой колонке (например, все TODO)
         */
        const tasksInStatus = prev.filter((t) => t.status === sourceStatus);

        /**
         * Меняем порядок задачи внутри массива:
         * - source.index  — индекс, откуда тащили
         * - destination.index — индекс, куда бросили
         */
        const reordered = reorder(
          tasksInStatus,
          source.index,
          destination.index
        );

        /**
         * Остальные задачи (из других статусов) должны остаться как есть
         */
        const others = prev.filter((t) => t.status !== sourceStatus);

        /**
         * Возвращаем обновлённый массив:
         * - все остальные задачи
         * - и переставленные задачи из этой колонки
         */
        return [...others, ...reordered];
      }

      // ─────────────────────────────────────────────
      // 2) ПЕРЕМЕЩЕНИЕ МЕЖДУ РАЗНЫМИ КОЛОНКАМИ
      // ─────────────────────────────────────────────

      // Все задачи в колонке, из которой вытаскиваем
      const tasksInSource = prev.filter((t) => t.status === sourceStatus);

      // Все задачи в колонке, куда вставляем
      const tasksInDest = prev.filter((t) => t.status === destStatus);

      // Копии массивов, чтобы не мутировать исходные
      const fromList = Array.from(tasksInSource);
      const toList = Array.from(tasksInDest);

      /**
       * 1) Удаляем задачу из старой колонки по её индексу.
       * removed — сама задача.
       */
      const [removed] = fromList.splice(source.index, 1);

      /**
       * 2) Создаём копию задачи, но со статусом,
       * соответствующим колонке, куда перетащили.
       */
      const movedUpdated: TaskWithAssigneeDTO = {
        ...removed,
        status: destStatus,
      };

      /**
       * 3) Вставляем обновлённую задачу в новую колонку
       * на нужную позицию (destination.index)
       */
      toList.splice(destination.index, 0, movedUpdated);

      /**
       * 4) Все остальные задачи, которые не относятся
       * ни к sourceStatus, ни к destStatus
       */
      const others = prev.filter(
        (t) => t.status !== sourceStatus && t.status !== destStatus
      );

      /**
       * 5) Возвращаем новый массив задач:
       * - задачи других статусов
       * - обновлённая колонка «откуда»
       * - обновлённая колонка «куда»
       */
      return [...others, ...fromList, ...toList];
    });

    (async () => {
      try {
        const res = await fetch(apiRoutes.updateTaskStatus(taskId), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: destStatus }),
        });

        if (!res.ok) {
          toast.error('Не удалось обновить статус задачи');
          console.error('Failed to update task status', await res.json());
          setBoardTasks(prevSnapshot);
          return;
          // Добавить откат
        }
      } catch (e) {
        toast.error('Не удалось обновить статус задачи');
        setBoardTasks(prevSnapshot);
        console.error('Failed to update task status', e);
      }
    })();
  };
}
