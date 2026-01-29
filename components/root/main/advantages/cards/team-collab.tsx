import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { Users2 } from 'lucide-react';
import Image from 'next/image';

const TeamCollaboration = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn('bg-white flex flex-col gap-4 relative pt-4', className)}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2">
        <FeatureBadge
          icon={<Users2 className="h-4 w-4" />}
          text="Совместная работа"
          className="bg-violet-50 text-violet-600 border-violet-300/50"
        />

        <Heading className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Совместная работа без барьеров</Heading>
        <p>
          Приглашайте участников по email и управляйте ролями — Owner, Admin или
          Member. Делитесь задачами и проектами, контролируя доступ и
          ответственность. Совместная работа становится проще и прозрачнее.
        </p>
      </div>
      <figure className="hidden sm:block">
        <Image
          className="w-full h-auto pointer-events-none"
          src="/images/advantages/TeamCollaboration.webp"
          alt="TeamCollaboration"
          width={459}
          height={170}
        />
      </figure>
    </article>
  );
};

export default TeamCollaboration;
