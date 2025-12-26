import { RootHeading } from '../../root-heading';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

const CaseCard = ({
  children,
  title,
  containerClassName,
  titleClassName,
  titleHoverEffect,
  info,
  isDesktop,
}: {
  children: React.ReactNode;
  title: string;
  containerClassName?: string;
  titleClassName?: string;
  titleHoverEffect?: boolean;
  info?: string;
  isDesktop?: boolean;
}) => {
  // for mobile / click tooltip support
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    setTooltipOpen(false);
  }, [isDesktop]);
  return (
    <div
      className={`group border border-b-zinc-100 px-4 py-4 space-y-2 ${containerClassName}`}
    >
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <RootHeading
            className={`font-semibold relative text-wrap ${titleClassName} ${titleHoverEffect ? 'transition-transform duration-300 ease-out group-hover:scale-125 group-hover:translate-x-6 group-hover:translate-y-4 group-hover:rotate-2 group-hover:font-black' : ''}`}
            level={6}
          >
            {title}
          </RootHeading>
          {info && isDesktop && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="bottom">{info}</TooltipContent>
            </Tooltip>
          )}
          {info && !isDesktop && (
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger onClick={() => setTooltipOpen((v) => !v)} asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="bottom">{info}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
      {children}
    </div>
  );
};

export default CaseCard;
