import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebarDynamic } from '@/components/sidebar/dynamic/dashboard-sidebar-dynamic';
import { CSSProperties } from 'react';
import {
  Root as AvatarRoot,
  Image as AvatarImage,
  Fallback as AvatarFallback,
} from '@radix-ui/react-avatar';
import DashboardSidebarStatic from '@/components/sidebar/static/dashboard-sidebar-static';
import { fetchWorkspaces } from '@/lib/fetch-fns/fetch-workspaces';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { WorkspaceService } from '@/lib/services/workspace';
import { requireUser } from '@/helpers/require-user';
import { ProjectListDTO } from '@/types/prisma/DTO/projects';
import { ProjectServices } from '@/lib/services/project';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = await requireUser();
  const workspaces: WorkspaceListDTO[] = await WorkspaceService.getList(id);

  return (
    <SidebarProvider
      className="flex min-h-screen"
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '18rem',
        } as CSSProperties
      }
    >
      {/* Статичный только на lg+ */}
      <div className="hidden lg:block">
        <DashboardSidebarStatic workspaces={workspaces} />
      </div>

      {/* Динамичный только на <lg */}
      <div className="lg:hidden">
        <DashboardSidebarDynamic />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-20 px-4 py-3 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center">
            <SidebarTrigger className="ml-auto lg:hidden" />
            <AvatarRoot className="AvatarRoot">
              <AvatarImage
                className="AvatarImage"
                src="https://images.unsplash.com/photo-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                alt="Colm Tuite"
              />
              <AvatarFallback className="AvatarFallback" delayMs={600}>
                Avatar
              </AvatarFallback>
            </AvatarRoot>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
