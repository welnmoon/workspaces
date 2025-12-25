import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

interface Crumb {
  label: string | React.ReactNode;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center space-x-2 text-gray-600"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="underline-anim hover:text-black"
              >
                {item.label}
              </Link>
            ) : (
              <span className={clsx(isLast ? 'text-black' : '')}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="mx-1">
                <ArrowRight size={20} />
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
