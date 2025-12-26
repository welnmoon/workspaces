import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import WMembersSection from './w-members-section';
import type { SessionUser } from '@/helpers/require-user';
import type { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';
import { InvitationDTO } from '@/types/prisma/DTO/invitations';
import InvitesSection from './invites-section';

const WorkspaceTabs = ({
  user,
  projectSectionProps,
  members,
  invites,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
  user: SessionUser;
  invites: InvitationDTO[];
}) => {
  const membersAndRoles = members.map((member) => ({
    userId: member.userId,
    role: member.role as RoleWithoutOwnerDTO,
  }));
  return (
    <Tabs className="mb-6" defaultValue="projects">
      <TabsList className="">
        <TabsTrigger value="projects">Проекты</TabsTrigger>
        <TabsTrigger value="members">Участники</TabsTrigger>
        <TabsTrigger value="invites" className="flex items-center gap-2">
          Приглашения
        </TabsTrigger>
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

      <TabsContent value="invites" className="mt-2">
        <InvitesSection invites={invites} />
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
