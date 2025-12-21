'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectTabsList from './project-tasks-list';
import ProjectTasksBoard from '../project-tasks-board';
import type { TaskWithAssigneeDTO } from '@/types/prisma/DTO/tasks';
import { createTasksBoardOnDragEnd } from '@/helpers/task/on-drag-end';
import { tasksFilterByStatus } from '@/helpers/task/tasks-filter-by-status';
import useMediaQuery from '@/hooks/use-media-query';
import { useTasksWithAssignee } from '@/hooks/tasks/use-tasks-with-assignee';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Kanban, List, Trash } from 'lucide-react';
import type { TaskStats } from '@/types/service/task-stats';
import ProjectTasksStats from '../project-tasks-stats';
import { IoStatsChart } from 'react-icons/io5';
import { useDeleteTasksBulk } from '@/hooks/tasks/use-delete-tasks-bulk';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { SprintWithTasksWithAssigneesDTO } from '@/types/prisma/DTO/sprint';
import BacklogAccordion from './backlog-accordion';
import { useSprintCreate } from '@/hooks/sprint/use-sprint-create';
import { CreateSprintSchema } from '@/schemas/sprint/create-sprint-schema';
import CreateTaskDialog from '@/components/dialogs/create-task-dialog';
import { useMembers } from '@/hooks/members/use-members';
import MainBtn from '@/components/buttons/main-btn';
import { FaPenToSquare } from 'react-icons/fa6';
import { useProjectLock } from '../context/project-lock-context';

type ProjectTabsProps = {
  sprints: SprintWithTasksWithAssigneesDTO[];
  tasks: TaskWithAssigneeDTO[];
  workspaceId: number;
  projectId: number;
  allTaskStats: TaskStats;
  projectEnd: boolean;
  memberTaskStats: TaskStats;
};

const doneCounts = [10, 25, 50];

