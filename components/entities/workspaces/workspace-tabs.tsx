import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import WMembersSection from './w-members-section';
import { SessionUser } from '@/helpers/require-user';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';

const WorkspaceTabs = ({
  user,
  projectSectionProps,
  members,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
  user: SessionUser;
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
    </Tabs>
  );
};

export default WorkspaceTabs;
