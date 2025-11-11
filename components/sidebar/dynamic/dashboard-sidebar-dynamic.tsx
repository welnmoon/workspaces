import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export function DashboardSidebarDynamic() {
  return (
    <>
      <Sidebar className="z-40 w-5/6 md:w-1/2">
        <SidebarHeader />
        <SidebarContent>
          HelloHelloHelloHelloHelloHe
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarRail side="left" railWidth={48} peekPx={12} openGapPx={8} />
    </>
  );
}
