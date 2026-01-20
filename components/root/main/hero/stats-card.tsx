import { Card, CardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';
const StatsCard = ({
  item,
  animatedValueClass,
}: {
  item: { name: string; value: number; href: string };
  animatedValueClass: string;
}) => {
  const animatedValue = useCountUp({
    start: 0,
    target: item.value,
    decimals: 0,
  });
  return (
    <Card key={item.name} className="p-0 gap-0 shadow-none">
      <CardContent className="py-2 px-2 md:px-8">
        <dt className="text-muted-foreground text-[12px] md:text-[16px]">
          {item.name}
        </dt>

        <dd className={cn(animatedValueClass, 'text-primary-500')}>
          {animatedValue}
        </dd>
      </CardContent>

      
    </Card>
  );
};

export default StatsCard;
