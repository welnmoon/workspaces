import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const TeamCollaboration = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn('bg-white flex flex-col gap-4 relative pt-8', className)}
    >
      <div className="flex-1 pl-8 pr-8 flex flex-col gap-2">
        <Heading>Совместная работа без барьеров</Heading>
        <p>
          Приглашайте участников по email и управляйте ролями — Owner, Admin или
          Member. Делитесь задачами и проектами, контролируя доступ и
          ответственность. Совместная работа становится проще и прозрачнее.
        </p>
      </div>
      <figure className="">
        <img
          className="w-full pointer-events-none"
          src="/images/advantages/TeamCollaboration.svg"
          alt="TeamCollaboration"
        />
      </figure>
    </article>
  );
};

export default TeamCollaboration;
