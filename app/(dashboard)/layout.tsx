'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar/dashboard-sidebar';
import { CSSProperties } from 'react';
import useMediaQuery from '@/hooks/use-media-query';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMediumUp = useMediaQuery('(min-width: 1024px)'); // TODO - если isMediumUp то показываем static sidebar, иначе dynamic
  return (
    <SidebarProvider
      className="flex min-h-screen"
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '18rem',
        } as CSSProperties
      }
    >
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto w-full">
            {isMediumUp && <SidebarTrigger className="mb-4" />}
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
