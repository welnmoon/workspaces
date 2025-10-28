import TaskComponent from '@/components/forms/task/task';
import NotFound from '@/components/not-found';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

const TaskPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string; taskId: string };
}) => {
  const task = await prisma.task.findUnique({
    where: {
      id: Number(params.taskId),
      projectId: Number(params.projectId),
    },
    include: {
      project: true,
      assignee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    return <NotFound text="Task" />;
  }

  const projectName = await prisma.project.findUnique({
    where: {
      id: Number(params.projectId),
    },
    select: {
      name: true,
      id: true,
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const assignee = await prisma.user.findUnique({
    where: {
      id: String(task.assigneeId),
    },
  });

  return (
    <TaskComponent
      task={task}
      projectName={projectName?.name || params.projectId}
      projectId={projectName?.id || Number(params.projectId)}
      workspaceId={projectName?.workspace.id || Number(params.workspaceId)}
      workspaceName={projectName?.workspace.name || ''}
      assignee={assignee}
    />
  );
};

export default TaskPage;
