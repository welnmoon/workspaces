import CaseCard from '../case-card';
import MembersRolesCard from './card';
import { cn } from '@/lib/utils';

const MembersAndRoles = ({ className = '' }: { className?: string }) => {
  return (
    <div className={cn('border-b border-zinc-100 border-r ', className)}>
      <CaseCard title="Участники и роли" containerClassName="h-full">
        <ul className="space-y-2 list-none">
          <MembersRolesCard name="Элшатұлы Нұрсұлтан" role="Owner" />
          <MembersRolesCard name="Алибеков Нартай" role="Admin" />
          <MembersRolesCard name="Антон Ким" role="Member" />
        </ul>
      </CaseCard>
    </div>
  );
};

export default MembersAndRoles;
