// ...existing code...
import type { Prisma, Task, TaskPriority, TaskStatus } from '@prisma/client';

/**
 * DTOs для Task
 *
 * Примечание:
 * - TaskCreateDTO задан явно — поля создания обычно отличаются по обязательности от полной модели.
 * - TaskSelect/List/Full — через Pick привязаны к модели Prisma, чтобы гарантировать соответствие полей.
 * - TaskUpdateDTO — Partial<Pick<...>> для частичного обновления.
 * - TaskWithoutDatesDTO — Omit для удаления служебных полей.
 */

/**
 * DTOs для Task
 *
 * Примечание:
 * - TaskCreateDTO задан явно, так как поля создания отличаются от полной модели
 * - Используем Omit для исключения служебных полей
 * - TaskUpdateDTO использует Partial для опциональности всех полей
 */

export type TaskCreateDTO = {
  title: string;
  description?: string | null;
  projectId: number;
  dueDate?: Date | string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
};

// Базовый тип для списков и выборок
export type TaskBaseDTO = Omit<Task, 'createdAt' | 'updatedAt'>;

// Минимальный набор полей для селекта
export type TaskSelectDTO = Pick<TaskBaseDTO, 'id' | 'title' | 'status'>;

// Список задач (без дат создания/обновления)
export type TaskListDTO = TaskBaseDTO;

// Полная информация о задаче (включая все поля)
export type TaskFullDTO = Task;

// Частичное обновление (все поля опциональны, кроме системных)
export type TaskUpdateDTO = Partial<TaskBaseDTO>;

export type TaskWithAssigneeDTO = Prisma.TaskGetPayload<{
  include: {
    assignee: true;
  };
}>;
