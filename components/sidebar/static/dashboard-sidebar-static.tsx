'use client';
import WorkspaceSelect from '@/components/ui/select/workspace-select';
import WorknestLogotype from '../../ui/worknest-logotype';
import { useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';

// Этот компонент показывается только на больших экранах
const DashboardSidebarStatic = ({
  workspaces,
}: {
  workspaces: WorkspaceListDTO[];
}) => {
  // const [workspaces, setWorkspaces] = useState<WorkspaceListDTO[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );

  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const getWorkspaces = async () => {
  //     try {
  //       setLoading(true);
  //       const workspaces = await fetchWorkspaces();
  //       setWorkspaces(workspaces);
  //     } catch (e) {
  //       console.error('Error fetching workspaces', e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getWorkspaces();
  // }, []);

  return (
    <aside className="hidden md:block md:w-60 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4">
      <WorknestLogotype />
      <div className="">
        <WorkspaceSelect
          workspaces={workspaces}
          onChange={setSelectedWorkspace}
        />
      </div>
    </aside>
  );
};

export default DashboardSidebarStatic;
