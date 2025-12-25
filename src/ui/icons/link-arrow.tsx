import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type LinkArrowProps = {
  href: string;
  children: string;
  className?: string;
};

export function LinkArrow({ href, children, className }: LinkArrowProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1 text-zinc-800 hover:text-zinc-900 transition font-medium ${className ?? ''}`}
    >
      <span className="underline-anim text-sm">{children}</span>
      <ArrowRight
        size={16}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
