import TaskComponent from '@/components/forms/task/task';
import NotFound from '@/components/not-found';
import prisma from '@/lib/prisma';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';
import { notFound } from 'next/navigation';

const TaskPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string; taskId: string };
}) => {
  const task = await TaskService.getTaskById(Number(params.taskId));

  if (!task) {
    return <NotFound text="Task" />;
  }

  const projectWithWorkspace = await ProjectService.getProjectByIdWithWorkspace(
    Number(params.projectId)
  );

  const assignee = await prisma.user.findUnique({
    where: {
      id: String(task.assigneeId),
    },
  });

  return (
    <TaskComponent
      task={task}
      projectName={projectWithWorkspace?.name || params.projectId}
      projectId={projectWithWorkspace?.id || Number(params.projectId)}
      workspaceId={
        projectWithWorkspace?.workspace.id || Number(params.workspaceId)
      }
      workspaceName={projectWithWorkspace?.workspace.name || ''}
      assignee={assignee}
    />
  );
};

export default TaskPage;
