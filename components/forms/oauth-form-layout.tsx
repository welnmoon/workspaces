import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { WorkspaceLogo } from '../ui/workspace-logo';

type AuthFormLayoutProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const AuthFormLayout = ({
  title,
  children,
  className,
}: AuthFormLayoutProps) => (
  <div className="flex items-center justify-center min-h-screen">
    <main
      className={cn(
        'w-full sm:w-[350px] md:w-[400px] lg:w-[500px] p-6 bg-white rounded shadow',
        className
      )}
    >
      <WorkspaceLogo className="mb-4 text-primary-500" />
      <Heading level={2}>{title}</Heading>
      <div className="mt-6">{children}</div>
    </main>
  </div>
);

export default AuthFormLayout;
