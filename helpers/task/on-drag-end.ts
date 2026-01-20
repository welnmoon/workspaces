import { DropResult } from '@hello-pangea/dnd';
import { Dispatch, SetStateAction } from 'react';
import { reorder } from './reorder';
import toast from 'react-hot-toast';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { TaskStatusDTO } from '@/const/tasks-status';
import { updateTaskStatusRequest } from '@/hooks/tasks/use-task-status-change';

export function createTasksBoardOnDragEnd(
  setBoardTasks: Dispatch<SetStateAction<TaskWithAssigneeDTO[]>>,
  syncCache?: (tasks: TaskWithAssigneeDTO[]) => void
) {
  return (result: DropResult) => {
    const { source, destination, draggableId } = result;

                                                               
    if (!destination) return;

                                                             
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const sourceStatus = source.droppableId as TaskStatusDTO;
    const destStatus = destination.droppableId as TaskStatusDTO;

                 
    let prevSnapshot: TaskWithAssigneeDTO[] = [];

                                                                      
    let nextTasks: TaskWithAssigneeDTO[] = [];

    setBoardTasks((prev) => {
      prevSnapshot = prev;
                                  
      const taskId = Number(draggableId);

                                                     
      const sourceStatus = source.droppableId as TaskStatusDTO;

                                                            
      const destStatus = destination.droppableId as TaskStatusDTO;

                                      
      const movingTask = prev.find((t) => t.id === taskId);
      if (!movingTask) return prev;                                            

                                                      
                                             
                                                      
      if (sourceStatus === destStatus) {
           
                                                               
           
        const tasksInStatus = prev.filter((t) => t.status === sourceStatus);

           
                                                
                                                  
                                                     
           
        const reordered = reorder(
          tasksInStatus,
          source.index,
          destination.index
        );

           
                                                                         
           
        const others = prev.filter((t) => t.status !== sourceStatus);

           
                                         
                                 
                                                    
           
        nextTasks = [...others, ...reordered];
        return nextTasks;
      }

                                                      
                                               
                                                      

                                                     
      const tasksInSource = prev.filter((t) => t.status === sourceStatus);

                                             
      const tasksInDest = prev.filter((t) => t.status === destStatus);

                                                     
      const fromList = Array.from(tasksInSource);
      const toList = Array.from(tasksInDest);

         
                                                           
                               
         
      const [removed] = fromList.splice(source.index, 1);

         
                                                 
                                                  
         
      const movedUpdated: TaskWithAssigneeDTO = {
        ...removed,
        status: destStatus,
      };

         
                                                        
                                              
         
      toList.splice(destination.index, 0, movedUpdated);

         
                                                      
                                           
         
      const others = prev.filter(
        (t) => t.status !== sourceStatus && t.status !== destStatus
      );

         
                                          
                                 
                                       
                                     
         
      nextTasks = [...others, ...fromList, ...toList];
      return nextTasks;
    });

    if (syncCache && nextTasks.length > 0) {
      syncCache(nextTasks);
    }

    (async () => {
      try {
        await updateTaskStatusRequest(taskId, destStatus);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'Не удалось обновить статус задачи'
        );
        setBoardTasks(prevSnapshot);
        if (syncCache) syncCache(prevSnapshot);
        console.error('Failed to update task status', e);
      }
    })();
  };
}
