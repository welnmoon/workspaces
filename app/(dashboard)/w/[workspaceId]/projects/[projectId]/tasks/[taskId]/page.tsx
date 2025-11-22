import TaskComponent from '@/components/forms/task/task';
import NotFound from '@/components/not-found';
import prisma from '@/lib/prisma';
import { ProjectService } from '@/lib/services/project';
import { TaskService } from '@/lib/services/tasks';

const TaskPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string; taskId: string }>;
}) => {
  const taskId = Number((await params).taskId);
  const projectId = Number((await params).projectId);
  const workspaceId = Number((await params).workspaceId);
  const task = await TaskService.getTaskById(Number((await params).taskId));

  if (!task) {
    return <NotFound text="Task" />;
  }

  const projectWithWorkspace = await ProjectService.getProjectByIdWithWorkspace(
    Number((await params).projectId)
  );

  const assignee = await prisma.user.findUnique({
    where: {
      id: String(task.assigneeId),
    },
  });

  return (
    <TaskComponent
      task={task}
      projectName={projectWithWorkspace?.name || String(projectId)}
      projectId={projectWithWorkspace?.id || projectId}
      workspaceId={projectWithWorkspace?.workspace.id || workspaceId}
      workspaceName={projectWithWorkspace?.workspace.name || ''}
      assignee={assignee}
    />
  );
};

export default TaskPage;
