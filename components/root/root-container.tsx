import { cn } from '@/lib/utils';

const RootContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        `w-full mx-auto px-4
            sm:max-w-screen-sm
            md:max-w-screen-md
            lg:max-w-screen-lg
            xl:max-w-screen-xl
            2xl:max-w-screen-2xl
            mt-4 mb-4`,
        className
      )}
    >
      {children}
    </section>
  );
};

export default RootContainer;
