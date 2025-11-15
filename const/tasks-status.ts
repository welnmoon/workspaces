import { TaskStatus } from '@prisma/client';

export const STATUS_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: TaskStatus.TODO, title: 'TODO' },
  { id: TaskStatus.IN_PROGRESS, title: 'В работе' },
  { id: TaskStatus.DONE, title: 'Готово' },
  { id: TaskStatus.BLOCKED, title: 'Заблокировано' },
];
