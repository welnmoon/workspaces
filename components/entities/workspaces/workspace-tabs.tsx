import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import WMembersSection from './w-members-section';
import type { SessionUser } from '@/helpers/require-user';
import type { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { PaymentDTO } from '@/types/prisma/DTO/payment';
import PaymentsSection from './payments-section';

const WorkspaceTabs = ({
  user,
  projectSectionProps,
  members,
  payments,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
  user: SessionUser;
  payments: PaymentDTO[];
}) => {
  const membersAndRoles = members.map((member) => ({
    userId: member.userId,
    role: member.role as RoleWithoutOwnerDTO,
  }));
  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
        <TabsTrigger value="members">Участники</TabsTrigger>
        <TabsTrigger value="payments">Оплаты</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <WProjectsSection
          projects={projectSectionProps.projects}
          userRole={projectSectionProps.userRole}
          workspace={projectSectionProps.workspace}
          workspaceId={projectSectionProps.workspaceId}
        />
      </TabsContent>
      <TabsContent value="members">
        <WMembersSection
          membersAndRoles={membersAndRoles}
          user={user}
          members={members}
        />
      </TabsContent>
      <TabsContent value="payments">
        <PaymentsSection payments={payments} currentUserId={user.id} />
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
