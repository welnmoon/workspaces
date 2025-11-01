import { cn } from '@/lib/utils';
import Link from 'next/link';

const BaseLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {' '}
      <Link href={href} className={cn(className, '')}>
        <span className="underline-anim">{children}</span>
      </Link>
    </>
  );
};

export default BaseLink;
