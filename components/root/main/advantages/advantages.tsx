import RootContainer from '../../root-container';
import WorkspaceHub from './cards/workspace-hub';
import ProjectControl from './cards/project-control';
import SmartTasks from './cards/smart-tasks';
import TeamCollaboration from './cards/team-collab';
import AnalyticsAudit from './cards/analytics-audit';
import PricingGrowth from './cards/pricing-growth';
import { RootHeading } from '../../root-heading';
import { VscSparkleFilled } from 'react-icons/vsc';

const Advantages = () => {
  return (
    <section className="bg-white p-8">
      <RootContainer>
        <RootHeading
          className="text-center mx-auto tracking-tight font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          text-neutral-800 lg:w-3/4"
          level={2}
        >
          Работайте как{' '}
          <span className=" items-center gap-1 text-primary-500 relative">
            <VscSparkleFilled
              className=" absolute w-10 h-10  -right-4 -top-3 text-amber-300"
              style={{ animation: 'gentle-bounce 2.2s ease-in-out infinite' }}
            />
            команда
          </span>
          , а не как разрозненные чаты и таблицы
        </RootHeading>

        <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-5 gap-3 w-full lg:w-3/4 mx-auto mt-8">
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
