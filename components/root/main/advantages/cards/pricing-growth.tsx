import { FeatureBadge } from '@/components/ui/feature-badge';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const PricingGrowth = ({ className }: { className?: string }) => {
  return (
    <article
      className={cn(
        'bg-white relative pt-4 md:block lg:flex lg:flex-end md:min-h-[420px]',
        className
      )}
    >
      <div className="flex-1 pl-8 pt-4 pb-8 pr-8 flex flex-col gap-2 md:pr-8">
        <FeatureBadge
          icon={<Sparkles className="h-4 w-4" />}
          text="Бесплатно → рост"
          className="bg-amber-50 text-amber-700 border-amber-300/50"
        />

        <Heading className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Бесплатно — с возможностью роста</Heading>
        <p>
          Начните с бесплатного тарифа и развивайтесь без ограничений.
          Переходите на Pro, чтобы открыть дополнительные проекты, участников и
          интеграции. Worknest растёт вместе с вашей командой.
        </p>
      </div>
      <figure
        className="hidden sm:block
      md:absolute md:right-0 md:bottom-0 md:w-3/5
      lg:static lg:flex lg:items-end lg:w-1/2
      "
      >
        <Image
          className="w-full h-auto pointer-events-none"
          src="/images/advantages/PricingGrowth.svg"
          alt="PricingGrowth"
          width={580}
          height={299}
        />
      </figure>
    </article>
  );
};

export default PricingGrowth;

