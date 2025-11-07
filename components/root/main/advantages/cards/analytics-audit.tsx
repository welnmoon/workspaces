import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const AnalyticsAudit = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn('bg-white  flex flex-col gap-4 relative pt-8', className)}
    >
      <div className="flex-1 pl-8 pr-8 flex flex-col gap-2">
        <Heading>Прозрачная аналитика и история действий</Heading>
        <p>
          Система фиксирует каждое изменение — от создания задачи до обновления
          статуса. Отчёты и аудит-лог помогают анализировать эффективность
          команды и улучшать процессы работы.
        </p>
      </div>
      <figure className="">
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
