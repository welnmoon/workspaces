import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const AdvantageCard = ({
  className,
  title,
  desc,
  children,
}: {
  className?: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) => {
  return (
    <article className={cn(`bg-white rounded-md flex`, className)}>
      <div>
        <Heading>{title}</Heading>
        <p>{desc}</p>
      </div>
      {children && <div>{children}</div>}
    </article>
  );
};

export default AdvantageCard;
