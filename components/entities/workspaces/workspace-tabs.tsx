import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WProjectsSection, { WProjectsSectionProps } from './w-projects-section';
import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';

const WorkspaceTabs = ({
  projectSectionProps,
  members,
}: {
  projectSectionProps: WProjectsSectionProps;
  members: MembershipSelectUserDTO[];
}) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
        <TabsTrigger value="members">Участники</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        <WProjectsSection {...projectSectionProps} />
      </TabsContent>
      <TabsContent value="members">
        <ul>
          {members.map((m) => (
            <li>
              {m.user.firstName} {m.user.lastName}
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
