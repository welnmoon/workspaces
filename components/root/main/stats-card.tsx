import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';
const StatsCard = ({
  item,
}: {
  item: { name: string; value: number; href: string };
}) => {
  const animatedValue = useCountUp({
    start: 0,
    target: item.value,
    decimals: 0,
  });
  return (
    <Card key={item.name} className="p-0 gap-0 w-[22%] shadow-none">
      <CardContent className="p-6">
        <dt className=" text-muted-foreground">{item.name}</dt>

        <dd className="mt-1 text-primary-500 text-5xl font-bold wrap-break-word">
          {animatedValue}
        </dd>
      </CardContent>

      <CardFooter className="flex justify-end border-t border-border p-0!">
        <a
          href={item.href}
          className="px-6 py-3 text-sm font-medium text-primary hover:text-primary/90"
        >
          View more →
        </a>
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
