import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import WMembersSection from './w-members-section';

const WorkspaceTabs = ({
  projectSectionProps,
  members,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
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
        <WMembersSection members={members} />
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
