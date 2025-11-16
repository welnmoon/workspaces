import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Root as AvatarRoot,
  Image as AvatarImage,
  Fallback as AvatarFallback,
} from '@radix-ui/react-avatar';
import DashboardSidebarStatic from '@/components/sidebar/static/dashboard-sidebar-static';
import { WorkspaceListDTO } from '@/types/prisma/DTO/workspaces';
import { WorkspaceService } from '@/lib/services/workspace';
import { requireUser } from '@/helpers/require-user';
import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';
import { getInitials } from '@/helpers/profile.ts/getInitials';
import { InvitationService } from '@/lib/services/invitation';
import InvitationsPopover, {
  InvitationNotificationData,
} from '@/components/notifications/invitations-popover';
import { Badge } from '@/components/ui/badge';
import DashboardSidebarDynamic from '@/components/sidebar/dynamic/dashboard-sidebar-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const workspaces: WorkspaceListDTO[] = await WorkspaceService.getList(
    user.id
  );
  // const invitations = await InvitationService.getReceivedInvitations(user.id);
  // const invitationNotifications: InvitationNotificationData[] = invitations.map(
  //   (inv) => ({
  //     id: inv.id,
  //     workspaceId: inv.workspaceId,
  //     workspaceName: inv.workspace?.name ?? null,
  //     invitedRole: inv.invitedRole,
  //     status: inv.status,
  //     createdAt: inv.createdAt.toISOString(),
  //     inviterName:
  //       inv.inviter?.firstName || inv.inviter?.lastName
  //         ? [inv.inviter?.firstName, inv.inviter?.lastName]
  //             .filter(Boolean)
  //             .join(' ')
  //         : (inv.inviter?.email ?? null),
  //   })
  // );
  return (
    <SidebarProvider defaultOpen={false} className="flex min-h-screen">
      {/* Статичный только на lg+ */}
      <div className="hidden lg:block">
        <DashboardSidebarStatic workspaces={workspaces} />
      </div>

      {/* Динамичный только на <lg */}
      <div className="sm:visible lg:hidden">
        <DashboardSidebarDynamic workspaces={workspaces} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 px-4 py-3 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between">
            {/* <SidebarTrigger className="ml-0 lg:hidden z-40" /> */}
            <div className="flex items-center gap-2">
              <InvitationsPopover
                userId={user.id}
                // invitations={invitationNotifications}
              />
              <AvatarRoot className="flex gap-2 items-center justify-center">
                <Link
                  href={clientRoutes.profilePage()}
                  className="flex gap-2 text-center"
                >
                  {user.image ? (
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? 'User'}
                    />
                  ) : (
                    <div className="bg-slate-200 rounded-full p-2">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <AvatarFallback className="flex items-center" delayMs={600}>
                    <span className="underline-anim">{user.name}</span>
                  </AvatarFallback>
                </Link>
                <Badge className="h-fit font-md" variant={'outline'}>
                  {user.email}
                </Badge>
              </AvatarRoot>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
