import { cn } from '@/lib/utils';
import { JSX } from 'react';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
};

export const Heading = ({ level = 1, children, className }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseStyles = {
    1: 'text-3xl font-bold tracking-tight',
    2: 'text-2xl font-semibold',
    3: 'text-xl font-medium',
    4: 'text-lg font-medium',
    5: 'text-base font-medium',
    6: 'text-sm font-semibold uppercase text-muted-foreground',
  }[level];

  return <Tag className={cn(baseStyles, className)}>{children}</Tag>;
};
