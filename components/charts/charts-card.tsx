import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ChartsCard = ({
  children,
  title,
  desc,
  className,
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
  className: string;
}) => {
  return (
    <Card className={cn('min-w-content shadow-none', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default ChartsCard;
