import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import WMembersSection from './w-members-section';
import { SessionUser } from '@/helpers/require-user';

const WorkspaceTabs = ({
  user,
  projectSectionProps,
  members,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
  user: SessionUser;
}) => {
  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
        <TabsTrigger value="members">Участники</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <WProjectsSection {...projectSectionProps} />
      </TabsContent>
      <TabsContent value="members">
        <WMembersSection user={user} members={members} />
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
