import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { PanelsTopLeft } from 'lucide-react';
import Image from 'next/image';

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
    <article
      className={cn(
        // до lg без флекса, на lg — как было
        `bg-white relative pt-4 md:block lg:flex lg:flex-end md:min-h-[420px]`,
        className
      )}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2 md:pr-8">
        <FeatureBadge
          icon={<PanelsTopLeft className="h-4 w-4" />}
          text="Единое пространство"
          className="bg-blue-50 text-blue-600 border-blue-300/50"
        />
        <Heading className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Единое пространство для всей команды</Heading>
        <p>
          Создавайте рабочие пространства для проектов, отделов или клиентов.
          Вся коммуникация, задачи и участники — в одном месте, без потери
          контекста. Больше никаких разрозненных чатов и таблиц.
        </p>
      </div>

      <figure
        className="
      hidden sm:block
      md:absolute md:right-0 md:bottom-0 md:w-3/5
      lg:static lg:flex lg:items-end lg:w-1/2
    "
      >
        <Image
          className="w-full pointer-events-none lg:h-full md:w-full"
          src="/images/advantages/WorkspaceHub.svg"
          alt="WorkspaceHub"
          width={100}
          height={150}
        />
      </figure>
    </article>
  );
};

export default WorkspaceHub;

