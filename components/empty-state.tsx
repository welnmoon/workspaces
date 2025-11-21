// components/ui/empty-state.tsx

import { cn } from '@/lib/utils';
import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string | React.ReactElement;
  icon?: string | React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title,
  subtitle,
  icon = '📭',
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-zinc-200 rounded-md text-zinc-500',
        className
      )}
    >
      <div className="text-5xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm mt-1 text-zinc-400">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
