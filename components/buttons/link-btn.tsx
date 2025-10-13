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
        className={cn(className, 'bg-primary-500 rounded-xl text-primary-50', 'hover:bg-primary-600')}
      >
        {text}
      </Button>
    </Link>
  );
};

export default LinkButton;
