import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

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
      className={cn(
        `bg-white flex flex-col gap-4 relative pt-4 pl-4`,
        className
      )}
    >
      <div className="flex-1 pt-4 pl-4 pr-8 flex flex-col gap-2">
        <Heading>Проекты под полным контролем</Heading>
        <p>
          Планируйте, отслеживайте и реализуйте проекты от идеи до релиза.
          Карточки, статусы и дедлайны помогают держать фокус и видеть общий
          прогресс.
        </p>
      </div>
      <figure className="">
        <img
          className="w-full pointer-events-none object-contain w-200"
          src="/images/advantages/ProjectControl.svg"
          alt="WorkspaceHub"
        />
      </figure>
    </article>
  );
};

export default ProjectControl;
