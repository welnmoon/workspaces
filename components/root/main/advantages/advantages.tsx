import { Heading } from '@/components/ui/heading';
import RootContainer from '../../root-container';
import AdvantageCard from './advantage-card';
import WorkspaceHub from './cards/workspace-hub';
import ProjectControl from './cards/project-control';
import SmartTasks from './cards/smart-tasks';
import TeamCollaboration from './cards/team-collab';
import AnalyticsAudit from './cards/analytics-audit';
import PricingGrowth from './cards/pricing-growth';

const Advantages = () => {
  return (
    <section className="bg-gray-300 p-8">
      <RootContainer>
        <div className="grid grid-cols-5 gap-3 w-full py-8 px-40">
          <WorkspaceHub className="col-span-5 rounded-md overflow-hidden bg-[#F4F8FF] border border-blue-300/40" />

          <ProjectControl className="col-span-3 rounded-md overflow-hidden bg-[#F8FFE8] border border-lime-300/40" />

          <SmartTasks className="col-span-2 rounded-md overflow-hidden bg-[#FFF4F7] border border-rose-300/40" />

          <TeamCollaboration className="col-span-2 rounded-md overflow-hidden bg-[#F7F3FF] border border-violet-300/40" />

          <AnalyticsAudit className="col-span-3 rounded-md overflow-hidden bg-[#F2F9FF] border border-sky-300/40" />

          <PricingGrowth className="col-span-5 rounded-md overflow-hidden bg-[#FFF7ED] border border-amber-300/40" />
        </div>
      </RootContainer>
    </section>
  );
};

export default Advantages;
