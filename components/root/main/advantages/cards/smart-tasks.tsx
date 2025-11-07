import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const SmartTasks = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn(
        'bg-white flex flex-col gap-4 relative pt-8',
        className
      )}
    >
      <div className="flex-1 pl-8 pr-8 flex flex-col gap-2">
        <Heading>Умные задачи и приоритеты</Heading>
        <p>
          Назначайте исполнителей, расставляйте приоритеты и сроки. Worknest
          автоматически синхронизирует статусы, чтобы команда всегда знала, что
          делать дальше и где находится каждый проект.
        </p>
      </div>
      <figure className="">
        <img
          className="w-full pointer-events-none"
          src="/images/advantages/SmartTasks.svg"
          alt="SmartTasks"
        />
      </figure>
    </article>
  );
};

export default SmartTasks;
