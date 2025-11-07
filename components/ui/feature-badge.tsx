import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type FeatureBadgeProps = {
  icon: ReactNode;
  text: string;
  className?: string;
};

export const FeatureBadge = ({ icon, text, className }: FeatureBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
        'bg-blue-50 text-blue-600 border border-blue-200/60',
        className
      )}
    >
      <i className="grid place-items-center">{icon}</i>
      {text}
    </span>
  );
};
