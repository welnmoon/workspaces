                      
import type { Prisma, Task, TaskPriority, TaskStatus } from '@prisma/client';

export type TaskCreateDTO = {
  title: string;
  description?: string | null;
  projectId: number;
  dueDate?: Date | string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
};

                                    
export type TaskBaseDTO = Omit<Task, 'createdAt' | 'updatedAt'>;

                                      
export type TaskSelectDTO = Pick<TaskBaseDTO, 'id' | 'title' | 'status'>;

                                             
export type TaskListDTO = TaskBaseDTO;

                                                
export type TaskFullDTO = Task;

                                                               
export type TaskUpdateDTO = Partial<TaskBaseDTO>;

export type TaskWithAssigneeDTO = Prisma.TaskGetPayload<{
  include: {
    assignee: true;
  };
}>;

export type TaskPriorityDTO = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
