import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { ListChecks } from 'lucide-react';
import Image from 'next/image';

const SmartTasks = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn('bg-white flex flex-col gap-4 relative pt-4', className)}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2">
        <FeatureBadge
          icon={<ListChecks className="h-4 w-4" />}
          text="Умные задачи"
          className="bg-rose-50 text-rose-600 border-rose-300/50"
        />
        <Heading>Умные задачи и приоритеты</Heading>
        <p>
          Назначайте исполнителей, расставляйте приоритеты и сроки. Worknest
          автоматически синхронизирует статусы, чтобы команда всегда знала, что
          делать дальше и где находится каждый проект.
        </p>
      </div>
      <figure className="hidden sm:block">
        <Image
          className="w-full pointer-events-none"
          src="/images/advantages/SmartTasks.svg"
          alt="SmartTasks"
          width={100}
          height={150}
        />
      </figure>
    </article>
  );
};

export default SmartTasks;
