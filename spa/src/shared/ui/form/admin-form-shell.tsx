import * as React from 'react';
import { cn } from '../../lib/utils';

type AdminFormShellProps = {
  title: string;
  description?: string;
                    
  eyebrow?: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

const AdminFormShell = ({
  title,
  description,
           
  eyebrow,
  actions,
  aside,
  footer,
  children,
  className,
  bodyClassName,
}: AdminFormShellProps) => {
  const hasAside = Boolean(aside);

  return (
    <section className={cn('admin-form-shell', className)}>
      <header className="admin-form-shell__header">
        {eyebrow && (
          <span className="admin-form-shell__eyebrow">{eyebrow}</span>
        )}
        <div className="admin-form-shell__header-row">
          <div className="admin-form-shell__title-block">
            <h2 className="admin-form-shell__title">{title}</h2>
            {description && (
              <p className="admin-form-shell__description">{description}</p>
            )}
          </div>
          <div className="admin-form-shell__actions">
            
            {actions}
          </div>
        </div>
      </header>
      <div
        className={cn(
          'admin-form-shell__body',
          hasAside && 'admin-form-shell__body--with-aside',
          bodyClassName
        )}
      >
        <div className="admin-form-shell__content">{children}</div>
        {hasAside && <aside className="admin-form-shell__aside">{aside}</aside>}
      </div>
      {footer && <div className="admin-form-shell__footer">{footer}</div>}
    </section>
  );
};

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const AdminFormSection = ({
  title,
  description,
  children,
  className,
  contentClassName,
}: AdminFormSectionProps) => {
  return (
    <section className={cn('admin-form-section', className)}>
      <div className="admin-form-section__header">
        <h3 className="admin-form-section__title">{title}</h3>
        {description && (
          <p className="admin-form-section__description">{description}</p>
        )}
      </div>
      <div className={cn('admin-form-section__content', contentClassName)}>
        {children}
      </div>
    </section>
  );
};

export { AdminFormSection };
export default AdminFormShell;
