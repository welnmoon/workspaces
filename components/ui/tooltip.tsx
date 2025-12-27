'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/use-media-query';

const TooltipProvider = TooltipPrimitive.Provider;

type TooltipContextValue = {
  isTouch: boolean;
  toggle: () => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const Tooltip = ({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  delayDuration,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const isDesktop = useMediaQuery('(hover: hover) and (pointer: fine)');
  const isTouch = !isDesktop;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  );
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;

  React.useEffect(() => {
    if (!isTouch) {
      setUncontrolledOpen(false);
    }
  }, [isTouch]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo<TooltipContextValue>(
    () => ({
      isTouch,
      toggle: () => handleOpenChange(!open),
    }),
    [isTouch, open, handleOpenChange]
  );

  const rootProps = isTouch
    ? {
        ...props,
        open,
        onOpenChange: handleOpenChange,
        delayDuration: 0,
      }
    : {
        ...props,
        open: openProp,
        defaultOpen,
        onOpenChange,
        delayDuration,
      };

  return (
    <TooltipContext.Provider value={contextValue}>
      <TooltipPrimitive.Root {...rootProps}>{children}</TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (ctx?.isTouch) {
      ctx.toggle();
    }
  };

  return (
    <TooltipPrimitive.Trigger ref={ref} onClick={handleClick} {...props} />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
