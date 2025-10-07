'use server';

export default async function createTask({
  params,
  title,
  description,
  dueDate,
}: {
  params: { projectId: string; workspaceId: string }; // сразу получим workspace id тоже
  title: string;
  description: string;
  dueDate: string;
}) {
    
}