const ProjectTabs = ({
  sprints,
  tasks,
  workspaceId,
  projectId,
  allTaskStats,
  memberTaskStats,
  projectEnd,
}: ProjectTabsProps) => {
  const [createSprint, setCreateSprint] = useState(false);
  const [openSprintIds, setOpenSprintIds] = useState<string[]>([]);
  const projectStatus = useProjectLock();

  // members for accordions and for create task form
  const { data: members } = useMembers(workspaceId!, projectId!);

  const queryClient = useQueryClient();
  const queryKey = ['tasks', projectId, workspaceId];

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const droppableDirection = isDesktop ? 'vertical' : 'horizontal';

  //----------------------Tasks--------------------------//
  const [allTasks, setAllTasks] = useState<TaskWithAssigneeDTO[]>(tasks);
  const [boardTasks, setBoardTasks] = useState<TaskWithAssigneeDTO[]>([]);
  const [doneTasksCount, setDoneTasksCount] = useState<string>(
    String(doneCounts[0])
  );

  //----------------------Delete Tasks--------------------------//
  const [selectedIds, setSelectedIds] = useState(new Set<number>());

  const { mutate: deleteTasks, isPending: isDeleteTasksPending } =
    useDeleteTasksBulk(workspaceId, projectId, setAllTasks, queryKey);

  const handleDeleteTasks = () => {
    deleteTasks(selectedIds, {
      onSuccess: () => {
        toast.success('Задачи успешно удалены');
        setSelectedIds(new Set());
      },
      onError: (e) => {
        toast.error(e.message ?? 'Произошла ошибка при удалении задач');
      },
    });
  };

  const syncCache = (updatedTasks: TaskWithAssigneeDTO[]) => {
    setAllTasks((prev) => {
      const tasksMap = new Map(prev.map((t) => [t.id, t]));
      for (const t of updatedTasks) {
        tasksMap.set(t.id, t);
      }

      const newTasksArray = Array.from(tasksMap.values());
      queryClient.setQueryData(queryKey, newTasksArray);

      return newTasksArray;
    });
  };

  const { data: optimisticTasks, isLoading: isTasksLoading } =
    useTasksWithAssignee(projectId, workspaceId, tasks);

  //----------------------Filter Tasks--------------------------//
  useEffect(() => {
    if (optimisticTasks && Array.isArray(optimisticTasks)) {
      setAllTasks(optimisticTasks);
    }
  }, [optimisticTasks]);

  const backlogTasks = allTasks.filter((t) => t.sprintId === null);

  const listTasks = allTasks;

  //---------------------Sprint------------------------------------------//

  const { mutate: onCreateSprint, isPending: isCreateSprintPending } =
    useSprintCreate(workspaceId, projectId);

  const onCreateSprintHandler = (payload: CreateSprintSchema) => {
    onCreateSprint(payload, {
      onSuccess: () => {
        setCreateSprint(false);
      },
      onError: (e) => {
        toast.error(e.message ?? 'Произошла ошибка при создании спринта');
      },
    });
  };

  //----------------------Tasks Board - Kanban--------------------------//
  useEffect(() => {
    setBoardTasks(allTasks.filter((t) => t.sprintId !== null));
  }, [allTasks]);

  const tasksByStatus = tasksFilterByStatus({ tasks: boardTasks });
  // обновляем кэш с помощью sync
  const onDragEnd = createTasksBoardOnDragEnd(setBoardTasks, syncCache);

  const totalDone = allTaskStats?.tasksDoneCount ?? 0;
  const shown = Number(doneTasksCount);
  const remainTasksCount = totalDone - shown > 0 ? totalDone - shown : 0;

  const [activeTab, setActiveTab] = useState<
    'list' | 'kanban' | 'stats' | 'backlog'
  >('list');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) =>
        setActiveTab(v as 'list' | 'kanban' | 'stats' | 'backlog')
      }
      className="w-full space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3 sticky top-20 z-10 bg-white p-2 rounded-xl shadow ">
        <TabsList className="inline-flex flex-wrap gap-1">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Список</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            <span>Канбан</span>
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center gap-2">
            <IoStatsChart className="h-4 w-4" />
            <span>Бэклог</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <IoStatsChart className="h-4 w-4" />
            <span>Статистика</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="relative">
              <Button
                disabled={isDeleteTasksPending}
                className={cn(
                  'text-red-500 bg-white hover:bg-red-50 w-30 text-left',
                  isDeleteTasksPending && 'text-zinc-500 cursor-none'
                )}
                onClick={() => handleDeleteTasks()}
              >
                <Trash size={20} />

                {isDeleteTasksPending ? (
                  <Spinner className="animate-spin " />
                ) : (
                  'Удалить'
                )}
              </Button>
            </div>
          )}
        </div>

        <CreateTaskDialog
          members={members!}
          projectId={projectId}
          workspaceId={workspaceId}
        />
        {activeTab === 'list' && (
          <MainBtn
            onClick={() => setCreateSprint((prev) => !prev)}
            text={createSprint ? 'Отменить' : 'Создать спринт'}
            icon={<FaPenToSquare className="text-white" size={20} />}
          />
        )}
        {activeTab === 'list' && openSprintIds.length > 0 && (
          <Button
            variant="outline"
            className="h-9 px-3 text-xs"
            onClick={() => setOpenSprintIds([])}
          >
            Свернуть все спринты
          </Button>
        )}
      </div>

      <TabsContent value="list" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-zinc-100">
            Всего задач: <span className="font-medium">{listTasks.length}</span>
          </div>
        </div>

        <ProjectTabsList
          sprints={sprints}
          createSprint={createSprint}
          // sprintsId={sprintsId}
          backlogTasks={backlogTasks}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
          onCreateSprint={onCreateSprintHandler}
          onCreateSprintPending={isCreateSprintPending}
          openSprintIds={openSprintIds}
          setOpenSprintIds={setOpenSprintIds}
        />
      </TabsContent>

      <TabsContent value="kanban" className="mt-2">
        <ProjectTasksBoard
          filteredTasks={boardTasks}
          tasksByStatus={tasksByStatus}
          droppableDirection={droppableDirection}
          onDragEnd={onDragEnd}
          workspaceId={workspaceId}
          projectId={projectId}
          doneTasksCount={doneTasksCount}
          setDoneTasksCount={setDoneTasksCount}
          counts={doneCounts}
          remainTasksCount={remainTasksCount}
        />
      </TabsContent>
      <TabsContent value="stats" className="mt-2">
        <ProjectTasksStats
          workspaceId={workspaceId}
          projectId={projectId}
          allTaskStats={allTaskStats}
          memberTaskStats={memberTaskStats}
        />
      </TabsContent>

      <TabsContent value="backlog" className="mt-2">
        {/* <ProjectTabsBacklog
          backlogTasks={backlogTasks}
          hasAnyFilter={hasAnyFilter}
          hasStatusFilter={hasStatusFilter}
          hasDateFilter={hasDateFilter}
          status={status}
          onStatusChange={changeStatus}
          isStatusPending={isPending}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isDeleteTasksPending}
        /> */}
        <BacklogAccordion
          tasks={backlogTasks}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isDeleteTasksPending={isTasksLoading}
          isTasksLoading={isTasksLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
