import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const WorkspaceHub = ({
  className,
  //   title,
  //   desc,
  //   children,
}: {
  className?: string;
  //   title: string;
  //   desc: string;
  //   children?: React.ReactNode;
}) => {
  return (
    <article className={cn(`bg-white flex relative pt-4`, className)}>
      <div className="flex-1 pl-8 pt-4 flex flex-col gap-2">
        <Heading>Единое пространство для всей команды</Heading>
        <p>
          Создавайте рабочие пространства для проектов, отделов или клиентов.
          Вся коммуникация, задачи и участники — в одном месте, без потери
          контекста. Больше никаких разрозненных чатов и таблиц.
        </p>
      </div>
      <figure className="w-1/2">
        <img
          className="w-full pointer-events-none"
          src="/images/advantages/WorkspaceHub.svg"
          alt="WorkspaceHub"
        />
      </figure>
    </article>
  );
};

export default WorkspaceHub;
