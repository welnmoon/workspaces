import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { cn } from '../lib/utils';
import { buttonVariants, type ButtonProps } from './button';
import styles from './dialog.module.css';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

const useDialogContext = (componentName: string) => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used within Dialog`);
  }
  return ctx;
};

type DialogProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Dialog = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

type DialogPortalProps = {
  children: React.ReactNode;
};

const DialogPortal = ({ children }: DialogPortalProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(children, document.body);
};

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useDialogContext('DialogOverlay');

  return (
    <div
      ref={ref}
      className={cn(styles.overlay, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

type DialogActionProps = Omit<ButtonProps, 'asChild'>;

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogActionProps>(
  ({ className, onClick, type, variant, size, ...props }, ref) => {
    const { open, setOpen } = useDialogContext('DialogTrigger');

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(!open);
          }
        }}
        {...props}
      />
    );
  }
);
DialogTrigger.displayName = 'DialogTrigger';

const DialogClose = React.forwardRef<HTMLButtonElement, DialogActionProps>(
  ({ className, onClick, type, variant, size, ...props }, ref) => {
    const { setOpen } = useDialogContext('DialogClose');

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(false);
          }
        }}
        {...props}
      />
    );
  }
);
DialogClose.displayName = 'DialogClose';

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useDialogContext('DialogContent');

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <DialogPortal>
      <div className={styles.portal} role="presentation">
        <DialogOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(styles.content, className)}
          {...props}
        >
          {children}
          <button
            type="button"
            className={styles.closeIcon}
            onClick={() => setOpen(false)}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.header, className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.footer, className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn(styles.title, className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
