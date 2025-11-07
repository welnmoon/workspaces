import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { LineChart } from 'lucide-react';

const AnalyticsAudit = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn('bg-white  flex flex-col gap-4 relative pt-4', className)}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2">
        <FeatureBadge
          icon={<LineChart className="h-4 w-4" />}
          text="Аналитика и аудит-лог"
          className="bg-sky-50 text-sky-600 border-sky-300/50"
        />
        <Heading>Прозрачная аналитика и история действий</Heading>
        <p>
          Система фиксирует каждое изменение — от создания задачи до обновления
          статуса. Отчёты и аудит-лог помогают анализировать эффективность
          команды и улучшать процессы работы.
        </p>
      </div>
      <figure className="hidden sm:block">
        <img
          className="w-full pointer-events-none"
          src="/images/advantages/WorkspaceHub.svg"
          alt="AnalyticsAudit"
        />
      </figure>
    </article>
  );
};

export default AnalyticsAudit;
