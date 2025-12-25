import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LinkButtonProps {
  text: string;
  href: string;
  className?: string;
}

const LinkButton = ({ text, href, className }: LinkButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className={cn(
          className,
          'bg-primary-500 text-primary-50',
          'hover:bg-primary-600'
        )}
      >
        {text}
      </Button>
    </Link>
  );
};

export default LinkButton;
export { LinkButton, type LinkButtonProps };
