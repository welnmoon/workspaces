import { Breadcrumbs } from '@/components/bread-crumbs';
import Audits from '@/components/entities/audit/audits';
import { Heading } from '@/components/ui/heading';
import { requireUser } from '@/guards/require-user';
import { validateId } from '@/helpers/validate-id';
import { clientRoutes } from '@/lib/routes/client-routes';
import { AuditLogService } from '@/lib/services/audit-log';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
  description: "Manage your team's work in one space",
  icons: {
    icon: '/icons/metadata/w.png',
  },
};

const ActivityPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) => {
  await requireUser();

  const workspaceId = validateId((await params).workspaceId);
  const audits = await AuditLogService.getWorkspaceLogs(workspaceId, 100);

  return (
    <main className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Workspaces', href: clientRoutes.workspacesPage() },
          {
            label: `Workspace ${workspaceId}`,
            href: clientRoutes.workspacePage(workspaceId),
          },
          { label: 'Журнал аудита' },
        ]}
      />
      <Heading>Журнал аудита</Heading>
      <Audits audits={audits} />
    </main>
  );
};

export default ActivityPage;
