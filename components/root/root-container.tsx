import { cn } from '@/lib/utils';
import React from 'react';

type ContainerSize = 'xs' | 'sm' | 'md' | 'xl';

const sizeClasses: Record<ContainerSize, string> = {
  xs: `
    max-w-screen-sm
  `,
  sm: `
    sm:max-w-screen-sm
    md:max-w-screen-md
  `,
  md: `
    sm:max-w-screen-sm
    md:max-w-screen-md
    lg:max-w-screen-lg
  `,
  xl: `
    sm:max-w-screen-sm
    md:max-w-screen-md
    lg:max-w-screen-lg
    xl:max-w-screen-xl
    2xl:max-w-screen-2xl
  `,
};

const RootContainer = ({
  children,
  className,
  size = 'xl',
}: {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSize;
}) => {
  return (
    <section
      className={cn(
        `
        w-full mx-auto px-4
        mt-4 mb-4
        `,
        sizeClasses[size],
        className
      )}
    >
      {children}
    </section>
  );
};

export default RootContainer;
