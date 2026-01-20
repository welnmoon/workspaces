'use client';

import { Sidebar, SidebarRail } from '@/components/ui/sidebar';

import WorkspaceSelect from '@/components/ui/select/workspace-select';
import { useEffect, useState } from 'react';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import ProjectSelect from '@/components/ui/select/project-select';
import { usePathname } from 'next/navigation';
import TaskSelect from '@/components/ui/select/task-select';

import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { useProjects } from '@/hooks/project/use-projects';
import { useTasks } from '@/hooks/tasks/use-tasks';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { RenderNavigation } from '../sidebar-nav';
import { getIdsFromPathname } from '@/helpers/get-ids-from-path';
import { clientRoutes } from '@/lib/routes/client-routes';

                                                        
const DashboardSidebarDynamic = ({
  workspaces,
}: {
  workspaces: WorkspaceListDTO[];
}) => {
                                              
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const {
    data: projects = [],
    isLoading: pLoading,
                       
                        
  } = useProjects(
    selectedWorkspaceId ? Number(selectedWorkspaceId) : undefined
  );

  const {
    data: tasks = [],
    isLoading: tLoading,
                       
                        
  } = useTasks(
    selectedProjectId ? Number(selectedProjectId) : undefined,
    selectedWorkspaceId ? Number(selectedWorkspaceId) : undefined
  );
                                          
                                                                    
                                                           

                                                
                                                     
                                                           

                   
                      
                                  
                         
                
        

                         

                                                 
                           
                         
                                            
                               

                
                      
                                
                      
                                                                
                
        

                                 
                              
                                 
                     
                                            
                                        
           
                          
                         
                                                        
             
                                                 
        
                                                  

                                             
  const pathname = usePathname();
  useEffect(() => {
    const { projectId: projectIdFromPath, workspaceId: workspaceIdFromPath } =
      getIdsFromPathname(pathname);

                                  
    setSelectedWorkspaceId(workspaceIdFromPath);
    setSelectedProjectId(projectIdFromPath);
  }, [pathname]);

                                              
  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspaceId(Number(value));
    setSelectedProjectId(null);
    setSelectedTaskId(null);
                       
                    
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(Number(value));
    setSelectedTaskId(null);
  };

  return (
    <>
      <Sidebar>
        <aside
          className="flex flex-col w-80 md:w-75 lg:w-62 xl:w-64 bg-zinc-50 border-r h-screen px-4 py-4 mr-4
    sticky top-0"
        >
          <div className="mb-6">
            <Link href={clientRoutes.workspacesPage()} aria-label="К рабочим пространствам">
              <WorkspaceLogo />
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <WorkspaceSelect
              label="Рабочее пространство"
              workspaces={workspaces}
              onChange={handleWorkspaceChange}
              value={
                selectedWorkspaceId !== null ? String(selectedWorkspaceId) : ''
              }
              placeholder="Выберите пространство"
            />

            {selectedWorkspaceId && (
              <ProjectSelect
                label="Проект"
                onChange={handleProjectChange}
                value={
                  selectedProjectId !== null ? String(selectedProjectId) : ''
                }
                projects={projects}
                loading={pLoading}
                placeholder="Выберите проект"
                workspaceId={String(selectedWorkspaceId)}
              />
            )}

            {selectedWorkspaceId && selectedProjectId && (
              <TaskSelect
                label="Задача"
                onChange={(value) => setSelectedTaskId(Number(value))}
                placeholder="Выберите задачу"
                projectId={String(selectedProjectId)}
                tasks={tasks}
                workspaceId={selectedTaskId ? String(selectedWorkspaceId) : ''}
                value={String(selectedTaskId)}
                loading={tLoading}
              />
            )}
          </div>

          <div className="mt-auto">
            <Heading
              level={3}
              className="font-semibold text-muted-foreground uppercase mb-2"
            >
              Навигация
            </Heading>
            <RenderNavigation />
          </div>
        </aside>
      </Sidebar>
      <SidebarRail side="left" railWidth={48} peekPx={12} openGapPx={8} />
    </>
  );
};

export default DashboardSidebarDynamic;
