import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

const PricingGrowth = ({ className }: { className?: string }) => {
  return (
    <article className={cn('bg-white flex relative pt-4', className)}>
      <div className="flex-1 pl-8 pt-4 flex flex-col gap-2">
        <Heading>Бесплатно — с возможностью роста</Heading>
        <p>
          Начните с бесплатного тарифа и развивайтесь без ограничений.
          Переходите на Pro, чтобы открыть дополнительные проекты, участников и
          интеграции. Worknest растёт вместе с вашей командой.
        </p>
      </div>
      <figure className="w-1/2">
        <img
          className="w-full pointer-events-none"
          src="/images/advantages/PricingGrowth.svg"
          alt="PricingGrowth"
        />
      </figure>
    </article>
  );
};

export default PricingGrowth;
