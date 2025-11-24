import type { TaskPriorityDTO } from './../types/prisma/DTO/priority';

export const TASK_PRIORITY_LABELS: Record<TaskPriorityDTO, string> = {
  HIGH: 'Высокий',
  MEDIUM: 'Средний',
  LOW: 'Низкий',
  URGENT: 'Срочный',
};

export const TASK_PRIORITY_KEYS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  URGENT: 'URGENT',
} as const;

export const TASK_PRIORITY_ARRAY = [
  TASK_PRIORITY_KEYS.HIGH,
  TASK_PRIORITY_KEYS.MEDIUM,
  TASK_PRIORITY_KEYS.LOW,
  TASK_PRIORITY_KEYS.URGENT,
];
