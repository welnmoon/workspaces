export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'] as const;

export type TaskStatusDTO = (typeof TASK_STATUSES)[number];

export const STATUS_COLUMNS: { id: TaskStatusDTO; title: string }[] = [
  { id: 'TODO', title: 'К выполнению' },
  { id: 'IN_PROGRESS', title: 'В работе' },
  { id: 'DONE', title: 'Готово' },
  { id: 'BLOCKED', title: 'Заблокировано' },
];
