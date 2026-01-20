'use client';

                                              

                                

import { cn } from '@/lib/utils';
import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string | React.ReactElement;
  icon?: string | React.ReactNode;
  className?: string;
  iconIsImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
}

const EmptyState = ({
  title,
  subtitle,
  icon = '📭',
  className,
  iconIsImage = false,
  imageSrc,
  imageAlt,
  imageClassName,
}: EmptyStateProps) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-zinc-200 rounded-md text-zinc-500',
        className
      )}
    >
      <div className="text-5xl mb-2">
        {iconIsImage ? (
          <>
            <img
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              src={imageSrc}
              alt={imageAlt}
              draggable={false}
              className={cn(
                imageClassName,
                imgLoaded ? 'opacity-100' : 'opacity-0'
              )}
            />
            {!imgLoaded && (
              <div
                className={cn(
                  'rounded-md bg-gray-200 animate-pulse',
                  imageClassName
                )}
              />
            )}
          </>
        ) : (
          icon
        )}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm mt-1 text-zinc-400">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
