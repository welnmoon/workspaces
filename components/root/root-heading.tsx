import { cn } from '@/lib/utils';
import { JSX } from 'react';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
};

export const RootHeading = ({
  level = 1,
  children,
  className,
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseStyles = {
    1: 'text-7xl tracking-tight',
    2: 'text-6xl',
    3: 'text-5xl ',
    4: 'text-4xl ',
    5: 'text-3xl ',
    6: 'text-2xl uppercase',
  }[level];

  return <Tag className={cn(baseStyles, className)}>{children}</Tag>;
};
