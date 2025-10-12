import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';

interface LinkButtonProps {
  text: string;
  href: string;
  className?: string;
}

const LinkButton = ({ text, href, className }: LinkButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className={cn(className, 'bg-secondary rounded-xl text-primary-50')}
      >
        {text}
      </Button>
    </Link>
  );
};

export default LinkButton;
