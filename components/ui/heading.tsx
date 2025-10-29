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
    1: 'text-3xl tracking-tight',
    2: 'text-2xl',
    3: 'text-xl ',
    4: 'text-lg ',
    5: 'text-base ',
    6: 'text-sm uppercase',
  }[level];

  return <Tag className={cn(baseStyles, className)}>{children}</Tag>;
};
