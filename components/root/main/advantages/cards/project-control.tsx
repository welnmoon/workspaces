import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { KanbanSquare } from 'lucide-react';
import Image from 'next/image';

const ProjectControl = ({
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
      className={cn(`bg-white flex flex-col gap-4 relative pt-4`, className)}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2">
        <FeatureBadge
          icon={<KanbanSquare className="h-4 w-4" />}
          text="Проекты под контролем"
          className="bg-lime-50 text-lime-700 border-lime-300/50"
        />

        <Heading>Проекты под полным контролем</Heading>
        <p>
          Планируйте, отслеживайте и реализуйте проекты от идеи до релиза.
          Карточки, статусы и дедлайны помогают держать фокус и видеть общий
          прогресс.
        </p>
      </div>
      <figure className="hidden sm:block ">
        <Image
          className="w-full pointer-events-none"
          src="/images/advantages/ProjectControl.svg"
          alt="AnalyticsAudit"
          width={100}
          height={150}
        />
      </figure>
    </article>
  );
};

export default ProjectControl;
