'use client';

import { X } from 'lucide-react';
import React from 'react';
import { cn } from '../../../lib/utils';

interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const ClearButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'form-clear-btn',
        className
      )}
    >
      <X className="form-clear-btn__icon" />
    </button>
  );
};
